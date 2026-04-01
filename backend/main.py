import os
from dotenv import load_dotenv
load_dotenv()

"""
Lex AI — FastAPI Backend Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("GROQ KEY:", os.getenv("GROQ_API_KEY"))

from routes.chat import router as chat_router
from routes.document import router as document_router
from routes.rights import router as rights_router
from routes.draft import router as draft_router
from routes.tracker import router as tracker_router
from routes.rescue import router as rescue_router

app = FastAPI(
    title="Lex AI",
    description="Voice-first legal assistant for Indian citizens",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat_router, prefix="/api")
app.include_router(document_router, prefix="/api")
app.include_router(rights_router, prefix="/api")
app.include_router(draft_router, prefix="/api")
app.include_router(tracker_router, prefix="/api")
app.include_router(rescue_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Lex AI Backend is running 🚀"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

