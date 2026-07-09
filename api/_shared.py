"""
HirePilot AI – Shared mock data + watsonx helpers for all API functions.
Each api/*.py imports from this module.
"""
from __future__ import annotations
import os, time
from http.server import BaseHTTPRequestHandler
import json


# ── Config ────────────────────────────────────────────────────
WATSONX_API_URL    = os.getenv("WATSONX_API_URL", "https://us-south.ml.cloud.ibm.com")
WATSONX_API_KEY    = os.getenv("WATSONX_API_KEY", "")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID", "")
USE_MOCK           = os.getenv("USE_MOCK_DATA", "true").lower() not in ("false","0","no")

WATSONX_ORCHESTRATE = {
    "orchestrationID":    "8254d45b2e8c49f397fed4f4efda4474_82de1835-3f80-482d-864e-7b0c75121f2f",
    "hostURL":            "https://au-syd.watson-orchestrate.cloud.ibm.com",
    "deploymentPlatform": "ibmcloud",
    "crn":                "crn:v1:bluemix:public:watsonx-orchestrate:au-syd:a/8254d45b2e8c49f397fed4f4efda4474:82de1835-3f80-482d-864e-7b0c75121f2f::",
    "agentId":            "066f1a0a-dec9-4dc8-8462-23b617d50639",
    "agentEnvironmentId": "6b0c667f-8cb8-43d0-bc81-098baaf81a36",
}

# ── CORS helper ────────────────────────────────────────────────
CORS_HEADERS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type":                 "application/json",
}


def json_response(handler: BaseHTTPRequestHandler, data: dict, status: int = 200) -> None:
    body = json.dumps(data).encode()
    handler.send_response(status)
    for k, v in CORS_HEADERS.items():
        handler.send_header(k, v)
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_body(handler: BaseHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", 0))
    raw = handler.rfile.read(length) if length else b"{}"
    try:
        return json.loads(raw)
    except Exception:
        return {}


# ── Mock data factories ────────────────────────────────────────

def mock_dashboard() -> dict:
    return {
        "career_readiness_score": 78, "ats_score": 82,
        "recommended_jobs": 14, "interview_readiness": 71,
        "skill_gap_score": 65, "profile_strength": 88,
        "applications_sent": 12, "interviews_scheduled": 3,
        "recent_activity": [
            {"action": "Resume uploaded and analyzed",          "time": "2 hours ago"},
            {"action": "Applied to Senior Developer at Stripe", "time": "1 day ago"},
            {"action": "Interview scheduled with Cloudflare",   "time": "2 days ago"},
            {"action": "Cover letter generated for Databricks", "time": "3 days ago"},
        ],
    }


def mock_resume(text: str = "") -> dict:
    return {
        "ats_score": 82, "confidence_score": 91, "word_count": 487,
        "readability_score": 74,
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
        "missing_keywords": [
            "Kubernetes","CI/CD","Terraform","Agile","Scrum",
            "Microservices","REST API","Docker","AWS Lambda","GraphQL",
        ],
        "suggestions": [
            "Add a 3–4 line professional summary at the top of your resume.",
            "Include quantified metrics for each role (percentages, team sizes, revenue impact).",
            "Add missing technical keywords naturally in experience bullets.",
            "Consider adding a 'Projects' section to demonstrate hands-on expertise.",
            "Tailor resume keywords to each job description for higher ATS scores.",
        ],
        "sections_found":   ["Experience","Skills","Education","Certifications"],
        "sections_missing": ["Summary","Projects","Awards"],
    }


def mock_jobs(role: str = "Software Engineer", location: str = "Remote") -> dict:
    return {
        "total_found": 47,
        "jobs": [
            {"title": f"Senior {role}", "company": "Stripe",     "location": location,        "salary": "$145,000–$185,000", "match_pct": 94, "confidence": 97, "type": "Full-time", "posted": "2 days ago",  "skills": ["Python","React","PostgreSQL","AWS"],       "url": "https://stripe.com/jobs",              "description": "Lead development of payment infrastructure serving millions of users."},
            {"title": role,              "company": "Cloudflare", "location": "Remote",         "salary": "$130,000–$165,000", "match_pct": 89, "confidence": 92, "type": "Full-time", "posted": "1 day ago",   "skills": ["Go","Rust","Kubernetes","Distributed Systems"],"url":"https://cloudflare.com/careers",       "description": "Build and scale edge computing solutions at a global scale."},
            {"title": f"{role} II",      "company": "Databricks", "location": location,        "salary": "$140,000–$175,000", "match_pct": 86, "confidence": 88, "type": "Hybrid",    "posted": "3 days ago",  "skills": ["Python","Spark","Scala","Delta Lake"],    "url": "https://databricks.com/company/careers","description": "Work on data lakehouse products used by Fortune 500 companies."},
            {"title": f"Staff {role}",   "company": "Figma",      "location": "New York, NY",   "salary": "$155,000–$200,000", "match_pct": 81, "confidence": 84, "type": "Full-time", "posted": "5 days ago",  "skills": ["TypeScript","WebGL","React","Performance"],"url": "https://figma.com/careers",            "description": "Improve Figma's collaborative design editor performance."},
            {"title": f"Principal {role}","company":"Notion",     "location": "Remote",         "salary": "$160,000–$210,000", "match_pct": 77, "confidence": 80, "type": "Remote",    "posted": "1 week ago",  "skills": ["React","Node.js","CRDTs","System Design"],"url": "https://notion.so/careers",            "description": "Architect next-generation collaborative document infrastructure."},
        ],
    }


def mock_skills(role: str = "Senior Software Engineer") -> dict:
    return {
        "current_skills": [
            {"name":"Python","level":"Expert","score":90},{"name":"React","level":"Advanced","score":80},
            {"name":"Node.js","level":"Intermediate","score":65},{"name":"SQL","level":"Advanced","score":78},
            {"name":"Git","level":"Expert","score":92},{"name":"AWS (basic)","level":"Beginner","score":40},
        ],
        "missing_skills": [
            {"name":"Kubernetes","priority":"High","demand":91},{"name":"Terraform","priority":"High","demand":87},
            {"name":"GraphQL","priority":"Medium","demand":74},{"name":"TypeScript","priority":"High","demand":89},
            {"name":"CI/CD","priority":"High","demand":85},{"name":"System Design","priority":"High","demand":93},
        ],
        "certifications": [
            {"name":"AWS Solutions Architect Associate","provider":"Amazon","duration":"3 months","url":"https://aws.amazon.com/certification/"},
            {"name":"CKA – Certified Kubernetes Admin","provider":"CNCF","duration":"2 months","url":"https://www.cncf.io/certification/cka/"},
            {"name":"HashiCorp Terraform Associate","provider":"HCP","duration":"6 weeks","url":"https://developer.hashicorp.com/certifications"},
            {"name":"IBM Full Stack Developer","provider":"IBM","duration":"4 months","url":"https://www.ibm.com/training/"},
        ],
        "projects": [
            {"name":"Build a microservices app with Docker + K8s","difficulty":"Medium","time":"2 weeks"},
            {"name":"Deploy a Terraform-managed AWS infrastructure","difficulty":"Medium","time":"1 week"},
            {"name":"Convert a REST API to GraphQL","difficulty":"Easy","time":"3 days"},
            {"name":"Set up a full CI/CD pipeline with GitHub Actions","difficulty":"Medium","time":"1 week"},
        ],
        "roadmap": [
            {"step":1,"title":"Master TypeScript","detail":"Complete TypeScript course + migrate a JS project","weeks":3},
            {"step":2,"title":"Learn Docker deeply","detail":"Containerise your existing projects","weeks":2},
            {"step":3,"title":"Kubernetes fundamentals","detail":"Deploy apps to a local K8s cluster via minikube","weeks":4},
            {"step":4,"title":"Infrastructure as Code","detail":"Provision AWS infra using Terraform","weeks":3},
            {"step":5,"title":"CI/CD Mastery","detail":"Build GitHub Actions pipelines for your repos","weeks":2},
            {"step":6,"title":"System Design practice","detail":"Solve 20+ system design problems on Excalidraw","weeks":4},
        ],
        "estimated_weeks": 18, "salary_uplift_pct": 28,
    }


def mock_cover_letter(company: str, role: str) -> dict:
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
    return {"cover_letter": letter, "word_count": len(letter.split()), "tone": "Professional"}


def mock_interview(role: str) -> dict:
    return {
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
            {"question": "Give an example of when you took ownership of a problem that wasn't yours.", "answer": "Demonstrate initiative and cross-functional collaboration. Show you identified a gap, drove it to resolution, linked to business impact.", "difficulty": "medium", "category": "Ownership"},
        ],
        "coding": [
            {"question": "Implement a function that finds the longest substring without repeating characters.", "answer": "Sliding window with hash set. O(n) time, O(min(m,n)) space where m is charset size.", "difficulty": "medium", "category": "Strings / Sliding Window"},
            {"question": "Write a function to detect if a binary tree is balanced.", "answer": "DFS post-order. Return -1 if unbalanced, else height. Check |left-right| > 1. O(n) time.", "difficulty": "hard", "category": "Trees / Recursion"},
        ],
    }


def mock_advisor(role: str) -> dict:
    return {
        "career_roadmap": [
            {"year":"Now",    "title":"Mid-level Engineer",  "focus":"Deepen full-stack expertise, contribute to system design decisions"},
            {"year":"Year 1", "title":"Senior Engineer",     "focus":"Lead features end-to-end, mentor 1-2 juniors, own a service"},
            {"year":"Year 2", "title":"Staff / Tech Lead",   "focus":"Define technical direction, cross-team influence, org-wide impact"},
            {"year":"Year 4", "title":"Principal / Architect","focus":"Enterprise architecture, strategic planning, hiring bar-raiser"},
        ],
        "salary_prediction": {"current":"$115,000","12_months":"$135,000","24_months":"$155,000","36_months":"$180,000"},
        "top_companies": [
            {"name":"Stripe",       "match":94,"culture":"High-performance, craft-focused"},
            {"name":"Cloudflare",   "match":89,"culture":"Distributed, open, engineering-led"},
            {"name":"Databricks",   "match":86,"culture":"Data-driven, fast-growing"},
            {"name":"Hashicorp",    "match":83,"culture":"Open source first, remote-friendly"},
            {"name":"IBM Research", "match":80,"culture":"Innovation, enterprise scale, diversity"},
        ],
        "future_skills": [
            {"skill":"AI/ML Engineering",       "relevance":95,"timeline":"Now"},
            {"skill":"Platform Engineering",    "relevance":88,"timeline":"6 months"},
            {"skill":"FinOps / Cloud Cost Mgmt","relevance":72,"timeline":"1 year"},
            {"skill":"WebAssembly (WASM)",       "relevance":68,"timeline":"1-2 years"},
            {"skill":"Quantum Computing Basics", "relevance":45,"timeline":"3+ years"},
        ],
        "certifications": [
            "AWS Solutions Architect Professional",
            "Google Cloud Professional Data Engineer",
            "IBM AI Enterprise Workflow Specialisation",
            "Certified Kubernetes Administrator (CKA)",
        ],
        "market_insight": "Demand for full-stack engineers with cloud-native experience is growing at 22% YoY. Engineers with AI/ML integration skills command a 35% salary premium.",
    }
