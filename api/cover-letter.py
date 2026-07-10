"""HirePilot AI – /api/cover-letter  POST"""
import json, time
from http.server import BaseHTTPRequestHandler

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = self._body()
        company = body.get("company", "Acme Corp")
        role = body.get("role", "Software Engineer")
        today = time.strftime("%B %d, %Y")
        letter = f"""{today}

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
        self._send({"cover_letter": letter, "word_count": len(letter.split()), "tone": "Professional"})

    def do_OPTIONS(self):
        self._send({})

    def _body(self):
        n = int(self.headers.get("Content-Length", 0))
        try:
            return json.loads(self.rfile.read(n)) if n else {}
        except Exception:
            return {}

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
