"""HirePilot AI – /api/dashboard  GET"""
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
            "career_readiness_score": 78, "ats_score": 82,
            "recommended_jobs": 14, "interview_readiness": 71,
            "skill_gap_score": 65, "profile_strength": 88,
            "applications_sent": 12, "interviews_scheduled": 3,
            "recent_activity": [
                {"action": "Resume uploaded and analyzed", "time": "2 hours ago"},
                {"action": "Applied to Senior Developer at Stripe", "time": "1 day ago"},
                {"action": "Interview scheduled with Cloudflare", "time": "2 days ago"},
                {"action": "Cover letter generated for Databricks", "time": "3 days ago"},
            ],
        }),
    }
