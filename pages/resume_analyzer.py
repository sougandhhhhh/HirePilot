"""
HirePilot AI – Resume Analyzer Page
Upload resume → AI-powered ATS analysis, strengths, weaknesses, suggestions.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import (
    render_pills, render_progress_bar, info_box,
    success_box, warning_box, render_footer,
)
from services.watsonx_service import analyze_resume
from utils.config import ALLOWED_RESUME_TYPES, MAX_UPLOAD_SIZE_MB
from utils.helpers import (
    section_header, extract_text_from_file, validate_file,
    progress_html, score_colour,
)


def render() -> None:
    """Render the Resume Analyzer page."""

    # ── Page Header ────────────────────────────────────────
    section_header("Resume Analyzer", "📄")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Upload your resume to get an instant ATS score, strengths, weaknesses, and AI-powered suggestions."
        "</p>",
        unsafe_allow_html=True,
    )

    col_upload, col_results = st.columns([1, 2], gap="large")

    # ── Left: Upload Panel ─────────────────────────────────
    with col_upload:
        st.markdown(
            """
            <div style="background:#f4f4f4;border:2px dashed #c6c6c6;border-radius:4px;
                        padding:1.5rem;text-align:center;margin-bottom:1rem;">
                <div style="font-size:2.5rem;margin-bottom:0.5rem;">📂</div>
                <div style="font-size:0.875rem;font-weight:500;color:#161616;">Drop your resume here</div>
                <div style="font-size:0.75rem;color:#6f6f6f;margin-top:0.25rem;">PDF, DOCX, or TXT · Max 10 MB</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        uploaded = st.file_uploader(
            "Choose Resume File",
            type=ALLOWED_RESUME_TYPES,
            label_visibility="collapsed",
            key="resume_uploader",
        )

        if uploaded:
            # Validate
            is_valid, err_msg = validate_file(uploaded, ALLOWED_RESUME_TYPES, MAX_UPLOAD_SIZE_MB)
            if not is_valid:
                st.error(f"❌ {err_msg}")
                return

            st.markdown(
                f"""
                <div style="background:#defbe6;border:1px solid #a7f0ba;border-radius:4px;
                            padding:0.75rem 1rem;font-size:0.8rem;margin-top:0.5rem;">
                    ✅ <strong>{uploaded.name}</strong><br>
                    <span style='color:#6f6f6f;'>
                        {len(uploaded.getvalue()) / 1024:.1f} KB · {uploaded.type}
                    </span>
                </div>
                """,
                unsafe_allow_html=True,
            )

            if st.button("🔍 Analyze Resume", use_container_width=True, key="analyze_btn"):
                with st.spinner("⏳ Extracting text from resume…"):
                    try:
                        text = extract_text_from_file(uploaded)
                        st.session_state["resume_text"]     = text
                        st.session_state["resume_filename"] = uploaded.name
                    except Exception as e:
                        st.error(f"Could not extract text: {e}")
                        return

                with st.spinner("🤖 IBM watsonx AI is analyzing your resume…"):
                    result = analyze_resume(st.session_state["resume_text"])
                    st.session_state["resume_analysis"] = result

                st.success("✅ Analysis complete!")
                st.rerun()

        # Show extracted text if available
        if st.session_state.get("resume_text"):
            st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
            with st.expander("📃 View Extracted Resume Text", expanded=False):
                st.text_area(
                    "Resume Content",
                    value=st.session_state["resume_text"],
                    height=300,
                    disabled=True,
                    label_visibility="collapsed",
                )

    # ── Right: Analysis Results ────────────────────────────
    with col_results:
        analysis = st.session_state.get("resume_analysis")

        if analysis is None:
            st.markdown(
                """
                <div style="text-align:center;padding:4rem 2rem;color:#6f6f6f;">
                    <div style="font-size:3rem;margin-bottom:1rem;">📋</div>
                    <div style="font-size:1rem;font-weight:500;color:#161616;">
                        No resume analyzed yet
                    </div>
                    <div style="font-size:0.875rem;margin-top:0.5rem;">
                        Upload a PDF, DOCX, or TXT file on the left to get started.
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            return

        # ── Score Row ──────────────────────────────────────
        score_col1, score_col2, score_col3 = st.columns(3)

        ats   = analysis.get("ats_score", 0)
        conf  = analysis.get("confidence_score", 0)
        wc    = analysis.get("word_count", 0)

        with score_col1:
            colour = score_colour(ats)
            st.markdown(
                f"""
                <div class="metric-card accent-blue" style="text-align:center;">
                    <div class="card-value" style="color:{colour};">{ats}</div>
                    <div class="card-label">ATS Score</div>
                    <div style="font-size:0.72rem;color:#6f6f6f;margin-top:4px;">out of 100</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with score_col2:
            colour2 = score_colour(conf)
            st.markdown(
                f"""
                <div class="metric-card accent-green" style="text-align:center;">
                    <div class="card-value" style="color:{colour2};">{conf}%</div>
                    <div class="card-label">AI Confidence</div>
                    <div style="font-size:0.72rem;color:#6f6f6f;margin-top:4px;">analysis accuracy</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with score_col3:
            st.markdown(
                f"""
                <div class="metric-card accent-teal" style="text-align:center;">
                    <div class="card-value">{wc}</div>
                    <div class="card-label">Word Count</div>
                    <div style="font-size:0.72rem;color:#6f6f6f;margin-top:4px;">ideal: 450–600</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

        # Progress bar for ATS
        st.markdown(
            progress_html("ATS Score Progress", ats),
            unsafe_allow_html=True,
        )

        st.markdown("<hr class='ibm-divider'>", unsafe_allow_html=True)

        # ── Tabs for detailed results ──────────────────────
        tabs = st.tabs(["💪 Strengths", "⚠️ Weaknesses", "🔑 Keywords", "💡 Suggestions", "📂 Sections"])

        with tabs[0]:
            strengths = analysis.get("strengths", [])
            if strengths:
                for s in strengths:
                    st.markdown(
                        f'<div style="display:flex;gap:0.6rem;padding:0.5rem 0;border-bottom:1px solid #f4f4f4;">'
                        f'<span style="color:#42be65;font-size:1rem;">✓</span>'
                        f'<span style="font-size:0.875rem;">{s}</span></div>',
                        unsafe_allow_html=True,
                    )

        with tabs[1]:
            weaknesses = analysis.get("weaknesses", [])
            if weaknesses:
                for w in weaknesses:
                    st.markdown(
                        f'<div style="display:flex;gap:0.6rem;padding:0.5rem 0;border-bottom:1px solid #f4f4f4;">'
                        f'<span style="color:#fa4d56;font-size:1rem;">✗</span>'
                        f'<span style="font-size:0.875rem;">{w}</span></div>',
                        unsafe_allow_html=True,
                    )

        with tabs[2]:
            missing = analysis.get("missing_keywords", [])
            if missing:
                st.markdown(
                    "<p style='font-size:0.82rem;color:#6f6f6f;margin-bottom:0.75rem;'>"
                    "Add these keywords to increase your ATS score:</p>",
                    unsafe_allow_html=True,
                )
                render_pills(missing, style="red")

        with tabs[3]:
            suggestions = analysis.get("suggestions", [])
            if suggestions:
                for i, sug in enumerate(suggestions, 1):
                    st.markdown(
                        f"""
                        <div style="display:flex;gap:0.75rem;padding:0.75rem;
                                    background:#f4f4f4;border-radius:4px;margin-bottom:0.5rem;">
                            <div style="min-width:22px;height:22px;border-radius:50%;background:#0f62fe;
                                        color:#fff;font-size:0.72rem;font-weight:700;display:flex;
                                        align-items:center;justify-content:center;">{i}</div>
                            <span style="font-size:0.875rem;">{sug}</span>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

        with tabs[4]:
            found   = analysis.get("sections_found",   [])
            missing_secs = analysis.get("sections_missing", [])
            col_a, col_b = st.columns(2)
            with col_a:
                st.markdown("**✅ Found Sections**")
                render_pills(found, style="green")
            with col_b:
                st.markdown("**❌ Missing Sections**")
                render_pills(missing_secs, style="red")

    render_footer()
