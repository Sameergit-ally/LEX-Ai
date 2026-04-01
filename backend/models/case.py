"""
Pydantic schemas for case tracker endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List, Any


class HearingDate(BaseModel):
    date: str
    description: Optional[str] = ""
    completed: bool = False


class CaseCreateRequest(BaseModel):
    user_id: str
    case_number: str
    court_name: str
    case_type: Optional[str] = ""
    hearing_dates: Optional[List[HearingDate]] = []


class CaseResponse(BaseModel):
    id: str
    case_number: str
    court_name: str
    case_type: str
    hearing_dates: Any = []
    ai_next_steps: Optional[str] = ""
    status: str = "active"
    created_at: Optional[str] = None


class CaseListResponse(BaseModel):
    cases: List[CaseResponse]


class DraftRequest(BaseModel):
    user_id: str
    draft_type: str
    details: dict


class DraftResponse(BaseModel):
    draft_id: str
    draft_type: str
    content: str
    message: str = "Draft generated successfully"


class RightsRequest(BaseModel):
    question: str
    language: Optional[str] = "auto"


class RightsResponse(BaseModel):
    answer: str
