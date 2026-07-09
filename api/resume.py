"""HirePilot AI – /api/resume  POST (multipart file upload)"""
import sys, os, cgi, io; sys.path.insert(0, os.path.dirname(__file__))
from _shared import BaseHTTPRequestHandler, json_response, mock_resume

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        ct = self.headers.get("Content-Type", "")
        text = ""
        try:
            # Parse multipart form-data to extract the file
            if "multipart/form-data" in ct:
                fs = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": ct},
                )
                if "file" in fs:
                    file_item = fs["file"]
                    raw = file_item.file.read()
                    fname = (file_item.filename or "").lower()
                    if fname.endswith(".txt"):
                        text = raw.decode("utf-8", errors="replace")
                    else:
                        text = f"[Binary file: {file_item.filename} – {len(raw)} bytes received]"
        except Exception as e:
            text = f"[Parse error: {e}]"

        json_response(self, mock_resume(text))

    def do_OPTIONS(self):
        json_response(self, {})
    def log_message(self, *a): pass
