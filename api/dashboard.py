"""HirePilot AI – /api/dashboard  GET"""
import json
from http.server import BaseHTTPRequestHandler

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._send({
            "career_readiness_score": 78, "ats_score": 82,
            "recommended_jobs": 14, "interview_readiness": 71,
            "skill_gap_score": 65, "profile_strength": 88,
            "applications_sent": 12, "interviews_scheduled": 3,
            "recent_activity": [
                {"action": "Resume uploaded and analyzed", "time": "2 hours ago"},
                {"action": "Applied to Senior Developer at Stripe", "time": "1 day ago"},
                {"action": "Interview scheduled with Cloudflare", "time": "2 days ago"},
                {"action": "Cover letter generated for Databricks", "time": "3 days ago"},
            ],
        })

    def do_OPTIONS(self):
        self._send({})

    def _send(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass
