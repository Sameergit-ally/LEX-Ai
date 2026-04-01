"""
Vector Store — ChromaDB operations with sentence-transformers embeddings.
"""

import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

# Persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)

# Local embedding model (free, fast, ~80MB download on first run)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def get_or_create_collection(doc_id: str):
    """Get or create a ChromaDB collection for a specific document."""
    safe_name = f"doc_{doc_id.replace('-', '_')}"
    return chroma_client.get_or_create_collection(
        name=safe_name,
        metadata={"hnsw:space": "cosine"},
    )


async def add_document_chunks(doc_id: str, chunks: list[str]) -> int:
    """
    Embed and store document chunks in ChromaDB.
    Returns count of chunks stored.
    """
    if not chunks:
        return 0

    collection = get_or_create_collection(doc_id)
    embeddings = embedding_model.encode(chunks).tolist()
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
    )
    return len(chunks)


async def query_document(doc_id: str, question: str, n_results: int = 5) -> list[str]:
    """
    Query ChromaDB for relevant chunks from a specific document.
    Returns list of matching text chunks.
    """
    collection = get_or_create_collection(doc_id)

    if collection.count() == 0:
        return []

    query_embedding = embedding_model.encode([question]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(n_results, collection.count()),
    )

    return results["documents"][0] if results["documents"] else []


async def delete_document(doc_id: str):
    """Delete a document's collection from ChromaDB."""
    safe_name = f"doc_{doc_id.replace('-', '_')}"
    try:
        chroma_client.delete_collection(name=safe_name)
    except Exception:
        pass  # Collection may not exist
