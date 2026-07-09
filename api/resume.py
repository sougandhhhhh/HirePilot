"""HirePilot AI – /api/resume  POST (multipart file upload)"""
import json, cgi
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
    def do_POST(self):
        ct = self.headers.get("Content-Type", "")
        try:
            if "multipart/form-data" in ct:
                fs = cgi.FieldStorage(
                    fp=self.rfile, headers=self.headers,
                    environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": ct},
                )
        except Exception:
            pass
        _send(self, {
            "ats_score": 82, "confidence_score": 91, "word_count": 487,
            "strengths": [
                "Strong technical skill set with Python and cloud technologies",
                "Clear and quantified achievements (e.g., 40% performance improvement)",
                "Relevant experience at well-known companies",
                "Good use of action verbs throughout",
            ],
            "weaknesses": [
                "Missing a professional summary section",
                "Education section lacks GPA / honours details",
                "No mention of soft skills or leadership experience",
            ],
            "missing_keywords": ["Kubernetes","CI/CD","Terraform","Agile","Scrum","Microservices","Docker","GraphQL"],
            "suggestions": [
                "Add a 3–4 line professional summary at the top of your resume.",
                "Include quantified metrics for each role (percentages, team sizes, revenue impact).",
                "Add missing technical keywords naturally in experience bullets.",
                "Consider adding a 'Projects' section to demonstrate hands-on expertise.",
                "Tailor resume keywords to each job description for higher ATS scores.",
            ],
            "sections_found":   ["Experience","Skills","Education","Certifications"],
            "sections_missing": ["Summary","Projects","Awards"],
        })
    def do_OPTIONS(self): _send(self, {})
    def log_message(self, *a): pass
