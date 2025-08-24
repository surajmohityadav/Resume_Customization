from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.services.extractor import extract_text
from app.services.keyword import extract_keywords
from app.services.llm import customize_resume
from app.services.generator import generate_pdf
from app.models.resume import ResumeInput, ResumeOutput
from app.models.db_models import Resume
from app.utils.db import get_db
from loguru import logger

router = APIRouter()

@router.post("/upload-and-customize", response_model=ResumeOutput)
async def upload_and_customize(file: UploadFile = File(...), input: ResumeInput = Depends(), db: Session = Depends(get_db)):
    try:
        # Validate file type
        if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
            logger.error(f"Unsupported file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")

        # Extract text from resume
        resume_text = await extract_text(file)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Empty resume content")

        # Extract keywords from job description
        keywords = extract_keywords(input.job_description)
        if not keywords:
            raise HTTPException(status_code=400, detail="No keywords extracted from job description")

        # Customize resume
        customized_content = await customize_resume(resume_text, input.job_description, keywords)

        # Save to database
        resume = Resume(base_content=resume_text, customized_content=customized_content, job_description=input.job_description)
        db.add(resume)
        db.commit()
        db.refresh(resume)

        logger.info(f"Resume uploaded and customized for job: {input.job_description[:30]}...")
        return ResumeOutput(id=resume.id, customized_content=customized_content)
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{resume_id}")
async def download_resume(resume_id: int, db: Session = Depends(get_db)):
    try:
        # Fetch resume from database
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        # Generate PDF
        pdf_buffer = generate_pdf(resume.customized_content, f"customized_resume_{resume_id}.pdf")
        
        logger.info(f"Resume {resume_id} downloaded")
        # Return PDF as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=customized_resume_{resume_id}.pdf"}
        )
    except Exception as e:
        logger.error(f"Error downloading resume {resume_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))