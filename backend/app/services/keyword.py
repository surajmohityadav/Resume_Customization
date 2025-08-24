import spacy
from loguru import logger

nlp = spacy.load("en_core_web_sm")

def extract_keywords(job_description: str) -> list[str]:
    try:
        doc = nlp(job_description)
        # Use NOUN and ADJ tokens for basic keyword extraction
        keywords = [token.text for token in doc if token.pos_ in ["NOUN", "ADJ"]]
        unique_keywords = list(set(keywords))
        logger.info(f"Extracted {len(unique_keywords)} keywords from job description")
        return unique_keywords
    except Exception as e:
        logger.error(f"Error extracting keywords: {str(e)}")
        raise