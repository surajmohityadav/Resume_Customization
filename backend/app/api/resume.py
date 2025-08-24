from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.services.extractor import extract_text
from app.services.keyword import extract_keywords
from app.services.llm import (
    customize_resume, 
    generate_resume_from_scratch,
    calculate_ats_score,
    extract_skills_from_resume
)
from app.services.generator import generate_pdf_from_html
from app.models.resume import ResumeOutput
from app.models.db_models import Resume
from app.utils.db import get_db
from loguru import logger

router = APIRouter()

@router.post("/upload-and-customize", response_model=ResumeOutput)
async def upload_and_customize(
    file: UploadFile = File(...), 
    job_description: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        resume_text = await extract_text(file)
        keywords = extract_keywords(job_description)
        customized_content = await customize_resume(resume_text, job_description, keywords)
        
        resume = Resume(base_content=resume_text, customized_content=customized_content, job_description=job_description)
        db.add(resume)
        db.commit()
        db.refresh(resume)

        return ResumeOutput(id=resume.id, customized_content=customized_content)
    except Exception as e:
        logger.error(f"API error in upload_and_customize: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/build-from-scratch", response_model=ResumeOutput)
async def build_from_scratch(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        job_description = data.get("job_description")
        user_details = data.get("user_details")
        if not job_description or not user_details:
            raise HTTPException(status_code=400, detail="Job description and user details are required.")
        
        keywords = extract_keywords(job_description)
        customized_content = await generate_resume_from_scratch(user_details, job_description, keywords)
        
        resume = Resume(base_content=str(user_details), customized_content=customized_content, job_description=job_description)
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return ResumeOutput(id=resume.id, customized_content=customized_content)
    except Exception as e:
        logger.error(f"API error in build-from-scratch: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ... (imports)

@router.post("/download-pdf")
async def download_pdf(request: Request):
    try:
        data = await request.json()
        html_content = data.get("html_content")
        font_family = data.get("font_family", "Helvetica")
        if not html_content:
            raise HTTPException(status_code=400, detail="No HTML content provided.")
        
        # Call the simplified generator function
        pdf_buffer = generate_pdf_from_html(html_content, font_family)
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=Customized_Resume.pdf"}
        )
    except Exception as e:
        logger.error(f"Error in download_pdf endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- The rest of the endpoints in this file are correct and do not need changes. ---

@router.post("/calculate-ats-score")
async def get_ats_score(request: Request):
    try:
        data = await request.json()
        resume_text = data.get("resume_text")
        job_description = data.get("job_description")
        if not resume_text or not job_description:
            raise HTTPException(status_code=400, detail="Resume and job description are required.")
        
        score_data = await calculate_ats_score(resume_text, job_description)
        return score_data
    except Exception as e:
        logger.error(f"API error in get_ats_score: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-skills")
async def extract_skills(request: Request):
    try:
        data = await request.json()
        resume_text = data.get("resume_text")
        if not resume_text:
            raise HTTPException(status_code=400, detail="Resume text is required.")
        
        skills_data = await extract_skills_from_resume(resume_text)
        return skills_data
    except Exception as e:
        logger.error(f"API error in extract_skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/extract-text")
async def extract_text_from_file(file: UploadFile = File(...)):
    """Extracts raw text from an uploaded PDF or DOCX file."""
    try:
        if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")
        
        resume_text = await extract_text(file)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")
            
        return {"original_text": resume_text}
    except Exception as e:
        logger.error(f"API error in extract-text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))