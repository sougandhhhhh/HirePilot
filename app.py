"""
HirePilot AI – Main Entry Point
Streamlit multi-page application router with IBM Carbon design.
"""

from __future__ import annotations

import sys
import os

# ── Path Setup ─────────────────────────────────────────────────
# Ensure the hirepilot_ai package root is on sys.path so all
# relative imports (pages/, components/, services/, utils/) work.
APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

import streamlit as st

from utils.config import APP_TITLE, APP_SUBTITLE
from utils.styling import inject_css
from utils.helpers import init_session_state
from components.ui_components import render_sidebar

# ── Page imports ───────────────────────────────────────────────
import pages.dashboard       as page_dashboard
import pages.resume_analyzer as page_resume
import pages.job_matcher     as page_jobs
import pages.skill_gap       as page_skill
import pages.cover_letter    as page_cover
import pages.interview_coach as page_interview
import pages.app_tracker     as page_tracker
import pages.career_advisor  as page_career


# ──────────────────────────────────────────────────────────────
# Streamlit Page Config  (must be first Streamlit call)
# ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title=f"{APP_TITLE} – Career Assistant",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "Get Help":     "https://www.ibm.com/watsonx",
        "Report a bug": None,
        "About":        f"**{APP_TITLE}** v1.0.0 · Powered by IBM watsonx Orchestrate",
    },
)

# ──────────────────────────────────────────────────────────────
# Initialise global state & inject CSS
# ──────────────────────────────────────────────────────────────
init_session_state()
inject_css()

# ──────────────────────────────────────────────────────────────
# Sidebar navigation (returns selected page id)
# ──────────────────────────────────────────────────────────────
current_page = render_sidebar()

# ──────────────────────────────────────────────────────────────
# Page Router
# ──────────────────────────────────────────────────────────────
PAGE_MAP = {
    "dashboard":       page_dashboard.render,
    "resume_analyzer": page_resume.render,
    "job_matcher":     page_jobs.render,
    "skill_gap":       page_skill.render,
    "cover_letter":    page_cover.render,
    "interview_coach": page_interview.render,
    "app_tracker":     page_tracker.render,
    "career_advisor":  page_career.render,
}

render_fn = PAGE_MAP.get(current_page)

if render_fn:
    render_fn()
else:
    st.error(f"Page '{current_page}' not found.")
    page_dashboard.render()
