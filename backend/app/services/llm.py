import os
import httpx
from dotenv import load_dotenv
from loguru import logger

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

async def customize_resume(resume_text: str, job_description: str, keywords: list[str]) -> str:
    if not GEMINI_API_KEY:
        logger.error("Gemini API key not set")
        raise RuntimeError("Gemini API key not configured")
    try:
        prompt = (
            "Rewrite the following resume to align with this job description, emphasizing these keywords: "
            f"{', '.join(keywords)}.\n"
            f"Job Description: {job_description}\n"
            f"Original Resume: {resume_text}\n"
            "Keep the structure intact and focus on summary and experience sections."
        )
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
            response.raise_for_status()
            data = response.json()
            # Validate response structure
            candidates = data.get("candidates")
            if not candidates or not isinstance(candidates, list):
                logger.error(f"Unexpected Gemini response: {data}")
                raise ValueError("Invalid response from Gemini API")
            content = candidates[0].get("content", {})
            parts = content.get("parts")
            if not parts or not isinstance(parts, list):
                logger.error(f"Unexpected Gemini response: {data}")
                raise ValueError("Invalid response from Gemini API")
            customized = parts[0].get("text", "")
            if not customized:
                raise ValueError("No content returned from Gemini API")
            logger.info("Resume customized successfully with Gemini")
            return customized
    except httpx.HTTPStatusError as e:
        logger.error(f"Gemini API HTTP error: {e.response.status_code} - {e.response.text}")
        raise
    except Exception as e:
        logger.error(f"Error customizing resume with Gemini: {str(e)}")
        raise