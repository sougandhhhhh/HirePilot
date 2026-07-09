"""
HirePilot AI – IBM watsonx Orchestrate Service Layer
Handles all API calls to watsonx agents with mock data fallback.
"""

from __future__ import annotations

import json
import random
import time
from typing import Any

import streamlit as st

from utils.config import (
    WATSONX_API_URL,
    WATSONX_API_KEY,
    WATSONX_PROJECT_ID,
    AGENT_ENDPOINTS,
    USE_MOCK_DATA,
    REQUEST_TIMEOUT,
)


# ──────────────────────────────────────────────────────────────
# Base API Client
# ──────────────────────────────────────────────────────────────

def _get_headers() -> dict:
    return {
        "Authorization": f"Bearer {WATSONX_API_KEY}",
        "Content-Type": "application/json",
        "IBM-Project-ID": WATSONX_PROJECT_ID,
    }


def _call_agent(endpoint_key: str, payload: dict) -> dict:
    """
    Call an IBM watsonx Orchestrate agent endpoint.
    Falls back to mock data if USE_MOCK_DATA is True or API key is missing.
    """
    if USE_MOCK_DATA or not WATSONX_API_KEY:
        return _mock_response(endpoint_key, payload)

    try:
        import requests
        url = WATSONX_API_URL.rstrip("/") + AGENT_ENDPOINTS[endpoint_key]
        resp = requests.post(url, json=payload, headers=_get_headers(), timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        st.error(f"watsonx API error: {e}. Falling back to demo data.")
        return _mock_response(endpoint_key, payload)


# ──────────────────────────────────────────────────────────────
# Mock Data Generators  (realistic, varied responses)
# ──────────────────────────────────────────────────────────────

def _mock_response(key: str, payload: dict) -> dict:
    """Route to the correct mock data factory."""
    factories = {
        "resume_analyzer":    _mock_resume_analysis,
        "job_matcher":        _mock_job_matches,
        "skill_gap":          _mock_skill_gap,
        "cover_letter":       _mock_cover_letter,
        "interview_coach":    _mock_interview_questions,
        "career_advisor":     _mock_career_advice,
        "dashboard":          _mock_dashboard,
    }
    return factories.get(key, lambda p: {"error": "Unknown agent"})(payload)


def _mock_dashboard(_: dict) -> dict:
    return {
        "career_readiness_score": 78,
        "ats_score":              82,
        "recommended_jobs":       14,
        "interview_readiness":    71,
        "skill_gap_score":        65,
        "profile_strength":       88,
        "applications_sent":      12,
        "interviews_scheduled":   3,
        "recent_activity": [
            {"action": "Resume uploaded and analyzed",         "time": "2 hours ago"},
            {"action": "Applied to Senior Developer at Stripe","time": "1 day ago"},
            {"action": "Interview scheduled with Cloudflare",  "time": "2 days ago"},
            {"action": "Cover letter generated for Databricks","time": "3 days ago"},
        ],
    }


def _mock_resume_analysis(payload: dict) -> dict:
    return {
        "ats_score": 82,
        "confidence_score": 91,
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
            "Kubernetes", "CI/CD", "Terraform", "Agile", "Scrum",
            "Microservices", "REST API", "Docker", "AWS Lambda", "GraphQL",
        ],
        "suggestions": [
            "Add a 3-4 line professional summary at the top of your resume.",
            "Include quantified metrics for each role (percentages, team sizes, revenue impact).",
            "Add missing technical keywords naturally in experience bullets.",
            "Consider adding a 'Projects' section to demonstrate hands-on expertise.",
            "Tailor resume keywords to each job description for higher ATS scores.",
        ],
        "sections_found":  ["Experience", "Skills", "Education", "Certifications"],
        "sections_missing": ["Summary", "Projects", "Awards"],
        "word_count": 487,
        "readability_score": 74,
    }


def _mock_job_matches(payload: dict) -> dict:
    roles = payload.get("role", "Software Engineer")
    location = payload.get("location", "San Francisco, CA")
    jobs = [
        {
            "title":       f"Senior {roles}",
            "company":     "Stripe",
            "location":    location,
            "salary":      "$145,000 – $185,000",
            "match_pct":   94,
            "confidence":  97,
            "type":        "Full-time",
            "posted":      "2 days ago",
            "skills":      ["Python", "React", "PostgreSQL", "AWS"],
            "url":         "https://stripe.com/jobs",
            "description": "Lead development of payment infrastructure serving millions of users.",
        },
        {
            "title":       roles,
            "company":     "Cloudflare",
            "location":    "Remote",
            "salary":      "$130,000 – $165,000",
            "match_pct":   89,
            "confidence":  92,
            "type":        "Full-time",
            "posted":      "1 day ago",
            "skills":      ["Go", "Rust", "Kubernetes", "Distributed Systems"],
            "url":         "https://cloudflare.com/careers",
            "description": "Build and scale edge computing solutions at a global scale.",
        },
        {
            "title":       f"{roles} II",
            "company":     "Databricks",
            "location":    location,
            "salary":      "$140,000 – $175,000",
            "match_pct":   86,
            "confidence":  88,
            "type":        "Hybrid",
            "posted":      "3 days ago",
            "skills":      ["Python", "Spark", "Scala", "Delta Lake"],
            "url":         "https://databricks.com/company/careers",
            "description": "Work on data lakehouse products used by Fortune 500 companies.",
        },
        {
            "title":       f"Staff {roles}",
            "company":     "Figma",
            "location":    "New York, NY",
            "salary":      "$155,000 – $200,000",
            "match_pct":   81,
            "confidence":  84,
            "type":        "Full-time",
            "posted":      "5 days ago",
            "skills":      ["TypeScript", "WebGL", "React", "Performance"],
            "url":         "https://figma.com/careers",
            "description": "Improve Figma's collaborative design editor performance and reliability.",
        },
        {
            "title":       f"Principal {roles}",
            "company":     "Notion",
            "location":    "Remote",
            "salary":      "$160,000 – $210,000",
            "match_pct":   77,
            "confidence":  80,
            "type":        "Remote",
            "posted":      "1 week ago",
            "skills":      ["React", "Node.js", "CRDTs", "System Design"],
            "url":         "https://notion.so/careers",
            "description": "Architect next-generation collaborative document infrastructure.",
        },
    ]
    return {"jobs": jobs, "total_found": 47, "search_time_ms": 342}


def _mock_skill_gap(payload: dict) -> dict:
    return {
        "current_skills": [
            {"name": "Python",       "level": "Expert",        "score": 90},
            {"name": "React",        "level": "Advanced",      "score": 80},
            {"name": "Node.js",      "level": "Intermediate",  "score": 65},
            {"name": "SQL",          "level": "Advanced",      "score": 78},
            {"name": "Git",          "level": "Expert",        "score": 92},
            {"name": "REST APIs",    "level": "Advanced",      "score": 75},
            {"name": "AWS (basic)",  "level": "Beginner",      "score": 40},
        ],
        "missing_skills": [
            {"name": "Kubernetes",      "priority": "High",   "demand": 91},
            {"name": "Terraform",       "priority": "High",   "demand": 87},
            {"name": "GraphQL",         "priority": "Medium", "demand": 74},
            {"name": "TypeScript",      "priority": "High",   "demand": 89},
            {"name": "CI/CD Pipelines", "priority": "High",   "demand": 85},
            {"name": "System Design",   "priority": "High",   "demand": 93},
            {"name": "Docker",          "priority": "Medium", "demand": 80},
        ],
        "certifications": [
            {"name": "AWS Solutions Architect Associate", "provider": "Amazon", "duration": "3 months",  "url": "https://aws.amazon.com/certification/"},
            {"name": "CKA – Certified Kubernetes Admin",  "provider": "CNCF",   "duration": "2 months",  "url": "https://www.cncf.io/certification/cka/"},
            {"name": "HashiCorp Terraform Associate",     "provider": "HCP",    "duration": "6 weeks",   "url": "https://developer.hashicorp.com/certifications"},
            {"name": "IBM Full Stack Developer",          "provider": "IBM",    "duration": "4 months",  "url": "https://www.ibm.com/training/"},
        ],
        "projects": [
            {"name": "Build a microservices app with Docker + K8s", "difficulty": "Medium", "time": "2 weeks"},
            {"name": "Deploy a Terraform-managed AWS infrastructure",  "difficulty": "Medium", "time": "1 week"},
            {"name": "Convert a REST API to GraphQL",                  "difficulty": "Easy",   "time": "3 days"},
            {"name": "Set up a full CI/CD pipeline with GitHub Actions","difficulty": "Medium", "time": "1 week"},
        ],
        "roadmap": [
            {"step": 1, "title": "Master TypeScript",         "detail": "Complete TypeScript course + migrate a JS project", "weeks": 3},
            {"step": 2, "title": "Learn Docker deeply",        "detail": "Containerise your existing projects",               "weeks": 2},
            {"step": 3, "title": "Kubernetes fundamentals",    "detail": "Deploy apps to a local K8s cluster via minikube",   "weeks": 4},
            {"step": 4, "title": "Infrastructure as Code",     "detail": "Provision AWS infra using Terraform",               "weeks": 3},
            {"step": 5, "title": "CI/CD Mastery",              "detail": "Build GitHub Actions pipelines for your repos",     "weeks": 2},
            {"step": 6, "title": "System Design practice",     "detail": "Solve 20+ system design problems on Excalidraw",    "weeks": 4},
        ],
        "estimated_weeks": 18,
        "salary_uplift_pct": 28,
    }


def _mock_cover_letter(payload: dict) -> dict:
    company = payload.get("company", "Acme Corp")
    role    = payload.get("role", "Software Engineer")
    today   = time.strftime("%B %d, %Y")
    letter = f"""
{today}

Hiring Manager
{company}

Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With over three years of hands-on experience building scalable web applications and a deep passion for crafting elegant, maintainable code, I am confident I would make an immediate and lasting contribution to your engineering team.

Throughout my career, I have delivered high-impact projects — reducing API response times by 40%, scaling distributed systems to serve millions of concurrent users, and mentoring junior engineers to grow their craft. My core technical expertise spans Python, React, Node.js, and cloud-native architectures, skills directly aligned with the requirements outlined in your job description.

What excites me most about {company} is your commitment to engineering excellence and the opportunity to work on products that matter at scale. I thrive in collaborative, fast-paced environments where curiosity and ownership are celebrated.

I would love the opportunity to discuss how my background and enthusiasm can drive meaningful impact at {company}. Thank you for considering my application — I look forward to the conversation.

Warm regards,

Alex Johnson
alex.johnson@email.com | linkedin.com/in/alexjohnson | github.com/alexjohnson
""".strip()
    return {"cover_letter": letter, "word_count": len(letter.split()), "tone": "Professional"}


def _mock_interview_questions(payload: dict) -> dict:
    role = payload.get("role", "Software Engineer")
    return {
        "technical": [
            {
                "question":   f"Explain the difference between synchronous and asynchronous programming. Give a real-world example from your experience as a {role}.",
                "answer":     "Synchronous execution blocks the thread until completion (e.g., reading a file). Asynchronous execution uses callbacks/promises/async-await so the thread can handle other tasks while waiting — critical for I/O-bound operations like API calls or DB queries.",
                "difficulty": "medium",
                "category":   "Core Concepts",
            },
            {
                "question":   "How would you design a URL shortener service like bit.ly from scratch?",
                "answer":     "Key components: (1) Hash function (base62 encoding of a counter), (2) Redis for caching hot URLs, (3) PostgreSQL for persistent storage, (4) Load balancer + horizontal scaling, (5) Analytics pipeline. Handle collisions by retrying with salt.",
                "difficulty": "hard",
                "category":   "System Design",
            },
            {
                "question":   "What is the time complexity of quicksort and when would you prefer mergesort?",
                "answer":     "Quicksort: O(n log n) avg, O(n²) worst. Prefer mergesort when (1) you need guaranteed O(n log n) worst-case, (2) you're sorting linked lists (no random access), (3) you need a stable sort.",
                "difficulty": "medium",
                "category":   "Algorithms",
            },
        ],
        "hr": [
            {
                "question":   "Tell me about yourself and why you're interested in this role.",
                "answer":     "Structure: Past (background + key achievements) → Present (current role + skills) → Future (why this company, career goals). Keep it 2 minutes. Be specific, not generic.",
                "difficulty": "easy",
                "category":   "Introduction",
            },
            {
                "question":   "Describe a time you disagreed with your manager. How did you handle it?",
                "answer":     "Use STAR: Situation (context), Task (your role), Action (how you respectfully raised the concern with data), Result (outcome — ideally positive). Show maturity and professionalism.",
                "difficulty": "medium",
                "category":   "Conflict Resolution",
            },
        ],
        "behavioral": [
            {
                "question":   "Tell me about a time you had to deliver a project under an extremely tight deadline.",
                "answer":     "STAR method: Identify the constraint → Prioritise ruthlessly → Communicate risks early → Execute with focus → Reflect on lessons. Quantify the outcome (delivered X feature in Y days with Z% test coverage).",
                "difficulty": "medium",
                "category":   "Delivery Under Pressure",
            },
            {
                "question":   "Give an example of when you took ownership of a problem that wasn't technically yours.",
                "answer":     "Demonstrate initiative and cross-functional collaboration. Show you identified a gap, took responsibility voluntarily, collaborated with others, and drove it to resolution — linking back to team or business impact.",
                "difficulty": "medium",
                "category":   "Ownership",
            },
        ],
        "coding": [
            {
                "question":   "Implement a function that finds the longest substring without repeating characters.",
                "answer":     "Use sliding window with a hash set. Move right pointer and track characters; when a duplicate is found, move left pointer past the previous occurrence. O(n) time, O(min(m,n)) space where m is charset size.",
                "difficulty": "medium",
                "category":   "Strings / Sliding Window",
            },
            {
                "question":   "Write a function to detect if a binary tree is balanced (height difference ≤ 1 for every node).",
                "answer":     "DFS post-order traversal. Return -1 if subtree is unbalanced; otherwise return height. Check |left_height - right_height| > 1. O(n) time, O(h) space (h = tree height).",
                "difficulty": "hard",
                "category":   "Trees / Recursion",
            },
        ],
    }


def _mock_career_advice(payload: dict) -> dict:
    return {
        "career_roadmap": [
            {"year": "Now",    "title": "Mid-level Engineer",       "focus": "Deepen full-stack expertise, contribute to system design decisions"},
            {"year": "Year 1", "title": "Senior Engineer",          "focus": "Lead features end-to-end, mentor 1-2 juniors, own a service"},
            {"year": "Year 2", "title": "Staff / Tech Lead",        "focus": "Define technical direction, cross-team influence, org-wide impact"},
            {"year": "Year 4", "title": "Principal / Architect",    "focus": "Enterprise architecture, strategic planning, hiring bar-raiser"},
        ],
        "salary_prediction": {
            "current":    "$115,000",
            "12_months":  "$135,000",
            "24_months":  "$155,000",
            "36_months":  "$180,000",
        },
        "certifications": [
            "AWS Solutions Architect Professional",
            "Google Cloud Professional Data Engineer",
            "IBM AI Enterprise Workflow Specialisation",
            "Certified Kubernetes Administrator (CKA)",
        ],
        "top_companies": [
            {"name": "Stripe",        "match": 94, "culture": "High-performance, craft-focused"},
            {"name": "Cloudflare",    "match": 89, "culture": "Distributed, open, engineering-led"},
            {"name": "Databricks",    "match": 86, "culture": "Data-driven, fast-growing"},
            {"name": "Hashicorp",     "match": 83, "culture": "Open source first, remote-friendly"},
            {"name": "IBM Research",  "match": 80, "culture": "Innovation, enterprise scale, diversity"},
        ],
        "future_skills": [
            {"skill": "AI/ML Engineering",          "relevance": 95, "timeline": "Now"},
            {"skill": "Platform Engineering",        "relevance": 88, "timeline": "6 months"},
            {"skill": "FinOps / Cloud Cost Mgmt",    "relevance": 72, "timeline": "1 year"},
            {"skill": "WebAssembly (WASM)",           "relevance": 68, "timeline": "1-2 years"},
            {"skill": "Quantum Computing Basics",     "relevance": 45, "timeline": "3+ years"},
        ],
        "market_insight": "Demand for full-stack engineers with cloud-native experience is growing at 22% YoY. Engineers with AI/ML integration skills command a 35% salary premium.",
    }


# ──────────────────────────────────────────────────────────────
# Public Service Functions (called by pages)
# ──────────────────────────────────────────────────────────────

def get_dashboard_data() -> dict:
    return _call_agent("dashboard", {})


def analyze_resume(resume_text: str) -> dict:
    return _call_agent("resume_analyzer", {"resume_text": resume_text})


def get_job_matches(role: str, location: str, experience: str, skills: list[str]) -> dict:
    return _call_agent("job_matcher", {
        "role": role, "location": location,
        "experience": experience, "skills": skills,
    })


def analyze_skill_gap(role: str, skills: list[str]) -> dict:
    return _call_agent("skill_gap", {"target_role": role, "current_skills": skills})


def generate_cover_letter(company: str, role: str, job_description: str, resume_text: str = "") -> dict:
    return _call_agent("cover_letter", {
        "company": company, "role": role,
        "job_description": job_description, "resume_text": resume_text,
    })


def get_interview_questions(role: str, difficulty: str = "all") -> dict:
    return _call_agent("interview_coach", {"role": role, "difficulty": difficulty})


def get_career_advice(role: str, skills: list[str], experience: str) -> dict:
    return _call_agent("career_advisor", {
        "current_role": role, "skills": skills, "experience": experience,
    })
