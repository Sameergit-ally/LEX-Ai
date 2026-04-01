"""
Chat Route — Voice/text legal consultation endpoint.
"""

from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse, ChatMessage
from services.llm_service import chat_completion
from services.supabase_service import supabase
from prompts.legal_consultant import LEGAL_CONSULTANT_PROMPT

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def legal_chat(req: ChatRequest):
    """
    Legal consultation endpoint.
    - Loads chat history from Supabase for context
    - Sends to Groq with legal system prompt
    - Saves both user message and AI reply to Supabase
    """
    try:
        # 1. Load recent chat history from Supabase
        history_resp = (
            supabase.table("chats")
            .select("role, message, created_at")
            .eq("user_id", req.user_id)
            .order("created_at", desc=False)
            .limit(20)
            .execute()
        )
        history = history_resp.data if history_resp.data else []

        # 2. Build messages for LLM
        messages = [{"role": "system", "content": LEGAL_CONSULTANT_PROMPT}]
        for h in history:
            messages.append({
                "role": h["role"],
                "content": h["message"],
            })
        messages.append({"role": "user", "content": req.message})

        # 3. Get LLM response
        reply = await chat_completion(messages)

        # 4. Save user message to Supabase
        supabase.table("chats").insert({
            "user_id": req.user_id,
            "role": "user",
            "message": req.message,
        }).execute()

        # 5. Save assistant reply to Supabase
        supabase.table("chats").insert({
            "user_id": req.user_id,
            "role": "assistant",
            "message": reply,
        }).execute()

        # 6. Return response
        chat_history = [
            ChatMessage(role=h["role"], message=h["message"], created_at=h.get("created_at"))
            for h in history
        ]

        return ChatResponse(reply=reply, chat_history=chat_history)

    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
