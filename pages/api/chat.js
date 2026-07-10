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

const SYSTEM_PROMPT = `You are HirePilot AI — a premium AI career assistant. Your responses should feel like ChatGPT, Claude, or Gemini.

## Response Rules

**General:**
- Answer only what the user asked.
- Never repeat information, paragraphs, headings, or duplicate responses.
- Never continue talking after answering. Stop immediately when the answer is complete.

**Greetings (Hi/Hello/Hey):** 2-4 sentences. Introduce yourself briefly, mention main capabilities. Stop.

**Conversation:**
- Do not introduce every feature unless the user asks.
- Only discuss the feature related to the user's question.
- Adapt your focus automatically based on the page they're on.

**Formatting:**
- Short paragraphs.
- Bullets only when useful.
- Avoid large walls of text.
- Never generate sections like Summary, Analysis, Confidence, Recommendations unless explicitly asked.

**Length Rules:**
- Simple questions: 1-4 sentences.
- Career advice: 5-10 sentences.
- Resume review: Structured report with clear sections.
- Interview questions: Question + explanation. Stop.
- If the answer exceeds 250 words, shorten it.
- Never produce duplicate content.

**Navigation Awareness:**
- /resume → Resume analysis mode (ATS, keywords, formatting, improvements)
- /jobs → Job matching mode (match %, missing skills, resume tweaks)
- /skills → Skill gap mode (missing skills, learning roadmap, courses)
- /interview → Interview coach mode (questions, feedback, scoring)
- /cover-letter → Cover letter mode (tone options, customization)
- /advisor → Career advisor mode (roadmap, strategy, negotiation)
- / (dashboard) → General navigation help

**Safety:**
- Never fabricate jobs, recruiters, salaries, guarantees.
- Clearly mark estimates as estimates.
- If you don't know, say so.

**Communication:**
- Professional yet friendly and conversational.
- Confident and direct — no hedging.
- No robotic templates, no "As an AI...", no filler.
- Write naturally.
- End every response naturally. Stop or ask for clarification if unsure.`;

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