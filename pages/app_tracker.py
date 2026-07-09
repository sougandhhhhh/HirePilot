"""
HirePilot AI – Application Tracker Page
Track all job applications with status, interview dates, and outcome.
"""

from __future__ import annotations

import datetime
import streamlit as st
import pandas as pd

from components.ui_components import render_footer, info_box
from utils.helpers import section_header, pill_html


STATUS_OPTIONS  = ["Applied", "Screening", "Interview", "Technical Test", "Offer", "Rejected", "Withdrawn"]
OFFER_STATUSES  = ["Pending", "Received", "Negotiating", "Accepted", "Declined"]

STATUS_STYLE = {
    "Applied":        "badge-applied",
    "Screening":      "badge-pending",
    "Interview":      "badge-interview",
    "Technical Test": "badge-pending",
    "Offer":          "badge-offer",
    "Rejected":       "badge-rejected",
    "Withdrawn":      "badge-pending",
}


def _default_applications() -> list[dict]:
    """Seed demo application data."""
    return [
        {
            "company":        "Stripe",
            "role":           "Senior Software Engineer",
            "applied_date":   "Jan 10, 2025",
            "status":         "Interview",
            "interview_date": "Jan 20, 2025",
            "offer_status":   "Pending",
            "location":       "San Francisco, CA",
            "salary":         "$145K – $185K",
        },
        {
            "company":        "Cloudflare",
            "role":           "Software Engineer",
            "applied_date":   "Jan 08, 2025",
            "status":         "Screening",
            "interview_date": "—",
            "offer_status":   "Pending",
            "location":       "Remote",
            "salary":         "$130K – $165K",
        },
        {
            "company":        "Databricks",
            "role":           "Software Engineer II",
            "applied_date":   "Jan 05, 2025",
            "status":         "Applied",
            "interview_date": "—",
            "offer_status":   "Pending",
            "location":       "San Francisco, CA",
            "salary":         "$140K – $175K",
        },
        {
            "company":        "Figma",
            "role":           "Staff Software Engineer",
            "applied_date":   "Dec 28, 2024",
            "status":         "Rejected",
            "interview_date": "Jan 03, 2025",
            "offer_status":   "N/A",
            "location":       "New York, NY",
            "salary":         "$155K – $200K",
        },
        {
            "company":        "IBM",
            "role":           "AI Software Engineer",
            "applied_date":   "Dec 20, 2024",
            "status":         "Offer",
            "interview_date": "Dec 30, 2024",
            "offer_status":   "Negotiating",
            "location":       "Remote",
            "salary":         "$135K – $160K",
        },
    ]


def render() -> None:
    """Render the Application Tracker page."""

    section_header("Application Tracker", "📋")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Track every application, interview, and outcome in one organised view."
        "</p>",
        unsafe_allow_html=True,
    )

    # Initialise with demo data if empty
    if not st.session_state.get("applications"):
        st.session_state["applications"] = _default_applications()

    apps = st.session_state["applications"]

    # ── Summary KPIs ───────────────────────────────────────
    total      = len(apps)
    interviews = sum(1 for a in apps if a["status"] in ("Interview", "Technical Test"))
    offers     = sum(1 for a in apps if a["status"] == "Offer")
    rejected   = sum(1 for a in apps if a["status"] == "Rejected")
    response_rate = int(((total - rejected) / total * 100)) if total else 0

    kpi_cols = st.columns(5)
    kpis = [
        ("📤", str(total),          "Total Applied",    "blue"),
        ("🗓️", str(interviews),    "Interviews",        "green"),
        ("🎉", str(offers),         "Offers",           "teal"),
        ("❌", str(rejected),       "Rejected",         "red"),
        ("📈", f"{response_rate}%", "Response Rate",    "purple"),
    ]
    for col, (icon, val, label, accent) in zip(kpi_cols, kpis):
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

    st.markdown("<div style='height:1.25rem'></div>", unsafe_allow_html=True)

    # ── Add New Application ────────────────────────────────
    with st.expander("➕ Add New Application", expanded=False):
        add_col1, add_col2, add_col3 = st.columns(3)
        with add_col1:
            new_company  = st.text_input("🏢 Company",  key="at_new_company")
            new_role     = st.text_input("🎯 Role",     key="at_new_role")
        with add_col2:
            new_date     = st.date_input("📅 Applied Date", value=datetime.date.today(), key="at_new_date")
            new_status   = st.selectbox("📊 Status",    STATUS_OPTIONS, key="at_new_status")
        with add_col3:
            new_location = st.text_input("📍 Location", key="at_new_loc")
            new_salary   = st.text_input("💰 Salary",   placeholder="$XX,000 – $XX,000", key="at_new_salary")

        new_interview = st.date_input("🗓️ Interview Date (optional)", value=None, key="at_new_interview")

        if st.button("➕ Add Application", key="at_add"):
            if new_company.strip() and new_role.strip():
                apps.append({
                    "company":        new_company,
                    "role":           new_role,
                    "applied_date":   new_date.strftime("%b %d, %Y"),
                    "status":         new_status,
                    "interview_date": new_interview.strftime("%b %d, %Y") if new_interview else "—",
                    "offer_status":   "Pending",
                    "location":       new_location or "—",
                    "salary":         new_salary or "—",
                })
                st.session_state["applications"] = apps
                st.success(f"✅ {new_company} application added!")
                st.rerun()
            else:
                st.error("Please enter at least Company and Role.")

    # ── Filter & Search ────────────────────────────────────
    filter_col1, filter_col2, filter_col3 = st.columns([2, 1, 1])

    with filter_col1:
        search_term = st.text_input(
            "🔍 Search",
            placeholder="Search by company or role…",
            key="at_search",
            label_visibility="collapsed",
        )
    with filter_col2:
        status_filter = st.multiselect(
            "Status Filter",
            STATUS_OPTIONS,
            key="at_status_filter",
            placeholder="All statuses",
            label_visibility="collapsed",
        )
    with filter_col3:
        sort_col = st.selectbox(
            "Sort",
            ["Applied Date ↓", "Applied Date ↑", "Company A–Z", "Status"],
            key="at_sort",
            label_visibility="collapsed",
        )

    # Apply filters
    filtered = apps
    if search_term:
        s = search_term.lower()
        filtered = [a for a in filtered if s in a["company"].lower() or s in a["role"].lower()]
    if status_filter:
        filtered = [a for a in filtered if a["status"] in status_filter]

    # Sort
    if sort_col == "Applied Date ↓":
        filtered = sorted(filtered, key=lambda x: x.get("applied_date", ""), reverse=True)
    elif sort_col == "Applied Date ↑":
        filtered = sorted(filtered, key=lambda x: x.get("applied_date", ""))
    elif sort_col == "Company A–Z":
        filtered = sorted(filtered, key=lambda x: x["company"].lower())
    elif sort_col == "Status":
        order = {s: i for i, s in enumerate(STATUS_OPTIONS)}
        filtered = sorted(filtered, key=lambda x: order.get(x["status"], 99))

    st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)

    # ── Application Table ──────────────────────────────────
    if not filtered:
        info_box("No applications match your current filters.")
    else:
        # Render custom HTML table
        rows_html = ""
        for i, app in enumerate(filtered):
            status_cls = STATUS_STYLE.get(app["status"], "badge-applied")
            rows_html += f"""
            <tr style="border-bottom:1px solid #e5e7eb;{'background:#f9fafb;' if i % 2 == 0 else ''}">
                <td style="padding:0.75rem 1rem;font-weight:600;font-size:0.875rem;">{app['company']}</td>
                <td style="padding:0.75rem 1rem;font-size:0.82rem;color:#6f6f6f;">{app['role']}</td>
                <td style="padding:0.75rem 1rem;font-size:0.82rem;">{app.get('applied_date','—')}</td>
                <td style="padding:0.75rem 1rem;">
                    <span class="badge {status_cls}">{app['status']}</span>
                </td>
                <td style="padding:0.75rem 1rem;font-size:0.82rem;">{app.get('interview_date','—')}</td>
                <td style="padding:0.75rem 1rem;font-size:0.82rem;color:#6f6f6f;">{app.get('offer_status','—')}</td>
                <td style="padding:0.75rem 1rem;font-size:0.82rem;">{app.get('salary','—')}</td>
            </tr>
            """

        table_html = f"""
        <div style="overflow-x:auto;border:1px solid #e5e7eb;border-radius:4px;">
            <table style="width:100%;border-collapse:collapse;background:#fff;">
                <thead>
                    <tr style="background:#f4f4f4;border-bottom:2px solid #e5e7eb;">
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Company</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Role</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Applied</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Status</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Interview</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Offer</th>
                        <th style="padding:0.75rem 1rem;text-align:left;font-size:0.78rem;
                                   font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
                                   color:#6f6f6f;">Salary</th>
                    </tr>
                </thead>
                <tbody>{rows_html}</tbody>
            </table>
        </div>
        <div style="font-size:0.75rem;color:#6f6f6f;margin-top:0.5rem;text-align:right;">
            Showing {len(filtered)} of {len(apps)} applications
        </div>
        """
        st.markdown(table_html, unsafe_allow_html=True)

    # ── Upcoming Interviews ────────────────────────────────
    upcoming = [
        a for a in apps
        if a.get("interview_date", "—") != "—"
        and a["status"] in ("Interview", "Technical Test", "Screening")
    ]

    if upcoming:
        st.markdown("<div style='height:1.5rem'></div>", unsafe_allow_html=True)
        section_header("Upcoming Interviews", "🗓️")

        for a in upcoming:
            st.markdown(
                f"""
                <div style="display:flex;justify-content:space-between;align-items:center;
                            padding:0.75rem 1.25rem;background:#edf5ff;border:1px solid #d0e2ff;
                            border-left:4px solid #0f62fe;border-radius:4px;margin-bottom:0.5rem;">
                    <div>
                        <strong>{a['company']}</strong> –
                        <span style="color:#6f6f6f;">{a['role']}</span>
                    </div>
                    <div style="font-size:0.82rem;color:#0043ce;font-weight:500;">
                        🗓️ {a['interview_date']}
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    render_footer()
