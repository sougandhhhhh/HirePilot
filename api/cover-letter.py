"""HirePilot AI – /api/cover-letter  POST"""
import json, time
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
        b       = _body(self)
        company = b.get("company", "Acme Corp")
        role    = b.get("role", "Software Engineer")
        today   = time.strftime("%B %d, %Y")
        letter  = f"""{today}

Hiring Manager
{company}

Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With over three years of hands-on experience building scalable web applications and a deep passion for crafting elegant, maintainable code, I am confident I would make an immediate and lasting contribution to your engineering team.

Throughout my career, I have delivered high-impact projects — reducing API response times by 40%, scaling distributed systems to serve millions of concurrent users, and mentoring junior engineers to grow their craft. My core technical expertise spans Python, React, Node.js, and cloud-native architectures — skills directly aligned with the requirements outlined in your job description.

What excites me most about {company} is your commitment to engineering excellence and the opportunity to work on products that matter at scale. I thrive in collaborative, fast-paced environments where curiosity and ownership are celebrated.

I would love the opportunity to discuss how my background and enthusiasm can drive meaningful impact at {company}. Thank you for considering my application — I look forward to the conversation.

Warm regards,

Alex Johnson
alex.johnson@email.com | linkedin.com/in/alexjohnson | github.com/alexjohnson""".strip()
        _send(self, {"cover_letter": letter, "word_count": len(letter.split()), "tone": "Professional"})
    def do_OPTIONS(self): _send(self, {})
    def log_message(self, *a): pass
