"""
HirePilot AI – AI Assistant Page
Embeds the IBM watsonx Orchestrate chat agent via st.components.v1.html().

Why st.components.v1.html() and NOT st.markdown(unsafe_allow_html=True)?
  Streamlit's markdown renderer deliberately strips all <script> tags for
  security.  st.components.v1.html() renders a sandboxed <iframe> that
  preserves JavaScript, which is required for the wxoLoader to initialise.
"""

from __future__ import annotations

import streamlit as st
import streamlit.components.v1 as components

from utils.config import WATSONX_ORCHESTRATE_CONFIG
from utils.helpers import section_header
from components.ui_components import render_footer


# ──────────────────────────────────────────────────────────────
# Build the self-contained HTML document injected into the iframe
# ──────────────────────────────────────────────────────────────

def _build_agent_html(cfg: dict, height: int) -> str:
    """
    Return a complete HTML document that:
      1. Sets window.wxOConfiguration with all required fields.
      2. Dynamically appends the wxoLoader.js script from the IBM host.
      3. Calls wxoLoader.init() once the script loads.
      4. Sizes the #root element to fill the iframe viewport.
    """
    host = cfg["hostURL"].rstrip("/")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HirePilot AI – Watsonx Assistant</title>
  <style>
    /* ── Reset ── */
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

    html, body {{
      height: 100%;
      width:  100%;
      font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
      background: #f4f4f4;
      overflow: hidden;
    }}

    /* ── Loading overlay (shown until wxoLoader fires) ── */
    #loading-overlay {{
      position: fixed; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #f4f4f4; gap: 1rem; z-index: 1000;
      transition: opacity 0.4s ease;
    }}
    #loading-overlay.hidden {{
      opacity: 0;
      pointer-events: none;
    }}
    .spinner {{
      width: 40px; height: 40px;
      border: 3px solid #d0e2ff;
      border-top-color: #0f62fe;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }}
    @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
    .loading-text {{
      font-size: 0.875rem; color: #6f6f6f; font-weight: 500;
    }}
    .loading-brand {{
      font-size: 1rem; font-weight: 700; color: #161616;
    }}

    /* ── Agent root container ── */
    #root {{
      position: absolute;
      inset: 0;
      height: 100%;
      width:  100%;
      display: flex;
      flex-direction: column;
    }}

    /* ── Make the injected wxo chat iframe fill the space ── */
    #root iframe,
    #root > div {{
      flex: 1;
      height: 100% !important;
      width:  100% !important;
      border: none !important;
    }}
  </style>
</head>
<body>

  <!-- Loading state shown while wxoLoader.js fetches -->
  <div id="loading-overlay">
    <div class="loading-brand">✈️ HirePilot AI</div>
    <div class="spinner"></div>
    <div class="loading-text">Connecting to IBM watsonx Orchestrate…</div>
  </div>

  <!-- wxo mounts the chat UI inside this element -->
  <div id="root"></div>

  <script>
    // ── 1. Configure the embedded agent ──────────────────────
    window.wxOConfiguration = {{
      orchestrationID:    "{cfg['orchestrationID']}",
      hostURL:            "{host}",
      rootElementID:      "root",
      deploymentPlatform: "{cfg['deploymentPlatform']}",
      crn:                "{cfg['crn']}",
      chatOptions: {{
        agentId:            "{cfg['agentId']}",
        agentEnvironmentId: "{cfg['agentEnvironmentId']}"
      }}
    }};

    // ── 2. Dynamically load wxoLoader.js ─────────────────────
    setTimeout(function () {{
      var script = document.createElement('script');
      script.src = window.wxOConfiguration.hostURL
                   + '/wxochat/wxoLoader.js?embed=true';

      script.addEventListener('load', function () {{
        // Hide the loading overlay once the agent is initialised
        wxoLoader.init();
        var overlay = document.getElementById('loading-overlay');
        if (overlay) {{
          overlay.classList.add('hidden');
          setTimeout(function () {{ overlay.remove(); }}, 500);
        }}
      }});

      script.addEventListener('error', function () {{
        var overlay = document.getElementById('loading-overlay');
        if (overlay) {{
          overlay.innerHTML =
            '<div style="text-align:center;padding:2rem;color:#6f6f6f;">' +
            '<div style="font-size:2rem;margin-bottom:.75rem;">⚠️</div>' +
            '<div style="font-weight:600;color:#161616;margin-bottom:.5rem;">' +
            'Could not load IBM watsonx Orchestrate</div>' +
            '<div style="font-size:.82rem;">Check your network connection and that ' +
            'the agent credentials are valid.</div></div>';
        }}
      }});

      document.head.appendChild(script);
    }}, 0);
  </script>
</body>
</html>"""


# ──────────────────────────────────────────────────────────────
# Page renderer
# ──────────────────────────────────────────────────────────────

CHAT_HEIGHT = 720   # px – height of the embedded chat iframe


def render() -> None:
    """Render the AI Assistant page with the embedded watsonx Orchestrate agent."""

    # ── Page header ────────────────────────────────────────
    section_header("AI Assistant", "🤖")

    st.markdown(
        """
        <p style="color:#6f6f6f;font-size:0.9rem;margin-top:-0.5rem;margin-bottom:1.25rem;">
            Chat with your IBM watsonx Orchestrate career agent — ask about your resume,
            job matches, interview prep, or anything career-related.
        </p>
        """,
        unsafe_allow_html=True,
    )

    # ── Capability pills ───────────────────────────────────
    st.markdown(
        """
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;">
            <span style="background:#edf5ff;color:#0043ce;border:1px solid #d0e2ff;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                📄 Resume Analysis
            </span>
            <span style="background:#defbe6;color:#0e6027;border:1px solid #a7f0ba;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                🔍 Job Matching
            </span>
            <span style="background:#f6f2ff;color:#6929c4;border:1px solid #d4bbff;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                🎤 Interview Prep
            </span>
            <span style="background:#d9fbfb;color:#005d5d;border:1px solid #9ef0f0;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                🧩 Skill Gap Advice
            </span>
            <span style="background:#fcf4d6;color:#8e6a00;border:1px solid #f1c21b;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                ✉️ Cover Letter Help
            </span>
            <span style="background:#fff1f1;color:#a2191f;border:1px solid #ffb3b8;
                         border-radius:1rem;padding:.2rem .75rem;font-size:.75rem;font-weight:500;">
                🚀 Career Strategy
            </span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── Embedded agent iframe ──────────────────────────────
    # st.components.v1.html() renders inside a sandboxed <iframe>,
    # which is the ONLY Streamlit primitive that preserves <script> tags.
    agent_html = _build_agent_html(WATSONX_ORCHESTRATE_CONFIG, CHAT_HEIGHT)

    components.html(
        agent_html,
        height=CHAT_HEIGHT,
        scrolling=False,
    )

    # ── Suggested prompts (below the chat) ────────────────
    st.markdown("<div style='height:1.25rem'></div>", unsafe_allow_html=True)
    st.markdown(
        '<div style="font-size:.8rem;font-weight:600;color:#6f6f6f;'
        'text-transform:uppercase;letter-spacing:.5px;margin-bottom:.6rem;">'
        'Suggested Prompts</div>',
        unsafe_allow_html=True,
    )

    prompts = [
        ("📄", "Analyze my resume and give me an ATS score"),
        ("🔍", "Find me senior engineer jobs in San Francisco"),
        ("🧩", "What skills am I missing for a Staff Engineer role?"),
        ("🎤", "Give me 5 hard system design interview questions"),
        ("✉️", "Write a cover letter for a role at Stripe"),
        ("🚀", "What will my salary be in 3 years?"),
    ]

    col_pairs = [prompts[i:i+3] for i in range(0, len(prompts), 3)]
    for row in col_pairs:
        cols = st.columns(3, gap="small")
        for col, (icon, text) in zip(cols, row):
            with col:
                st.markdown(
                    f"""
                    <div style="background:#f4f4f4;border:1px solid #e5e7eb;border-radius:4px;
                                padding:.65rem .85rem;font-size:.8rem;cursor:default;
                                color:#161616;line-height:1.4;">
                        <span style="margin-right:.35rem;">{icon}</span>{text}
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    render_footer()
