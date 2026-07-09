"""
HirePilot AI – Utility Helpers
File parsing, text extraction, PDF generation, session initialisation.
"""

from __future__ import annotations

import io
import re
import time
import datetime
from typing import Any

import streamlit as st


# ──────────────────────────────────────────────────────────────
# Session State Initialisation
# ──────────────────────────────────────────────────────────────

DEFAULT_SESSION: dict[str, Any] = {
    "current_page":         "dashboard",
    "resume_text":          "",
    "resume_filename":      "",
    "resume_analysis":      None,
    "job_matches":          None,
    "skill_gap_data":       None,
    "cover_letter_text":    "",
    "interview_questions":  None,
    "applications":         [],
    "career_advice":        None,
    "dashboard_data":       None,
    "user_profile": {
        "name":       "Alex Johnson",
        "role":       "Full Stack Developer",
        "experience": "3 years",
        "skills":     ["Python", "React", "Node.js", "SQL"],
        "location":   "San Francisco, CA",
    },
}


def init_session_state() -> None:
    """Initialise all session state keys with default values."""
    for key, value in DEFAULT_SESSION.items():
        if key not in st.session_state:
            st.session_state[key] = value


# ──────────────────────────────────────────────────────────────
# File Parsing
# ──────────────────────────────────────────────────────────────

def extract_text_from_file(uploaded_file) -> str:
    """
    Extract plain text from a PDF, DOCX, or TXT file.
    Returns extracted text string or raises ValueError.
    """
    filename = uploaded_file.name.lower()
    raw_bytes = uploaded_file.read()

    if filename.endswith(".txt"):
        return raw_bytes.decode("utf-8", errors="replace")

    if filename.endswith(".pdf"):
        return _extract_pdf(raw_bytes)

    if filename.endswith(".docx"):
        return _extract_docx(raw_bytes)

    raise ValueError(f"Unsupported file type: {uploaded_file.name}")


def _extract_pdf(raw: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF (fitz) or pdfminer fallback."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=raw, filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    except ImportError:
        pass

    try:
        from pdfminer.high_level import extract_text_to_fp
        from pdfminer.layout import LAParams
        output = io.StringIO()
        extract_text_to_fp(io.BytesIO(raw), output, laparams=LAParams())
        return output.getvalue()
    except ImportError:
        pass

    # Graceful fallback – inform user
    return "[PDF text extraction requires PyMuPDF or pdfminer.six. Install via: pip install pymupdf]"


def _extract_docx(raw: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(raw))
        return "\n".join(para.text for para in doc.paragraphs if para.text.strip())
    except ImportError:
        return "[DOCX extraction requires python-docx. Install via: pip install python-docx]"


# ──────────────────────────────────────────────────────────────
# Validation
# ──────────────────────────────────────────────────────────────

def validate_file(uploaded_file, allowed_types: list[str], max_mb: int) -> tuple[bool, str]:
    """
    Validate file extension and size.
    Returns (is_valid, error_message).
    """
    ext = uploaded_file.name.rsplit(".", 1)[-1].lower()
    if ext not in allowed_types:
        return False, f"File type .{ext} is not supported. Allowed: {', '.join(allowed_types)}"

    size_mb = len(uploaded_file.getvalue()) / (1024 * 1024)
    if size_mb > max_mb:
        return False, f"File is {size_mb:.1f} MB which exceeds the {max_mb} MB limit."

    return True, ""


# ──────────────────────────────────────────────────────────────
# PDF Generation (Cover Letter Download)
# ──────────────────────────────────────────────────────────────

def generate_pdf_bytes(text: str, title: str = "HirePilot AI Document") -> bytes:
    """
    Render plain text as a simple PDF.
    Uses fpdf2 if available, otherwise returns encoded text.
    """
    try:
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=11)
        pdf.set_margins(20, 20, 20)
        pdf.set_auto_page_break(auto=True, margin=20)

        # Title
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, title, ln=True)
        pdf.ln(4)

        # Body
        pdf.set_font("Helvetica", size=10)
        for line in text.split("\n"):
            pdf.multi_cell(0, 6, line or " ")

        return bytes(pdf.output())

    except ImportError:
        # Fallback: plain text bytes that browsers can download
        return text.encode("utf-8")


# ──────────────────────────────────────────────────────────────
# Formatting Helpers
# ──────────────────────────────────────────────────────────────

def score_colour(score: int) -> str:
    """Return CSS colour variable name based on score 0-100."""
    if score >= 80:
        return "#42be65"   # green
    elif score >= 60:
        return "#f1c21b"   # yellow
    elif score >= 40:
        return "#ff832b"   # orange
    return "#fa4d56"       # red


def format_date(dt: datetime.date | str | None) -> str:
    if dt is None:
        return "—"
    if isinstance(dt, str):
        return dt
    return dt.strftime("%b %d, %Y")


def truncate(text: str, max_len: int = 120) -> str:
    return text if len(text) <= max_len else text[:max_len].rstrip() + "…"


def progress_html(label: str, value: int, colour: str | None = None) -> str:
    """Render a custom IBM-styled progress bar as HTML."""
    colour = colour or score_colour(value)
    return f"""
    <div class="progress-container">
        <div class="progress-label">
            <span>{label}</span><span>{value}%</span>
        </div>
        <div class="progress-bg">
            <div class="progress-fill" style="width:{value}%; background:{colour};"></div>
        </div>
    </div>
    """


def pill_html(text: str, style: str = "blue") -> str:
    """Return HTML for a pill badge."""
    return f'<span class="pill pill-{style}">{text}</span>'


def metric_card_html(
    icon: str,
    value: str,
    label: str,
    delta: str = "",
    delta_up: bool = True,
    accent: str = "blue",
) -> str:
    """Return HTML for a metric card."""
    delta_class = "delta-up" if delta_up else "delta-down"
    delta_block = f'<div class="card-delta {delta_class}">{delta}</div>' if delta else ""
    return f"""
    <div class="metric-card accent-{accent}">
        <span class="card-icon">{icon}</span>
        <div class="card-value">{value}</div>
        <div class="card-label">{label}</div>
        {delta_block}
    </div>
    """


def section_header(title: str, icon: str = "") -> None:
    """Render an IBM-styled section header."""
    import streamlit as st
    prefix = f"{icon} " if icon else ""
    st.markdown(
        f'<div class="section-header">{prefix}{title}</div>',
        unsafe_allow_html=True,
    )


def simulate_loading(message: str = "Processing with IBM watsonx AI…", duration: float = 1.5) -> None:
    """Show a spinner for a short duration to simulate AI processing."""
    with st.spinner(message):
        time.sleep(duration)
