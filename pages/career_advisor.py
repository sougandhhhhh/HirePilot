"""
HirePilot AI – AI Career Advisor Page
Personalised career roadmap, salary prediction, top companies, and future skills.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import render_pills, render_roadmap, info_box, render_footer
from services.watsonx_service import get_career_advice
from utils.helpers import section_header, score_colour, pill_html


def render() -> None:
    """Render the AI Career Advisor page."""

    section_header("AI Career Advisor", "🚀")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Get a personalised career roadmap, salary forecast, and IBM watsonx-powered strategic insights."
        "</p>",
        unsafe_allow_html=True,
    )

    # ── Config ─────────────────────────────────────────────
    with st.expander("⚙️ Your Profile", expanded=st.session_state.get("career_advice") is None):
        profile = st.session_state.get("user_profile", {})
        col1, col2, col3 = st.columns(3)
        with col1:
            current_role = st.text_input(
                "🎯 Current Role",
                value=profile.get("role", "Full Stack Developer"),
                key="ca_role",
            )
        with col2:
            experience = st.selectbox(
                "📅 Experience",
                ["< 1 year", "1–2 years", "3–5 years", "5–8 years", "8+ years"],
                index=2,
                key="ca_exp",
            )
        with col3:
            skills_input = st.text_input(
                "🛠️ Key Skills (comma-separated)",
                value=", ".join(profile.get("skills", ["Python", "React"])),
                key="ca_skills",
            )

        if st.button("🚀 Get Career Advice", key="ca_generate"):
            skills = [s.strip() for s in skills_input.split(",") if s.strip()]
            with st.spinner("🤖 IBM watsonx AI is analysing your career trajectory…"):
                result = get_career_advice(current_role, skills, experience)
                st.session_state["career_advice"] = result
            st.rerun()

    data = st.session_state.get("career_advice")

    if data is None:
        info_box(
            "Fill in your profile above and click 'Get Career Advice' to receive "
            "a personalised career strategy powered by IBM watsonx AI."
        )
        return

    # ── Tabs ───────────────────────────────────────────────
    tabs = st.tabs([
        "🗺️ Career Roadmap",
        "💰 Salary Forecast",
        "🏢 Top Companies",
        "🔮 Future Skills",
        "📜 Certifications",
    ])

    # ── Tab 1: Career Roadmap ──────────────────────────────
    with tabs[0]:
        roadmap = data.get("career_roadmap", [])
        if roadmap:
            # Timeline view
            for step in roadmap:
                year  = step.get("year", "")
                title = step.get("title", "")
                focus = step.get("focus", "")
                is_now = year == "Now"

                st.markdown(
                    f"""
                    <div style="display:flex;gap:1.25rem;padding:1.1rem 0;
                                border-bottom:1px solid #f4f4f4;">
                        <div style="min-width:70px;text-align:center;">
                            <div style="background:{'#0f62fe' if is_now else '#e5e7eb'};
                                        color:{'#fff' if is_now else '#6f6f6f'};
                                        border-radius:4px;padding:0.25rem 0.5rem;
                                        font-size:0.75rem;font-weight:600;">{year}</div>
                        </div>
                        <div>
                            <div style="font-weight:600;font-size:0.95rem;
                                        color:{'#0f62fe' if is_now else '#161616'};">
                                {title}
                                {'<span style="background:#0f62fe;color:#fff;font-size:0.65rem;'
                                 'padding:2px 6px;border-radius:8px;margin-left:8px;'
                                 'font-weight:500;">YOU ARE HERE</span>' if is_now else ''}
                            </div>
                            <div style="font-size:0.82rem;color:#6f6f6f;margin-top:0.25rem;">
                                {focus}
                            </div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            st.markdown(
                """
                <div class="info-box" style="margin-top:1rem;">
                    💡 <strong>Tip:</strong> Each career stage typically requires 18–24 months of
                    focused growth, measurable impact, and visible leadership. Invest in mentorship
                    relationships and stay visible in the organisation.
                </div>
                """,
                unsafe_allow_html=True,
            )

    # ── Tab 2: Salary Forecast ─────────────────────────────
    with tabs[1]:
        salary = data.get("salary_prediction", {})

        salary_items = [
            ("Current",    salary.get("current",   "$0"), "#6f6f6f"),
            ("12 Months",  salary.get("12_months", "$0"), "#f1c21b"),
            ("24 Months",  salary.get("24_months", "$0"), "#0f62fe"),
            ("36 Months",  salary.get("36_months", "$0"), "#42be65"),
        ]

        sal_cols = st.columns(4)
        for col, (period, amount, colour) in zip(sal_cols, salary_items):
            with col:
                st.markdown(
                    f"""
                    <div class="metric-card" style="border-top-color:{colour};text-align:center;">
                        <div class="card-value" style="color:{colour};font-size:1.5rem;">{amount}</div>
                        <div class="card-label">{period}</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

        st.markdown("<div style='height:1.25rem'></div>", unsafe_allow_html=True)

        # Visual salary growth bar
        section_header("Salary Growth Trajectory", "📈")

        base_amounts = {
            "Current":   int(salary.get("current",   "$115000").replace("$","").replace(",","")),
            "12 Months": int(salary.get("12_months", "$135000").replace("$","").replace(",","")),
            "24 Months": int(salary.get("24_months", "$155000").replace("$","").replace(",","")),
            "36 Months": int(salary.get("36_months", "$180000").replace("$","").replace(",","")),
        }
        max_salary = max(base_amounts.values()) if base_amounts else 1

        for period, amount in base_amounts.items():
            pct = int(amount / max_salary * 100)
            colour_map = {
                "Current": "#6f6f6f", "12 Months": "#f1c21b",
                "24 Months": "#0f62fe", "36 Months": "#42be65",
            }
            c = colour_map.get(period, "#0f62fe")
            st.markdown(
                f"""
                <div class="progress-container">
                    <div class="progress-label">
                        <span>{period}</span>
                        <span style="font-weight:600;">${amount:,}</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width:{pct}%;background:{c};"></div>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        market = data.get("market_insight", "")
        if market:
            st.markdown(
                f'<div class="info-box" style="margin-top:1rem;">📊 {market}</div>',
                unsafe_allow_html=True,
            )

    # ── Tab 3: Top Companies ───────────────────────────────
    with tabs[2]:
        companies = data.get("top_companies", [])
        if companies:
            for company in companies:
                match  = company.get("match", 0)
                colour = score_colour(match)
                st.markdown(
                    f"""
                    <div style="display:flex;justify-content:space-between;align-items:center;
                                padding:1rem 1.25rem;border:1px solid #e5e7eb;border-radius:4px;
                                margin-bottom:0.75rem;background:#fff;">
                        <div>
                            <div style="font-weight:600;font-size:0.95rem;">{company['name']}</div>
                            <div style="font-size:0.78rem;color:#6f6f6f;margin-top:0.2rem;">
                                {company.get('culture','')}
                            </div>
                        </div>
                        <div style="text-align:right;min-width:80px;">
                            <div style="font-size:1.5rem;font-weight:700;color:{colour};">{match}%</div>
                            <div style="font-size:0.7rem;color:#6f6f6f;">culture match</div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                # Match bar
                st.markdown(
                    f"""
                    <div style="height:4px;background:#e5e7eb;border-radius:2px;
                                margin:-0.5rem 0 0.25rem;overflow:hidden;">
                        <div style="width:{match}%;height:4px;background:{colour};border-radius:2px;"></div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # ── Tab 4: Future Skills ───────────────────────────────
    with tabs[3]:
        future_skills = data.get("future_skills", [])
        if future_skills:
            st.markdown(
                "<p style='font-size:0.875rem;color:#6f6f6f;margin-bottom:1rem;'>"
                "Skills with the highest projected demand growth over the next 3 years:</p>",
                unsafe_allow_html=True,
            )

            for skill in future_skills:
                relevance = skill.get("relevance", 0)
                timeline  = skill.get("timeline", "")
                colour    = score_colour(relevance)

                st.markdown(
                    f"""
                    <div style="padding:0.85rem 1rem;border:1px solid #e5e7eb;border-radius:4px;
                                margin-bottom:0.5rem;background:#fff;">
                        <div style="display:flex;justify-content:space-between;
                                    align-items:center;margin-bottom:0.4rem;">
                            <strong style="font-size:0.9rem;">{skill['skill']}</strong>
                            <div style="display:flex;align-items:center;gap:0.75rem;">
                                {pill_html(timeline, "blue")}
                                <span style="font-weight:700;color:{colour};">{relevance}%</span>
                            </div>
                        </div>
                        <div class="progress-bg">
                            <div class="progress-fill" style="width:{relevance}%;background:{colour};"></div>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # ── Tab 5: Certifications ──────────────────────────────
    with tabs[4]:
        certs = data.get("certifications", [])
        if certs:
            for i, cert in enumerate(certs):
                st.markdown(
                    f"""
                    <div style="display:flex;align-items:center;gap:0.75rem;
                                padding:0.85rem 1rem;border:1px solid #e5e7eb;
                                border-left:4px solid #0f62fe;border-radius:0 4px 4px 0;
                                margin-bottom:0.5rem;background:#fff;">
                        <span style="font-size:1.3rem;">📜</span>
                        <span style="font-size:0.9rem;font-weight:500;">{cert}</span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    render_footer()
