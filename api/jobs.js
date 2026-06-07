// Deliberately uses the runtime's built-in fetch instead of axios — Vercel's bundler
// (@vercel/nft) fails to trace axios's platform-specific internals into the function
// bundle, which crashes the function at boot with FUNCTION_INVOCATION_FAILED
// ("Cannot find module '/var/task/node_modules/axios/dist/node/axios.cjs'").
// Native fetch needs no bundling at all, so this sidesteps the problem entirely.

const FETCH_TIMEOUT_MS = 6000;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url} responded with ${response.status}`);
  return response.json();
}

const SOURCE_NAMES = ['RemoteOK', 'Arbeitnow', 'Adzuna'];

const POSTED_WITHIN_HOURS = {
  '24h': 24,
  '3d': 72,
  '7d': 168,
};

const EMPLOYMENT_TYPE_KEYWORDS = {
  'full-time': ['full time', 'full-time', 'fulltime'],
  'part-time': ['part time', 'part-time', 'parttime'],
  contract: ['contract', 'contractor', 'freelance'],
  internship: ['internship', 'intern'],
};

function normalize(value) {
  return String(value || '').toLowerCase();
}

function matchesAnyTerm(haystack, terms) {
  if (!terms.length) return true;
  const text = normalize(haystack);
  return terms.some((term) => text.includes(term));
}

// First entry is RemoteOK's legal/metadata notice, not a job — drop it.
async function fetchRemoteOK() {
  const data = await fetchJson('https://remoteok.com/api', {
    headers: { 'User-Agent': 'TimingoTech-JobFinder/1.0 (+https://timingotech.com)' },
  });
  const jobs = Array.isArray(data) ? data.slice(1) : [];
  return jobs.map((job) => ({
    id: `remoteok-${job.id || job.slug}`,
    title: job.position || job.title || 'Untitled role',
    company: job.company || 'Unknown company',
    location: job.location || 'Remote',
    remote: true,
    jobType: null,
    tags: Array.isArray(job.tags) ? job.tags : [],
    description: job.description || '',
    postedAt: job.date ? new Date(job.date) : null,
    url: job.url || (job.slug ? `https://remoteok.com/remote-jobs/${job.slug}` : null),
    source: 'RemoteOK',
  }));
}

async function fetchArbeitnow() {
  const data = await fetchJson('https://www.arbeitnow.com/api/job-board-api');
  const jobs = Array.isArray(data?.data) ? data.data : [];
  return jobs.map((job) => ({
    id: `arbeitnow-${job.slug}`,
    title: job.title || 'Untitled role',
    company: job.company_name || 'Unknown company',
    location: job.location || (job.remote ? 'Remote' : ''),
    remote: !!job.remote,
    jobType: Array.isArray(job.job_types) && job.job_types.length ? job.job_types.join(', ') : null,
    tags: Array.isArray(job.tags) ? job.tags : [],
    description: job.description || '',
    postedAt: job.created_at ? new Date(job.created_at * 1000) : null,
    url: job.url,
    source: 'Arbeitnow',
  }));
}

// Optional — only runs if ADZUNA_APP_ID / ADZUNA_APP_KEY are configured (free signup at developer.adzuna.com).
async function fetchAdzuna({ what, location }) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const country = process.env.ADZUNA_COUNTRY || 'us';
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: '50',
    max_days_old: '7',
    ...(what ? { what } : {}),
    ...(location ? { where: location } : {}),
  });
  const data = await fetchJson(`https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`);

  const jobs = Array.isArray(data?.results) ? data.results : [];
  return jobs.map((job) => ({
    id: `adzuna-${job.id}`,
    title: job.title || 'Untitled role',
    company: job.company?.display_name || 'Unknown company',
    location: job.location?.display_name || '',
    remote: /remote/i.test(`${job.title} ${job.location?.display_name || ''}`),
    jobType: job.contract_time || job.contract_type || null,
    tags: job.category?.label ? [job.category.label] : [],
    description: job.description || '',
    postedAt: job.created ? new Date(job.created) : null,
    url: job.redirect_url,
    source: 'Adzuna',
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const {
    keywords = '',
    industryTerms = '',
    skills = '',
    location = '',
    workSetting = 'any',
    employmentType = 'any',
    postedWithin = '',
  } = req.query || {};

  const terms = [keywords, industryTerms, skills]
    .join(' ')
    .split(/[,\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const locationTerm = normalize(location);
  const cutoff = POSTED_WITHIN_HOURS[postedWithin]
    ? Date.now() - POSTED_WITHIN_HOURS[postedWithin] * 60 * 60 * 1000
    : null;

  try {
    const settled = await Promise.allSettled([
      fetchRemoteOK(),
      fetchArbeitnow(),
      fetchAdzuna({ what: [keywords, industryTerms].filter(Boolean).join(' '), location }),
    ]);

    const sourceStatus = {};
    let jobs = [];
    settled.forEach((result, i) => {
      const name = SOURCE_NAMES[i];
      if (result.status === 'fulfilled') {
        sourceStatus[name] = { ok: true, count: result.value.length };
        jobs = jobs.concat(result.value);
      } else {
        sourceStatus[name] = { ok: false, error: result.reason?.message || 'Failed to fetch' };
      }
    });

    const filtered = jobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.tags.join(' ')} ${job.description}`;
      if (!matchesAnyTerm(haystack, terms)) return false;

      if (locationTerm && locationTerm !== 'worldwide') {
        const locationMatches =
          normalize(job.location).includes(locationTerm) || (locationTerm === 'remote' && job.remote);
        if (!locationMatches) return false;
      }

      if (workSetting === 'remote' && !job.remote) return false;
      if (workSetting === 'hybrid' && !/hybrid/i.test(`${job.location} ${job.description}`)) return false;
      if (workSetting === 'onsite' && (job.remote || /remote/i.test(job.location))) return false;

      if (employmentType !== 'any') {
        const wanted = EMPLOYMENT_TYPE_KEYWORDS[employmentType] || [];
        const typeText = normalize(`${job.jobType || ''} ${job.tags.join(' ')} ${job.description}`);
        if (wanted.length && !wanted.some((w) => typeText.includes(w))) return false;
      }

      if (cutoff && job.postedAt && job.postedAt.getTime() < cutoff) return false;

      return true;
    });

    const seen = new Set();
    const deduped = filtered.filter((job) => {
      const key = `${normalize(job.title)}|${normalize(job.company)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    deduped.sort((a, b) => (b.postedAt?.getTime() || 0) - (a.postedAt?.getTime() || 0));

    return res.status(200).json({
      jobs: deduped.slice(0, 100).map((job) => ({ ...job, postedAt: job.postedAt ? job.postedAt.toISOString() : null })),
      total: deduped.length,
      sources: sourceStatus,
    });
  } catch (err) {
    console.error('Jobs API error:', err);
    return res.status(500).json({ error: err.message || 'Something went wrong while searching for jobs' });
  }
}
