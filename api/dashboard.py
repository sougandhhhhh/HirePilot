"""HirePilot AI – /api/dashboard  GET"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from _shared import BaseHTTPRequestHandler, json_response, mock_dashboard

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        json_response(self, mock_dashboard())
    def do_OPTIONS(self):
        json_response(self, {})
    def log_message(self, *a): pass
