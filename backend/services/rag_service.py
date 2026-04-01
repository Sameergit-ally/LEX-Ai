"""
RAG Service — LangChain-based pipeline for document chunking + retrieval + LLM analysis.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter
from services.vector_store import add_document_chunks, query_document
from services.llm_service import chat_completion, chat_completion_json
from prompts.doc_analyzer import DOC_ANALYZER_PROMPT


# Text splitter config
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\n\n", "\n", ". ", " ", ""],
)


async def process_document(doc_id: str, raw_text: str) -> dict:
    """
    Full RAG pipeline:
    1. Split text into chunks
    2. Store chunks + embeddings in ChromaDB
    3. Query for risky clauses
    4. Send relevant chunks to Groq for analysis
    Returns analysis dict.
    """
    # 1. Split into chunks
    chunks = text_splitter.split_text(raw_text)

    if not chunks:
        return {
            "risk_level": "low",
            "risky_clauses": [],
            "plain_explanation": "No readable text found in the document.",
            "recommendations": ["Please upload a clearer document."],
        }

    # 2. Store in ChromaDB
    await add_document_chunks(doc_id, chunks)

    # 3. Query for risky / important clauses
    risky_chunks = await query_document(
        doc_id, "risky clauses penalties termination liability indemnity", n_results=5
    )

    # 4. Build context for LLM
    context = "\n\n---\n\n".join(risky_chunks) if risky_chunks else "\n\n".join(chunks[:5])

    messages = [
        {"role": "system", "content": DOC_ANALYZER_PROMPT},
        {
            "role": "user",
            "content": f"Analyze this legal document excerpt:\n\n{context}",
        },
    ]

    # 5. Get LLM analysis
    analysis = await chat_completion_json(messages)
    return analysis


async def query_document_rag(doc_id: str, question: str) -> dict:
    """
    RAG query: find relevant chunks and answer a specific question about a document.
    """
    # 1. Retrieve relevant chunks
    relevant_chunks = await query_document(doc_id, question, n_results=5)

    if not relevant_chunks:
        return {
            "answer": "No relevant information found. The document may not have been processed yet.",
            "relevant_chunks": [],
        }

    context = "\n\n---\n\n".join(relevant_chunks)

    messages = [
        {
            "role": "system",
            "content": "You are a legal document expert. Answer the user's question based ONLY on the provided document context. If the answer is not in the context, say so. Cite specific clauses when possible.",
        },
        {
            "role": "user",
            "content": f"Document context:\n{context}\n\nQuestion: {question}",
        },
    ]

    answer = await chat_completion(messages)
    return {"answer": answer, "relevant_chunks": relevant_chunks}
