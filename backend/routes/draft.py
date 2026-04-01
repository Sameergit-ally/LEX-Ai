"""
Draft Route — Auto legal draft generator + PDF download.
"""

import uuid
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.case import DraftRequest, DraftResponse
from services.llm_service import chat_completion
from services.supabase_service import supabase
from prompts.draft_generator import DRAFT_GENERATOR_PROMPT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY

router = APIRouter(tags=["Drafts"])


@router.post("/draft", response_model=DraftResponse)
async def generate_draft(req: DraftRequest):
    """
    Generate a legal draft using Groq LLM.
    Saves to Supabase drafts table.
    """
    try:
        # Format the prompt with draft type
        system_prompt = DRAFT_GENERATOR_PROMPT.format(draft_type=req.draft_type)

        # Build details string
        details_str = "\n".join([f"- {k}: {v}" for k, v in req.details.items()])

        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Generate a {req.draft_type} with these details:\n{details_str}",
            },
        ]

        content = await chat_completion(messages, temperature=0.3, max_tokens=2048)

        # Generate ID and save to Supabase
        draft_id = str(uuid.uuid4())
        supabase.table("drafts").insert({
            "id": draft_id,
            "user_id": req.user_id,
            "draft_type": req.draft_type,
            "content": content,
        }).execute()

        return DraftResponse(
            draft_id=draft_id,
            draft_type=req.draft_type,
            content=content,
        )

    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Draft generation failed: {str(e)}")


@router.get("/draft/download/{draft_id}")
async def download_draft_pdf(draft_id: str):
    """
    Download a generated draft as a PDF file.
    """
    try:
        # Fetch draft from Supabase
        resp = supabase.table("drafts").select("*").eq("id", draft_id).execute()

        if not resp.data:
            raise HTTPException(status_code=404, detail="Draft not found")

        draft = resp.data[0]

        # Generate PDF using reportlab
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
        )

        styles = getSampleStyleSheet()
        body_style = ParagraphStyle(
            "BodyJustified",
            parent=styles["Normal"],
            alignment=TA_JUSTIFY,
            fontSize=11,
            leading=16,
            spaceAfter=8,
        )
        title_style = ParagraphStyle(
            "DraftTitle",
            parent=styles["Heading1"],
            fontSize=16,
            spaceAfter=20,
        )

        story = []
        story.append(Paragraph(f"Lex AI — {draft['draft_type']}", title_style))
        story.append(Spacer(1, 0.3 * inch))

        # Split content into paragraphs
        for para in draft["content"].split("\n"):
            if para.strip():
                # Escape special XML characters for reportlab
                safe = para.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                story.append(Paragraph(safe, body_style))

        doc.build(story)
        buffer.seek(0)

        filename = f"Lex_AI_{draft['draft_type'].replace(' ', '_')}.pdf"
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF download failed: {str(e)}")
