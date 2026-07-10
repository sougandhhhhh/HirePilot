"""HirePilot AI – /api/advisor  POST"""
import json
from http.server import BaseHTTPRequestHandler

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        self._send({
            "career_roadmap": [
                {"year": "Now", "title": "Mid-level Engineer", "focus": "Deepen full-stack expertise, contribute to system design decisions"},
                {"year": "Year 1", "title": "Senior Engineer", "focus": "Lead features end-to-end, mentor 1-2 juniors, own a service"},
                {"year": "Year 2", "title": "Staff / Tech Lead", "focus": "Define technical direction, cross-team influence, org-wide impact"},
                {"year": "Year 4", "title": "Principal / Architect", "focus": "Enterprise architecture, strategic planning, hiring bar-raiser"},
            ],
            "salary_prediction": {
                "current": "$115,000", "12_months": "$135,000",
                "24_months": "$155,000", "36_months": "$180,000",
            },
            "top_companies": [
                {"name": "Stripe", "match": 94, "culture": "High-performance, craft-focused"},
                {"name": "Cloudflare", "match": 89, "culture": "Distributed, open, engineering-led"},
                {"name": "Databricks", "match": 86, "culture": "Data-driven, fast-growing"},
                {"name": "Hashicorp", "match": 83, "culture": "Open source first, remote-friendly"},
                {"name": "IBM Research", "match": 80, "culture": "Innovation, enterprise scale, diversity"},
            ],
            "future_skills": [
                {"skill": "AI/ML Engineering", "relevance": 95, "timeline": "Now"},
                {"skill": "Platform Engineering", "relevance": 88, "timeline": "6 months"},
                {"skill": "FinOps / Cloud Cost Mgmt", "relevance": 72, "timeline": "1 year"},
                {"skill": "WebAssembly (WASM)", "relevance": 68, "timeline": "1-2 years"},
                {"skill": "Quantum Computing Basics", "relevance": 45, "timeline": "3+ years"},
            ],
            "certifications": [
                "AWS Solutions Architect Professional",
                "Google Cloud Professional Data Engineer",
                "IBM AI Enterprise Workflow Specialisation",
                "Certified Kubernetes Administrator (CKA)",
            ],
            "market_insight": "Demand for full-stack engineers with cloud-native experience is growing at 22% YoY. Engineers with AI/ML integration skills command a 35% salary premium.",
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
