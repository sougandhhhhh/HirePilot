"""HirePilot AI – /api/dashboard  GET"""
import json, os
from http.server import BaseHTTPRequestHandler

_CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

def _send(h, data, status=200):
    body = json.dumps(data).encode()
    h.send_response(status)
    for k, v in _CORS.items(): h.send_header(k, v)
    h.send_header("Content-Length", str(len(body)))
    h.end_headers()
    h.wfile.write(body)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        _send(self, {
            "career_readiness_score": 78, "ats_score": 82,
            "recommended_jobs": 14, "interview_readiness": 71,
            "skill_gap_score": 65, "profile_strength": 88,
            "applications_sent": 12, "interviews_scheduled": 3,
            "recent_activity": [
                {"action": "Resume uploaded and analyzed",          "time": "2 hours ago"},
                {"action": "Applied to Senior Developer at Stripe", "time": "1 day ago"},
                {"action": "Interview scheduled with Cloudflare",   "time": "2 days ago"},
                {"action": "Cover letter generated for Databricks", "time": "3 days ago"},
            ],
        })
    def do_OPTIONS(self): _send(self, {})
    def log_message(self, *a): pass
