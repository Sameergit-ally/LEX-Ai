import os
from dotenv import load_dotenv
load_dotenv()

import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.llm_service import chat_completion_json

router = APIRouter(tags=["Case Rescue"])

class RescueRequest(BaseModel):
    user_id: str
    problem_description: str
    case_category: Optional[str] = None

SYSTEM_PROMPT = """You are an expert Indian legal advisor with 20 years of experience.
A person has come to you in distress with a legal problem.

Your job:
1. Analyze their problem deeply
2. Identify ALL relevant Indian laws:
   - Constitution of India articles
   - IPC sections  
   - CrPC provisions
   - Any specific Acts (Consumer Protection Act, RTI Act, 
     IT Act, Domestic Violence Act, etc.)
3. Build a practical step-by-step rescue plan

STRICT RULES:
- Be specific to THEIR situation, not generic advice
- Cite exact Article/Section numbers always
- Steps must be actionable — not vague
- Include realistic time estimates
- Mention free legal aid options
- Flag urgent actions first if severity is HIGH
- Never make up laws — only cite real Indian laws
- End every plan with: Consult a licensed advocate 
  for final legal advice

Return ONLY valid JSON matching this exact structure:
{
  "severity": "HIGH or MEDIUM or LOW",
  "case_type": "Short category name",
  "urgent_actions": [{"action": "...", "time_estimate": "..."}],
  "rescue_plan": [{"step": "...", "action": "...", "time_estimate": "..."}],
  "free_legal_aid_options": ["..."],
  "final_advice": "Consult a licensed advocate for final legal advice"
}

No markdown, no extra text, pure JSON only."""

@router.post("/rescue/generate")
async def generate_rescue_plan(req: RescueRequest):
    try:
        user_message_content = f"Problem Description: {req.problem_description}"
        if req.case_category:
            user_message_content += f"\nCase Category: {req.case_category}"
            
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message_content}
        ]
        
        # Call the LLM service to get the JSON response
        response_json = await chat_completion_json(messages)
        
        # Ensure it's returned as dict. Valid JSON string or dict depending on `chat_completion_json` output
        if isinstance(response_json, str):
            try:
                response_json = json.loads(response_json)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail="LLM returned invalid JSON format")
                
        return response_json
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
