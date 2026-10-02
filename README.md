# DevLens

DevLens is an AI-powered developer documentation assistant. It allows developers to upload technical documentation, indexes it into a vector database, and uses Google Gemini via a Retrieval-Augmented Generation (RAG) pipeline to provide accurate answers with source citations.

## Architecture Overview

User
 ↓
React Frontend
 ↓
FastAPI
 ↓
RAG Pipeline
 ├── Sentence Transformers
 ├── Qdrant
 └── Gemini
 ↓
Answer + Sources

## Technology Stack

- **Backend**: Python 3.12, FastAPI, Uvicorn, SentenceTransformers, Qdrant Client, Google GenAI SDK
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Vector DB**: Qdrant (via Docker)
- **Embeddings**: Sentence Transformers (`all-MiniLM-L6-v2`)
- **LLM**: Google Gemini

## Project Structure

- `backend/`: FastAPI application, RAG pipeline, and tests.
- `frontend/`: React/Vite web application.
- `data/`: Sample documents for testing.
- `docker-compose.yml`: Qdrant database configuration.

## Prerequisites

- Python 3.12
- Node.js & npm
- Docker (for Qdrant)
- Google Gemini API Key

## Setup & Installation

### 1. Vector Database (Qdrant)
Start Qdrant using the provided `docker-compose.yml`:
```powershell
docker-compose up -d
```

### 2. Environment Variables
In the `backend/` directory, copy `.env.example` to `.env`:
```powershell
cp backend/.env.example backend/.env
```
Edit `backend/.env` and add your `GEMINI_API_KEY`.

In the `frontend/` directory, copy `.env.example` to `.env`:
```powershell
cp frontend/.env.example frontend/.env
```
Ensure `VITE_API_BASE_URL` points to your backend (default is `http://localhost:8000`).

### 3. Python Setup
Activate the virtual environment and start the backend:
```powershell
# Activate virtual environment (Windows)
.\.venv\Scripts\Activate.ps1

# Install dependencies (if not already done)
cd backend
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
In a new terminal window, start the frontend:
```powershell
cd frontend
npm install
npm run dev
```

## Usage

### How to upload a document
1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Drag and drop a `.txt`, `.md`, or `.pdf` file into the upload area or click to select a file.
3. Click "Upload Document".
4. The system will extract the text, chunk it, create embeddings, and store them in Qdrant.

### How to ask a question
1. Once a document is uploaded, type a question in the chat input at the bottom.
2. Click the send icon.
3. DevLens will search the indexed documentation and provide a grounded answer.

### How RAG works in this project
1. **Ingestion**: Documents are split into chunks. Each chunk gets an embedding vector via Sentence Transformers. These vectors and metadata are stored in Qdrant.
2. **Retrieval**: Your question is converted to an embedding. Qdrant is queried using cosine similarity to find the most relevant chunks.
3. **Generation**: The relevant chunks are appended to a prompt with strict instructions not to invent facts. This prompt is sent to Gemini to generate the answer.

### How citations/sources work
The retrieved chunks from Qdrant contain metadata (filename, chunk index, text). This metadata is returned by the backend alongside Gemini's answer and is displayed in the frontend as source cards.

## Running Tests

To run the backend test suite, use the following commands from the project root:
```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1
cd backend

# Run pytest
$env:PYTHONPATH="."
pytest
```

## Common Troubleshooting Issues

- **Qdrant connection refused**: Ensure Docker is running and you executed `docker-compose up -d`.
- **Gemini API Error**: Check that your `GEMINI_API_KEY` in `backend/.env` is valid.
- **Missing pypdf error**: Ensure all backend dependencies are installed in your activated virtual environment (`pip install -r backend/requirements.txt`).
- **Frontend can't connect to backend**: Ensure the backend is running on `localhost:8000` and the frontend `.env` is configured correctly.
