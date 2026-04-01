"""
Pydantic schemas for document endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List, Any


class DocumentAnalysis(BaseModel):
    risk_level: str = "low"
    risky_clauses: List[str] = []
    plain_explanation: str = ""
    recommendations: List[str] = []


class DocumentUploadResponse(BaseModel):
    document_id: str
    file_name: str
    analysis: DocumentAnalysis
    message: str = "Document analyzed successfully"


class DocumentQueryRequest(BaseModel):
    document_id: str
    question: str
    user_id: Optional[str] = None


class DocumentQueryResponse(BaseModel):
    answer: str
    relevant_chunks: Optional[List[str]] = []
