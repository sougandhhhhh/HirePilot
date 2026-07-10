# HirePilot AI

**Enterprise-grade AI Career Copilot** — built with [Next.js 14](https://nextjs.org) and [IBM watsonx.ai](https://www.ibm.com/products/watsonx-ai). Analyzes resumes, matches jobs, bridges skill gaps, coaches interviews, generates cover letters, and tracks applications — all powered by Granite / Llama 3 via a custom AI agent.

---

## Pages

| Route | Page |
|-------|------|
| `/` | Dashboard — career readiness scores, KPIs, quick actions |
| `/resume` | Resume Analyzer — ATS scoring, keyword gaps, suggestions |
| `/jobs` | Job Matcher — match percentage, skill comparison, salary estimates |
| `/skills` | Skill Gap Analysis — missing skills, learning roadmap |
| `/cover-letter` | Cover Letter Generator — tone selector, download |
| `/interview` | Interview Coach — technical, HR, behavioral Q&A |
| `/tracker` | Application Tracker — lifecycle table, status badges |
| `/advisor` | Career Advisor — roadmap, salary forecast, future skills |
| `/assistant` | AI Assistant — full-page chat with watsonx.ai agent |

---

## Architecture

```
User Browser
     │
     ▼
Next.js (Vercel)
  ├── pages/*.js          → Static/client pages
  ├── pages/api/chat.js   → Serverless function (runs on Vercel)
  │     │
  │     ├── 1. Gets IAM token from IBM Cloud
  │     └── 2. Calls watsonx.ai text generation API (Llama 3 / Granite)
  │
  └── components/
       ├── ChatWindow.js   → Reusable chat UI (used by /assistant + floating bubble)
       ├── Layout.js       → App shell: sidebar, theme toggle, settings, chat bubble
       └── theme/          → Dark/Light theme system with CSS variables
```

**No Python, no Flask, no separate backend.** The AI agent runs entirely inside Next.js API routes on Vercel.

---

## Getting Started

### Prerequisites
- Node.js 18+
- An IBM Cloud account with watsonx.ai provisioned
- An IBM Cloud API key

### 1. Clone & install

```bash
git clone https://github.com/sougandhhhhh/HirePilot.git
cd HirePilot
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
WATSONX_API_KEY=your-ibm-cloud-api-key
WATSONX_PROJECT_ID=your-watsonx-project-id
WATSONX_URL=https://au-syd.ml.cloud.ibm.com
WATSONX_MODEL_ID=meta-llama/llama-3-3-70b-instruct
```

### 3. Run locally

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add -A
git commit -m "Ready for deploy"
git push origin master
```

### 2. Import project

Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo.

### 3. Set environment variables

In **Vercel Dashboard → Project → Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `WATSONX_API_KEY` | *(your IBM Cloud API key)* |
| `WATSONX_PROJECT_ID` | `acf4d1ce-68c3-4d99-ae6b-2e828586453c` |
| `WATSONX_URL` | `https://au-syd.ml.cloud.ibm.com` |
| `WATSONX_MODEL_ID` | `meta-llama/llama-3-3-70b-instruct` |

### 4. Deploy

Click **Deploy**. The AI assistant will work on the live site immediately.

---

## Project Structure

```
components/
├── ChatWindow.js        # Reusable chat UI (messages, input, typing indicator)
├── Layout.js            # App shell: sidebar, top bar, settings, floating chat
├── UI.js                # Shared UI primitives (SectionHeader, Pill, etc.)
├── WatsonxAgent.js      # Full-page assistant wrapper for /assistant route
├── WatsonxService.js    # watsonx.ai REST client helpers
└── theme/
    ├── ThemeContext.js   # Theme provider + useTheme hook
    ├── ThemeDropdown.js  # Animated theme picker (Framer Motion)
    └── themeUtils.js     # localStorage persistence, system detection

pages/
├── _app.js              # Root app wrapper with ThemeProvider
├── _document.js         # Anti-flicker inline script
├── index.js             # Dashboard
├── resume.js, jobs.js, skills.js, cover-letter.js, interview.js
├── tracker.js, advisor.js, assistant.js
└── api/
    └── chat.js          # Serverless API route → watsonx.ai

styles/
└── globals.css          # Design tokens, dark + light theme, component styles

public/
└── logo.png             # Brand asset
```

---

## Design System

- **Font**: IBM Plex Sans
- **Theme**: Dark-first with Light mode override — CSS custom properties, Framer Motion transitions
- **Components**: Glass-morphism panels, gradient accents, animated hover states
- **Responsive**: Collapsible sidebar, mobile-adaptive layouts, bottom-sheet theme picker

## AI Agent

The chat agent uses the full system prompt defined in `pages/api/chat.js` with expertise in:

- Resume analysis & ATS optimization
- Job matching & skill gap analysis
- Interview preparation & coaching
- Cover letter generation
- Application tracking & career advising

Every recommendation includes confidence scoring with the disclaimer that scores are AI-generated estimates.

---

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **AI Backend**: IBM watsonx.ai (Meta Llama 3 / IBM Granite)
- **Animation**: Framer Motion
- **Deployment**: Vercel
- **Auth**: None (client-side app)

---

## License

MIT — © HirePilot AI
