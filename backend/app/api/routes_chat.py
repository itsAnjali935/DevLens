from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag import generate_rag_answer
from app.config import settings

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
        
    try:
        answer, sources = generate_rag_answer(request.question, top_k=settings.top_k)
        
        return ChatResponse(
            answer=answer,
            sources=sources
        )
    except Exception as e:
        print(f"Error during chat: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
