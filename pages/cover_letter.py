"""
HirePilot AI – Cover Letter Generator Page
Generate professional, personalised cover letters with one click.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import info_box, render_footer, success_box
from services.watsonx_service import generate_cover_letter
from utils.helpers import section_header, generate_pdf_bytes


def render() -> None:
    """Render the Cover Letter Generator page."""

    section_header("Cover Letter Generator", "✉️")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Generate a professional, tailored cover letter in seconds using IBM watsonx AI."
        "</p>",
        unsafe_allow_html=True,
    )

    form_col, result_col = st.columns([1, 1], gap="large")

    # ── Left: Input Form ───────────────────────────────────
    with form_col:
        st.markdown(
            '<div style="background:#f4f4f4;border:1px solid #e5e7eb;border-radius:4px;padding:1.5rem;">',
            unsafe_allow_html=True,
        )
        st.markdown("### ✏️ Letter Details")

        company = st.text_input(
            "🏢 Company Name",
            placeholder="e.g. Stripe, Google, IBM…",
            key="cl_company",
        )
        role = st.text_input(
            "🎯 Role / Position",
            placeholder="e.g. Senior Software Engineer",
            key="cl_role",
        )
        job_description = st.text_area(
            "📋 Job Description",
            placeholder="Paste the job description here…",
            height=200,
            key="cl_jd",
        )
        tone = st.select_slider(
            "📢 Letter Tone",
            options=["Formal", "Professional", "Enthusiastic", "Bold"],
            value="Professional",
            key="cl_tone",
        )
        include_resume = st.checkbox(
            "📎 Incorporate my uploaded resume",
            value=bool(st.session_state.get("resume_text")),
            key="cl_use_resume",
        )

        st.markdown("</div>", unsafe_allow_html=True)

        st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)

        generate_clicked = st.button(
            "✨ Generate Cover Letter",
            use_container_width=True,
            key="cl_generate",
        )

    # ── Right: Generated Letter ────────────────────────────
    with result_col:
        if generate_clicked:
            if not company.strip() or not role.strip():
                st.error("❌ Please fill in the Company Name and Role fields.")
            else:
                resume_text = st.session_state.get("resume_text", "") if include_resume else ""
                with st.spinner("✍️ IBM watsonx AI is crafting your cover letter…"):
                    result = generate_cover_letter(
                        company=company,
                        role=role,
                        job_description=job_description,
                        resume_text=resume_text,
                    )
                    st.session_state["cover_letter_text"] = result.get("cover_letter", "")

        letter = st.session_state.get("cover_letter_text", "")

        if letter:
            success_box(f"Cover letter generated for {st.session_state.get('cl_company', 'your target company')}!")

            # Metadata
            word_count = len(letter.split())
            st.markdown(
                f"""
                <div style="display:flex;gap:1.5rem;font-size:0.78rem;color:#6f6f6f;
                            margin-bottom:0.75rem;">
                    <span>📝 {word_count} words</span>
                    <span>🎨 Professional tone</span>
                    <span>✅ ATS-optimised</span>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Letter display
            st.markdown(
                f'<div class="cover-letter-box">{letter}</div>',
                unsafe_allow_html=True,
            )

            st.markdown("<div style='height:0.75rem'></div>", unsafe_allow_html=True)

            # Action buttons
            act_col1, act_col2, act_col3 = st.columns(3)

            with act_col1:
                # Copy to clipboard via st.code
                if st.button("📋 Copy Letter", use_container_width=True, key="cl_copy"):
                    st.code(letter, language=None)

            with act_col2:
                # Download as text
                st.download_button(
                    label="💾 Download TXT",
                    data=letter.encode("utf-8"),
                    file_name=f"cover_letter_{st.session_state.get('cl_company','').replace(' ','_')}.txt",
                    mime="text/plain",
                    use_container_width=True,
                    key="cl_download_txt",
                )

            with act_col3:
                # Download as PDF
                pdf_bytes = generate_pdf_bytes(letter, title=f"Cover Letter – {role} at {company}")
                st.download_button(
                    label="📄 Download PDF",
                    data=pdf_bytes,
                    file_name=f"cover_letter_{company.replace(' ','_')}.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                    key="cl_download_pdf",
                )

            # Edit letter
            with st.expander("✏️ Edit Letter", expanded=False):
                edited = st.text_area(
                    "Edit Cover Letter",
                    value=letter,
                    height=400,
                    key="cl_editor",
                    label_visibility="collapsed",
                )
                if st.button("💾 Save Edits", key="cl_save_edit"):
                    st.session_state["cover_letter_text"] = edited
                    st.success("Saved!")
                    st.rerun()

        else:
            # Empty state
            st.markdown(
                """
                <div style="text-align:center;padding:4rem 2rem;color:#6f6f6f;">
                    <div style="font-size:3rem;margin-bottom:1rem;">✉️</div>
                    <div style="font-size:1rem;font-weight:500;color:#161616;">
                        Your cover letter will appear here
                    </div>
                    <div style="font-size:0.875rem;margin-top:0.5rem;">
                        Fill in the form on the left and click Generate.
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # ── Tips ───────────────────────────────────────────────
    st.markdown("<hr class='ibm-divider'>", unsafe_allow_html=True)
    section_header("Cover Letter Tips", "💡")

    tip_cols = st.columns(3)
    tips = [
        ("🎯 Tailor Every Letter", "Customise each letter for the specific company and role. Generic letters have a 3× lower response rate."),
        ("📊 Use Numbers", "Quantify your achievements wherever possible. 'Improved performance by 40%' beats 'improved performance'."),
        ("✂️ Keep It Concise", "Aim for 3–4 paragraphs, 250–350 words. Hiring managers spend an average of 7 seconds on first read."),
    ]
    for col, (title, body) in zip(tip_cols, tips):
        with col:
            st.markdown(
                f"""
                <div style="background:#f4f4f4;border-radius:4px;padding:1rem 1.25rem;height:100%;">
                    <div style="font-weight:600;margin-bottom:0.4rem;">{title}</div>
                    <div style="font-size:0.82rem;color:#6f6f6f;">{body}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    render_footer()
