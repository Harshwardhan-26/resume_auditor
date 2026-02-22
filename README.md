# ResumeIQ 🚀 | AI-Powered Resume Auditor

**ResumeIQ** is a full-stack, AI-driven resume analysis tool designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging Natural Language Processing (NLP) and a decoupled cloud architecture, the platform provides real-time scoring, skill categorization, and actionable "Before vs. After" improvement suggestions.

---

## 🌟 Key Features

### 🧠 Intelligent Analysis (Backend)
* **ATS Compatibility Scoring:** Evaluates resumes based on formatting, contact information, and impact density.
* **Job Role Classifier:** Uses keyword-density logic to predict the user's career path (e.g., AI/ML Engineer, Web Developer).
* **Skill Profile Categorization:** Automatically groups detected keywords into Technical Skills, Soft Skills, and Industry Knowledge.
* **Impact Quantification:** Identifies missing metrics and provides specific suggestions to turn duty-focused bullets into results-oriented achievements.

### 💻 Modern User Experience (Frontend)
* **Real-time Audit Dashboard:** Interactive radial charts and checklists showing scan progress and results.
* **Dark/Light Mode:** A polished, glassmorphic UI with theme persistence.
* **Downloadable Reports:** Generates a professional PDF analysis report directly in the browser for offline use.
* **Responsive Design:** Fully optimized for mobile and desktop resume uploads.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (React)** | Server-side rendering and UI logic |
| **Styling** | **Tailwind CSS + Framer Motion** | Professional aesthetics and fluid animations |
| **Backend** | **FastAPI (Python)** | High-performance asynchronous API for data processing |
| **NLP/Parser** | **PyMuPDF (fitz)** | Deep text extraction from PDF resumes |
| **Deployment**| **Netlify + Render** | Multi-cloud hosting for the decoupled architecture |

---

## 📐 System Architecture

ResumeIQ follows a **Decoupled Client-Server Architecture**:

1.  **Client (Netlify):** The Next.js frontend handles file uploads and UI state.
2.  **API (Render):** The FastAPI backend receives the binary PDF, extracts text, and runs the audit logic.
3.  **The Handshake:** Communication happens via asynchronous HTTPS requests with JSON payloads.



---

## 🚀 Deployment Details

The project is live at: **[Insert Your Netlify URL Here]**

* **Frontend:** Deployed on **Netlify** for optimized global delivery.
* **Backend:** Hosted on **Render** (Free Tier). 
    * *Note: Due to Render's free tier sleep policy, the first scan after a period of inactivity may experience a 30-40 second "Cold Start" delay.*

---

## ⚙️ Local Setup

### Backend (Python)
1. Navigate to the root folder.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python main.py`

### Frontend (Next.js)
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

---

## 👨‍💻 Author
**Harshwardhan Goyal**
* B.Tech Student
* Focus: Machine Learning & CyberSecurity

---

## 📜 License
This project is for educational purposes.
