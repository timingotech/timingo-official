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

const SOURCE_NAMES = ['RemoteOK', 'Arbeitnow', 'Adzuna', 'Remotive', 'Jobicy', 'The Muse', 'Himalayas'];

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

async function fetchRemotive() {
  const data = await fetchJson('https://remotive.com/api/remote-jobs?limit=100');
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  return jobs.map((job) => ({
    id: `remotive-${job.id}`,
    title: job.title || 'Untitled role',
    company: job.company_name || 'Unknown company',
    location: job.candidate_required_location || 'Remote',
    remote: true,
    jobType: job.job_type ? job.job_type.replace(/_/g, ' ') : null,
    tags: Array.isArray(job.tags) ? job.tags : [],
    description: job.description || '',
    postedAt: job.publication_date ? new Date(job.publication_date) : null,
    url: job.url,
    source: 'Remotive',
  }));
}

async function fetchJobicy() {
  const data = await fetchJson('https://jobicy.com/api/v2/remote-jobs?count=100');
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  return jobs.map((job) => ({
    id: `jobicy-${job.id}`,
    title: job.jobTitle || 'Untitled role',
    company: job.companyName || 'Unknown company',
    location: job.jobGeo || 'Remote',
    remote: true,
    jobType: Array.isArray(job.jobType) && job.jobType.length ? job.jobType.join(', ') : null,
    tags: Array.isArray(job.jobIndustry) ? job.jobIndustry : [],
    description: job.jobExcerpt || '',
    postedAt: job.pubDate ? new Date(job.pubDate) : null,
    url: job.url,
    source: 'Jobicy',
  }));
}

async function fetchTheMuse() {
  const data = await fetchJson('https://www.themuse.com/api/public/jobs?page=1');
  const jobs = Array.isArray(data?.results) ? data.results : [];
  return jobs.map((job) => {
    const locations = Array.isArray(job.locations) ? job.locations.map((l) => l.name).filter(Boolean) : [];
    return {
      id: `muse-${job.id}`,
      title: job.name || 'Untitled role',
      company: job.company?.name || 'Unknown company',
      location: locations.join(', '),
      remote: locations.some((l) => /remote/i.test(l)),
      jobType: Array.isArray(job.levels) && job.levels.length ? job.levels.map((l) => l.name).join(', ') : null,
      tags: Array.isArray(job.tags) ? job.tags : [],
      description: job.contents || '',
      postedAt: job.publication_date ? new Date(job.publication_date) : null,
      url: job.refs?.landing_page,
      source: 'The Muse',
    };
  });
}

async function fetchHimalayas() {
  const data = await fetchJson('https://himalayas.app/jobs/api?limit=100');
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  return jobs.map((job) => ({
    id: `himalayas-${job.guid || job.applicationLink}`,
    title: job.title || 'Untitled role',
    company: job.companyName || 'Unknown company',
    location: Array.isArray(job.locationRestrictions) && job.locationRestrictions.length
      ? job.locationRestrictions.join(', ')
      : 'Remote',
    remote: true,
    jobType: job.employmentType || null,
    tags: Array.isArray(job.categories) ? job.categories : [],
    description: job.excerpt || job.description || '',
    postedAt: job.pubDate ? new Date(job.pubDate * 1000) : null,
    url: job.applicationLink || job.guid,
    source: 'Himalayas',
  }));
}

// Pulls live openings straight from named employers' own public job-board APIs —
// Greenhouse, Lever and Ashby all expose free, no-key JSON endpoints per company.
// This is what gets us real listings from ~50 specific, recognizable companies
// rather than relying solely on generic aggregators (which mostly cover remote roles).
const MAX_JOBS_PER_COMPANY = 40;

const COMPANIES = [
  { name: 'Airbnb', platform: 'greenhouse', token: 'airbnb' },
  { name: 'Stripe', platform: 'greenhouse', token: 'stripe' },
  { name: 'GitLab', platform: 'greenhouse', token: 'gitlab' },
  { name: 'Robinhood', platform: 'greenhouse', token: 'robinhood' },
  { name: 'Discord', platform: 'greenhouse', token: 'discord' },
  { name: 'Figma', platform: 'greenhouse', token: 'figma' },
  { name: 'Asana', platform: 'greenhouse', token: 'asana' },
  { name: 'Reddit', platform: 'greenhouse', token: 'reddit' },
  { name: 'Pinterest', platform: 'greenhouse', token: 'pinterest' },
  { name: 'Twitch', platform: 'greenhouse', token: 'twitch' },
  { name: 'Instacart', platform: 'greenhouse', token: 'instacart' },
  { name: 'Squarespace', platform: 'greenhouse', token: 'squarespace' },
  { name: 'Cloudflare', platform: 'greenhouse', token: 'cloudflare' },
  { name: 'Elastic', platform: 'greenhouse', token: 'elastic' },
  { name: 'MongoDB', platform: 'greenhouse', token: 'mongodb' },
  { name: 'Gusto', platform: 'greenhouse', token: 'gusto' },
  { name: 'Brex', platform: 'greenhouse', token: 'brex' },
  { name: 'Affirm', platform: 'greenhouse', token: 'affirm' },
  { name: 'Lyft', platform: 'greenhouse', token: 'lyft' },
  { name: 'Databricks', platform: 'greenhouse', token: 'databricks' },
  { name: 'Samsara', platform: 'greenhouse', token: 'samsara' },
  { name: 'Webflow', platform: 'greenhouse', token: 'webflow' },
  { name: 'Vercel', platform: 'greenhouse', token: 'vercel' },
  { name: 'Carta', platform: 'greenhouse', token: 'carta' },
  { name: 'Chime', platform: 'greenhouse', token: 'chime' },
  { name: 'Flexport', platform: 'greenhouse', token: 'flexport' },
  { name: 'Mixpanel', platform: 'greenhouse', token: 'mixpanel' },
  { name: 'Scale AI', platform: 'greenhouse', token: 'scaleai' },
  { name: 'SoFi', platform: 'greenhouse', token: 'sofi' },
  { name: 'Toast', platform: 'greenhouse', token: 'toast' },
  { name: 'Duolingo', platform: 'greenhouse', token: 'duolingo' },
  { name: 'Dropbox', platform: 'greenhouse', token: 'dropbox' },
  { name: 'Okta', platform: 'greenhouse', token: 'okta' },
  { name: 'Twilio', platform: 'greenhouse', token: 'twilio' },
  { name: 'Intercom', platform: 'greenhouse', token: 'intercom' },
  { name: 'Algolia', platform: 'greenhouse', token: 'algolia' },
  { name: 'Anthropic', platform: 'greenhouse', token: 'anthropic' },
  { name: 'Peloton', platform: 'greenhouse', token: 'peloton' },
  { name: 'New Relic', platform: 'greenhouse', token: 'newrelic' },
  { name: 'PagerDuty', platform: 'greenhouse', token: 'pagerduty' },
  { name: 'Udemy', platform: 'greenhouse', token: 'udemy' },
  { name: 'Ramp', platform: 'ashby', token: 'ramp' },
  { name: 'Linear', platform: 'ashby', token: 'linear' },
  { name: 'OpenAI', platform: 'ashby', token: 'openai' },
  { name: 'Substack', platform: 'ashby', token: 'substack' },
  { name: 'Vanta', platform: 'ashby', token: 'vanta' },
  { name: 'Deel', platform: 'ashby', token: 'deel' },
  { name: 'Notion', platform: 'ashby', token: 'notion' },
  { name: 'Outreach', platform: 'lever', token: 'outreach' },
  { name: 'Tala', platform: 'lever', token: 'tala' },
];

function stripHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchGreenhouseCompany({ name, token }) {
  const data = await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`);
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  return jobs.slice(0, MAX_JOBS_PER_COMPANY).map((job) => ({
    id: `gh-${token}-${job.id}`,
    title: job.title || 'Untitled role',
    company: name,
    location: job.location?.name || '',
    remote: /remote/i.test(job.location?.name || ''),
    jobType: null,
    tags: [],
    description: stripHtml(job.content),
    postedAt: job.updated_at ? new Date(job.updated_at) : null,
    url: job.absolute_url || null,
    source: name,
  }));
}

async function fetchLeverCompany({ name, token }) {
  const data = await fetchJson(`https://api.lever.co/v0/postings/${token}?mode=json`);
  const jobs = Array.isArray(data) ? data : [];
  return jobs.slice(0, MAX_JOBS_PER_COMPANY).map((job) => ({
    id: `lever-${token}-${job.id}`,
    title: job.text || 'Untitled role',
    company: name,
    location: job.categories?.location || '',
    remote: /remote/i.test(job.categories?.location || ''),
    jobType: job.categories?.commitment || null,
    tags: job.categories?.team ? [job.categories.team] : [],
    description: stripHtml(job.descriptionPlain || job.description),
    postedAt: job.createdAt ? new Date(job.createdAt) : null,
    url: job.hostedUrl || null,
    source: name,
  }));
}

async function fetchAshbyCompany({ name, token }) {
  const data = await fetchJson(`https://api.ashbyhq.com/posting-api/job-board/${token}`);
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  return jobs.slice(0, MAX_JOBS_PER_COMPANY).map((job) => ({
    id: `ashby-${token}-${job.id}`,
    title: job.title || 'Untitled role',
    company: name,
    location: job.location || '',
    remote: !!job.isRemote || /remote/i.test(job.location || ''),
    jobType: job.employmentType || null,
    tags: [],
    description: stripHtml(job.descriptionPlain),
    postedAt: job.publishedAt ? new Date(job.publishedAt) : null,
    url: job.jobUrl || job.applyUrl || null,
    source: name,
  }));
}

const COMPANY_FETCHERS = {
  greenhouse: fetchGreenhouseCompany,
  lever: fetchLeverCompany,
  ashby: fetchAshbyCompany,
};

function fetchCompanyJobs(company) {
  const fetcher = COMPANY_FETCHERS[company.platform];
  return fetcher ? fetcher(company) : Promise.resolve([]);
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
      fetchRemotive(),
      fetchJobicy(),
      fetchTheMuse(),
      fetchHimalayas(),
      ...COMPANIES.map(fetchCompanyJobs),
    ]);

    const sourceStatus = {};
    let jobs = [];
    let companiesResponding = 0;
    let companiesJobCount = 0;

    settled.forEach((result, i) => {
      if (i < SOURCE_NAMES.length) {
        const name = SOURCE_NAMES[i];
        if (result.status === 'fulfilled') {
          sourceStatus[name] = { ok: true, count: result.value.length };
          jobs = jobs.concat(result.value);
        } else {
          sourceStatus[name] = { ok: false, error: result.reason?.message || 'Failed to fetch' };
        }
        return;
      }

      if (result.status === 'fulfilled') {
        companiesResponding += 1;
        companiesJobCount += result.value.length;
        jobs = jobs.concat(result.value);
      }
    });

    sourceStatus['Company boards'] = {
      ok: companiesResponding > 0,
      count: companiesJobCount,
      checked: COMPANIES.length,
      responding: companiesResponding,
    };

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
