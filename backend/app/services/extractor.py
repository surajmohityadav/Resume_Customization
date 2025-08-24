import pdfplumber
from docx import Document
from fastapi import UploadFile
from loguru import logger

async def extract_text(file: UploadFile) -> str:
    try:
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(file.file) as pdf:
                text = "".join(page.extract_text() or "" for page in pdf.pages)
        elif file.filename.endswith(".docx"):
            file.file.seek(0)  # Ensure pointer is at start
            doc = Document(file.file)
            text = "\n".join([para.text for para in doc.paragraphs])
        else:
            logger.error(f"Unsupported file format: {file.filename}")
            raise ValueError("Unsupported file format. Use PDF or DOCX.")
        logger.info(f"Extracted text from {file.filename}, length: {len(text)}")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from {file.filename}: {str(e)}")
        raise