"""
HirePilot AI – Dashboard Page
Displays career overview KPIs and recent activity.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import (
    render_hero, render_metric_row, render_score_gauge,
    render_progress_bar, info_box, render_footer,
)
from services.watsonx_service import get_dashboard_data
from utils.helpers import section_header, simulate_loading, score_colour


def render() -> None:
    """Render the Dashboard page."""

    render_hero(
        title="HirePilot AI – Your Intelligent Career Assistant",
        subtitle=(
            "Analyze your resume, identify skill gaps, prepare for interviews, "
            "generate cover letters, and track your applications using IBM Agentic AI."
        ),
    )

    # ── Load data ──────────────────────────────────────────
    if st.session_state.get("dashboard_data") is None:
        with st.spinner("Loading your career summary…"):
            st.session_state["dashboard_data"] = get_dashboard_data()

    data = st.session_state["dashboard_data"]

    # ── Top KPI Row ────────────────────────────────────────
    section_header("Career Overview", "📊")

    render_metric_row([
        {
            "icon": "🎯", "value": f"{data['career_readiness_score']}%",
            "label": "Career Readiness", "delta": "↑ 5% this week",
            "delta_up": True, "accent": "blue",
        },
        {
            "icon": "📄", "value": str(data['ats_score']),
            "label": "ATS Resume Score", "delta": "↑ 8 pts",
            "delta_up": True, "accent": "green",
        },
        {
            "icon": "💼", "value": str(data['recommended_jobs']),
            "label": "Recommended Jobs", "delta": "+3 new today",
            "delta_up": True, "accent": "teal",
        },
        {
            "icon": "🎤", "value": f"{data['interview_readiness']}%",
            "label": "Interview Readiness", "delta": "↑ 3% this week",
            "delta_up": True, "accent": "purple",
        },
        {
            "icon": "🧩", "value": f"{data['skill_gap_score']}%",
            "label": "Skill Gap Score", "delta": "↓ 2% (good!)",
            "delta_up": False, "accent": "yellow",
        },
    ])

    st.markdown("<div style='height:1.5rem'></div>", unsafe_allow_html=True)

    # ── Second Row ─────────────────────────────────────────
    col_gauges, col_activity = st.columns([2, 3], gap="large")

    with col_gauges:
        section_header("Score Breakdown", "📈")

        g_cols = st.columns(2)
        with g_cols[0]:
            render_score_gauge(data["career_readiness_score"], "Career Readiness", size=130)
            st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
            render_score_gauge(data["interview_readiness"], "Interview Ready", size=130)

        with g_cols[1]:
            render_score_gauge(data["ats_score"], "ATS Score", size=130)
            st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
            render_score_gauge(data["skill_gap_score"], "Skill Fit", size=130)

        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

        # Profile Strength Bar
        section_header("Profile Strength", "💪")
        render_progress_bar("Profile Completeness", data.get("profile_strength", 88))
        render_progress_bar("Resume Quality",        data.get("ats_score", 82))
        render_progress_bar("Interview Readiness",   data.get("interview_readiness", 71))
        render_progress_bar("Skill Fit",             data.get("skill_gap_score", 65))

    with col_activity:
        # ── Application Stats ──────────────────────────────
        section_header("Application Statistics", "📋")

        stat_cols = st.columns(2)
        with stat_cols[0]:
            st.markdown(
                """
                <div class="metric-card accent-blue" style="text-align:center;">
                    <span class="card-icon">📤</span>
                    <div class="card-value">12</div>
                    <div class="card-label">Applications Sent</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with stat_cols[1]:
            st.markdown(
                """
                <div class="metric-card accent-green" style="text-align:center;">
                    <span class="card-icon">🗓️</span>
                    <div class="card-value">3</div>
                    <div class="card-label">Interviews Scheduled</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

        # ── Recent Activity ────────────────────────────────
        section_header("Recent Activity", "⚡")

        for activity in data.get("recent_activity", []):
            st.markdown(
                f"""
                <div style="display:flex;align-items:flex-start;gap:0.75rem;
                            padding:0.75rem 0;border-bottom:1px solid #f4f4f4;">
                    <div style="width:8px;height:8px;border-radius:50%;background:#0f62fe;
                                margin-top:5px;flex-shrink:0;"></div>
                    <div>
                        <div style="font-size:0.875rem;color:#161616;">{activity['action']}</div>
                        <div style="font-size:0.75rem;color:#6f6f6f;margin-top:2px;">{activity['time']}</div>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

        # ── Quick Actions ──────────────────────────────────
        section_header("Quick Actions", "⚡")
        qa_cols = st.columns(2)

        with qa_cols[0]:
            if st.button("📄 Analyze Resume", use_container_width=True, key="dash_resume"):
                st.session_state["current_page"] = "resume_analyzer"
                st.rerun()
            if st.button("🔍 Match Jobs", use_container_width=True, key="dash_jobs"):
                st.session_state["current_page"] = "job_matcher"
                st.rerun()

        with qa_cols[1]:
            if st.button("🎤 Practice Interview", use_container_width=True, key="dash_interview"):
                st.session_state["current_page"] = "interview_coach"
                st.rerun()
            if st.button("✉️ Generate Cover Letter", use_container_width=True, key="dash_cover"):
                st.session_state["current_page"] = "cover_letter"
                st.rerun()

        # ── IBM watsonx info ───────────────────────────────
        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
        info_box(
            "All AI insights are powered by IBM watsonx Orchestrate. "
            "Connect your watsonx API key in the environment settings to activate live agents."
        )

    render_footer()
