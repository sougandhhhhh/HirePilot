"""
HirePilot AI – Job Matcher Page
AI-powered job matching based on role, location, experience, and skills.
"""

from __future__ import annotations

import streamlit as st

from components.ui_components import render_job_card, render_pills, info_box, render_footer
from services.watsonx_service import get_job_matches
from utils.helpers import section_header, score_colour


# ── Common job role options ──────────────────────────────────
ROLES = [
    "Software Engineer", "Full Stack Developer", "Frontend Engineer",
    "Backend Engineer", "Data Scientist", "Data Engineer", "ML Engineer",
    "DevOps Engineer", "Cloud Architect", "Product Manager",
    "UX Designer", "Cybersecurity Engineer", "Mobile Developer (iOS/Android)",
    "Site Reliability Engineer (SRE)", "AI/ML Research Scientist",
]

LOCATIONS = [
    "Remote", "San Francisco, CA", "New York, NY", "Seattle, WA",
    "Austin, TX", "Boston, MA", "Chicago, IL", "Los Angeles, CA",
    "London, UK", "Berlin, Germany", "Toronto, Canada",
]

EXPERIENCE_LEVELS = [
    "Entry Level (0–2 years)",
    "Mid Level (2–5 years)",
    "Senior Level (5–8 years)",
    "Staff / Lead (8+ years)",
    "Principal / Director",
]

SKILLS_LIST = [
    "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++",
    "React", "Vue", "Angular", "Node.js", "Next.js",
    "AWS", "GCP", "Azure", "Kubernetes", "Docker", "Terraform",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "Machine Learning", "Deep Learning", "LLMs", "MLOps",
    "GraphQL", "REST APIs", "gRPC", "Kafka", "Spark",
    "CI/CD", "GitHub Actions", "Jenkins", "Agile", "Scrum",
]


def render() -> None:
    """Render the Job Matcher page."""

    section_header("Job Matcher", "🔍")
    st.markdown(
        "<p style='color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.5rem;'>"
        "Tell the AI your preferences and discover top-matched opportunities with salary insights."
        "</p>",
        unsafe_allow_html=True,
    )

    # ── Search Form ────────────────────────────────────────
    with st.container():
        st.markdown(
            '<div style="background:#f4f4f4;border:1px solid #e5e7eb;border-radius:4px;padding:1.5rem;margin-bottom:1.5rem;">',
            unsafe_allow_html=True,
        )

        form_col1, form_col2 = st.columns(2, gap="medium")

        with form_col1:
            selected_role = st.selectbox(
                "🎯 Target Role", ROLES,
                index=ROLES.index("Software Engineer"),
                key="jm_role",
            )
            selected_location = st.selectbox(
                "📍 Preferred Location", LOCATIONS, key="jm_location"
            )

        with form_col2:
            selected_exp = st.selectbox(
                "📅 Experience Level", EXPERIENCE_LEVELS,
                index=1,
                key="jm_experience",
            )
            selected_skills = st.multiselect(
                "🛠️ Your Skills (select up to 8)",
                SKILLS_LIST,
                default=["Python", "React", "Node.js", "SQL"],
                max_selections=8,
                key="jm_skills",
            )

        st.markdown("</div>", unsafe_allow_html=True)

        search_col, _ = st.columns([1, 3])
        with search_col:
            search_clicked = st.button("🔍 Find Matching Jobs", use_container_width=True, key="jm_search")

    if search_clicked or st.session_state.get("job_matches") is not None:
        if search_clicked:
            with st.spinner("🤖 IBM watsonx is scanning thousands of job listings…"):
                result = get_job_matches(
                    role=selected_role,
                    location=selected_location,
                    experience=selected_exp,
                    skills=selected_skills,
                )
                st.session_state["job_matches"] = result

        result = st.session_state["job_matches"]
        if result is None:
            return

        jobs = result.get("jobs", [])
        total = result.get("total_found", len(jobs))

        # ── Results Header ─────────────────────────────────
        st.markdown(
            f"""
            <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:0.75rem 1rem;background:#edf5ff;border:1px solid #d0e2ff;
                        border-radius:4px;margin-bottom:1.25rem;">
                <div style="font-size:0.9rem;font-weight:600;color:#0043ce;">
                    🎯 Found <strong>{total}</strong> matching jobs for
                    <strong>{selected_role}</strong> in <strong>{selected_location}</strong>
                </div>
                <div style="font-size:0.75rem;color:#6f6f6f;">
                    Showing top {len(jobs)} results
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # ── Filter Bar ─────────────────────────────────────
        filter_col1, filter_col2, filter_col3 = st.columns([1, 1, 2])
        with filter_col1:
            min_match = st.slider("Min Match %", 0, 100, 75, key="jm_filter_match")
        with filter_col2:
            sort_by = st.selectbox(
                "Sort by", ["Match %", "Salary", "Posted Date"],
                key="jm_sort",
                label_visibility="visible",
            )
        with filter_col3:
            job_type_filter = st.multiselect(
                "Job Type",
                ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"],
                default=["Full-time", "Remote", "Hybrid"],
                key="jm_type_filter",
            )

        # Filter & sort
        filtered = [j for j in jobs if j.get("match_pct", 0) >= min_match]
        if sort_by == "Match %":
            filtered.sort(key=lambda j: j.get("match_pct", 0), reverse=True)
        elif sort_by == "Salary":
            filtered.sort(key=lambda j: j.get("salary", "$0"), reverse=True)

        st.markdown("<div style='height:0.5rem'></div>", unsafe_allow_html=True)

        # ── Job Cards ──────────────────────────────────────
        if not filtered:
            st.info("No jobs match the current filters. Try lowering the minimum match percentage.")
        else:
            for job in filtered:
                render_job_card(job)
                # Apply button
                apply_key = f"apply_{job['company']}_{job['title']}"
                col_a, col_b, _ = st.columns([1, 1, 4])
                with col_a:
                    if st.button(
                        "✅ Apply Now",
                        key=f"btn_{apply_key}",
                        use_container_width=True,
                    ):
                        # Add to application tracker
                        apps = st.session_state.get("applications", [])
                        exists = any(
                            a["company"] == job["company"] and a["role"] == job["title"]
                            for a in apps
                        )
                        if not exists:
                            import datetime
                            apps.append({
                                "company":        job["company"],
                                "role":           job["title"],
                                "applied_date":   datetime.date.today().strftime("%b %d, %Y"),
                                "status":         "Applied",
                                "interview_date": "—",
                                "offer_status":   "Pending",
                                "location":       job["location"],
                                "salary":         job["salary"],
                            })
                            st.session_state["applications"] = apps
                            st.success(f"✅ Added {job['company']} to your Application Tracker!")
                        else:
                            st.info("Already in your Application Tracker.")

                with col_b:
                    st.link_button("🔗 View Job", url=job.get("url", "#"))

                st.markdown("<hr class='ibm-divider'>", unsafe_allow_html=True)

    else:
        # Empty state
        info_box(
            "Select your preferences above and click 'Find Matching Jobs' to discover "
            "AI-curated opportunities tailored to your profile."
        )

    render_footer()
