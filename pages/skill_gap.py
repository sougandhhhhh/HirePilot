"""
HirePilot AI – Skill Gap Analysis Page
Visualise current vs required skills, certifications, project ideas, and roadmap.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import (
    render_pills, render_skill_bars, render_roadmap,
    info_box, render_footer,
)
from services.watsonx_service import analyze_skill_gap
from utils.helpers import section_header, score_colour, pill_html


TARGET_ROLES = [
    "Senior Software Engineer", "Staff Engineer", "Principal Engineer",
    "Data Scientist", "ML Engineer", "DevOps / Platform Engineer",
    "Cloud Architect", "Cybersecurity Specialist", "Product Manager",
    "AI Research Scientist",
]

COMMON_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust",
    "React", "Vue", "Node.js", "AWS", "GCP", "Azure",
    "Docker", "Kubernetes", "Terraform", "SQL", "MongoDB",
    "Machine Learning", "System Design", "CI/CD",
]


def render() -> None:
    """Render the Skill Gap Analysis page."""

    section_header("Skill Gap Analysis", "🧩")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Discover exactly which skills you need to reach your next role — with a personalised learning roadmap."
        "</p>",
        unsafe_allow_html=True,
    )

    # ── Config Form ────────────────────────────────────────
    with st.expander("⚙️ Configure Analysis", expanded=True):
        col1, col2 = st.columns(2)
        with col1:
            target_role = st.selectbox(
                "🎯 Target Role", TARGET_ROLES,
                key="sg_target_role",
            )
        with col2:
            current_skills = st.multiselect(
                "🛠️ Your Current Skills",
                COMMON_SKILLS,
                default=["Python", "React", "Node.js", "SQL"],
                key="sg_skills",
            )

        if st.button("🔍 Analyze Skill Gaps", key="sg_analyze"):
            with st.spinner("🤖 Mapping your skills against industry requirements…"):
                result = analyze_skill_gap(target_role, current_skills)
                st.session_state["skill_gap_data"] = result
            st.rerun()

    # ── Results ────────────────────────────────────────────
    data = st.session_state.get("skill_gap_data")

    if data is None:
        info_box("Configure your target role and current skills above, then click Analyze.")
        return

    est_weeks = data.get("estimated_weeks", 0)
    salary_up = data.get("salary_uplift_pct", 0)

    # Summary KPIs
    kpi_cols = st.columns(4)
    kpi_data = [
        ("🛠️", str(len(data.get("current_skills", []))), "Current Skills",   "blue"),
        ("❌", str(len(data.get("missing_skills", []))), "Missing Skills",   "red"),
        ("📜", str(len(data.get("certifications", []))), "Certifications",   "teal"),
        ("⏱️", f"{est_weeks}w",                          "Est. Learn Time",  "purple"),
    ]
    for col, (icon, val, label, accent) in zip(kpi_cols, kpi_data):
        with col:
            st.markdown(
                f"""
                <div class="metric-card accent-{accent}" style="text-align:center;">
                    <span class="card-icon">{icon}</span>
                    <div class="card-value">{val}</div>
                    <div class="card-label">{label}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    if salary_up:
        st.markdown(
            f"""
            <div style="background:#defbe6;border:1px solid #a7f0ba;border-left:4px solid #42be65;
                        border-radius:4px;padding:0.85rem 1.25rem;font-size:0.875rem;
                        color:#0e6027;margin:1rem 0;">
                💰 Completing this learning path could increase your salary by up to
                <strong>{salary_up}%</strong>.
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

    tabs = st.tabs([
        "📊 Skills Overview",
        "❌ Missing Skills",
        "📜 Certifications",
        "🔨 Projects",
        "🗺️ Roadmap",
    ])

    # ── Tab 1: Current Skills ──────────────────────────────
    with tabs[0]:
        current_skills_data = data.get("current_skills", [])
        col_skills, col_chart = st.columns([1, 1])

        with col_skills:
            st.markdown("**Current Skill Proficiency**")
            render_skill_bars(current_skills_data)

        with col_chart:
            st.markdown("**Skill Level Distribution**")
            level_counts = {}
            for s in current_skills_data:
                lvl = s.get("level", "Unknown")
                level_counts[lvl] = level_counts.get(lvl, 0) + 1

            for lvl, cnt in level_counts.items():
                colour_map = {
                    "Expert": "#42be65", "Advanced": "#0f62fe",
                    "Intermediate": "#f1c21b", "Beginner": "#ff832b",
                }
                colour = colour_map.get(lvl, "#6f6f6f")
                total = len(current_skills_data)
                pct = int(cnt / total * 100) if total else 0
                st.markdown(
                    f"""
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>{lvl} ({cnt})</span><span>{pct}%</span>
                        </div>
                        <div class="progress-bg">
                            <div class="progress-fill" style="width:{pct}%;background:{colour};"></div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # ── Tab 2: Missing Skills ──────────────────────────────
    with tabs[1]:
        missing = data.get("missing_skills", [])
        if missing:
            priority_map = {"High": "red", "Medium": "yellow", "Low": "green"}
            for skill in sorted(missing, key=lambda x: ["High", "Medium", "Low"].index(x.get("priority", "Medium"))):
                prio = skill.get("priority", "Medium")
                demand = skill.get("demand", 0)
                colour = score_colour(demand)
                st.markdown(
                    f"""
                    <div style="display:flex;justify-content:space-between;align-items:center;
                                padding:0.75rem 1rem;border:1px solid #e5e7eb;border-radius:4px;
                                margin-bottom:0.5rem;background:#fff;">
                        <div>
                            <strong style="font-size:0.9rem;">{skill['name']}</strong>
                            &nbsp;{pill_html(prio, priority_map.get(prio,'gray'))}
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:0.8rem;color:#6f6f6f;">Market demand</div>
                            <div style="font-size:1rem;font-weight:700;color:{colour};">{demand}%</div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # ── Tab 3: Certifications ──────────────────────────────
    with tabs[2]:
        certs = data.get("certifications", [])
        cert_cols = st.columns(2)
        for i, cert in enumerate(certs):
            with cert_cols[i % 2]:
                st.markdown(
                    f"""
                    <div style="border:1px solid #e5e7eb;border-top:3px solid #0f62fe;
                                border-radius:4px;padding:1rem;margin-bottom:1rem;">
                        <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">
                            📜 {cert['name']}
                        </div>
                        <div style="font-size:0.78rem;color:#6f6f6f;">
                            Provider: <strong>{cert['provider']}</strong> ·
                            Duration: <strong>{cert['duration']}</strong>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                st.link_button(f"🔗 Learn More", url=cert.get("url", "#"), key=f"cert_{i}")

    # ── Tab 4: Projects ────────────────────────────────────
    with tabs[3]:
        projects = data.get("projects", [])
        diff_style = {"Easy": "green", "Medium": "yellow", "Hard": "red"}
        for proj in projects:
            diff = proj.get("difficulty", "Medium")
            st.markdown(
                f"""
                <div style="border:1px solid #e5e7eb;border-left:4px solid #0f62fe;
                            border-radius:0 4px 4px 0;padding:1rem 1.25rem;margin-bottom:0.75rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <strong style="font-size:0.9rem;">🔨 {proj['name']}</strong>
                        <div>
                            {pill_html(diff, diff_style.get(diff,'gray'))}
                            {pill_html('⏱️ ' + proj.get('time',''), 'gray')}
                        </div>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # ── Tab 5: Roadmap ─────────────────────────────────────
    with tabs[4]:
        roadmap = data.get("roadmap", [])
        if roadmap:
            st.markdown(
                f"""
                <div class="info-box">
                    🗺️ Estimated completion: <strong>{est_weeks} weeks</strong> ·
                    Potential salary increase: <strong>+{salary_up}%</strong>
                </div>
                """,
                unsafe_allow_html=True,
            )
            render_roadmap(roadmap)

    render_footer()
