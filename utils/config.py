"""
HirePilot AI – Configuration & Constants
IBM watsonx Orchestrate API settings and app-wide constants.

Secret resolution order (first match wins):
  1. st.secrets  – Streamlit Community Cloud / local .streamlit/secrets.toml
  2. os.environ  – Railway, Render, Heroku, Docker env vars
  3. Hard-coded default (empty string / fallback)
"""

import os


def _secret(key: str, default: str = "") -> str:
    """
    Resolve a config value from Streamlit secrets first,
    then environment variables, then a hard-coded default.
    This makes the app work identically on Streamlit Community Cloud,
    Railway, Render, Heroku, Docker, and local dev.
    """
    try:
        import streamlit as st
        val = st.secrets.get(key)
        if val is not None:
            return str(val)
    except Exception:
        pass
    return os.getenv(key, default)


# ──────────────────────────────────────────────
# IBM watsonx Orchestrate API Configuration
# ──────────────────────────────────────────────
WATSONX_API_URL    = _secret("WATSONX_API_URL",    "https://us-south.ml.cloud.ibm.com")
WATSONX_API_KEY    = _secret("WATSONX_API_KEY",    "")
WATSONX_PROJECT_ID = _secret("WATSONX_PROJECT_ID", "")
WATSONX_SPACE_ID   = _secret("WATSONX_SPACE_ID",   "")

# IBM watsonx.ai model IDs
MODEL_GRANITE = "ibm/granite-13b-instruct-v2"
MODEL_LLAMA = "meta-llama/llama-3-70b-instruct"
MODEL_MIXTRAL = "mistralai/mixtral-8x7b-instruct-v01"

DEFAULT_MODEL = MODEL_GRANITE

# ──────────────────────────────────────────────
# Orchestrate Agent Endpoints (mock/real)
# ──────────────────────────────────────────────
AGENT_ENDPOINTS = {
    "resume_analyzer":     "/v1/agents/resume-analyzer/invoke",
    "job_matcher":         "/v1/agents/job-matcher/invoke",
    "skill_gap":           "/v1/agents/skill-gap-analyzer/invoke",
    "cover_letter":        "/v1/agents/cover-letter-generator/invoke",
    "interview_coach":     "/v1/agents/interview-coach/invoke",
    "career_advisor":      "/v1/agents/career-advisor/invoke",
    "dashboard":           "/v1/agents/dashboard-summary/invoke",
}

# ──────────────────────────────────────────────
# App Meta
# ──────────────────────────────────────────────
APP_TITLE = "HirePilot AI"
APP_SUBTITLE = "Your Intelligent Career Assistant"
APP_VERSION = "1.0.0"
APP_TAGLINE = (
    "Analyze your resume, identify skill gaps, prepare for interviews, "
    "generate cover letters, and track your applications using IBM Agentic AI."
)

# ──────────────────────────────────────────────
# File Upload Constraints
# ──────────────────────────────────────────────
ALLOWED_RESUME_TYPES = ["pdf", "docx", "txt"]
MAX_UPLOAD_SIZE_MB = 10

# ──────────────────────────────────────────────
# Navigation Pages
# ──────────────────────────────────────────────
NAV_PAGES = [
    {"id": "dashboard",        "label": "📊  Dashboard",            "icon": "📊"},
    {"id": "resume_analyzer",  "label": "📄  Resume Analyzer",      "icon": "📄"},
    {"id": "job_matcher",      "label": "🔍  Job Matcher",          "icon": "🔍"},
    {"id": "skill_gap",        "label": "🧩  Skill Gap Analysis",   "icon": "🧩"},
    {"id": "cover_letter",     "label": "✉️  Cover Letter",         "icon": "✉️"},
    {"id": "interview_coach",  "label": "🎤  Interview Coach",      "icon": "🎤"},
    {"id": "app_tracker",      "label": "📋  Application Tracker",  "icon": "📋"},
    {"id": "career_advisor",   "label": "🚀  AI Career Advisor",    "icon": "🚀"},
    {"id": "ai_assistant",     "label": "🤖  AI Assistant",         "icon": "🤖"},
]

# ──────────────────────────────────────────────
# IBM watsonx Orchestrate Embedded Agent
# ──────────────────────────────────────────────
WATSONX_ORCHESTRATE_CONFIG = {
    "orchestrationID":  "8254d45b2e8c49f397fed4f4efda4474_82de1835-3f80-482d-864e-7b0c75121f2f",
    "hostURL":          "https://au-syd.watson-orchestrate.cloud.ibm.com",
    "rootElementID":    "root",
    "deploymentPlatform": "ibmcloud",
    "crn":              "crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/8254d45b2e8c49f397fed4f4efda4474:82de1835-3f80-482d-864e-7b0c75121f2f::",
    "agentId":          "066f1a0a-dec9-4dc8-8462-23b617d50639",
    "agentEnvironmentId": "6b0c667f-8cb8-43d0-bc81-098baaf81a36",
}

# ──────────────────────────────────────────────
# Demo / Mock Data Toggle
# ──────────────────────────────────────────────
# Reads from secrets/env so it can be toggled per environment without code changes.
USE_MOCK_DATA   = _secret("USE_MOCK_DATA", "true").lower() not in ("false", "0", "no")
REQUEST_TIMEOUT = 30   # seconds
