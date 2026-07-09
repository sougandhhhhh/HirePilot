# HirePilot AI

**Intelligent AI-powered Job Application Assistant** built with Streamlit and IBM watsonx Orchestrate.

---

## Features

| Page | Description |
|------|-------------|
| 📊 Dashboard | Career readiness scores, KPIs, recent activity |
| 📄 Resume Analyzer | ATS scoring, keyword gaps, strengths & suggestions |
| 🔍 Job Matcher | AI-curated job matches with salary and confidence |
| 🧩 Skill Gap Analysis | Missing skills, certifications, learning roadmap |
| ✉️ Cover Letter | One-click professional cover letter + PDF download |
| 🎤 Interview Coach | Technical, HR, behavioral & coding Q&A |
| 📋 Application Tracker | Full application lifecycle management |
| 🚀 AI Career Advisor | Roadmap, salary forecast, top companies, future skills |

---

## Quick Start

```bash
# 1. Clone / navigate to the project
cd hirepilot_ai

# 2. Create virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment (optional – app runs in demo mode without this)
cp .env.example .env
# Edit .env with your IBM watsonx API credentials

# 5. Run the app
streamlit run app.py
```

Then open **http://localhost:8501** in your browser.

---

## Project Structure

```
hirepilot_ai/
├── app.py                      # Main entry point & router
├── requirements.txt
├── .env.example
│
├── pages/                      # One file per page
│   ├── dashboard.py
│   ├── resume_analyzer.py
│   ├── job_matcher.py
│   ├── skill_gap.py
│   ├── cover_letter.py
│   ├── interview_coach.py
│   ├── app_tracker.py
│   └── career_advisor.py
│
├── components/                 # Shared UI components
│   └── ui_components.py        # Cards, sidebar, gauges, job cards…
│
├── services/                   # API integration
│   └── watsonx_service.py      # IBM watsonx Orchestrate client + mock data
│
└── utils/                      # Shared utilities
    ├── config.py                # Constants & env config
    ├── helpers.py               # File parsing, session init, formatters
    └── styling.py               # IBM Carbon CSS injection
```

---

## IBM watsonx Integration

The app connects to **IBM watsonx Orchestrate** via REST APIs. Each page invokes a dedicated AI agent:

| Agent | Endpoint |
|-------|----------|
| Resume Analyzer | `/v1/agents/resume-analyzer/invoke` |
| Job Matcher | `/v1/agents/job-matcher/invoke` |
| Skill Gap Analyzer | `/v1/agents/skill-gap-analyzer/invoke` |
| Cover Letter Generator | `/v1/agents/cover-letter-generator/invoke` |
| Interview Coach | `/v1/agents/interview-coach/invoke` |
| Career Advisor | `/v1/agents/career-advisor/invoke` |

Set `USE_MOCK_DATA=False` in `.env` to switch from demo data to live agents.

---

## Tech Stack

- **Frontend**: Streamlit + IBM Carbon Design System (CSS)
- **AI Backend**: IBM watsonx Orchestrate + watsonx.ai (Granite / Llama 3)
- **PDF Parsing**: PyMuPDF, pdfminer.six, python-docx
- **PDF Generation**: fpdf2

---

## License

MIT — © HirePilot AI
