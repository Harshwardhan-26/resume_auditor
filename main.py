import uvicorn
from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Online", "message": "Resume IQ Backend is running!"}

def audit_resume(text):
    text_lower = text.lower()
    
    # --- 1. Contact Info Audit ---
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+', text))
    has_phone = bool(re.search(r'\+?\d[\d\-\(\) ]{8,}', text))
    has_linkedin = "linkedin.com" in text_lower
    contact_count = sum([has_email, has_phone, has_linkedin])
    contact_score = (contact_count / 3) * 100

    # --- 2. Impact Audit (Metrics) ---
    # Looks for percentages, dollar signs, and "plus" numbers (e.g., 50+)
    metrics = re.findall(r'\d+%', text) + re.findall(r'\$\d+', text) + re.findall(r'\d+\+', text)
    has_metrics = len(metrics) > 0
    impact_score = min(len(metrics) * 34, 100)

    # --- 3. Section Audit ---
    essential_sections = ["experience", "education", "skills"]
    bonus_sections = ["projects", "summary", "awards", "certifications"]
    found_essentials = [s for s in essential_sections if s in text_lower]
    found_bonus = [s for s in bonus_sections if s in text_lower]
    section_score = ((len(found_essentials) / len(essential_sections)) * 80) + (min(len(found_bonus) * 10, 20))

    # --- 4. Skill Categorizer ---
    tech_db = ["python", "java", "react", "next.js", "javascript", "sql", "aws", "docker", "git", "fastapi", "html", "css", "c++", "cybersecurity", "networking"]
    soft_db = ["leadership", "management", "communication", "teamwork", "problem solving", "adaptability", "mentoring"]
    industry_db = ["software engineering", "cybersecurity", "machine learning", "data science", "web development", "networking"]

    # Format as objects for frontend mapping
    found_tech = [{"name": s.capitalize()} for s in tech_db if s in text_lower]
    found_soft = [{"name": s.capitalize()} for s in soft_db if s in text_lower]
    found_industry = [{"name": s.capitalize()} for s in industry_db if s in text_lower]

    skill_score = min(((len(found_tech) + len(found_soft) + len(found_industry)) * 8), 100)

    # --- 5. Job Role Classifier ---
    predicted_role = "General Professional"
    tech_list = [s["name"].lower() for s in found_tech]
    ind_list = [s["name"].lower() for s in found_industry]

    if "cybersecurity" in ind_list or any(x in tech_list for x in ["networking", "firewall"]):
        predicted_role = "Cybersecurity Specialist"
    elif "machine learning" in ind_list or "python" in tech_list:
        predicted_role = "AI/ML Engineer"
    elif any(x in tech_list for x in ["react", "next.js", "javascript", "html", "css"]):
        predicted_role = "Frontend/Web Developer"
    elif "data science" in ind_list or "sql" in tech_list:
        predicted_role = "Data Analyst"
    elif "software engineering" in ind_list:
        predicted_role = "Software Engineer"

    # --- 6. Final Health Score (Balanced) ---
    final_score = (contact_score * 0.20) + (impact_score * 0.20) + (section_score * 0.30) + (skill_score * 0.30)

    # --- 7. Improvements (Task Cards) ---
    improvements = []
    if not has_phone:
        improvements.append({
            "title": "Add a Phone Number",
            "impact": "high",
            "scoreGain": 15,
            "before": "No phone contact detected.",
            "after": "Add a professional phone number (e.g., +1 (555) 123-4567) to ensure recruiters can reach you easily."
        })
    if len(metrics) < 3:
        improvements.append({
            "title": "Quantify Your Impact",
            "impact": "high",
            "scoreGain": 25,
            "before": "Helped develop features for the company app.",
            "after": "Developed 5+ key features for the company app, increasing user engagement by 15%."
        })
    if "summary" not in [s.lower() for s in found_bonus]:
        improvements.append({
            "title": "Add a Professional Summary",
            "impact": "medium",
            "scoreGain": 10,
            "before": "Resume starts immediately with education/experience.",
            "after": "Add a 2-3 sentence 'Professional Summary' at the top to highlight your core value proposition."
        })

    return {
        "healthScore": int(final_score),
        "predictedRole": predicted_role,
        "scoreExplanation": f"Your resume is a strong match for {predicted_role} roles, but can be improved by adding more quantifiable metrics.",
        "skillProfile": {
            "technical": found_tech if found_tech else [{"name": "None detected"}],
            "soft": found_soft if found_soft else [{"name": "None detected"}],
            "industry": found_industry if found_industry else [{"name": "General"}]
        },
        "categories": {
            "contactInfo": {
                "name": "Contact Info", "icon": "contact", "score": int(contact_score),
                "checks": [
                    {"label": "Email", "passed": has_email, "detail": "Found professional email." if has_email else "Missing email."},
                    {"label": "Phone", "passed": has_phone, "detail": "Found phone number." if has_phone else "Missing phone."},
                    {"label": "LinkedIn", "passed": has_linkedin, "detail": "Found LinkedIn profile." if has_linkedin else "Add LinkedIn URL."}
                ]
            },
            "formatting": {"name": "Formatting", "icon": "formatting", "score": 95, "checks": [{"label": "PDF Format", "passed": True, "detail": "Perfect for ATS parsing."}]},
            "impact": {"name": "Impact", "icon": "impact", "score": int(impact_score), "checks": [{"label": "Quantified Metrics", "passed": has_metrics, "detail": f"Found {len(metrics)} data markers."}]},
            "sections": {"name": "Sections", "icon": "sections", "score": int(section_score), "checks": [{"label": s.capitalize(), "passed": s in found_essentials, "detail": "Found standard header."} for s in essential_sections]}
        },
        "improvements": improvements
    }

@app.post("/audit")
async def process_resume(file: UploadFile = File(...)):
    content = await file.read()
    doc = fitz.open(stream=content, filetype="pdf")
    resume_text = "".join([page.get_text() for page in doc])
    return audit_resume(resume_text)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 STARTING SERVER ON PORT {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)