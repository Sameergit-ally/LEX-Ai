"""
Tracker Route — Court case tracker CRUD + AI next steps.
"""

from fastapi import APIRouter, HTTPException
from models.case import CaseCreateRequest, CaseResponse, CaseListResponse
from services.llm_service import chat_completion
from services.supabase_service import supabase

router = APIRouter(tags=["Case Tracker"])


@router.post("/case", response_model=CaseResponse)
async def create_case(req: CaseCreateRequest):
    """
    Add a new case to the tracker.
    AI generates next steps based on case type.
    """
    try:
        # Generate AI next steps
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a legal case advisor for Indian courts. "
                    "Given a case type and court, suggest 3-5 practical next steps "
                    "the litigant should take. Be specific and actionable. "
                    "Mention relevant procedures, timelines, and documents needed."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Case type: {req.case_type}\n"
                    f"Court: {req.court_name}\n"
                    f"Case number: {req.case_number}\n"
                    f"What should I do next?"
                ),
            },
        ]
        ai_next_steps = await chat_completion(messages, temperature=0.3)

        # Serialize hearing dates
        hearing_dates_data = [hd.model_dump() for hd in req.hearing_dates] if req.hearing_dates else []

        # Save to Supabase
        resp = supabase.table("cases").insert({
            "user_id": req.user_id,
            "case_number": req.case_number,
            "court_name": req.court_name,
            "case_type": req.case_type or "",
            "hearing_dates": hearing_dates_data,
            "ai_next_steps": ai_next_steps,
            "status": "active",
        }).execute()

        if not resp.data:
            raise HTTPException(status_code=500, detail="Failed to save case")

        case = resp.data[0]
        return CaseResponse(
            id=case["id"],
            case_number=case["case_number"],
            court_name=case["court_name"],
            case_type=case.get("case_type", ""),
            hearing_dates=case.get("hearing_dates", []),
            ai_next_steps=case.get("ai_next_steps", ""),
            status=case.get("status", "active"),
            created_at=case.get("created_at"),
        )

    except HTTPException:
        raise
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Case creation failed: {str(e)}")


@router.get("/case/{case_id}", response_model=CaseResponse)
async def get_case(case_id: str):
    """Get case details by ID."""
    try:
        resp = supabase.table("cases").select("*").eq("id", case_id).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Case not found")
        case = resp.data[0]
        return CaseResponse(
            id=case["id"],
            case_number=case["case_number"],
            court_name=case["court_name"],
            case_type=case.get("case_type", ""),
            hearing_dates=case.get("hearing_dates", []),
            ai_next_steps=case.get("ai_next_steps", ""),
            status=case.get("status", "active"),
            created_at=case.get("created_at"),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get case: {str(e)}")


@router.get("/case/user/{user_id}", response_model=CaseListResponse)
async def get_user_cases(user_id: str):
    """Get all cases for a specific user."""
    try:
        resp = (
            supabase.table("cases")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        cases = [
            CaseResponse(
                id=c["id"],
                case_number=c["case_number"],
                court_name=c["court_name"],
                case_type=c.get("case_type", ""),
                hearing_dates=c.get("hearing_dates", []),
                ai_next_steps=c.get("ai_next_steps", ""),
                status=c.get("status", "active"),
                created_at=c.get("created_at"),
            )
            for c in (resp.data or [])
        ]
        return CaseListResponse(cases=cases)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list cases: {str(e)}")
