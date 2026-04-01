"""
Document Parser — extracts text from PDF and DOCX files.
"""

import fitz  # PyMuPDF
from docx import Document
import io


async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file given its bytes."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        return text.strip()
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {str(e)}")


async def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract all text from a DOCX file given its bytes."""
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        return text.strip()
    except Exception as e:
        raise RuntimeError(f"DOCX extraction failed: {str(e)}")


async def extract_text(file_bytes: bytes, filename: str) -> str:
    """Auto-detect file type and extract text."""
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return await extract_text_from_pdf(file_bytes)
    elif lower.endswith(".docx"):
        return await extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {filename}. Only PDF and DOCX are supported.")
