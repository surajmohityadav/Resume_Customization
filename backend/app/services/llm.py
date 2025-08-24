import os
import httpx
from dotenv import load_dotenv
from loguru import logger
import json

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Use a faster model for analysis tasks
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

async def customize_resume(resume_text: str, job_description: str, keywords: list[str]) -> str:
    """Customizes an existing resume with a very strict prompt."""
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key not configured")
    try:
        prompt = (
            "You are an expert resume editor. Your task is to rewrite the 'Original Resume' to be perfectly tailored for the 'Job Description', integrating the 'Keywords to Emprehasize'.\n\n"
            f"### Keywords to Emphasize:\n{', '.join(keywords)}\n\n"
            f"### Job Description:\n{job_description}\n\n"
            f"### Original Resume:\n{resume_text}\n\n"
            "---\n"
            "**CRITICAL OUTPUT RULE:**\n"
            "You MUST generate ONLY the final, clean resume text, formatted with markdown for bolding (e.g., **Summary**). "
            "Absolutely DO NOT include any placeholders, instructional comments in parentheses, or any text that is not part of a standard resume. "
            "The output must be a professional, finished document, ready to be sent to an employer.\n\n"
            "If the original resume lacks experience for a key skill, append a final section starting EXACTLY with '---PROMPT_FOR_USER---' to ask the user for that information."
        )
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
            response.raise_for_status()
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        logger.error(f"Error customizing resume: {str(e)}")
        raise


async def generate_resume_from_scratch(data: dict, job_description: str, keywords: list[str]) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key not configured")
    try:
        user_details = "\n".join([f"{key.replace('_', ' ').title()}: {value}" for key, value in data.items()])
        prompt = (
            "You are a professional resume writer. Create a complete, professional resume in a standard format using the following details. "
            "The resume must be expertly tailored to the provided job description, highlighting the specified keywords.\n\n"
            f"### Job Description:\n{job_description}\n\n"
            f"### Keywords to Emphasize:\n{', '.join(keywords)}\n\n"
            f"### User Provided Details:\n{user_details}\n\n"
            "---"
            "INSTRUCTIONS: Generate a complete resume formatted with markdown for bolding headers (e.g., **Summary**). "
            "Strictly generate only the resume content. Do NOT include any explanations or commentary."
        )
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
            response.raise_for_status()
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        logger.error(f"Error generating resume from scratch: {str(e)}")
        raise

async def calculate_ats_score(resume_text: str, job_description: str):
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key not configured")
    try:
        prompt = (
            "Act as an advanced Applicant Tracking System (ATS). Analyze the resume against the job description. "
            "Provide a suitability score from 1 to 10. Also, list key matching skills and key missing skills. "
            "Return ONLY a JSON object with keys: 'score', 'matching_skills', 'missing_skills'.\n\n"
            f"--- RESUME ---\n{resume_text}\n\n"
            f"--- JOB DESCRIPTION ---\n{job_description}"
        )
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
            response.raise_for_status()
            text_response = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean_json_str = text_response.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_json_str)
    except Exception as e:
        logger.error(f"Error in ATS score calculation: {str(e)}")
        raise

async def extract_skills_from_resume(resume_text: str):
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini API key not configured")
    try:
        prompt = (
            "Analyze the resume text and extract all technical and soft skills. "
            "Return ONLY a JSON object with two keys: 'technical_skills' and 'soft_skills', each holding an array of strings.\n\n"
            f"--- RESUME ---\n{resume_text}"
        )
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
            response.raise_for_status()
            text_response = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            clean_json_str = text_response.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_json_str)
    except Exception as e:
        logger.error(f"Error in skill extraction: {str(e)}")
        raise