"""
Rights Route — Know Your Rights engine endpoint.
"""

from fastapi import APIRouter, HTTPException
from models.case import RightsRequest, RightsResponse
from services.llm_service import chat_completion
from prompts.rights_engine import RIGHTS_ENGINE_PROMPT

router = APIRouter(tags=["Rights"])


@router.post("/rights", response_model=RightsResponse)
async def know_your_rights(req: RightsRequest):
    """
    Know Your Rights endpoint — answers legal rights questions
    with Indian law citations.
    """
    try:
        messages = [
            {"role": "system", "content": RIGHTS_ENGINE_PROMPT},
            {"role": "user", "content": req.question},
        ]
        answer = await chat_completion(messages, temperature=0.3, max_tokens=1024)
        return RightsResponse(answer=answer)

    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rights query failed: {str(e)}")
