from io import BytesIO
from xhtml2pdf import pisa
from loguru import logger

# This function now ONLY generates the final, clean resume.
def generate_pdf_from_html(html_content: str, font_family: str = 'Helvetica') -> BytesIO:
    try:
        buffer = BytesIO()
        css = f"""
        @page {{
            size: a4 portrait;
            margin: 1.5cm;
        }}
        body {{
            font-family: '{font_family}', 'Arial', sans-serif;
            font-size: 10.5pt;
            color: #333;
            line-height: 1.4;
        }}
        h1 {{ font-size: 24pt; text-align: center; margin: 0; padding: 0; font-weight: 600; }}
        p#contact {{ text-align: center; font-size: 9.5pt; margin-top: 5px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }}
        h2 {{ font-size: 13pt; color: #222; margin-top: 18px; margin-bottom: 5px; border-bottom: 1.5px solid #444; padding-bottom: 3px; text-transform: uppercase; }}
        ul {{ padding-left: 20px; list-style-type: disc; }}
        li {{ margin-bottom: 6px; }}
        """
        full_html = f"<html><head><style>{css}</style></head><body>{html_content}</body></html>"
        
        pisa_status = pisa.CreatePDF(src=BytesIO(full_html.encode("UTF-8")), dest=buffer)
        if pisa_status.err:
            raise Exception(f"PDF generation error: {pisa_status.err}")
            
        buffer.seek(0)
        logger.info(f"Generated final resume PDF with font {font_family} successfully.")
        return buffer
    except Exception as e:
        logger.error(f"Error generating PDF from HTML: {str(e)}")
        raise