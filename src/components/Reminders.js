import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Bell, BellRing, BellOff, Building2, Users, Calendar, Clock,
  CheckCircle2, Circle, Pencil, Trash2, Plus, LogOut, Search,
  AlertCircle, X, ExternalLink, Tag, Flag, Download, Eye, Copy,
  AlarmClock, CalendarDays, LayoutList, ChevronLeft, ChevronRight,
  CheckSquare, Square, RotateCcw, SlidersHorizontal,
} from 'lucide-react';

// ─── constants ───────────────────────────────────────────────────────────────

const COMPANY_NAME = 'Timingo Tech';
const AUTH_KEY = 'timingo_reminders_auth';

const OFFSET_PRESETS = [
  { label: '1 day before', minutes: 1440 },
  { label: '1 hour before', minutes: 60 },
  { label: '30 minutes before', minutes: 30 },
  { label: '10 minutes before', minutes: 10 },
  { label: '5 minutes before', minutes: 5 },
  { label: 'At the time', minutes: 0 },
];

const DEFAULT_OFFSETS = [1440, 60, 10, 5];

const CATEGORIES = ['Follow-up', 'Meeting', 'Invoice', 'Check-in', 'Other'];

const PRIORITY_META = {
  high:   { label: 'High',   badge: 'bg-red-50 text-red-600 border-red-200',     dot: 'bg-red-500'   },
  medium: { label: 'Medium', badge: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-400' },
  low:    { label: 'Low',    badge: 'bg-gray-50 text-gray-500 border-gray-200',   dot: 'bg-gray-400'  },
};

const SNOOZE_PRESETS = [
  { label: '30 minutes', minutes: 30 },
  { label: '1 hour',     minutes: 60 },
  { label: '4 hours',    minutes: 240 },
  { label: 'Tomorrow',   minutes: 1440 },
  { label: 'Next week',  minutes: 10080 },
];

const SORT_OPTIONS = [
  { value: 'due_asc',      label: 'Due date (soonest)' },
  { value: 'due_desc',     label: 'Due date (latest)'  },
  { value: 'priority',     label: 'Priority'           },
  { value: 'created_desc', label: 'Recently created'   },
  { value: 'created_asc',  label: 'Oldest created'     },
];

const emptyForm = {
  company: '',
  person_names: '',
  person_emails: '',
  title: '',
  notes: '',
  due_at: '',
  remind_offsets_minutes: DEFAULT_OFFSETS,
  priority: 'medium',
  category: '',
  url: '',
  custom_email_body: '',
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function errorMessageFrom(err, fallback) {
  const detail = err?.response?.data?.error;
  if (typeof detail === 'string' && detail) return detail;
  if (detail && typeof detail === 'object' && typeof detail.message === 'string') return detail.message;
  return fallback;
}

function parseList(value) {
  return String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function recipientLabels(reminder) {
  const names = reminder.person_names || [];
  const emails = reminder.person_emails || [];
  return emails.map((email, i) => names[i] || email);
}

function timeUntilLabel(dueAt, completed) {
  if (completed) return { text: 'Completed', tone: 'done' };
  const diffMs = new Date(dueAt).getTime() - Date.now();
  if (diffMs <= 0) return { text: 'Overdue', tone: 'overdue' };
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return { text: `In ${minutes}m`, tone: 'soon' };
  const hours = Math.round(minutes / 60);
  if (hours < 48) return { text: `In ${hours}h`, tone: hours <= 6 ? 'soon' : 'upcoming' };
  const days = Math.round(hours / 24);
  return { text: `In ${days}d`, tone: 'upcoming' };
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function subscribeToPush() {
  const publicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error('Push notifications are not configured for this site.');
  const registration = await navigator.serviceWorker.register('/reminders-sw.js', { scope: '/reminders' });
  await navigator.serviceWorker.ready;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted.');
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await axios.post('/api/push-subscribe', { subscription });
  return subscription;
}

async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration('/reminders');
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await axios.delete('/api/push-subscribe', { data: { subscription: { endpoint: subscription.endpoint } } });
  await subscription.unsubscribe();
}

function buildPreviewHtml(form) {
  const emails = parseList(form.person_emails);
  const names = parseList(form.person_names);
  const email = emails[0] || 'recipient@example.com';
  const name = names[0] || email;
  const dueLabel = form.due_at
    ? new Date(form.due_at).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      })
    : '(date not set)';

  const bodyHtml = form.custom_email_body
    ? `<p>${String(form.custom_email_body).replace(/\n/g, '<br/>')}</p>`
    : `<p>A reminder has just been set for <strong>${form.company || '(company)'}</strong>:</p>
       <h3 style="margin:8px 0;">${form.title || '(title)'}</h3>
       ${form.notes ? `<p>${form.notes}</p>` : ''}`;

  return `<div style="font-family:sans-serif;max-width:480px;color:#333;">
    <p>Hi ${name},</p>
    ${bodyHtml}
    <p><strong>Due:</strong> ${dueLabel}</p>
    <p>You'll get follow-up nudges by email as the due time gets closer.</p>
    <p style="color:#888;font-size:12px;">Sent by Timingo Tech Reminders</p>
  </div>`;
}

function exportCSV(reminders) {
  const headers = ['Company', 'Title', 'Priority', 'Category', 'Due', 'Recipients', 'Notes', 'URL', 'Completed', 'Created'];
  const rows = reminders.map((r) => [
    r.company, r.title, r.priority || 'medium', r.category || '',
    r.due_at, (r.person_emails || []).join('; '), r.notes || '',
    r.url || '', r.completed ? 'Yes' : 'No', r.created_at,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `reminders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(href);
}

// ─── style constants ──────────────────────────────────────────────────────────

const TONE_STYLES = {
  done:     'bg-gray-100 text-gray-500',
  overdue:  'bg-red-50 text-red-600',
  soon:     'bg-amber-50 text-amber-700',
  upcoming: 'bg-emerald-50 text-emerald-700',
};

const inputClasses =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]';
const labelClasses = 'block mb-1.5 text-sm font-medium text-gray-700';

// ─── GateForm ─────────────────────────────────────────────────────────────────

function GateForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const matches = (v) => v.trim().toLowerCase() === COMPANY_NAME.toLowerCase();
    if (matches(username) && matches(password)) {
      localStorage.setItem(AUTH_KEY, 'true');
      onSuccess();
    } else {
      setError('Incorrect login or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Helmet>
        <title>Reminders — Internal | Timingo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#F7666F] to-[#6675F7]">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <h1 className="mb-1 text-2xl font-bold text-center hometext-gradient">Internal Reminders</h1>
        <p className="mb-6 text-sm text-center text-gray-500">Sign in to manage reminders</p>
        <label className={labelClasses}>Login</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
          className={`${inputClasses} mb-4`} placeholder="Company name" autoComplete="username" />
        <label className={labelClasses}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className={`${inputClasses} mb-4`} placeholder="Company name" autoComplete="current-password" />
        {error && (
          <p className="flex items-center gap-1.5 mb-3 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}
        <button type="submit"
          className="w-full px-4 py-2.5 font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90">
          Sign in
        </button>
      </form>
    </div>
  );
}

// ─── OffsetPicker ─────────────────────────────────────────────────────────────

function OffsetPicker({ value, onChange }) {
  const toggle = (minutes) => {
    onChange(value.includes(minutes) ? value.filter((m) => m !== minutes) : [...value, minutes].sort((a, b) => b - a));
  };
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {OFFSET_PRESETS.map((preset) => {
        const active = value.includes(preset.minutes);
        return (
          <button type="button" key={preset.minutes} onClick={() => toggle(preset.minutes)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition ${
              active ? 'border-[#6675F7] bg-[#6675F7]/10 text-[#4452c9]' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            {active ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 text-gray-300" />}
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── PriorityPicker ───────────────────────────────────────────────────────────

function PriorityPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {Object.entries(PRIORITY_META).map(([key, meta]) => (
        <button type="button" key={key} onClick={() => onChange(key)}
          className={`flex-1 py-2 text-sm font-medium border rounded-lg transition ${
            value === key ? meta.badge + ' border-current' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}>
          {meta.label}
        </button>
      ))}
    </div>
  );
}

// ─── PreviewModal ─────────────────────────────────────────────────────────────

function PreviewModal({ html, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <Eye className="w-4 h-4 text-[#6675F7]" /> Email preview
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 border border-gray-100 rounded-xl m-4 text-sm text-gray-700 bg-gray-50">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <p className="px-5 pb-4 text-xs text-gray-400">
          Preview for first recipient. All recipients receive the same email body with their name substituted.
        </p>
      </div>
    </div>
  );
}

// ─── ReminderForm ─────────────────────────────────────────────────────────────

function ReminderForm({ initialValues, submitLabel, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(initialValues);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { setForm(initialValues); }, [initialValues]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  const nameCount  = parseList(form.person_names).length;
  const emailCount = parseList(form.person_emails).length;
  const countMismatch = nameCount > 0 && emailCount > 0 && nameCount !== emailCount;

  return (
    <>
      {showPreview && <PreviewModal html={buildPreviewHtml(form)} onClose={() => setShowPreview(false)} />}
      <form onSubmit={handleSubmit} className="grid gap-5 p-6 bg-white border border-gray-100 shadow-md rounded-2xl sm:p-7 sm:grid-cols-2">

        <div>
          <label className={labelClasses}>Company</label>
          <input required value={form.company} onChange={(e) => update('company', e.target.value)}
            className={inputClasses} placeholder="e.g. Acme Ltd" />
        </div>

        <div>
          <label className={labelClasses}>Title</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)}
            className={inputClasses} placeholder="e.g. Send proposal follow-up" />
        </div>

        <div>
          <label className={labelClasses}>Recipient name(s)</label>
          <input required value={form.person_names} onChange={(e) => update('person_names', e.target.value)}
            className={inputClasses} placeholder="e.g. Alice, Bob" />
          <p className="mt-1 text-xs text-gray-400">Separate multiple names with commas, same order as emails.</p>
        </div>

        <div>
          <label className={labelClasses}>Recipient email(s)</label>
          <input required value={form.person_emails} onChange={(e) => update('person_emails', e.target.value)}
            className={inputClasses} placeholder="e.g. alice@acme.com, bob@acme.com" />
          {countMismatch && (
            <p className="flex items-center gap-1.5 mt-1 text-xs text-amber-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {nameCount} name{nameCount === 1 ? '' : 's'} but {emailCount} email{emailCount === 1 ? '' : 's'} — extras fall back to the email address.
            </p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Due date &amp; time</label>
          <input required type="datetime-local" value={form.due_at}
            onChange={(e) => update('due_at', e.target.value)} className={inputClasses} />
          {form.due_at ? (
            <p className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-[#4452c9]">
              <Calendar className="w-3.5 h-3.5 shrink-0" /> Scheduled for {formatDateTime(form.due_at)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Picked in your own time zone.</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>Notes (optional)</label>
          <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)}
            rows={2} className={inputClasses} placeholder="Any extra context for the reminder email" />
        </div>

        <div>
          <label className={labelClasses}>Priority</label>
          <PriorityPicker value={form.priority} onChange={(v) => update('priority', v)} />
        </div>

        <div>
          <label className={labelClasses}>Category (optional)</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)}
            className={inputClasses}>
            <option value="">— none —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Reference URL (optional)</label>
          <input value={form.url} onChange={(e) => update('url', e.target.value)}
            className={inputClasses} placeholder="https://docs.google.com/… or any link" type="url" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Custom email body (optional)</label>
          <textarea value={form.custom_email_body} onChange={(e) => update('custom_email_body', e.target.value)}
            rows={3} className={inputClasses}
            placeholder="Leave blank to use the default template. If filled in, this replaces the body text of all reminder emails for this item." />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>Send email reminders</label>
          <OffsetPicker value={form.remind_offsets_minutes} onChange={(v) => update('remind_offsets_minutes', v)} />
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={busy}
            className="px-5 py-2.5 font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90 disabled:opacity-60">
            {busy ? 'Saving…' : submitLabel}
          </button>
          <button type="button" onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#4452c9] transition border border-[#6675F7]/30 rounded-lg hover:bg-[#6675F7]/5">
            <Eye className="w-4 h-4" /> Preview email
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-5 py-2.5 font-semibold text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

// ─── CalendarStrip ────────────────────────────────────────────────────────────

function CalendarStrip({ reminders, selectedDate, onSelectDate }) {
  const [offset, setOffset] = useState(0); // weeks offset
  const DAYS = 14;

  const days = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + offset * DAYS);
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [offset]);

  const countByDay = useMemo(() => {
    const map = {};
    for (const r of reminders) {
      const key = new Date(r.due_at).toDateString();
      if (!map[key]) map[key] = { total: 0, high: 0 };
      map[key].total += 1;
      if ((r.priority || 'medium') === 'high') map[key].high += 1;
    }
    return map;
  }, [reminders]);

  const today = new Date().toDateString();

  return (
    <div className="p-4 mb-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Calendar</span>
        <div className="flex items-center gap-1">
          {selectedDate && (
            <button onClick={() => onSelectDate(null)}
              className="px-2 py-1 text-xs text-[#4452c9] border border-[#6675F7]/30 rounded-lg hover:bg-[#6675F7]/5 transition mr-1">
              Clear filter
            </button>
          )}
          <button onClick={() => setOffset((o) => o - 1)}
            className="p-1.5 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setOffset(0)}
            className="px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Today
          </button>
          <button onClick={() => setOffset((o) => o + 1)}
            className="p-1.5 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:grid-cols-14">
        {days.map((d) => {
          const key = d.toDateString();
          const info = countByDay[key];
          const isSelected = selectedDate === key;
          const isToday = key === today;
          return (
            <button key={key} onClick={() => onSelectDate(isSelected ? null : key)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition ${
                isSelected
                  ? 'bg-[#6675F7] text-white'
                  : isToday
                  ? 'bg-[#6675F7]/10 text-[#4452c9] font-semibold'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}>
              <span className="text-[10px] uppercase opacity-70">
                {d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}
              </span>
              <span className="mt-0.5 font-semibold">{d.getDate()}</span>
              {info ? (
                <span className={`mt-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isSelected ? 'bg-white/30 text-white' : info.high > 0 ? 'bg-red-100 text-red-600' : 'bg-[#6675F7]/15 text-[#4452c9]'
                }`}>{info.total}</span>
              ) : (
                <span className="mt-1 w-5 h-5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SnoozeMenu ───────────────────────────────────────────────────────────────

function SnoozeMenu({ onSnooze }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
        <AlarmClock className="w-4 h-4" /> Snooze
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1">
          {SNOOZE_PRESETS.map((p) => (
            <button key={p.minutes} type="button"
              onClick={() => { setOpen(false); onSnooze(p.minutes); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition">
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ReminderCard ─────────────────────────────────────────────────────────────

function ReminderCard({ reminder, onEdit, onDelete, onToggleCompleted, onDuplicate, onSnooze, selected, onSelect, selectMode }) {
  const status     = timeUntilLabel(reminder.due_at, reminder.completed);
  const recipients = recipientLabels(reminder);
  const priority   = PRIORITY_META[reminder.priority || 'medium'];

  return (
    <div className={`relative p-5 sm:p-6 bg-white border rounded-2xl shadow-sm transition hover:shadow-md ${
      reminder.completed ? 'opacity-60' : ''
    } ${selected ? 'border-[#6675F7]/50 bg-[#6675F7]/[0.02]' : 'border-gray-100'}`}>

      {/* checkbox (select mode) */}
      {selectMode && (
        <button type="button" onClick={onSelect}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#6675F7] transition">
          {selected ? <CheckSquare className="w-5 h-5 text-[#6675F7]" /> : <Square className="w-5 h-5" />}
        </button>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            <Building2 className="w-3.5 h-3.5" />{reminder.company}
            {/* priority badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] normal-case font-semibold ${priority.badge}`}>
              <Flag className="w-2.5 h-2.5" />{priority.label}
            </span>
            {/* category tag */}
            {reminder.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-[10px] normal-case font-semibold">
                <Tag className="w-2.5 h-2.5" />{reminder.category}
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-gray-800">{reminder.title}</h3>
          <div className="flex items-start gap-1.5 mt-1.5 text-sm text-gray-500">
            <Users className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="break-words">{recipients.join(', ') || '—'}</span>
          </div>
          {reminder.notes && <p className="mt-2.5 text-sm text-gray-600">{reminder.notes}</p>}
          {reminder.url && (
            <a href={reminder.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-[#4452c9] hover:underline">
              <ExternalLink className="w-3 h-3" /> Reference link
            </a>
          )}
        </div>

        <div className="text-right shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${TONE_STYLES[status.tone]}`}>
            {status.tone === 'overdue' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {status.text}
          </span>
          <p className="flex items-center justify-end gap-1.5 mt-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />{formatDateTime(reminder.due_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 text-sm border-t border-gray-100">
        <button onClick={onToggleCompleted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
            reminder.completed
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
          {reminder.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {reminder.completed ? 'Completed' : 'Mark complete'}
        </button>
        <button onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50">
          <Pencil className="w-4 h-4" /> Edit
        </button>
        <button onClick={onDuplicate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50">
          <Copy className="w-4 h-4" /> Duplicate
        </button>
        {!reminder.completed && <SnoozeMenu onSnooze={onSnooze} />}
        <button onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-500 transition border border-red-200 rounded-lg hover:bg-red-50">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── StatPill ─────────────────────────────────────────────────────────────────

function StatPill({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 shadow-sm rounded-xl">
      <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${tone}`}>
        <Icon className="w-4.5 h-4.5" />
      </span>
      <div>
        <p className="text-lg font-semibold leading-none text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// ─── RemindersDashboard ───────────────────────────────────────────────────────

function RemindersDashboard() {
  const [reminders,   setReminders]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [notice,      setNotice]      = useState('');
  const [busy,        setBusy]        = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [duplicating, setDuplicating] = useState(null); // form values for duplicate
  const [pushState,   setPushState]   = useState('checking');

  // filtering / sorting
  const [activeTab,   setActiveTab]   = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy,      setSortBy]      = useState('due_asc');
  const [dateFrom,    setDateFrom]    = useState('');
  const [dateTo,      setDateTo]      = useState('');
  const [selectedDay, setSelectedDay] = useState(null); // calendar day filter (Date.toDateString())
  const [showFilters, setShowFilters] = useState(false);

  // view mode
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'

  // bulk select
  const [selectMode,   setSelectMode]   = useState(false);
  const [selectedIds,  setSelectedIds]  = useState(new Set());

  // undo-delete
  const pendingDeletesRef = useRef({});
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [undoItem,  setUndoItem]  = useState(null);

  // ── push notifications ──
  useEffect(() => {
    let cancelled = false;
    async function checkPushStatus() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !process.env.REACT_APP_VAPID_PUBLIC_KEY) {
        if (!cancelled) setPushState('unsupported'); return;
      }
      if (Notification.permission === 'denied') { if (!cancelled) setPushState('denied'); return; }
      try {
        const reg = await navigator.serviceWorker.getRegistration('/reminders');
        const sub = reg ? await reg.pushManager.getSubscription() : null;
        if (!cancelled) setPushState(sub ? 'enabled' : 'disabled');
      } catch { if (!cancelled) setPushState('disabled'); }
    }
    checkPushStatus();
    return () => { cancelled = true; };
  }, []);

  const togglePush = async () => {
    setError(''); setPushState('working');
    try {
      if (pushState === 'enabled') { await unsubscribeFromPush(); setPushState('disabled'); setNotice('Push notifications turned off.'); }
      else { await subscribeToPush(); setPushState('enabled'); setNotice('Push notifications enabled for this device.'); }
    } catch (err) {
      setPushState(Notification.permission === 'denied' ? 'denied' : 'disabled');
      setError(err?.message || 'Could not change push notification settings.');
    }
  };

  // ── load ──
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get('/api/reminders');
      setReminders(data.reminders || []);
    } catch (err) {
      setError(errorMessageFrom(err, 'Could not load reminders.'));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── notice auto-clear ──
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  // ── form helpers ──
  const buildPayload = (form) => ({
    company:               form.company.trim(),
    title:                 form.title.trim(),
    notes:                 form.notes.trim(),
    person_names:          parseList(form.person_names),
    person_emails:         parseList(form.person_emails),
    due_at:                new Date(form.due_at).toISOString(),
    remind_offsets_minutes: form.remind_offsets_minutes,
    priority:              form.priority || 'medium',
    category:              form.category || null,
    url:                   form.url.trim() || null,
    custom_email_body:     form.custom_email_body.trim() || null,
  });

  // ── create ──
  const handleCreate = async (form) => {
    setBusy(true); setError('');
    try {
      await axios.post('/api/reminders', buildPayload(form));
      setShowForm(false); setDuplicating(null);
      setNotice('Reminder created.'); await load();
    } catch (err) { setError(errorMessageFrom(err, 'Could not create reminder.')); }
    finally { setBusy(false); }
  };

  // ── update ──
  const handleUpdate = async (id, form) => {
    setBusy(true); setError('');
    try {
      await axios.patch('/api/reminders', { id, ...buildPayload(form) });
      setEditingId(null); setNotice('Reminder updated.'); await load();
    } catch (err) { setError(errorMessageFrom(err, 'Could not update reminder.')); }
    finally { setBusy(false); }
  };

  // ── toggle complete ──
  const toggleCompleted = async (reminder) => {
    setError('');
    try {
      await axios.patch('/api/reminders', { id: reminder.id, completed: !reminder.completed });
      await load();
    } catch (err) { setError(errorMessageFrom(err, 'Could not update reminder.')); }
  };

  // ── snooze ──
  const handleSnooze = async (reminder, minutes) => {
    setError('');
    try {
      const newDue = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      await axios.patch('/api/reminders', { id: reminder.id, due_at: newDue });
      setNotice(`Snoozed until ${formatDate(newDue)}.`); await load();
    } catch (err) { setError(errorMessageFrom(err, 'Could not snooze reminder.')); }
  };

  // ── delete (with undo) ──
  const commitDelete = async (id) => {
    delete pendingDeletesRef.current[id];
    setHiddenIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    try {
      await axios.delete(`/api/reminders?id=${id}`);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(errorMessageFrom(err, 'Could not delete reminder.'));
      setHiddenIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleDelete = (reminder) => {
    // flush any already-pending undo immediately
    for (const [existingId, pending] of Object.entries(pendingDeletesRef.current)) {
      clearTimeout(pending.timeoutId);
      commitDelete(existingId);
    }
    setHiddenIds((prev) => new Set([...prev, reminder.id]));
    const timeoutId = setTimeout(() => commitDelete(reminder.id), 5000);
    pendingDeletesRef.current[reminder.id] = { reminder, timeoutId };
    setUndoItem(reminder);
  };

  const handleUndoDelete = () => {
    if (!undoItem) return;
    const pending = pendingDeletesRef.current[undoItem.id];
    if (pending) {
      clearTimeout(pending.timeoutId);
      delete pendingDeletesRef.current[undoItem.id];
    }
    setHiddenIds((prev) => { const next = new Set(prev); next.delete(undoItem.id); return next; });
    setUndoItem(null);
  };

  // ── bulk actions ──
  const handleBulkComplete = async () => {
    setError('');
    try {
      await Promise.all([...selectedIds].map((id) => axios.patch('/api/reminders', { id, completed: true })));
      setSelectedIds(new Set()); setSelectMode(false);
      setNotice(`${selectedIds.size} reminder${selectedIds.size > 1 ? 's' : ''} marked complete.`);
      await load();
    } catch (err) { setError(errorMessageFrom(err, 'Bulk complete failed.')); }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.size} reminder${selectedIds.size > 1 ? 's' : ''}?`)) return;
    setError('');
    try {
      await Promise.all([...selectedIds].map((id) => axios.delete(`/api/reminders?id=${id}`)));
      setSelectedIds(new Set()); setSelectMode(false);
      setReminders((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setNotice('Reminders deleted.');
    } catch (err) { setError(errorMessageFrom(err, 'Bulk delete failed.')); }
  };

  // ── sign out ──
  const signOut = () => { localStorage.removeItem(AUTH_KEY); window.location.reload(); };

  // ── derived list ──
  const displayed = useMemo(() => {
    const now = Date.now();
    let list = reminders.filter((r) => !hiddenIds.has(r.id));

    if (activeTab === 'upcoming')  list = list.filter((r) => !r.completed && new Date(r.due_at).getTime() >= now);
    else if (activeTab === 'overdue')   list = list.filter((r) => !r.completed && new Date(r.due_at).getTime() < now);
    else if (activeTab === 'completed') list = list.filter((r) => r.completed);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) =>
        [r.company, r.title, r.notes, ...(r.person_names || []), ...(r.person_emails || [])]
          .some((s) => String(s || '').toLowerCase().includes(q))
      );
    }

    if (dateFrom) list = list.filter((r) => new Date(r.due_at) >= new Date(dateFrom));
    if (dateTo)   list = list.filter((r) => new Date(r.due_at) <= new Date(dateTo + 'T23:59:59'));

    if (selectedDay) list = list.filter((r) => new Date(r.due_at).toDateString() === selectedDay);

    list = [...list].sort((a, b) => {
      if (sortBy === 'due_desc')     return new Date(b.due_at) - new Date(a.due_at);
      if (sortBy === 'created_desc') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'created_asc')  return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'priority') {
        const ord = { high: 0, medium: 1, low: 2 };
        return (ord[a.priority || 'medium'] - ord[b.priority || 'medium']) || (new Date(a.due_at) - new Date(b.due_at));
      }
      return new Date(a.due_at) - new Date(b.due_at);
    });

    return list;
  }, [reminders, hiddenIds, activeTab, searchQuery, dateFrom, dateTo, selectedDay, sortBy]);

  // ── stats ──
  const stats = useMemo(() => {
    const now = Date.now();
    let overdue = 0, upcoming = 0, completed = 0;
    for (const r of reminders) {
      if (r.completed) completed += 1;
      else if (new Date(r.due_at).getTime() < now) overdue += 1;
      else upcoming += 1;
    }
    return { overdue, upcoming, completed };
  }, [reminders]);

  const allSelected = displayed.length > 0 && displayed.every((r) => selectedIds.has(r.id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(displayed.map((r) => r.id)));
  };

  // ── render ──
  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Helmet>
        <title>Reminders — Internal | Timingo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto">

        {/* ── header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[#F7666F] to-[#6675F7]">
              <Bell className="w-5 h-5 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-bold leading-tight hometext-gradient">Internal Reminders</h1>
              <p className="text-sm text-gray-500">Track follow-ups and nudge people by email before they're due.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pushState !== 'unsupported' && (
              <button onClick={togglePush}
                disabled={pushState === 'working' || pushState === 'checking' || pushState === 'denied'}
                title={pushState === 'denied' ? 'Notifications are blocked in your browser settings' : ''}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition border rounded-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                  pushState === 'enabled'
                    ? 'border-[#6675F7]/30 text-[#4452c9] bg-[#6675F7]/10 hover:bg-[#6675F7]/15'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                {pushState === 'enabled' ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                {pushState === 'enabled' && 'Notifications on'}
                {pushState === 'disabled' && 'Enable notifications'}
                {pushState === 'denied' && 'Notifications blocked'}
                {(pushState === 'checking' || pushState === 'working') && 'Notifications…'}
              </button>
            )}
            <button onClick={signOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 transition border border-gray-200 rounded-lg hover:bg-gray-50">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        {/* ── stat pills ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatPill icon={Clock}        label="Upcoming"  value={stats.upcoming}  tone="bg-[#6675F7]/10 text-[#4452c9]" />
          <StatPill icon={AlertCircle}  label="Overdue"   value={stats.overdue}   tone="bg-red-50 text-red-500" />
          <StatPill icon={CheckCircle2} label="Completed" value={stats.completed} tone="bg-emerald-50 text-emerald-600" />
        </div>

        {/* ── tabs ── */}
        <div className="flex gap-1 p-1 mb-5 bg-gray-100 rounded-xl w-fit">
          {[['all', 'All'], ['upcoming', 'Upcoming'], ['overdue', 'Overdue'], ['completed', 'Completed']].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
                activeTab === val ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {label}
              {val === 'overdue' && stats.overdue > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {stats.overdue}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── toolbar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {/* search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminders…"
              className={`${inputClasses} pl-9`} />
          </div>

          {/* sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* filters toggle */}
          <button onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm border rounded-lg transition ${
              showFilters || dateFrom || dateTo ? 'border-[#6675F7]/50 bg-[#6675F7]/10 text-[#4452c9]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* view toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('list')}
              className={`p-2.5 transition ${viewMode === 'list' ? 'bg-[#6675F7]/10 text-[#4452c9]' : 'text-gray-400 hover:bg-gray-50'}`}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('calendar')}
              className={`p-2.5 transition ${viewMode === 'calendar' ? 'bg-[#6675F7]/10 text-[#4452c9]' : 'text-gray-400 hover:bg-gray-50'}`}>
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          {/* select mode toggle */}
          <button onClick={() => { setSelectMode((s) => !s); setSelectedIds(new Set()); }}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm border rounded-lg transition ${
              selectMode ? 'border-[#6675F7]/50 bg-[#6675F7]/10 text-[#4452c9]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            <CheckSquare className="w-4 h-4" /> Select
          </button>

          {/* export */}
          <button onClick={() => exportCSV(displayed)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition">
            <Download className="w-4 h-4" /> Export
          </button>

          {/* new reminder */}
          <button onClick={() => { setShowForm((s) => !s); setEditingId(null); setDuplicating(null); }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Close' : 'New reminder'}
          </button>
        </div>

        {/* ── date range filters ── */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 mb-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Due from</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Due to</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]" />
            </div>
            {(dateFrom || dateTo) && (
              <div className="flex items-end">
                <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── bulk action bar ── */}
        {selectMode && selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-[#6675F7]/10 border border-[#6675F7]/20 rounded-2xl">
            <button onClick={toggleSelectAll} className="text-sm text-[#4452c9] font-medium hover:underline">
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
            <span className="text-sm text-[#4452c9]">{selectedIds.size} selected</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={handleBulkComplete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition">
                <CheckCircle2 className="w-4 h-4" /> Mark complete
              </button>
              <button onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* ── select-all row (when select mode, nothing selected yet) ── */}
        {selectMode && selectedIds.size === 0 && displayed.length > 0 && (
          <button onClick={toggleSelectAll}
            className="flex items-center gap-2 mb-3 text-sm text-gray-500 hover:text-[#4452c9] transition">
            <Square className="w-4 h-4" /> Select all ({displayed.length})
          </button>
        )}

        {/* ── notices / errors ── */}
        {notice && (
          <p className="flex items-center gap-1.5 px-4 py-2.5 mb-4 text-sm rounded-lg text-emerald-700 bg-emerald-50">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {notice}
          </p>
        )}
        {error && (
          <p className="flex items-center gap-1.5 px-4 py-2.5 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}

        {/* ── undo toast ── */}
        {undoItem && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 mb-4 bg-gray-800 text-white text-sm rounded-2xl shadow-lg">
            <span>Reminder deleted — "{undoItem.title}"</span>
            <button onClick={handleUndoDelete}
              className="font-semibold text-[#a5aeff] hover:text-white transition shrink-0">
              Undo
            </button>
          </div>
        )}

        {/* ── new / duplicate form ── */}
        {(showForm || duplicating) && !editingId && (
          <div className="mb-8">
            <ReminderForm
              initialValues={duplicating || emptyForm}
              submitLabel="Create reminder"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => { setShowForm(false); setDuplicating(null); }}
            />
          </div>
        )}

        {/* ── calendar strip (calendar view) ── */}
        {viewMode === 'calendar' && (
          <CalendarStrip reminders={reminders} selectedDate={selectedDay} onSelectDate={setSelectedDay} />
        )}

        {/* ── list ── */}
        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading reminders…</p>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-gray-400">
            <Bell className="w-10 h-10 mb-3 text-gray-300" />
            <p>{reminders.length === 0 ? 'No reminders yet. Create one to get started.' : 'No reminders match the current filters.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((reminder) =>
              editingId === reminder.id ? (
                <ReminderForm
                  key={reminder.id}
                  initialValues={{
                    company:               reminder.company,
                    person_names:          (reminder.person_names || []).join(', '),
                    person_emails:         (reminder.person_emails || []).join(', '),
                    title:                 reminder.title,
                    notes:                 reminder.notes || '',
                    due_at:                toDatetimeLocal(reminder.due_at),
                    remind_offsets_minutes: reminder.remind_offsets_minutes || DEFAULT_OFFSETS,
                    priority:              reminder.priority || 'medium',
                    category:              reminder.category || '',
                    url:                   reminder.url || '',
                    custom_email_body:     reminder.custom_email_body || '',
                  }}
                  submitLabel="Save changes"
                  busy={busy}
                  onSubmit={(form) => handleUpdate(reminder.id, form)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={() => { setEditingId(reminder.id); setShowForm(false); setDuplicating(null); }}
                  onDelete={() => handleDelete(reminder)}
                  onToggleCompleted={() => toggleCompleted(reminder)}
                  onDuplicate={() => {
                    setDuplicating({
                      company:               reminder.company,
                      person_names:          (reminder.person_names || []).join(', '),
                      person_emails:         (reminder.person_emails || []).join(', '),
                      title:                 reminder.title + ' (copy)',
                      notes:                 reminder.notes || '',
                      due_at:                '',
                      remind_offsets_minutes: reminder.remind_offsets_minutes || DEFAULT_OFFSETS,
                      priority:              reminder.priority || 'medium',
                      category:              reminder.category || '',
                      url:                   reminder.url || '',
                      custom_email_body:     reminder.custom_email_body || '',
                    });
                    setShowForm(false);
                    setEditingId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSnooze={(minutes) => handleSnooze(reminder, minutes)}
                  selected={selectedIds.has(reminder.id)}
                  onSelect={() => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      next.has(reminder.id) ? next.delete(reminder.id) : next.add(reminder.id);
                      return next;
                    });
                  }}
                  selectMode={selectMode}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── export ───────────────────────────────────────────────────────────────────

const Reminders = () => {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');
  if (!authed) return <GateForm onSuccess={() => setAuthed(true)} />;
  return <RemindersDashboard />;
};

export default Reminders;
