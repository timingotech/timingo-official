import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

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
  person_name: '',
  person_email: '',
  title: '',
  notes: '',
  due_at: '',
  remind_offsets_minutes: DEFAULT_OFFSETS,
};

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeUntilLabel(dueAt, completed) {
  if (completed) return 'Completed';
  const diffMs = new Date(dueAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Overdue';
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `In ${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `In ${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `In ${days} day${days === 1 ? '' : 's'}`;
}

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
    <div className="flex items-center justify-center min-h-screen bg-[#F7F7FA] px-4 pt-28">
      <Helmet>
        <title>Reminders — Internal | Timingo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-center hometext-gradient">Internal Reminders</h1>
        <p className="mb-6 text-sm text-center text-gray-500">Sign in to manage reminders</p>
        <label className="block mb-1 text-sm font-medium text-gray-700">Login</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Company name"
          autoComplete="username"
        />
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Company name"
          autoComplete="current-password"
        />
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full px-4 py-2 font-semibold text-white rounded support-gradient">
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {OFFSET_PRESETS.map((preset) => (
        <label key={preset.minutes} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.includes(preset.minutes)}
            onChange={() => toggle(preset.minutes)}
            className="w-4 h-4"
          />
          {preset.label}
        </label>
      ))}
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

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 p-6 bg-white rounded-lg shadow-md sm:grid-cols-2">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Company</label>
        <input
          required
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="e.g. Acme Ltd"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="e.g. Send proposal follow-up"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Person's name</label>
        <input
          required
          value={form.person_name}
          onChange={(e) => update('person_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Who this is for"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Person's email</label>
        <input
          required
          type="email"
          value={form.person_email}
          onChange={(e) => update('person_email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Where to send the reminder emails"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Due date &amp; time</label>
        <input
          required
          type="datetime-local"
          value={form.due_at}
          onChange={(e) => update('due_at', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Any extra context to include in the reminder email"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block mb-2 text-sm font-medium text-gray-700">Send email reminders</label>
        <OffsetPicker value={form.remind_offsets_minutes} onChange={(v) => update('remind_offsets_minutes', v)} />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 font-semibold text-white rounded support-gradient disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 font-semibold text-gray-600 border border-gray-300 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function ReminderCard({ reminder, onEdit, onDelete, onToggleCompleted }) {
  const dueLabel = new Date(reminder.due_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const status = timeUntilLabel(reminder.due_at, reminder.completed);
  const overdue = !reminder.completed && new Date(reminder.due_at).getTime() < Date.now();

  return (
    <div className={`p-5 bg-white rounded-lg shadow-md ${reminder.completed ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">{reminder.company}</p>
          <h3 className="text-lg font-semibold text-gray-800">{reminder.title}</h3>
          <p className="text-sm text-gray-500">For {reminder.person_name} · {reminder.person_email}</p>
          {reminder.notes && <p className="mt-2 text-sm text-gray-600">{reminder.notes}</p>}
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${overdue ? 'text-red-500' : 'text-gray-700'}`}>{status}</p>
          <p className="text-xs text-gray-400">{dueLabel}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
        <label className="flex items-center gap-2 text-gray-600">
          <input type="checkbox" checked={reminder.completed} onChange={onToggleCompleted} className="w-4 h-4" />
          Completed
        </label>
        <button onClick={onEdit} className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
          Edit
        </button>
        <button onClick={onDelete} className="px-3 py-1 text-red-500 border border-red-200 rounded hover:bg-red-50">
          Delete
        </button>
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

  const withDueAtIso = (form) => ({ ...form, due_at: new Date(form.due_at).toISOString() });

  const handleCreate = async (form) => {
    setBusy(true);
    setError('');
    try {
      await axios.post('/api/reminders', withDueAtIso(form));
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
      await axios.patch('/api/reminders', { id, ...withDueAtIso(form) });
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

  const filtered = companyFilter
    ? reminders.filter((r) => r.company.toLowerCase().includes(companyFilter.toLowerCase()))
    : reminders;

  return (
    <div className="min-h-screen px-4 pt-28 pb-10 bg-[#F7F7FA]">
      <Helmet>
        <title>Reminders — Internal | Timingo Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold hometext-gradient">Internal Reminders</h1>
          <div className="flex flex-wrap gap-3">
            <input
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company…"
              className="px-3 py-2 text-sm border border-gray-300 rounded"
            />
            <button
              onClick={() => {
                setShowForm((s) => !s);
                setEditingId(null);
              }}
              className="px-4 py-2 text-sm font-semibold text-white rounded support-gradient"
            >
              {showForm ? 'Close' : '+ New reminder'}
            </button>
            <button onClick={signOut} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded">
              Sign out
            </button>
          </div>
        </div>

        {notice && <p className="mb-4 text-sm text-green-600">{notice}</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {showForm && (
          <div className="mb-8">
            <ReminderForm initialValues={emptyForm} submitLabel="Create reminder" busy={busy} onSubmit={handleCreate} />
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading reminders…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No reminders yet. Create one to get started.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((reminder) =>
              editingId === reminder.id ? (
                <ReminderForm
                  key={reminder.id}
                  initialValues={{
                    company: reminder.company,
                    person_name: reminder.person_name,
                    person_email: reminder.person_email,
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

  if (!authed) {
    return <GateForm onSuccess={() => setAuthed(true)} />;
  }
  return <RemindersDashboard />;
};

export default Reminders;
