from typing import List, Dict, Any, Tuple
from app.services.vector_store import get_vector_store
from app.services.llm import get_llm_service
from app.models.schemas import SourceChunk
from app.config import settings

def build_prompt(question: str, context_chunks: List[str]) -> str:
    context_text = "\n\n---\n\n".join(context_chunks)
    
    prompt = f"""You are an AI-powered developer documentation assistant called DevLens.
Your job is to answer questions based strictly on the provided documentation context.

Rules:
1. Use the supplied documentation context below to answer the question.
2. Do NOT invent information that is not supported by the context.
3. If the documentation does not contain enough information to answer the question, explicitly state that the available documentation is insufficient.
4. Answer the user's question directly and concisely.
5. Prefer precise technical explanations and include code snippets if they are in the context.

=== CONTEXT ===
{context_text}
=== END CONTEXT ===

Question: {question}
Answer:"""
    return prompt

def generate_rag_answer(question: str, top_k: int = 4) -> Tuple[str, List[SourceChunk]]:
    vector_store = get_vector_store()
    llm = get_llm_service()
    
    # 1. Retrieve
    results = vector_store.search(question, top_k=top_k)
    
    # Filter by minimum similarity threshold
    results = [(payload, score) for payload, score in results if score >= settings.min_similarity]
    
    if not results:
        return "I don't have enough documentation context to answer this question.", []
        
    # 2. Extract chunks and sources
    context_chunks = []
    sources = []
    seen_chunks = set()
    
    for payload, score in results:
        text = payload.get("text", "")
        if text:
            filename = payload.get("filename", "Unknown Document")
            chunk_idx = payload.get("chunk_index", 0)
            chunk_id = f"{filename}_{chunk_idx}"
            
            # Ensure chunks are unique
            if chunk_id in seen_chunks:
                continue
            seen_chunks.add(chunk_id)

            context_chunks.append(text)
            
            # create preview
            preview = text[:100] + "..." if len(text) > 100 else text
            
            sources.append(SourceChunk(
                document=filename,
                chunk=chunk_idx,
                score=score,
                preview=preview
            ))
            
    # 3. Prompt
    prompt = build_prompt(question, context_chunks)
    
    # 4. Generate Answer
    answer = llm.generate_answer(prompt)
    
    return answer, sources
