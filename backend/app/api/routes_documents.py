import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

from app.models.schemas import DocumentUploadResponse
from app.services.document_loader import extract_text_from_file
from app.services.chunker import chunk_text
from app.services.vector_store import get_vector_store
from app.config import settings

router = APIRouter()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.txt', '.md', '.pdf']:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")
        
    try:
        # Save file temporarily to disk to allow PdfReader to work reliably
        temp_path = f"/tmp/{file.filename}"
        if os.name == 'nt':
            temp_path = f"{os.getenv('TEMP', '.')}\\{file.filename}"
            
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Extract text
        text = extract_text_from_file(temp_path, file.filename)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Extracted text is empty")
            
        # Chunk text
        chunks = chunk_text(text, chunk_size=settings.chunk_size, chunk_overlap=settings.chunk_overlap)
        
        # Add to vector store
        metadata = {"filename": file.filename}
        vector_store = get_vector_store()
        num_chunks = vector_store.add_chunks(chunks, metadata)
        
        return DocumentUploadResponse(
            filename=file.filename,
            chunks_created=num_chunks,
            status="success"
        )
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error during document upload: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
