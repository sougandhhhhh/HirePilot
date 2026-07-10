// HirePilot AI — watsonx.ai API route (server-side)

let tokenCache = { token: null, expiresAt: 0 };

const MAX_CONVERSATION_HISTORY = 10;

const SYSTEM_PROMPT = `You are HirePilot AI — a premium AI career assistant. Respond like ChatGPT or Claude: direct, conversational, and helpful.

## Core Rules
- Produce exactly ONE response to the latest user message, then stop.
- Never simulate the user. Never write "User:" or "User says:" after your response.
- Never continue the conversation, ask yourself questions, or generate the next user turn.
- Never repeat paragraphs, advice, sentence structures, or section headings across responses.

## Greeting Rules
If the user says hi, hello, or hey:
- Reply in under 60 words.
- Briefly introduce HirePilot AI and mention 2–3 core capabilities.
- Do not list every feature. Stop naturally.

## Response Length by Category
- Greetings: 50–60 words
- Simple questions (yes/no, quick facts, short how-to): 100–250 words
- Career advice / explanations: 250–500 words
- Resume analysis: detailed structured report
- Interview evaluation: detailed structured report
- Job matching: detailed structured report with match percentage and skill gaps
- Cover letter: one complete letter
- Do not generate detailed reports unless the user is on a relevant page or explicitly asks.

## Style
- Professional, conversational, confident. No hedging ("I think", "perhaps", "might").
- Write naturally — like a human expert, not a template.
- No "As an AI", no "I'm here to help", no robotic disclaimers.
- Short paragraphs. Use bullets only when they add clarity.
- Do not include sections like "Summary:", "Analysis:", or "Recommendations:" unless the user asks for a report.

## Page Awareness
- Dashboard (/): General career guidance and navigation help.
- Resume (/resume): Resume analysis — ATS scoring, keyword gaps, formatting, improvements.
- Jobs (/jobs): Job matching — match percentage, missing skills, resume tweaks.
- Skills (/skills): Skill gap analysis — missing skills, learning roadmap, course recommendations.
- Interview (/interview): Interview coaching — questions, feedback, scoring.
- Cover Letter (/cover-letter): Cover letter generation — tone selection, personalization.
- Career Advisor (/advisor): Career planning — roadmap, salary negotiation, strategy.
- Only discuss features related to the user's current page. Do not mention unrelated modules.

## Safety
- Never fabricate jobs, recruiters, salaries, or guarantees.
- Mark estimates clearly.
- Say "I don't know" when uncertain.`;

function buildPrompt(messages) {
  let systemContent = SYSTEM_PROMPT;
  let contextContent = '';
  const conversationTurns = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      contextContent += msg.content + '\n';
    } else if (msg.role === 'user') {
      conversationTurns.push(`User: ${msg.content}`);
    } else if (msg.role === 'assistant') {
      conversationTurns.push(`Assistant: ${msg.content}`);
    }
  }

  let prompt = `${systemContent.trim()}\n\n`;

  if (contextContent.trim()) {
    prompt += `${contextContent.trim()}\n\n`;
  }

  if (conversationTurns.length > 0) {
    prompt += `${conversationTurns.join('\n')}\n\n`;
  }

  prompt += 'Assistant:';

  return prompt;
}

function computeMaxTokens(messages) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const trimmed = lastMsg.trim();

  const greetingPatterns = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|yo|sup|howdy|what's up)\b/i;
  if (greetingPatterns.test(trimmed)) {
    return 80;
  }

  const simplePatterns = /^(what|who|when|where|why|how|can|do|is|are|will|would|could|should|does)\b/i;
  if (trimmed.length < 80 || simplePatterns.test(trimmed)) {
    return 250;
  }

  const reportKeywords = [
    { pattern: /resume|ats/i, tokens: 800 },
    { pattern: /job match|match percentage/i, tokens: 700 },
    { pattern: /interview/i, tokens: 700 },
    { pattern: /cover letter|coverletter/i, tokens: 600 },
    { pattern: /skill gap|learning roadmap|courses?|certification/i, tokens: 600 },
  ];

  for (const { pattern, tokens } of reportKeywords) {
    if (pattern.test(lastMsg)) {
      return tokens;
    }
  }

  return 400;
}

function extractResponse(raw) {
  let text = (raw || '').trim();

  const hallucinationMarkers = ['\nUser:', '\nUser ', '\nSystem:', '\nAssistant:', '\nHuman:'];
  let earliestIndex = text.length;
  for (const marker of hallucinationMarkers) {
    const idx = text.indexOf(marker);
    if (idx !== -1 && idx < earliestIndex) {
      earliestIndex = idx;
    }
  }

  if (earliestIndex < text.length) {
    text = text.substring(0, earliestIndex);
  }

  text = text.replace(/\s*(Assistant|AI)\s*:?\s*$/i, '');
  text = text.replace(/\n{3,}/g, '\n\n');

  const cleaned = text.trim();

  if (!cleaned) {
    return 'I\'m sorry, I couldn\'t generate a proper response. Could you rephrase your question?';
  }

  return cleaned;
}

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

async function generateResponse(messages) {
  const { WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL, WATSONX_MODEL_ID } = process.env;

  const token = await getIAMToken(WATSONX_API_KEY);
  const prompt = buildPrompt(messages);
  const modelId = WATSONX_MODEL_ID || 'meta-llama/llama-3-3-70b-instruct';
  const baseUrl = WATSONX_URL.replace(/\/$/, '');
  const maxTokens = computeMaxTokens(messages);

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
        max_new_tokens: maxTokens,
        min_new_tokens: 1,
        temperature: 0.4,
        top_p: 0.9,
        top_k: 40,
        repetition_penalty: 1.15,
        stop_sequences: ['\nUser:', '\nUser', '\nSystem:'],
      },
      project_id: WATSONX_PROJECT_ID,
    }),
  });

  const data = await wxRes.json();

  if (!wxRes.ok) {
    console.error('[chat API] watsonx error:', JSON.stringify(data));
    throw new Error(data.message || data.error || 'Generation failed');
  }

  const raw = data.results?.[0]?.generated_text || '';
  return extractResponse(raw);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL } = process.env;

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

    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');
    const recentMessages = nonSystemMessages.slice(-MAX_CONVERSATION_HISTORY);
    const trimmedMessages = [...systemMessages, ...recentMessages];

    const response = await generateResponse(trimmedMessages);
    return res.status(200).json({ response });
  } catch (err) {
    console.error('[chat API] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
