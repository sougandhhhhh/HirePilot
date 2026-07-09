"""HirePilot AI – /api/jobs  POST"""
import json
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

def _body(h):
    n = int(h.headers.get("Content-Length", 0))
    try: return json.loads(h.rfile.read(n)) if n else {}
    except: return {}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        b = _body(self)
        role = b.get("role", "Software Engineer")
        loc  = b.get("location", "Remote")
        _send(self, {
            "total_found": 47,
            "jobs": [
                {"title": f"Senior {role}", "company": "Stripe",     "location": loc,           "salary": "$145,000–$185,000", "match_pct": 94, "posted": "2 days ago",  "skills": ["Python","React","PostgreSQL","AWS"],            "url": "https://stripe.com/jobs",              "description": "Lead development of payment infrastructure serving millions of users."},
                {"title": role,              "company": "Cloudflare", "location": "Remote",       "salary": "$130,000–$165,000", "match_pct": 89, "posted": "1 day ago",   "skills": ["Go","Rust","Kubernetes","Distributed Systems"], "url": "https://cloudflare.com/careers",       "description": "Build and scale edge computing solutions at a global scale."},
                {"title": f"{role} II",      "company": "Databricks", "location": loc,           "salary": "$140,000–$175,000", "match_pct": 86, "posted": "3 days ago",  "skills": ["Python","Spark","Scala","Delta Lake"],          "url": "https://databricks.com/company/careers","description": "Work on data lakehouse products used by Fortune 500 companies."},
                {"title": f"Staff {role}",   "company": "Figma",      "location": "New York, NY","salary": "$155,000–$200,000", "match_pct": 81, "posted": "5 days ago",  "skills": ["TypeScript","WebGL","React","Performance"],     "url": "https://figma.com/careers",            "description": "Improve Figma's collaborative design editor performance."},
                {"title": f"Principal {role}","company": "Notion",    "location": "Remote",       "salary": "$160,000–$210,000", "match_pct": 77, "posted": "1 week ago",  "skills": ["React","Node.js","CRDTs","System Design"],      "url": "https://notion.so/careers",            "description": "Architect next-generation collaborative document infrastructure."},
            ],
        })
    def do_OPTIONS(self): _send(self, {})
    def log_message(self, *a): pass
