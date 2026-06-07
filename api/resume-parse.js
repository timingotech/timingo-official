// Calls OpenAI directly via fetch rather than the `openai` SDK — see api/jobs.js for why
// pulling in npm SDKs into Vercel functions is risky (bundler tracing failures crash the
// function at boot). A plain HTTPS POST needs no bundling at all.

const OPENAI_MODEL = 'gpt-4o-mini';

const INDUSTRY_OPTIONS = [
  'Software Engineering',
  'Data & Analytics',
  'Design & UX',
  'Product Management',
  'Marketing',
  'Sales & Business Dev',
  'Customer Support',
  'Human Resources',
  'Finance & Accounting',
  'Healthcare',
  'Operations & Admin',
];

const WORK_SETTINGS = ['remote', 'hybrid', 'onsite', 'any'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'any'];

const SYSTEM_PROMPT = `You are a resume analyzer for a job-search tool. Given the text of someone's resume, infer the role and filters that would help them find relevant job postings. Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "role": string,                 // their most likely target job title, e.g. "Frontend Engineer"
  "skills": string[],             // up to 8 of their strongest, most search-relevant skills
  "industries": string[],         // up to 3, chosen ONLY from this list: ${INDUSTRY_OPTIONS.join(', ')}
  "workSetting": string,          // one of: ${WORK_SETTINGS.join(', ')} — best guess from their history, "any" if unclear
  "employmentType": string,       // one of: ${EMPLOYMENT_TYPES.join(', ')} — best guess, "any" if unclear
  "location": string              // their city/country if mentioned, else ""
}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Resume analysis is not configured (missing OPENAI_API_KEY)' });
  }

  const text = String(req.body?.resumeText || '').trim();
  if (!text) return res.status(400).json({ error: 'No resume text was provided' });
  if (text.length < 50) return res.status(400).json({ error: 'That text is too short to be a resume' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          // Cap input so we stay well within token limits and keep cost predictable.
          { role: 'user', content: text.slice(0, 20000) },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`OpenAI responded with ${response.status}${detail ? `: ${detail.slice(0, 250)}` : ''}`);
    }

    const completion = await response.json();
    const raw = completion?.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('The AI returned a response that could not be understood');
    }

    const industries = Array.isArray(parsed.industries)
      ? parsed.industries.filter((s) => INDUSTRY_OPTIONS.includes(s)).slice(0, 3)
      : [];

    return res.status(200).json({
      role: typeof parsed.role === 'string' ? parsed.role.trim() : '',
      skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s) => typeof s === 'string').slice(0, 8) : [],
      industries,
      workSetting: WORK_SETTINGS.includes(parsed.workSetting) ? parsed.workSetting : 'any',
      employmentType: EMPLOYMENT_TYPES.includes(parsed.employmentType) ? parsed.employmentType : 'any',
      location: typeof parsed.location === 'string' ? parsed.location.trim() : '',
    });
  } catch (err) {
    console.error('Resume parse error:', err);
    return res.status(500).json({ error: err.message || 'Could not analyze that resume right now' });
  }
}
