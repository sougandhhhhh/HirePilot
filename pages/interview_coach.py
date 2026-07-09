"""
HirePilot AI – Interview Coach Page
AI-generated interview questions across Technical, HR, Behavioral, and Coding categories.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import render_question_card, render_pills, info_box, render_footer
from services.watsonx_service import get_interview_questions
from utils.helpers import section_header, pill_html


TARGET_ROLES = [
    "Software Engineer", "Full Stack Developer", "Data Scientist",
    "ML Engineer", "DevOps Engineer", "Product Manager",
    "Frontend Engineer", "Backend Engineer", "Cloud Architect",
    "Mobile Developer", "UX Designer", "Cybersecurity Engineer",
]

DIFFICULTY_OPTIONS = ["All Levels", "Easy", "Medium", "Hard"]


def render() -> None:
    """Render the Interview Coach page."""

    section_header("Interview Coach", "🎤")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Practice with AI-generated interview questions tailored to your target role — with model answers."
        "</p>",
        unsafe_allow_html=True,
    )

    # ── Config Bar ─────────────────────────────────────────
    config_col1, config_col2, config_col3 = st.columns([2, 1, 1])

    with config_col1:
        selected_role = st.selectbox(
            "🎯 Target Role",
            TARGET_ROLES,
            key="ic_role",
        )
    with config_col2:
        difficulty = st.selectbox(
            "📊 Difficulty",
            DIFFICULTY_OPTIONS,
            key="ic_difficulty",
        )
    with config_col3:
        st.markdown("<div style='height:1.75rem'></div>", unsafe_allow_html=True)
        generate_btn = st.button(
            "🎯 Generate Questions",
            use_container_width=True,
            key="ic_generate",
        )

    if generate_btn:
        with st.spinner("🤖 IBM watsonx AI is crafting your interview questions…"):
            result = get_interview_questions(
                role=selected_role,
                difficulty=difficulty.lower().replace("all levels", "all"),
            )
            st.session_state["interview_questions"] = result

    questions = st.session_state.get("interview_questions")

    if questions is None:
        info_box(
            "Select your target role and desired difficulty, then click "
            "'Generate Questions' to start practising."
        )

        # ── Tips ───────────────────────────────────────────
        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
        section_header("Interview Preparation Tips", "💡")

        tip_cols = st.columns(4)
        tips = [
            ("⭐ STAR Method", "Structure all behavioral answers: Situation, Task, Action, Result."),
            ("🕐 Timing", "Keep technical answers to 2-3 minutes. Practice with a timer."),
            ("📖 Research", "Study the company's tech stack, culture, and recent news."),
            ("❓ Ask Back", "Always have 2-3 thoughtful questions ready to ask the interviewer."),
        ]
        for col, (title, body) in zip(tip_cols, tips):
            with col:
                st.markdown(
                    f"""
                    <div style="background:#f4f4f4;border-radius:4px;padding:1rem;height:100%;">
                        <div style="font-weight:600;margin-bottom:0.35rem;font-size:0.875rem;">{title}</div>
                        <div style="font-size:0.78rem;color:#6f6f6f;">{body}</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
        return

    # ── Summary Stats ──────────────────────────────────────
    tech_q = questions.get("technical",  [])
    hr_q   = questions.get("hr",         [])
    beh_q  = questions.get("behavioral", [])
    cod_q  = questions.get("coding",     [])
    all_q  = tech_q + hr_q + beh_q + cod_q

    diff_filter = difficulty.lower() if difficulty != "All Levels" else None

    if diff_filter:
        tech_q = [q for q in tech_q if q.get("difficulty", "medium") == diff_filter]
        hr_q   = [q for q in hr_q   if q.get("difficulty", "medium") == diff_filter]
        beh_q  = [q for q in beh_q  if q.get("difficulty", "medium") == diff_filter]
        cod_q  = [q for q in cod_q  if q.get("difficulty", "medium") == diff_filter]

    total = len(tech_q) + len(hr_q) + len(beh_q) + len(cod_q)

    # Stats row
    stat_cols = st.columns(5)
    stats = [
        ("📦 Total", total, "blue"),
        ("💻 Technical", len(tech_q), "teal"),
        ("👔 HR", len(hr_q), "green"),
        ("🧠 Behavioral", len(beh_q), "purple"),
        ("👨‍💻 Coding", len(cod_q), "yellow"),
    ]
    for col, (label, count, accent) in zip(stat_cols, stats):
        with col:
            st.markdown(
                f"""
                <div class="metric-card accent-{accent}" style="text-align:center;padding:1rem;">
                    <div class="card-value" style="font-size:1.6rem;">{count}</div>
                    <div class="card-label">{label}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # Difficulty legend
    st.markdown(
        f"""
        <div style="display:flex;gap:0.75rem;align-items:center;margin:1rem 0 0.5rem;
                    font-size:0.78rem;color:#6f6f6f;">
            <span>Difficulty:</span>
            {pill_html("Easy",   "green")}
            {pill_html("Medium", "yellow")}
            {pill_html("Hard",   "red")}
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── Question Tabs ──────────────────────────────────────
    tab_labels = [
        f"💻 Technical ({len(tech_q)})",
        f"👔 HR ({len(hr_q)})",
        f"🧠 Behavioral ({len(beh_q)})",
        f"👨‍💻 Coding ({len(cod_q)})",
    ]
    tabs = st.tabs(tab_labels)

    for tab, q_list, cat_name in zip(
        tabs,
        [tech_q, hr_q, beh_q, cod_q],
        ["Technical", "HR", "Behavioral", "Coding"],
    ):
        with tab:
            if not q_list:
                st.info(f"No {cat_name} questions for the selected difficulty.")
                continue

            show_answers = st.toggle(
                "💡 Show Model Answers",
                value=True,
                key=f"ic_toggle_{cat_name}",
            )

            for i, question in enumerate(q_list, 1):
                if not show_answers:
                    # Simplified view without answers
                    diff = question.get("difficulty", "medium")
                    diff_map = {"easy": ("Easy","green"), "medium": ("Medium","yellow"), "hard": ("Hard","red")}
                    diff_label, diff_style = diff_map.get(diff, ("Medium", "yellow"))
                    st.markdown(
                        f"""
                        <div style="padding:0.75rem 1rem;border:1px solid #e5e7eb;border-radius:4px;
                                    margin-bottom:0.5rem;display:flex;justify-content:space-between;">
                            <span style="font-size:0.875rem;font-weight:500;">Q{i}. {question['question']}</span>
                            {pill_html(diff_label, diff_style)}
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
                else:
                    render_question_card(question, i)

    # ── Practice Mode ──────────────────────────────────────
    st.markdown("<hr class='ibm-divider'>", unsafe_allow_html=True)
    section_header("Self-Assessment Practice", "✍️")

    st.markdown(
        "<p style='font-size:0.875rem;color:#6f6f6f;'>"
        "Select a question and type your answer below to evaluate your response:</p>",
        unsafe_allow_html=True,
    )

    practice_q_list = [f"Q{i+1}: {q['question']}" for i, q in enumerate(all_q[:8])]
    if practice_q_list:
        selected_q = st.selectbox(
            "Choose a question to practice:",
            practice_q_list,
            key="ic_practice_select",
        )
        user_answer = st.text_area(
            "Your Answer",
            placeholder="Type your answer here…",
            height=150,
            key="ic_user_answer",
        )

        if st.button("📊 Evaluate My Answer", key="ic_evaluate") and user_answer.strip():
            # Simulate AI evaluation
            words = len(user_answer.split())
            score = min(100, max(40, 60 + (words // 5)))
            colour = "#42be65" if score >= 75 else "#f1c21b" if score >= 50 else "#fa4d56"

            st.markdown(
                f"""
                <div style="background:#f4f4f4;border-radius:4px;padding:1.25rem;margin-top:0.75rem;">
                    <div style="font-weight:600;margin-bottom:0.5rem;">AI Evaluation</div>
                    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem;">
                        <div style="font-size:2rem;font-weight:700;color:{colour};">{score}</div>
                        <div style="font-size:0.82rem;color:#6f6f6f;">/ 100 · {words} words</div>
                    </div>
                    <div style="font-size:0.875rem;color:#161616;">
                        {'✅ Good length and structure. Try to add specific quantified examples.' if words >= 50
                         else '⚠️ Your answer is quite short. Expand with STAR framework details.'}
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    render_footer()
