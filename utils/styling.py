"""
HirePilot AI – IBM Carbon-inspired CSS
Injects global styles into the Streamlit app.
"""

GLOBAL_CSS = """
<style>
/* ── Fonts & Root ────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
    --ibm-blue-60:   #0f62fe;
    --ibm-blue-50:   #4589ff;
    --ibm-blue-10:   #edf5ff;
    --ibm-blue-20:   #d0e2ff;
    --ibm-gray-100:  #161616;
    --ibm-gray-90:   #262626;
    --ibm-gray-80:   #393939;
    --ibm-gray-60:   #6f6f6f;
    --ibm-gray-30:   #c6c6c6;
    --ibm-gray-10:   #f4f4f4;
    --ibm-white:     #ffffff;
    --ibm-green-40:  #42be65;
    --ibm-teal-40:   #08bdba;
    --ibm-purple-50: #a56eff;
    --ibm-yellow-30: #f1c21b;
    --ibm-red-50:    #fa4d56;
    --radius:        4px;
    --shadow-sm:     0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.10);
    --shadow-md:     0 4px 6px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.08);
}

/* ── Base App ─────────────────────────────────────────── */
html, body, [class*="css"] {
    font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif !important;
}

.main .block-container {
    padding: 2rem 2.5rem 3rem !important;
    max-width: 1200px;
}

/* ── Hide Streamlit branding ─────────────────────────── */
#MainMenu, footer, header { visibility: hidden; }

/* ── Sidebar ─────────────────────────────────────────── */
[data-testid="stSidebar"] {
    background: var(--ibm-gray-100) !important;
    border-right: 1px solid var(--ibm-gray-80);
}
[data-testid="stSidebar"] * { color: #f4f4f4 !important; }
[data-testid="stSidebar"] .stRadio label {
    padding: 0.55rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    display: block;
    transition: background 0.15s;
}
[data-testid="stSidebar"] .stRadio label:hover {
    background: var(--ibm-gray-80) !important;
}

/* ── Hero Banner ─────────────────────────────────────── */
.hero-banner {
    background: linear-gradient(135deg, #0f62fe 0%, #001d6c 100%);
    color: #fff;
    padding: 3rem 2.5rem;
    border-radius: var(--radius);
    margin-bottom: 2rem;
}
.hero-banner h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    letter-spacing: -0.5px;
    color: #fff !important;
}
.hero-banner p {
    font-size: 1.05rem;
    font-weight: 300;
    line-height: 1.7;
    color: rgba(255,255,255,0.88) !important;
    max-width: 680px;
}
.hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

/* ── Metric Cards ────────────────────────────────────── */
.metric-card {
    background: var(--ibm-white);
    border: 1px solid var(--ibm-gray-30);
    border-top: 4px solid var(--ibm-blue-60);
    border-radius: var(--radius);
    padding: 1.5rem 1.25rem 1.25rem;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
    height: 100%;
}
.metric-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}
.metric-card .card-icon {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    display: block;
}
.metric-card .card-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ibm-gray-100);
    line-height: 1;
    margin-bottom: 0.25rem;
}
.metric-card .card-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ibm-gray-60);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.metric-card .card-delta {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    font-weight: 500;
}
.delta-up   { color: var(--ibm-green-40); }
.delta-down { color: var(--ibm-red-50); }

/* card accent colours */
.accent-blue   { border-top-color: var(--ibm-blue-60) !important; }
.accent-green  { border-top-color: var(--ibm-green-40) !important; }
.accent-teal   { border-top-color: var(--ibm-teal-40) !important; }
.accent-purple { border-top-color: var(--ibm-purple-50) !important; }
.accent-yellow { border-top-color: var(--ibm-yellow-30) !important; }
.accent-red    { border-top-color: var(--ibm-red-50) !important; }

/* ── Section Headers ─────────────────────────────────── */
.section-header {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--ibm-gray-100);
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--ibm-blue-60);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* ── Pill / Tag ──────────────────────────────────────── */
.pill {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    margin: 0.2rem;
}
.pill-blue   { background: var(--ibm-blue-10);  color: var(--ibm-blue-60);  border: 1px solid var(--ibm-blue-20); }
.pill-green  { background: #defbe6;             color: #0e6027;             border: 1px solid #a7f0ba; }
.pill-red    { background: #fff1f1;             color: #a2191f;             border: 1px solid #ffb3b8; }
.pill-yellow { background: #fcf4d6;             color: #8e6a00;             border: 1px solid #f1c21b; }
.pill-gray   { background: var(--ibm-gray-10);  color: var(--ibm-gray-80);  border: 1px solid var(--ibm-gray-30); }
.pill-purple { background: #f6f2ff;             color: #6929c4;             border: 1px solid #d4bbff; }
.pill-teal   { background: #d9fbfb;             color: #005d5d;             border: 1px solid #9ef0f0; }

/* ── Job Cards ───────────────────────────────────────── */
.job-card {
    background: var(--ibm-white);
    border: 1px solid var(--ibm-gray-30);
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s;
}
.job-card:hover { box-shadow: var(--shadow-md); }
.job-card h4    { margin: 0 0 0.35rem; font-size: 1rem; font-weight: 600; color: var(--ibm-blue-60); }
.job-card .meta { font-size: 0.8rem; color: var(--ibm-gray-60); margin-bottom: 0.75rem; }
.match-bar-bg {
    background: var(--ibm-gray-10);
    border-radius: 2px;
    height: 6px;
    overflow: hidden;
    margin: 0.4rem 0;
}
.match-bar-fill {
    height: 6px;
    border-radius: 2px;
    background: var(--ibm-blue-60);
}

/* ── Cover Letter Box ────────────────────────────────── */
.cover-letter-box {
    background: var(--ibm-gray-10);
    border: 1px solid var(--ibm-gray-30);
    border-radius: var(--radius);
    padding: 1.75rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--ibm-gray-100);
    white-space: pre-wrap;
}

/* ── Interview Question Card ─────────────────────────── */
.q-card {
    background: var(--ibm-white);
    border-left: 4px solid var(--ibm-blue-60);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow-sm);
}
.q-card.hard   { border-left-color: var(--ibm-red-50); }
.q-card.medium { border-left-color: var(--ibm-yellow-30); }
.q-card.easy   { border-left-color: var(--ibm-green-40); }
.q-card .question  { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.5rem; }
.q-card .answer    { font-size: 0.875rem; color: var(--ibm-gray-60); line-height: 1.65; }

/* ── Progress Bar ────────────────────────────────────── */
.progress-container { margin: 0.5rem 0 1rem; }
.progress-label {
    display: flex; justify-content: space-between;
    font-size: 0.8rem; color: var(--ibm-gray-60); margin-bottom: 4px;
}
.progress-bg {
    background: var(--ibm-gray-10);
    border-radius: 2px;
    height: 8px;
    overflow: hidden;
    border: 1px solid var(--ibm-gray-30);
}
.progress-fill {
    height: 8px;
    border-radius: 2px;
    transition: width 0.6s ease;
}

/* ── Status Badges ───────────────────────────────────── */
.badge { padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.badge-applied    { background: #edf5ff; color: #0043ce; }
.badge-interview  { background: #defbe6; color: #0e6027; }
.badge-offer      { background: #d9fbfb; color: #005d5d; }
.badge-rejected   { background: #fff1f1; color: #a2191f; }
.badge-pending    { background: #fcf4d6; color: #8e6a00; }

/* ── Roadmap Timeline ────────────────────────────────── */
.roadmap-item {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--ibm-gray-10);
}
.roadmap-step {
    min-width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--ibm-blue-60);
    color: #fff;
    font-weight: 700;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.roadmap-content h5  { margin: 0 0 0.25rem; font-size: 0.95rem; font-weight: 600; }
.roadmap-content p   { margin: 0; font-size: 0.82rem; color: var(--ibm-gray-60); }

/* ── Info Box ────────────────────────────────────────── */
.info-box {
    background: var(--ibm-blue-10);
    border: 1px solid var(--ibm-blue-20);
    border-left: 4px solid var(--ibm-blue-60);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    color: var(--ibm-gray-100);
    line-height: 1.6;
    margin: 1rem 0;
}

/* ── Buttons ─────────────────────────────────────────── */
.stButton > button {
    background-color: var(--ibm-blue-60) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: var(--radius) !important;
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    padding: 0.6rem 1.4rem !important;
    letter-spacing: 0.15px;
    transition: background 0.15s !important;
}
.stButton > button:hover {
    background-color: #0353e9 !important;
}
.stButton > button:active {
    background-color: #002d9c !important;
}

/* ── Inputs ──────────────────────────────────────────── */
.stTextInput > div > div > input,
.stTextArea > div > div > textarea,
.stSelectbox > div > div {
    border: 1px solid var(--ibm-gray-30) !important;
    border-radius: var(--radius) !important;
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-size: 0.875rem !important;
}
.stTextInput > div > div > input:focus,
.stTextArea > div > div > textarea:focus {
    border-color: var(--ibm-blue-60) !important;
    box-shadow: 0 0 0 2px rgba(15,98,254,0.2) !important;
}

/* ── Tabs ────────────────────────────────────────────── */
.stTabs [data-baseweb="tab-list"] {
    gap: 0;
    border-bottom: 2px solid var(--ibm-gray-30);
}
.stTabs [data-baseweb="tab"] {
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.25rem !important;
    border-bottom: 2px solid transparent !important;
    color: var(--ibm-gray-60) !important;
    margin-bottom: -2px;
}
.stTabs [aria-selected="true"] {
    border-bottom-color: var(--ibm-blue-60) !important;
    color: var(--ibm-blue-60) !important;
}

/* ── DataFrames ──────────────────────────────────────── */
.stDataFrame { border: 1px solid var(--ibm-gray-30) !important; border-radius: var(--radius) !important; }
.stDataFrame table { font-size: 0.85rem !important; }

/* ── Spinner / Loading ───────────────────────────────── */
.loading-wrapper {
    display: flex; flex-direction: column;
    align-items: center; padding: 3rem 0;
    color: var(--ibm-gray-60);
    font-size: 0.875rem;
    gap: 0.75rem;
}

/* ── Divider ─────────────────────────────────────────── */
.ibm-divider {
    border: none;
    border-top: 1px solid var(--ibm-gray-30);
    margin: 1.5rem 0;
}

/* ── Footer ──────────────────────────────────────────── */
.app-footer {
    text-align: center;
    padding: 2rem 0 1rem;
    font-size: 0.75rem;
    color: var(--ibm-gray-60);
    border-top: 1px solid var(--ibm-gray-30);
    margin-top: 3rem;
}
</style>
"""


def inject_css() -> None:
    """Inject IBM Carbon-inspired CSS into the Streamlit app."""
    import streamlit as st
    st.markdown(GLOBAL_CSS, unsafe_allow_html=True)
