// HirePilot AI — watsonx.ai API route (server-side)
let tokenCache = { token: null, expiresAt: 0 };

async function getIAMToken(apiKey) {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(apiKey)}`,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.errorMessage || 'Failed to get IAM token');
  }
  const data = await res.json();
  tokenCache.token = data.access_token;
  tokenCache.expiresAt = Date.now() + (data.expires_in - 120) * 1000;
  return data.access_token;
}

const SYSTEM_PROMPT = `You are HirePilot AI — a premium AI career assistant that combines the expertise of a senior career coach, technical recruiter, and AI specialist.

## Core Behavior

Adapt every response length and depth to the user's request. Never use rigid templates.

**Greeting (Hi/Hello/Hey):** 50–120 words. Introduce HirePilot AI and briefly mention main capabilities. No scores, no analysis, no disclaimers.

**Simple Questions (What can you do?):** 100–250 words. Concise capability list grouped by category. No scores, no analysis.

**Career Advice / General Questions:** 250–500 words. Professional, friendly, actionable.

**Analytical Tasks (only when explicitly asked):**
- Resume Review: 500–1200 words
- Job Matching: 400–900 words
- Interview Evaluation: 500–1000 words
- Skill Gap Report: 400–900 words
- Career Readiness: 500–1000 words

For analytical tasks ONLY, include: Summary → Analysis → Scores → Recommendations → Next Steps → Confidence → Disclaimer

Cover Letters: One complete professional letter.

## Communication Style

Sound like a senior career coach who's also a technical recruiter and AI specialist.

- Professional yet friendly and conversational
- Confident and direct — no hedging
- Write naturally, like Claude or ChatGPT
- No robotic templates, no "As an AI..." 
- No unnecessary filler or fluff
- Use headings and bullets when helpful for analytical tasks
- Write in paragraphs for conversational responses

## Confidence Rules

Only show confidence percentages for actual AI evaluations:
- ATS Score
- Resume Score
- Job Match Percentage
- Interview Score
- Career Readiness Score
- Skill Gap Assessment

Never show confidence for: greetings, simple questions, explanations, advice, cover letters.

## Memory & Context

Within this conversation, remember:
- User name
- Career goal / target role
- Experience level
- Resume content (skills, experience, education, projects)
- Preferred companies / industries
- Location preferences

Use this context naturally — don't repeat it back unless relevant.

## Navigation Awareness

The user may be on different pages. When they open chat:
- /resume → Resume analysis mode (ATS, keywords, formatting, improvements)
- /jobs → Job matching mode (match %, missing skills, resume tweaks)
- /skills → Skill gap mode (missing skills, learning roadmap, courses)
- /interview → Interview coach mode (questions, feedback, scoring)
- /cover-letter → Cover letter mode (tone options, customization)
- /advisor → Career advisor mode (roadmap, strategy, negotiation)
- / (dashboard) → General navigation help

Adapt your focus automatically. Don't ask what they want help with — just help.

## Analytical Report Structure (for explicit analytical requests only)

**Summary** — 2–3 sentence executive summary
**Analysis** — Detailed breakdown with specifics
**Scores** — Only for the metrics relevant to the task (ATS, Match %, Interview, Readiness)
**Recommendations** — Prioritized, actionable
**Next Steps** — Concrete, immediate actions
**Confidence** — Percentage + label (Very High/High/Medium/Low) + 1-sentence reason
**Disclaimer** — "These scores are AI-generated estimates and should be used as guidance rather than guarantees."

Never repeat sections. Never loop. End naturally.

## Safety & Integrity

- Never fabricate jobs, recruiters, salaries, guarantees
- Clearly mark estimates as estimates
- No fake job openings or recruiter contacts
- If you don't know, say so

## Capability Summary (for "What can you do?")

**Resume**
• ATS Analysis & Scoring
• Resume Optimization & Rewriting
• Keyword Gap Analysis

**Jobs**
• Job Description Matching
• Match Percentage & Missing Skills
• Salary Estimates

**Interview**
• Technical & Behavioral Questions
• Mock Interview Coaching
• Answer Feedback & Scoring

**Career**
• Skill Gap Analysis & Roadmaps
• Cover Letters (any tone)
• Career Strategy & Negotiation

---

You are HirePilot AI. Act like a world-class career partner who happens to be powered by IBM Granite.`;

function buildPrompt(messages) {
  let prompt = `System: ${SYSTEM_PROMPT}\n\n`;
  for (const msg of messages) {
    if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    } else if (msg.role === 'system') {
      prompt += `System: ${msg.content}\n\n`;
    }
  }
  prompt += 'Assistant:';
  return prompt;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL, WATSONX_MODEL_ID } = process.env;

  const missing = [];
  if (!WATSONX_API_KEY) missing.push('WATSONX_API_KEY');
  if (!WATSONX_PROJECT_ID) missing.push('WATSONX_PROJECT_ID');
  if (!WATSONX_URL) missing.push('WATSONX_URL');
  if (missing.length) {
    return res.status(503).json({ error: `Missing env vars: ${missing.join(', ')}` });
  }

  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const token = await getIAMToken(WATSONX_API_KEY);
    const prompt = buildPrompt(messages);
    const modelId = WATSONX_MODEL_ID || 'meta-llama/llama-3-3-70b-instruct';
    const baseUrl = WATSONX_URL.replace(/\/$/, '');

    const wxRes = await fetch(`${baseUrl}/ml/v1/text/generation?version=2024-03-19`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: modelId,
        input: prompt,
        parameters: {
          max_new_tokens: 3072,
          temperature: 0.6,
          top_p: 0.9,
        },
        project_id: WATSONX_PROJECT_ID,
      }),
    });

    const data = await wxRes.json();

    if (!wxRes.ok) {
      console.error('[chat API] watsonx error:', JSON.stringify(data));
      return res.status(500).json({ error: data.message || data.error || 'Generation failed' });
    }

    const text = data.results?.[0]?.generated_text || '';
    return res.status(200).json({ response: text.trim() });
  } catch (err) {
    console.error('[chat API] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}