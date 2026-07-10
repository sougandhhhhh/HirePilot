"""HirePilot AI – /api/resume  POST (multipart file upload)"""
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
            "missing_keywords": ["Kubernetes", "CI/CD", "Terraform", "Agile", "Scrum", "Microservices", "Docker", "GraphQL"],
            "suggestions": [
                "Add a 3–4 line professional summary at the top of your resume.",
                "Include quantified metrics for each role (percentages, team sizes, revenue impact).",
                "Add missing technical keywords naturally in experience bullets.",
                "Consider adding a 'Projects' section to demonstrate hands-on expertise.",
                "Tailor resume keywords to each job description for higher ATS scores.",
            ],
            "sections_found": ["Experience", "Skills", "Education", "Certifications"],
            "sections_missing": ["Summary", "Projects", "Awards"],
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
