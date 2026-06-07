import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  X,
} from 'lucide-react';

const INDUSTRIES = [
  { label: 'Any industry', value: '', terms: '' },
  { label: 'Software Engineering', value: 'software', terms: 'software engineer developer programming frontend backend' },
  { label: 'Data & Analytics', value: 'data', terms: 'data analyst scientist analytics machine learning' },
  { label: 'Design & UX', value: 'design', terms: 'design ux ui product designer graphic' },
  { label: 'Product Management', value: 'product', terms: 'product manager product owner' },
  { label: 'Marketing', value: 'marketing', terms: 'marketing seo content growth social media' },
  { label: 'Sales & Business Dev', value: 'sales', terms: 'sales account executive business development' },
  { label: 'Customer Support', value: 'support', terms: 'customer support customer success support specialist' },
  { label: 'Human Resources', value: 'hr', terms: 'hr recruiter talent people operations' },
  { label: 'Finance & Accounting', value: 'finance', terms: 'finance accounting accountant financial analyst' },
  { label: 'Healthcare', value: 'healthcare', terms: 'nurse healthcare medical clinical' },
  { label: 'Operations & Admin', value: 'ops', terms: 'operations admin project manager coordinator' },
];

const LOCATIONS = [
  { label: 'Worldwide', value: '' },
  { label: 'Remote only', value: 'remote' },
  { label: 'United States', value: 'united states' },
  { label: 'United Kingdom', value: 'united kingdom' },
  { label: 'Canada', value: 'canada' },
  { label: 'Germany', value: 'germany' },
  { label: 'India', value: 'india' },
  { label: 'Nigeria', value: 'nigeria' },
  { label: 'Custom…', value: 'custom' },
];

const WORK_SETTINGS = [
  { label: 'Any setting', value: 'any' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
];

const EMPLOYMENT_TYPES = [
  { label: 'Any type', value: 'any' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
];

const POSTED_WITHIN = [
  { label: 'Any time', value: '' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last 7 days', value: '7d' },
];

const inputClasses =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]';
const labelClasses = 'block mb-1.5 text-sm font-medium text-gray-700';

function timeAgoLabel(value) {
  if (!value) return null;
  const diffMs = Date.now() - new Date(value).getTime();
  if (diffMs < 0) return 'just now';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const MAX_RESUME_CHARS = 20000;

// Loaded on demand — pdfjs-dist is sizeable, so we only pull it in when someone
// actually uploads a PDF rather than bloating the page's main bundle.
async function extractPdfText(file) {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  // Served as a static file from /public — CRA's webpack config can't bundle workers
  // out of node_modules, so the file is copied alongside the rest of the public assets.
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  let text = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
    if (text.length > MAX_RESUME_CHARS) break;
  }
  return text.trim();
}

async function extractResumeText(file) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return extractPdfText(file);
  }
  return (await file.text()).trim();
}

function ResumeUpload({ onApply }) {
  const [status, setStatus] = useState('idle'); // idle | reading | analyzing | done | error
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [detected, setDetected] = useState(null);

  const runAnalysis = useCallback(async (resumeText) => {
    const trimmed = resumeText.trim();
    if (!trimmed) {
      setStatus('error');
      setError('That resume looks empty — try a different file or paste the text directly.');
      return;
    }
    setStatus('analyzing');
    setError('');
    try {
      const { data } = await axios.post('/api/resume-parse', { resumeText: trimmed.slice(0, MAX_RESUME_CHARS) });
      setDetected(data);
      setStatus('done');
      onApply(data);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.error || 'Could not analyze that resume right now. Please try again shortly.');
    }
  }, [onApply]);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setDetected(null);
    setStatus('reading');
    setError('');
    try {
      const text = await extractResumeText(file);
      await runAnalysis(text);
    } catch (err) {
      setStatus('error');
      setError('Could not read that file. Try a PDF or .txt file, or paste the text directly.');
    }
  }, [runAnalysis]);

  const reset = () => {
    setStatus('idle');
    setError('');
    setFileName('');
    setPastedText('');
    setDetected(null);
  };

  const busy = status === 'reading' || status === 'analyzing';

  return (
    <div className="mb-6 rounded-2xl border border-[#6675F7]/20 bg-gradient-to-br from-[#6675F7]/5 to-transparent p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#6675F7]/10 text-[#4452c9]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Fill from resume</h2>
          <p className="mt-0.5 text-sm text-gray-600">
            Upload a PDF or text resume and AI will suggest a role, skills, industries, and filters for you to review below.
          </p>

          {status === 'idle' && !showPaste && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-[#6675F7]/40 hover:text-[#4452c9]">
                <Upload className="h-4 w-4" />
                Upload resume (PDF or .txt)
                <input
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowPaste(true)}
                className="text-sm font-medium text-[#4452c9] hover:underline"
              >
                or paste resume text instead
              </button>
            </div>
          )}

          {showPaste && status === 'idle' && (
            <div className="mt-3 space-y-2">
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6675F7]/40 focus:border-[#6675F7]"
                rows={6}
                placeholder="Paste your resume text here…"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => runAnalysis(pastedText)}
                  disabled={!pastedText.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#6675F7] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#4452c9] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" /> Analyze
                </button>
                <button type="button" onClick={() => setShowPaste(false)} className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {busy && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {status === 'reading' ? `Reading ${fileName || 'your resume'}…` : 'Analyzing with AI…'}
            </div>
          )}

          {status === 'error' && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {status === 'done' && detected && (
            <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Detected{detected.role ? `: ${detected.role}` : ' your profile'} — filters below have been pre-filled. Review and adjust before searching.
                  </p>
                  {detected.skills?.length > 0 && (
                    <p className="mt-1 text-emerald-700">Skills: {detected.skills.join(', ')}</p>
                  )}
                  {detected.industries?.length > 0 && (
                    <p className="mt-0.5 text-emerald-700">Industries: {detected.industries.join(', ')}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
              >
                <X className="h-3 w-3" /> Start over with a different resume
              </button>
            </div>
          )}

          {fileName && status !== 'idle' && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <FileText className="h-3 w-3" /> {fileName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const posted = timeAgoLabel(job.postedAt);
  return (
    <a
      href={job.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 bg-white border border-gray-100 rounded-xl shadow-sm transition hover:shadow-md hover:border-[#6675F7]/30 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#4452c9] transition-colors">{job.title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600">
            <Building2 className="w-3.5 h-3.5" /> {job.company}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-[#6675F7]" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {job.location && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-gray-600">
            <MapPin className="w-3 h-3" /> {job.location}
          </span>
        )}
        {job.remote && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Remote</span>
        )}
        {job.jobType && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
            <Briefcase className="w-3 h-3" /> {job.jobType}
          </span>
        )}
        {posted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
            <Clock className="w-3 h-3" /> {posted}
          </span>
        )}
        <span className="ml-auto text-gray-400">via {job.source}</span>
      </div>
    </a>
  );
}

function JobFinder() {
  const [filters, setFilters] = useState({
    keywords: '',
    industry: '',
    skills: '',
    location: '',
    customLocation: '',
    workSetting: 'any',
    employmentType: 'any',
    postedWithin: '24h',
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSearched(true);
      try {
        const industry = INDUSTRIES.find((i) => i.value === filters.industry);
        const location = filters.location === 'custom' ? filters.customLocation : filters.location;

        const { data } = await axios.get('/api/jobs', {
          params: {
            keywords: filters.keywords,
            industryTerms: industry?.terms || '',
            skills: filters.skills,
            location,
            workSetting: filters.workSetting,
            employmentType: filters.employmentType,
            postedWithin: filters.postedWithin,
          },
        });
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not fetch jobs right now. Please try again shortly.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const applyResumeFilters = useCallback((detected) => {
    setFilters((f) => {
      const next = { ...f };

      if (detected.role) next.keywords = detected.role;
      if (detected.skills?.length) next.skills = detected.skills.join(', ');

      if (detected.industries?.length) {
        const match = INDUSTRIES.find((i) => i.label.toLowerCase() === detected.industries[0].toLowerCase());
        if (match) next.industry = match.value;
      }

      if (detected.workSetting && detected.workSetting !== 'any') next.workSetting = detected.workSetting;
      if (detected.employmentType && detected.employmentType !== 'any') next.employmentType = detected.employmentType;

      if (detected.location) {
        const loc = detected.location.toLowerCase();
        const match = LOCATIONS.find((l) => l.value && (loc.includes(l.value) || l.value.includes(loc)));
        if (match) {
          next.location = match.value;
        } else {
          next.location = 'custom';
          next.customLocation = detected.location;
        }
      }

      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-10 pt-28">
      <Helmet>
        <title>Job Finder | Timingo Tech</title>
        <meta name="description" content="Search recent job postings by industry, skills, location, work setting and more." />
      </Helmet>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Job Finder</h1>
          <p className="mt-2 text-gray-600">Search recent postings across multiple job boards, filtered the way you like.</p>
        </div>

        <ResumeUpload onApply={applyResumeFilters} />

        <form onSubmit={handleSearch} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Job title / keywords</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="e.g. Frontend Engineer"
                value={filters.keywords}
                onChange={update('keywords')}
              />
            </div>
            <div>
              <label className={labelClasses}>Skills (comma-separated)</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="e.g. React, TypeScript"
                value={filters.skills}
                onChange={update('skills')}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClasses}>Industry</label>
              <select className={inputClasses} value={filters.industry} onChange={update('industry')}>
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Location</label>
              <select className={inputClasses} value={filters.location} onChange={update('location')}>
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Work setting</label>
              <select className={inputClasses} value={filters.workSetting} onChange={update('workSetting')}>
                {WORK_SETTINGS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Employment type</label>
              <select className={inputClasses} value={filters.employmentType} onChange={update('employmentType')}>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filters.location === 'custom' && (
            <div>
              <label className={labelClasses}>Custom location</label>
              <input
                type="text"
                className={inputClasses}
                placeholder="e.g. Berlin, Germany"
                value={filters.customLocation}
                onChange={update('customLocation')}
              />
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xs">
              <label className={labelClasses}>Posted within</label>
              <select className={inputClasses} value={filters.postedWithin} onChange={update('postedWithin')}>
                {POSTED_WITHIN.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6675F7] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4452c9] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'Searching…' : 'Search jobs'}
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
          <SlidersHorizontal className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <p>
            Results are pulled live from RemoteOK, Arbeitnow, Remotive, Jobicy, The Muse, Himalayas, and Adzuna — real
            job-board feeds, not a crawl of the entire web. Hybrid/on-site detection is best-effort, since most free
            feeds focus on remote roles.
          </p>
        </div>

        <div className="mt-8">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          {!error && searched && !loading && jobs.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500">
              No matching jobs found. Try widening your filters — e.g. a broader location or longer "posted within" window.
            </div>
          )}

          {jobs.length > 0 && (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {jobs.length} matching job{jobs.length === 1 ? '' : 's'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobFinder;
