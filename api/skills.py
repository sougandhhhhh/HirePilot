"""HirePilot AI – /api/skills  POST"""
import json

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": "{}"}
    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "current_skills": [
                {"name": "Python", "level": "Expert", "score": 90},
                {"name": "React", "level": "Advanced", "score": 80},
                {"name": "Node.js", "level": "Intermediate", "score": 65},
                {"name": "SQL", "level": "Advanced", "score": 78},
                {"name": "Git", "level": "Expert", "score": 92},
                {"name": "AWS (basic)", "level": "Beginner", "score": 40},
            ],
            "missing_skills": [
                {"name": "Kubernetes", "priority": "High", "demand": 91},
                {"name": "Terraform", "priority": "High", "demand": 87},
                {"name": "GraphQL", "priority": "Medium", "demand": 74},
                {"name": "TypeScript", "priority": "High", "demand": 89},
                {"name": "CI/CD", "priority": "High", "demand": 85},
                {"name": "System Design", "priority": "High", "demand": 93},
            ],
            "certifications": [
                {"name": "AWS Solutions Architect Associate", "provider": "Amazon", "duration": "3 months", "url": "https://aws.amazon.com/certification/"},
                {"name": "CKA – Certified Kubernetes Admin", "provider": "CNCF", "duration": "2 months", "url": "https://www.cncf.io/certification/cka/"},
                {"name": "HashiCorp Terraform Associate", "provider": "HCP", "duration": "6 weeks", "url": "https://developer.hashicorp.com/certifications"},
                {"name": "IBM Full Stack Developer", "provider": "IBM", "duration": "4 months", "url": "https://www.ibm.com/training/"},
            ],
            "projects": [
                {"name": "Build a microservices app with Docker + K8s", "difficulty": "Medium", "time": "2 weeks"},
                {"name": "Deploy a Terraform-managed AWS infrastructure", "difficulty": "Medium", "time": "1 week"},
                {"name": "Convert a REST API to GraphQL", "difficulty": "Easy", "time": "3 days"},
                {"name": "Set up a full CI/CD pipeline with GitHub Actions", "difficulty": "Medium", "time": "1 week"},
            ],
            "roadmap": [
                {"step": 1, "title": "Master TypeScript", "detail": "Complete TypeScript course + migrate a JS project", "weeks": 3},
                {"step": 2, "title": "Learn Docker deeply", "detail": "Containerise your existing projects", "weeks": 2},
                {"step": 3, "title": "Kubernetes fundamentals", "detail": "Deploy apps to a local K8s cluster via minikube", "weeks": 4},
                {"step": 4, "title": "Infrastructure as Code", "detail": "Provision AWS infra using Terraform", "weeks": 3},
                {"step": 5, "title": "CI/CD Mastery", "detail": "Build GitHub Actions pipelines for your repos", "weeks": 2},
                {"step": 6, "title": "System Design practice", "detail": "Solve 20+ system design problems on Excalidraw", "weeks": 4},
            ],
            "estimated_weeks": 18,
            "salary_uplift_pct": 28,
        }),
    }
