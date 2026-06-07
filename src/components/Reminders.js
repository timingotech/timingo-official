import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Bell,
  BellRing,
  BellOff,
  Building2,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Plus,
  LogOut,
  Search,
  AlertCircle,
  X,
} from 'lucide-react';

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

const emptyForm = {
  company: '',
  person_names: '',
  person_emails: '',
  title: '',
  notes: '',
  due_at: '',
  remind_offsets_minutes: DEFAULT_OFFSETS,
};

function parseList(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTime(value) {
  // Note: `dateStyle`/`timeStyle` can't be combined with `timeZoneName` (Intl throws), so spell out the parts.
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
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
  if (minutes < 60) return { text: `In ${minutes} minute${minutes === 1 ? '' : 's'}`, tone: 'soon' };
  const hours = Math.round(minutes / 60);
  if (hours < 48) return { text: `In ${hours} hour${hours === 1 ? '' : 's'}`, tone: hours <= 6 ? 'soon' : 'upcoming' };
  const days = Math.round(hours / 24);
  return { text: `In ${days} day${days === 1 ? '' : 's'}`, tone: 'upcoming' };
}

// Web Push wants the VAPID public key as a Uint8Array, but it's handed out base64url-encoded.
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

const TONE_STYLES = {
  done: 'bg-gray-100 text-gray-500',
  overdue: 'bg-red-50 text-red-600',
  soon: 'bg-amber-50 text-amber-700',
  upcoming: 'bg-emerald-50 text-emerald-700',
};

const inputClasses =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]';
const labelClasses = 'block mb-1.5 text-sm font-medium text-gray-700';

function GateForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const matches = (value) => value.trim().toLowerCase() === COMPANY_NAME.toLowerCase();
    if (matches(username) && matches(password)) {
      localStorage.setItem(AUTH_KEY, 'true');
      setError('');
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
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`${inputClasses} mb-4`}
          placeholder="Company name"
          autoComplete="username"
        />
        <label className={labelClasses}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClasses} mb-4`}
          placeholder="Company name"
          autoComplete="current-password"
        />
        {error && (
          <p className="flex items-center gap-1.5 mb-3 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2.5 font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

function OffsetPicker({ value, onChange }) {
  const toggle = (minutes) => {
    if (value.includes(minutes)) {
      onChange(value.filter((m) => m !== minutes));
    } else {
      onChange([...value, minutes].sort((a, b) => b - a));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {OFFSET_PRESETS.map((preset) => {
        const active = value.includes(preset.minutes);
        return (
          <button
            type="button"
            key={preset.minutes}
            onClick={() => toggle(preset.minutes)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition ${
              active
                ? 'border-[#6675F7] bg-[#6675F7]/10 text-[#4452c9]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {active ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 text-gray-300" />}
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

function ReminderForm({ initialValues, submitLabel, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const nameCount = parseList(form.person_names).length;
  const emailCount = parseList(form.person_emails).length;
  const countMismatch = nameCount > 0 && emailCount > 0 && nameCount !== emailCount;

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 p-6 bg-white border border-gray-100 shadow-md rounded-2xl sm:p-7 sm:grid-cols-2">
      <div>
        <label className={labelClasses}>Company</label>
        <input
          required
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          className={inputClasses}
          placeholder="e.g. Acme Ltd"
        />
      </div>
      <div>
        <label className={labelClasses}>Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className={inputClasses}
          placeholder="e.g. Send proposal follow-up"
        />
      </div>
      <div>
        <label className={labelClasses}>Recipient name(s)</label>
        <input
          required
          value={form.person_names}
          onChange={(e) => update('person_names', e.target.value)}
          className={inputClasses}
          placeholder="e.g. Alice, Bob"
        />
        <p className="mt-1 text-xs text-gray-400">Separate multiple names with commas, in the same order as the emails.</p>
      </div>
      <div>
        <label className={labelClasses}>Recipient email(s)</label>
        <input
          required
          value={form.person_emails}
          onChange={(e) => update('person_emails', e.target.value)}
          className={inputClasses}
          placeholder="e.g. alice@acme.com, bob@acme.com"
        />
        {countMismatch && (
          <p className="flex items-center gap-1.5 mt-1 text-xs text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {nameCount} name{nameCount === 1 ? '' : 's'} but {emailCount} email{emailCount === 1 ? '' : 's'} — they'll be matched in order, extras fall back to the email address.
          </p>
        )}
      </div>
      <div>
        <label className={labelClasses}>Due date &amp; time</label>
        <input
          required
          type="datetime-local"
          value={form.due_at}
          onChange={(e) => update('due_at', e.target.value)}
          className={inputClasses}
        />
        {form.due_at ? (
          <p className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-[#4452c9]">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            Scheduled for {formatDateTime(form.due_at)}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-400">Picked in your own time zone — reminder emails are timed against this exact moment.</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label className={labelClasses}>Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          className={inputClasses}
          placeholder="Any extra context to include in the reminder email"
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClasses}>Send email reminders</label>
        <OffsetPicker value={form.remind_offsets_minutes} onChange={(v) => update('remind_offsets_minutes', v)} />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 font-semibold text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function ReminderCard({ reminder, onEdit, onDelete, onToggleCompleted }) {
  const status = timeUntilLabel(reminder.due_at, reminder.completed);
  const recipients = recipientLabels(reminder);

  return (
    <div className={`p-5 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm transition hover:shadow-md ${reminder.completed ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            <Building2 className="w-3.5 h-3.5" />
            {reminder.company}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-gray-800">{reminder.title}</h3>
          <div className="flex items-start gap-1.5 mt-1.5 text-sm text-gray-500">
            <Users className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="break-words">{recipients.join(', ') || '—'}</span>
          </div>
          {reminder.notes && <p className="mt-2.5 text-sm text-gray-600">{reminder.notes}</p>}
        </div>
        <div className="text-right shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${TONE_STYLES[status.tone]}`}>
            {status.tone === 'overdue' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {status.text}
          </span>
          <p className="flex items-center justify-end gap-1.5 mt-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateTime(reminder.due_at)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 text-sm border-t border-gray-100">
        <button
          onClick={onToggleCompleted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
            reminder.completed
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {reminder.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {reminder.completed ? 'Completed' : 'Mark complete'}
        </button>
        <button onClick={onEdit} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50">
          <Pencil className="w-4 h-4" /> Edit
        </button>
        <button onClick={onDelete} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-500 transition border border-red-200 rounded-lg hover:bg-red-50">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}

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

function RemindersDashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [companyFilter, setCompanyFilter] = useState('');
  const [pushState, setPushState] = useState('checking'); // checking | unsupported | enabled | disabled | denied | working

  useEffect(() => {
    let cancelled = false;
    async function checkPushStatus() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !process.env.REACT_APP_VAPID_PUBLIC_KEY) {
        if (!cancelled) setPushState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        if (!cancelled) setPushState('denied');
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration('/reminders');
        const subscription = registration ? await registration.pushManager.getSubscription() : null;
        if (!cancelled) setPushState(subscription ? 'enabled' : 'disabled');
      } catch {
        if (!cancelled) setPushState('disabled');
      }
    }
    checkPushStatus();
    return () => { cancelled = true; };
  }, []);

  const togglePush = async () => {
    setError('');
    setPushState('working');
    try {
      if (pushState === 'enabled') {
        await unsubscribeFromPush();
        setPushState('disabled');
        setNotice('Push notifications turned off for this device.');
      } else {
        await subscribeToPush();
        setPushState('enabled');
        setNotice('Push notifications enabled for this device.');
      }
    } catch (err) {
      setPushState(Notification.permission === 'denied' ? 'denied' : 'disabled');
      setError(err?.message || 'Could not change push notification settings.');
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/reminders');
      setReminders(data.reminders || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not load reminders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const buildPayload = (form) => ({
    company: form.company.trim(),
    title: form.title.trim(),
    notes: form.notes.trim(),
    person_names: parseList(form.person_names),
    person_emails: parseList(form.person_emails),
    due_at: new Date(form.due_at).toISOString(),
    remind_offsets_minutes: form.remind_offsets_minutes,
  });

  const handleCreate = async (form) => {
    setBusy(true);
    setError('');
    try {
      await axios.post('/api/reminders', buildPayload(form));
      setShowForm(false);
      setNotice('Reminder created.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not create reminder.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id, form) => {
    setBusy(true);
    setError('');
    try {
      await axios.patch('/api/reminders', { id, ...buildPayload(form) });
      setEditingId(null);
      setNotice('Reminder updated.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not update reminder.');
    } finally {
      setBusy(false);
    }
  };

  const toggleCompleted = async (reminder) => {
    setError('');
    try {
      await axios.patch('/api/reminders', { id: reminder.id, completed: !reminder.completed });
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not update reminder.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    setError('');
    try {
      await axios.delete(`/api/reminders?id=${id}`);
      setNotice('Reminder deleted.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not delete reminder.');
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  };

  const filtered = useMemo(
    () =>
      companyFilter
        ? reminders.filter((r) => r.company.toLowerCase().includes(companyFilter.toLowerCase()))
        : reminders,
    [reminders, companyFilter]
  );

  const stats = useMemo(() => {
    const now = Date.now();
    let overdue = 0;
    let upcoming = 0;
    let completed = 0;
    for (const r of reminders) {
      if (r.completed) completed += 1;
      else if (new Date(r.due_at).getTime() < now) overdue += 1;
      else upcoming += 1;
    }
    return { overdue, upcoming, completed };
  }, [reminders]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Helmet>
        <title>Reminders — Internal | Timingo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
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
          <div className="flex items-center gap-2">
            {pushState !== 'unsupported' && (
              <button
                onClick={togglePush}
                disabled={pushState === 'working' || pushState === 'checking' || pushState === 'denied'}
                title={pushState === 'denied' ? 'Notifications are blocked in your browser settings' : ''}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition border rounded-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                  pushState === 'enabled'
                    ? 'border-[#6675F7]/30 text-[#4452c9] bg-[#6675F7]/10 hover:bg-[#6675F7]/15'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {pushState === 'enabled' ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                {pushState === 'enabled' && 'Notifications on'}
                {pushState === 'disabled' && 'Enable notifications'}
                {pushState === 'denied' && 'Notifications blocked'}
                {(pushState === 'checking' || pushState === 'working') && 'Notifications…'}
              </button>
            )}
            <button onClick={signOut} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 transition border border-gray-200 rounded-lg hover:bg-gray-50">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatPill icon={Clock} label="Upcoming" value={stats.upcoming} tone="bg-[#6675F7]/10 text-[#4452c9]" />
          <StatPill icon={AlertCircle} label="Overdue" value={stats.overdue} tone="bg-red-50 text-red-500" />
          <StatPill icon={CheckCircle2} label="Completed" value={stats.completed} tone="bg-emerald-50 text-emerald-600" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company…"
              className={`${inputClasses} pl-9 w-56`}
            />
          </div>
          <button
            onClick={() => {
              setShowForm((s) => !s);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white transition rounded-lg bg-gradient-to-r from-[#F7666F] to-[#6675F7] hover:opacity-90"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Close' : 'New reminder'}
          </button>
        </div>

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

        {showForm && (
          <div className="mb-8">
            <ReminderForm initialValues={emptyForm} submitLabel="Create reminder" busy={busy} onSubmit={handleCreate} />
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading reminders…</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-gray-400">
            <Bell className="w-10 h-10 mb-3 text-gray-300" />
            <p>No reminders yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((reminder) =>
              editingId === reminder.id ? (
                <ReminderForm
                  key={reminder.id}
                  initialValues={{
                    company: reminder.company,
                    person_names: (reminder.person_names || []).join(', '),
                    person_emails: (reminder.person_emails || []).join(', '),
                    title: reminder.title,
                    notes: reminder.notes || '',
                    due_at: toDatetimeLocal(reminder.due_at),
                    remind_offsets_minutes: reminder.remind_offsets_minutes || DEFAULT_OFFSETS,
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
                  onEdit={() => {
                    setEditingId(reminder.id);
                    setShowForm(false);
                  }}
                  onDelete={() => handleDelete(reminder.id)}
                  onToggleCompleted={() => toggleCompleted(reminder)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Reminders = () => {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');

  // The site-wide manifest.json has start_url "." (the homepage), so iOS "Add to Home
  // Screen" launches into "/" no matter which page you tapped it from. Swap in a
  // manifest scoped to /reminders while this page is mounted, then restore on the way out.
  useEffect(() => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return undefined;
    const original = link.getAttribute('href');
    link.setAttribute('href', '/reminders-manifest.json');
    return () => {
      link.setAttribute('href', original);
    };
  }, []);

  if (!authed) {
    return <GateForm onSuccess={() => setAuthed(true)} />;
  }
  return <RemindersDashboard />;
};

export default Reminders;
