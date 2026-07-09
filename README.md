# ✈️ HirePilot AI

**Intelligent AI-powered Job Application Assistant** — built with Streamlit and IBM watsonx Orchestrate.

---

## Features

| Page | Description |
|------|-------------|
| 📊 Dashboard | Career readiness scores, KPIs, SVG gauges, recent activity |
| 📄 Resume Analyzer | PDF/DOCX/TXT upload, ATS scoring, keyword gaps, suggestions |
| 🔍 Job Matcher | AI-curated job matches with salary, match %, 1-click apply |
| 🧩 Skill Gap Analysis | Missing skills, certifications, roadmap, salary uplift |
| ✉️ Cover Letter | One-click generation, tone selector, PDF/TXT download |
| 🎤 Interview Coach | Technical, HR, behavioral & coding Q&A with model answers |
| 📋 Application Tracker | Full lifecycle table, status badges, upcoming interviews |
| 🚀 AI Career Advisor | Roadmap timeline, salary forecast, top companies, future skills |
| 🤖 AI Assistant | Live chat with IBM watsonx Orchestrate embedded agent |

---

## ⚡ Deployment — Choose Your Platform

### ✅ Option 1: Streamlit Community Cloud (Recommended — Free)

1. Push this repo to GitHub (already done)
2. Go to **https://share.streamlit.io** → "New app"
3. Set:
   - **Repository**: `sougandhhhhh/HirePilot`
   - **Branch**: `master`
   - **Main file path**: `app.py`
4. Under **Advanced settings → Secrets**, paste:
   ```toml
   WATSONX_API_KEY    = "your_ibm_cloud_api_key"
   WATSONX_PROJECT_ID = "your_project_id"
   WATSONX_API_URL    = "https://us-south.ml.cloud.ibm.com"
   USE_MOCK_DATA      = false
   ```
5. Click **Deploy** — app is live in ~60 seconds at `https://your-app.streamlit.app`

---

### Option 2: Railway (One-click, $5/mo)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Connect your GitHub repo
2. Railway auto-detects the `Procfile` and runs:
   ```
   streamlit run app.py --server.port=$PORT --server.address=0.0.0.0
   ```
3. Add env vars in Railway dashboard (same keys as above)

---

### Option 3: Render (Free tier available)

1. Create a new **Web Service** pointing to this repo
2. Set **Start Command**:
   ```
   streamlit run app.py --server.port=10000 --server.address=0.0.0.0
   ```
3. Add environment variables in the Render dashboard

---

### Option 4: Docker (Self-hosted / Any Cloud)

```bash
docker build -t hirepilot-ai .
docker run -p 8501:8501 \
  -e WATSONX_API_KEY=your_key \
  -e WATSONX_PROJECT_ID=your_project_id \
  -e USE_MOCK_DATA=false \
  hirepilot-ai
```

Then open **http://localhost:8501**

---

### Option 5: Local Development

```bash
git clone https://github.com/sougandhhhhh/HirePilot.git
cd HirePilot

pip install -r requirements.txt

# Optional: configure watsonx credentials
cp .streamlit/secrets.toml.example .streamlit/secrets.toml
# Edit secrets.toml with your IBM watsonx credentials

streamlit run app.py
```

---

### ⚠️ Why Not Vercel?

Vercel runs **serverless functions** with a maximum execution time of 60 seconds and no persistent process support. Streamlit requires:
- A **long-running WebSocket server** (persistent connection per user)
- A **stateful Python process** (session state, file uploads, etc.)

Vercel is not compatible with these requirements. The `vercel.json` in this repo serves a **redirect page** pointing to the Streamlit Community Cloud deployment.

---

## Project Structure

```
HirePilot/
├── app.py                         # Main entry point & page router
├── requirements.txt
├── Procfile                       # Railway / Render / Heroku
├── Dockerfile                     # Docker / any container cloud
├── runtime.txt                    # Python version pin
├── vercel.json                    # Vercel redirect (see note above)
├── api/
│   └── index.py                   # Vercel handler (serves redirect page)
│
├── .streamlit/
│   ├── config.toml                # Theme & server settings
│   └── secrets.toml.example       # Secret keys template
│
├── pages/
│   ├── dashboard.py
│   ├── resume_analyzer.py
│   ├── job_matcher.py
│   ├── skill_gap.py
│   ├── cover_letter.py
│   ├── interview_coach.py
│   ├── app_tracker.py
│   ├── career_advisor.py
│   └── ai_assistant.py            # IBM watsonx Orchestrate embedded agent
│
├── components/
│   └── ui_components.py           # Cards, sidebar, gauges, floating chat bubble
│
├── services/
│   └── watsonx_service.py         # IBM watsonx Orchestrate REST client
│
└── utils/
    ├── config.py                  # Constants, secrets resolution
    ├── helpers.py                 # File parsing, session init, formatters
    └── styling.py                 # IBM Carbon CSS
```

---

## IBM watsonx Integration

### Embedded Chat Agent
The 🤖 AI Assistant page and floating chat bubble use the **IBM watsonx Orchestrate** embedded agent loaded via `wxoLoader.js`.

### REST Agents (per page)
| Agent | Endpoint |
|-------|----------|
| Resume Analyzer | `/v1/agents/resume-analyzer/invoke` |
| Job Matcher | `/v1/agents/job-matcher/invoke` |
| Skill Gap | `/v1/agents/skill-gap-analyzer/invoke` |
| Cover Letter | `/v1/agents/cover-letter-generator/invoke` |
| Interview Coach | `/v1/agents/interview-coach/invoke` |
| Career Advisor | `/v1/agents/career-advisor/invoke` |

Set `USE_MOCK_DATA = false` in secrets/env to switch from demo data to live agents.

---

## Tech Stack

- **Frontend**: Streamlit + IBM Carbon Design System
- **AI Chat**: IBM watsonx Orchestrate (embedded agent + REST)
- **AI Models**: IBM Granite, Meta Llama 3 (via watsonx.ai)
- **PDF Parsing**: PyMuPDF, pdfminer.six, python-docx
- **PDF Generation**: fpdf2

---

## License

MIT — © HirePilot AI
