"""
Pydantic schemas for chat endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    user_id: str
    message: str
    language: Optional[str] = "auto"


class ChatMessage(BaseModel):
    role: str
    message: str
    created_at: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    chat_history: Optional[List[ChatMessage]] = []
