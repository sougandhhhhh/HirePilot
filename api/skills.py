"""HirePilot AI – /api/skills  POST"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from _shared import BaseHTTPRequestHandler, json_response, read_body, mock_skills

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = read_body(self)
        json_response(self, mock_skills(role=body.get("role", "Senior Software Engineer")))
    def do_OPTIONS(self):
        json_response(self, {})
    def log_message(self, *a): pass
