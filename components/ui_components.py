"""
HirePilot AI – Shared UI Components
Reusable Streamlit / HTML component fragments.
"""

from __future__ import annotations

import streamlit as st
import streamlit.components.v1 as components

from utils.helpers import metric_card_html, progress_html, pill_html, score_colour


# ──────────────────────────────────────────────────────────────
# Hero Banner
# ──────────────────────────────────────────────────────────────

def render_hero(
    title: str,
    subtitle: str,
    badge: str = "Powered by IBM watsonx AI",
) -> None:
    st.markdown(
        f"""
        <div class="hero-banner">
            <span class="hero-badge">✦ {badge}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────────────────────
# Metric Cards Row
# ──────────────────────────────────────────────────────────────

def render_metric_row(metrics: list[dict]) -> None:
    """
    Render a horizontal row of metric cards.
    Each dict: {icon, value, label, delta?, delta_up?, accent?}
    """
    cols = st.columns(len(metrics))
    for col, m in zip(cols, metrics):
        with col:
            st.markdown(
                metric_card_html(
                    icon=m.get("icon", ""),
                    value=str(m["value"]),
                    label=m["label"],
                    delta=m.get("delta", ""),
                    delta_up=m.get("delta_up", True),
                    accent=m.get("accent", "blue"),
                ),
                unsafe_allow_html=True,
            )


# ──────────────────────────────────────────────────────────────
# Score Gauge  (simple circular SVG)
# ──────────────────────────────────────────────────────────────

def render_score_gauge(score: int, label: str, size: int = 120) -> None:
    """Render a circular progress gauge using inline SVG."""
    r = 45
    circumference = 2 * 3.14159 * r
    offset = circumference * (1 - score / 100)
    colour = score_colour(score)
    svg = f"""
    <div style="text-align:center;">
        <svg width="{size}" height="{size}" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="{r}"
                fill="none" stroke="#e5e7eb" stroke-width="10"/>
            <circle cx="50" cy="50" r="{r}"
                fill="none" stroke="{colour}" stroke-width="10"
                stroke-dasharray="{circumference:.1f}"
                stroke-dashoffset="{offset:.1f}"
                stroke-linecap="round"
                transform="rotate(-90 50 50)"/>
            <text x="50" y="50" text-anchor="middle" dy="0.35em"
                font-size="18" font-weight="700" fill="#161616"
                font-family="IBM Plex Sans, sans-serif">{score}</text>
        </svg>
        <div style="font-size:0.78rem;color:#6f6f6f;font-weight:500;margin-top:4px;">{label}</div>
    </div>
    """
    st.markdown(svg, unsafe_allow_html=True)


# ──────────────────────────────────────────────────────────────
# Progress Bars
# ──────────────────────────────────────────────────────────────

def render_progress_bar(label: str, value: int) -> None:
    st.markdown(progress_html(label, value), unsafe_allow_html=True)


def render_skill_bars(skills: list[dict]) -> None:
    """Render a list of skill proficiency bars. Each dict: {name, score}"""
    for skill in skills:
        render_progress_bar(skill["name"], skill["score"])


# ──────────────────────────────────────────────────────────────
# Pill Clouds
# ──────────────────────────────────────────────────────────────

def render_pills(items: list[str], style: str = "blue") -> None:
    html = " ".join(pill_html(i, style) for i in items)
    st.markdown(html, unsafe_allow_html=True)


# ──────────────────────────────────────────────────────────────
# Info / Alert Boxes
# ──────────────────────────────────────────────────────────────

def info_box(text: str) -> None:
    st.markdown(f'<div class="info-box">ℹ️ {text}</div>', unsafe_allow_html=True)


def success_box(text: str) -> None:
    st.markdown(
        f'<div style="background:#defbe6;border-left:4px solid #42be65;border-radius:4px;padding:0.9rem 1.2rem;font-size:0.875rem;margin:0.75rem 0;">✅ {text}</div>',
        unsafe_allow_html=True,
    )


def warning_box(text: str) -> None:
    st.markdown(
        f'<div style="background:#fcf4d6;border-left:4px solid #f1c21b;border-radius:4px;padding:0.9rem 1.2rem;font-size:0.875rem;margin:0.75rem 0;">⚠️ {text}</div>',
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────────────────────
# Sidebar
# ──────────────────────────────────────────────────────────────

def render_sidebar() -> str:
    """
    Render the navigation sidebar.
    Returns the ID of the currently selected page.
    """
    from utils.config import NAV_PAGES, APP_TITLE, APP_VERSION

    with st.sidebar:
        # Logo / Brand
        st.markdown(
            f"""
            <div style="padding:1.25rem 0 0.5rem;text-align:center;">
                <div style="font-size:2rem;margin-bottom:0.25rem;">✈️</div>
                <div style="font-size:1.1rem;font-weight:700;letter-spacing:-0.3px;">{APP_TITLE}</div>
                <div style="font-size:0.7rem;color:#8d8d8d;font-weight:400;margin-top:2px;">v{APP_VERSION} · IBM watsonx AI</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<hr style="border-color:#393939;margin:0.75rem 0 1rem;">', unsafe_allow_html=True)

        # Navigation
        page_labels = [p["label"] for p in NAV_PAGES]
        page_ids    = [p["id"]    for p in NAV_PAGES]

        current_idx = page_ids.index(st.session_state.get("current_page", "dashboard"))

        selected_label = st.radio(
            "Navigation",
            options=page_labels,
            index=current_idx,
            label_visibility="collapsed",
        )

        selected_id = page_ids[page_labels.index(selected_label)]
        st.session_state["current_page"] = selected_id

        # User Profile Card
        st.markdown('<hr style="border-color:#393939;margin:1rem 0 0.75rem;">', unsafe_allow_html=True)
        profile = st.session_state.get("user_profile", {})
        st.markdown(
            f"""
            <div style="padding:0.75rem;background:#262626;border-radius:4px;">
                <div style="font-size:0.8rem;font-weight:600;">{profile.get('name','User')}</div>
                <div style="font-size:0.72rem;color:#8d8d8d;">{profile.get('role','Engineer')}</div>
                <div style="font-size:0.72rem;color:#8d8d8d;">{profile.get('location','')}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<hr style="border-color:#393939;margin:0.75rem 0;">', unsafe_allow_html=True)

        # Watsonx status indicator
        from utils.config import USE_MOCK_DATA
        mode_text  = "Demo Mode" if USE_MOCK_DATA else "Live – watsonx"
        mode_color = "#f1c21b"   if USE_MOCK_DATA else "#42be65"
        st.markdown(
            f'<div style="font-size:0.7rem;color:{mode_color};text-align:center;">⬤ {mode_text}</div>',
            unsafe_allow_html=True,
        )

        st.markdown('<hr style="border-color:#393939;margin:0.75rem 0;">', unsafe_allow_html=True)

        # ── AI Assistant quick-launch button in sidebar ────
        st.markdown(
            """
            <div style="padding:0 0 0.25rem;">
                <div style="font-size:0.68rem;color:#8d8d8d;text-transform:uppercase;
                            letter-spacing:0.5px;margin-bottom:0.5rem;">AI Assistant</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button(
            "🤖  Open AI Chat",
            use_container_width=True,
            key="sidebar_open_chat",
            help="Chat with your IBM watsonx Orchestrate career agent",
        ):
            st.session_state["current_page"] = "ai_assistant"
            st.rerun()

    return selected_id


# ──────────────────────────────────────────────────────────────
# Job Card
# ──────────────────────────────────────────────────────────────

def render_job_card(job: dict) -> None:
    match_pct = job.get("match_pct", 0)
    bar_color = score_colour(match_pct)
    skills_html = " ".join(pill_html(s, "blue") for s in job.get("skills", []))

    st.markdown(
        f"""
        <div class="job-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <h4>{job['title']}</h4>
                    <div class="meta">
                        🏢 {job['company']} &nbsp;|&nbsp; 📍 {job['location']}
                        &nbsp;|&nbsp; 💰 {job['salary']} &nbsp;|&nbsp; 🕐 {job['posted']}
                    </div>
                </div>
                <div style="text-align:right;min-width:80px;">
                    <div style="font-size:1.4rem;font-weight:700;color:{bar_color};">{match_pct}%</div>
                    <div style="font-size:0.7rem;color:#6f6f6f;">match</div>
                </div>
            </div>
            <p style="font-size:0.82rem;color:#6f6f6f;margin:0 0 0.75rem;">{job.get('description','')}</p>
            <div class="match-bar-bg">
                <div class="match-bar-fill" style="width:{match_pct}%;background:{bar_color};"></div>
            </div>
            <div style="margin-top:0.75rem;">{skills_html}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────────────────────
# Interview Question Card
# ──────────────────────────────────────────────────────────────

def render_question_card(item: dict, number: int) -> None:
    diff = item.get("difficulty", "medium").lower()
    diff_map = {"easy": ("Easy", "green"), "medium": ("Medium", "yellow"), "hard": ("Hard", "red")}
    diff_label, diff_style = diff_map.get(diff, ("Medium", "yellow"))
    category = item.get("category", "")

    st.markdown(
        f"""
        <div class="q-card {diff}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem;">
                <span style="font-size:0.72rem;color:#6f6f6f;">Q{number} · {category}</span>
                {pill_html(diff_label, diff_style)}
            </div>
            <div class="question">{item['question']}</div>
            <div class="answer">💡 {item['answer']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────────────────────
# Roadmap Timeline
# ──────────────────────────────────────────────────────────────

def render_roadmap(steps: list[dict]) -> None:
    html_parts = []
    for s in steps:
        html_parts.append(
            f"""
            <div class="roadmap-item">
                <div class="roadmap-step">{s['step']}</div>
                <div class="roadmap-content">
                    <h5>{s['title']} <span style="font-size:0.75rem;font-weight:400;color:#6f6f6f;">· {s.get('weeks','')} weeks</span></h5>
                    <p>{s['detail']}</p>
                </div>
            </div>
            """
        )
    st.markdown("".join(html_parts), unsafe_allow_html=True)


# ──────────────────────────────────────────────────────────────
# App Footer
# ──────────────────────────────────────────────────────────────

def render_footer() -> None:
    from utils.config import APP_VERSION
    st.markdown(
        f"""
        <div class="app-footer">
            HirePilot AI v{APP_VERSION} &nbsp;·&nbsp; Powered by IBM watsonx Orchestrate
            &nbsp;·&nbsp; Built with IBM Carbon Design
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────────────────────
# Persistent Floating Chat Bubble
# ──────────────────────────────────────────────────────────────

def render_chat_bubble() -> None:
    """
    Inject a floating chat bubble into every page.

    The bubble is rendered via st.components.v1.html() inside a zero-height
    wrapper so it overlays the page without consuming layout space.
    It opens an <iframe> that loads the IBM watsonx Orchestrate embedded agent
    as a slide-up panel when clicked.

    st.components.v1.html() is used because Streamlit strips <script> tags
    from st.markdown(unsafe_allow_html=True).
    """
    from utils.config import WATSONX_ORCHESTRATE_CONFIG as cfg

    host       = cfg["hostURL"].rstrip("/")
    orch_id    = cfg["orchestrationID"]
    platform   = cfg["deploymentPlatform"]
    crn        = cfg["crn"]
    agent_id   = cfg["agentId"]
    env_id     = cfg["agentEnvironmentId"]

    bubble_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: transparent; overflow: hidden; }}

  /* ── Floating bubble button ── */
  #chat-bubble {{
    position: fixed;
    bottom: 28px;
    right: 28px;
    width:  56px;
    height: 56px;
    border-radius: 50%;
    background: #0f62fe;
    color: #fff;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(15,98,254,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: background .15s, transform .15s;
  }}
  #chat-bubble:hover  {{ background: #0353e9; transform: scale(1.07); }}
  #chat-bubble:active {{ background: #002d9c; transform: scale(0.96); }}

  /* ── Slide-up chat panel ── */
  #chat-panel {{
    position: fixed;
    bottom: 96px;
    right:  28px;
    width:  400px;
    height: 600px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,.22);
    z-index: 9998;
    display: none;
    flex-direction: column;
    background: #fff;
    transform: translateY(20px);
    opacity: 0;
    transition: transform .25s ease, opacity .25s ease;
  }}
  #chat-panel.open {{
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }}

  /* ── Panel header ── */
  #panel-header {{
    background: linear-gradient(135deg, #0f62fe 0%, #001d6c 100%);
    color: #fff;
    padding: .75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }}
  #panel-header .title {{
    font-size: .9rem;
    font-weight: 600;
    font-family: 'IBM Plex Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: .5rem;
  }}
  #close-btn {{
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    opacity: .8;
    line-height: 1;
    padding: 0 .25rem;
  }}
  #close-btn:hover {{ opacity: 1; }}

  /* ── Agent container fills the panel ── */
  #root {{
    flex: 1;
    overflow: hidden;
    position: relative;
  }}
  #root iframe,
  #root > div {{
    width:  100% !important;
    height: 100% !important;
    border: none !important;
  }}

  /* ── Loading ── */
  #panel-loading {{
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: #f4f4f4; gap: .75rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: .82rem; color: #6f6f6f;
  }}
  .spinner {{
    width: 32px; height: 32px;
    border: 3px solid #d0e2ff;
    border-top-color: #0f62fe;
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }}
  @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
</style>
</head>
<body>

  <!-- Floating bubble -->
  <button id="chat-bubble" title="Open AI Assistant" aria-label="Open AI Assistant">
    🤖
  </button>

  <!-- Slide-up chat panel -->
  <div id="chat-panel">
    <div id="panel-header">
      <div class="title">✈️ HirePilot AI Assistant</div>
      <button id="close-btn" title="Close">✕</button>
    </div>
    <div id="root">
      <div id="panel-loading">
        <div class="spinner"></div>
        <span>Connecting to watsonx…</span>
      </div>
    </div>
  </div>

  <script>
    var panelOpen   = false;
    var agentLoaded = false;

    var bubble = document.getElementById('chat-bubble');
    var panel  = document.getElementById('chat-panel');
    var closeBtn = document.getElementById('close-btn');
    var loading  = document.getElementById('panel-loading');

    function openPanel() {{
      panel.style.display = 'flex';
      // Allow display to apply before adding .open for CSS transition
      requestAnimationFrame(function () {{
        requestAnimationFrame(function () {{ panel.classList.add('open'); }});
      }});
      bubble.textContent = '✕';
      panelOpen = true;

      if (!agentLoaded) {{ loadAgent(); }}
    }}

    function closePanel() {{
      panel.classList.remove('open');
      setTimeout(function () {{ panel.style.display = 'none'; }}, 260);
      bubble.textContent = '🤖';
      panelOpen = false;
    }}

    bubble.addEventListener('click', function () {{
      if (panelOpen) {{ closePanel(); }} else {{ openPanel(); }}
    }});
    closeBtn.addEventListener('click', closePanel);

    function loadAgent() {{
      window.wxOConfiguration = {{
        orchestrationID:    "{orch_id}",
        hostURL:            "{host}",
        rootElementID:      "root",
        deploymentPlatform: "{platform}",
        crn:                "{crn}",
        chatOptions: {{
          agentId:            "{agent_id}",
          agentEnvironmentId: "{env_id}"
        }}
      }};

      var script = document.createElement('script');
      script.src = "{host}/wxochat/wxoLoader.js?embed=true";

      script.addEventListener('load', function () {{
        wxoLoader.init();
        agentLoaded = true;
        if (loading) {{
          loading.style.opacity = '0';
          setTimeout(function () {{ loading.remove(); }}, 300);
        }}
      }});

      script.addEventListener('error', function () {{
        if (loading) {{
          loading.innerHTML =
            '<div style="text-align:center;padding:1.5rem;color:#6f6f6f;">' +
            '<div style="font-size:1.5rem;margin-bottom:.5rem;">⚠️</div>' +
            '<div style="font-weight:600;color:#161616;font-size:.82rem;">Could not load agent</div>' +
            '<div style="font-size:.75rem;margin-top:.3rem;">Check network / credentials</div>' +
            '</div>';
        }}
      }});

      document.head.appendChild(script);
    }}
  </script>
</body>
</html>"""

    # Render inside a zero-height wrapper — the fixed positioning means
    # the bubble floats above the page content without consuming vertical space.
    components.html(bubble_html, height=0, scrolling=False)
