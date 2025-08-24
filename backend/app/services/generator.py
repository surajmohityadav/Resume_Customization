from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from loguru import logger

def generate_pdf(content: str, filename: str = "customized_resume.pdf") -> BytesIO:
    """
    Generate a PDF from the customized resume text.
    Args:
        content: The customized resume text.
        filename: Name of the output PDF file.
    Returns:
        BytesIO buffer containing the PDF.
    """
    try:
        # Create a BytesIO buffer to hold the PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Define styles for the PDF
        title_style = styles['Heading1']
        body_style = styles['BodyText']
        
        # Split content into lines for formatting
        elements = []
        lines = content.split('\n')
        
        # Add each line as a paragraph with appropriate styling
        for line in lines:
            if line.strip():
                if line.startswith('#'):  # Treat as heading
                    elements.append(Paragraph(line.lstrip('# ').strip(), title_style))
                else:
                    elements.append(Paragraph(line.strip(), body_style))
                elements.append(Spacer(1, 12))  # Add spacing between paragraphs
        
        # Build the PDF
        doc.build(elements)
        buffer.seek(0)
        logger.info(f"Generated PDF: {filename}")
        return buffer
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise