"""
Document Route — Upload, analyze, and RAG query legal documents.
"""

import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.document import DocumentUploadResponse, DocumentAnalysis, DocumentQueryRequest, DocumentQueryResponse
from services.doc_parser import extract_text
from services.rag_service import process_document, query_document_rag
from services.supabase_service import supabase

router = APIRouter(tags=["Documents"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/document/upload", response_model=DocumentUploadResponse)
async def upload_and_analyze(
    file: UploadFile = File(...),
    user_id: str = Form(...),
):
    """
    Upload a PDF/DOCX → extract text → RAG analysis → save to Supabase.
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        lower_name = file.filename.lower()
        if not (lower_name.endswith(".pdf") or lower_name.endswith(".docx")):
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

        # Read file bytes
        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

        # Generate document ID
        doc_id = str(uuid.uuid4())

        # Extract text
        raw_text = await extract_text(file_bytes, file.filename)
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file. It may be scanned/image-based.")

        # RAG analysis
        analysis_result = await process_document(doc_id, raw_text)
        analysis = DocumentAnalysis(**analysis_result) if isinstance(analysis_result, dict) and "risk_level" in analysis_result else DocumentAnalysis()

        # Save to Supabase
        supabase.table("documents").insert({
            "id": doc_id,
            "user_id": user_id,
            "file_name": file.filename,
            "extracted_text": raw_text[:5000],  # Store first 5000 chars
            "risk_level": analysis.risk_level,
            "analysis": analysis.model_dump(),
        }).execute()

        return DocumentUploadResponse(
            document_id=doc_id,
            file_name=file.filename,
            analysis=analysis,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")


@router.post("/document/query", response_model=DocumentQueryResponse)
async def query_document_endpoint(req: DocumentQueryRequest):
    """
    RAG query on an uploaded document — ask questions about a specific document.
    """
    try:
        result = await query_document_rag(req.document_id, req.question)
        return DocumentQueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document query failed: {str(e)}")
