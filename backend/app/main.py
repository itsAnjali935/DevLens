from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

from app.api import routes_health, routes_documents, routes_chat

app = FastAPI(title="DevLens API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(routes_health.router, prefix="/health", tags=["Health"])
app.include_router(routes_documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(routes_chat.router, prefix="/api/chat", tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
