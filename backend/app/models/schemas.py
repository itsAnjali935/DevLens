from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    service: str

class DocumentUploadResponse(BaseModel):
    filename: str
    chunks_created: int
    status: str

class ChatRequest(BaseModel):
    question: str

class SourceChunk(BaseModel):
    document: str
    chunk: int
    score: float
    preview: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceChunk]
