"""HirePilot AI – /api/interview  POST"""
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
        body = self._body()
        role = body.get("role", "Software Engineer")
        self._send({
            "technical": [
                {"question": f"Explain the difference between synchronous and asynchronous programming as a {role}.", "answer": "Synchronous blocks the thread until done. Async (callbacks/promises/async-await) lets other work continue while waiting — critical for I/O-bound operations.", "difficulty": "medium", "category": "Core Concepts"},
                {"question": "How would you design a URL shortener like bit.ly from scratch?", "answer": "Hash function (base62 counter), Redis cache, PostgreSQL storage, load balancer, analytics pipeline. Handle collisions by retrying with salt.", "difficulty": "hard", "category": "System Design"},
                {"question": "What is the time complexity of quicksort and when would you prefer mergesort?", "answer": "Quicksort O(n log n) avg, O(n²) worst. Prefer mergesort for guaranteed O(n log n), linked lists, or stable sort.", "difficulty": "medium", "category": "Algorithms"},
            ],
            "hr": [
                {"question": "Tell me about yourself and why you're interested in this role.", "answer": "Structure: Past → Present → Future. Keep it 2 minutes. Be specific about achievements.", "difficulty": "easy", "category": "Introduction"},
                {"question": "Describe a time you disagreed with your manager.", "answer": "Use STAR. Raise concern respectfully with data. Show maturity and professionalism. Positive outcome.", "difficulty": "medium", "category": "Conflict Resolution"},
            ],
            "behavioral": [
                {"question": "Tell me about a time you delivered a project under an extremely tight deadline.", "answer": "STAR: constraint → prioritise ruthlessly → communicate risks early → execute → reflect. Quantify the outcome.", "difficulty": "medium", "category": "Delivery Under Pressure"},
                {"question": "Give an example of when you took ownership of a problem that wasn't yours.", "answer": "Demonstrate initiative and cross-functional collaboration. Identified a gap, drove it to resolution, linked to business impact.", "difficulty": "medium", "category": "Ownership"},
            ],
            "coding": [
                {"question": "Implement a function that finds the longest substring without repeating characters.", "answer": "Sliding window with hash set. O(n) time, O(min(m,n)) space where m is charset size.", "difficulty": "medium", "category": "Strings / Sliding Window"},
                {"question": "Write a function to detect if a binary tree is balanced.", "answer": "DFS post-order. Return -1 if unbalanced, else height. Check |left-right| > 1. O(n) time.", "difficulty": "hard", "category": "Trees / Recursion"},
            ],
        })

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
