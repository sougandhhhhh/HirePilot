"""
HirePilot AI – Vercel Python Handler

Vercel does not natively support Streamlit (which requires persistent
WebSocket connections and a long-running process). This handler serves
a redirect / landing page that links to the live deployment on
Streamlit Community Cloud.

To deploy the full app, use one of:
  - Streamlit Community Cloud  (recommended, free)
  - Railway / Render / Heroku  (see Procfile)
  - Docker                     (see Dockerfile)
"""

from http.server import BaseHTTPRequestHandler
import json

STREAMLIT_CLOUD_URL = "https://hirepilot-ai.streamlit.app"   # update after deploying

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="3;url={STREAMLIT_CLOUD_URL}">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>HirePilot AI – Redirecting…</title>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{font-family:-apple-system,"Segoe UI",sans-serif;background:#f4f4f4;
          display:flex;align-items:center;justify-content:center;min-height:100vh}}
    .card{{background:#fff;border-radius:4px;padding:3rem 2.5rem;max-width:480px;
           text-align:center;box-shadow:0 4px 16px rgba(0,0,0,.1)}}
    .icon{{font-size:3rem;margin-bottom:1rem}}
    h1{{font-size:1.5rem;font-weight:700;color:#161616;margin-bottom:.75rem}}
    p{{font-size:.9rem;color:#6f6f6f;line-height:1.6;margin-bottom:1.5rem}}
    a.btn{{display:inline-block;background:#0f62fe;color:#fff;padding:.65rem 1.5rem;
           border-radius:4px;text-decoration:none;font-weight:500;font-size:.875rem}}
    a.btn:hover{{background:#0353e9}}
    .note{{font-size:.75rem;color:#8d8d8d;margin-top:1.25rem}}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✈️</div>
    <h1>HirePilot AI</h1>
    <p>
      Streamlit apps require a persistent server connection and cannot run
      as Vercel serverless functions.<br><br>
      The full HirePilot AI app is hosted on
      <strong>Streamlit Community Cloud</strong> — redirecting you there now.
    </p>
    <a class="btn" href="{STREAMLIT_CLOUD_URL}">Open HirePilot AI →</a>
    <div class="note">Redirecting automatically in 3 seconds…</div>
  </div>
</body>
</html>"""


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(HTML.encode("utf-8"))

    def log_message(self, *args):
        pass   # silence access logs
