# DevLens

DevLens is an AI-powered developer documentation assistant. It allows developers to upload technical documentation, indexes it into a vector database, and uses Google Gemini via a Retrieval-Augmented Generation (RAG) pipeline to provide accurate answers with source citations.

**Live Demo:** [https://dev-lens-bc3jmeiii-anjali935kumari-8675.vercel.app/](https://dev-lens-bc3jmeiii-anjali935kumari-8675.vercel.app/)

**GitHub:** [https://github.com/itsAnjali935/DevLens](https://github.com/itsAnjali935/DevLens)

---

## Architecture Overview

```text
User
  ↓
React + Vite Frontend (Vercel)
  ↓
FastAPI Backend (Render)
  ↓
RAG Pipeline
  ├── FastEmbed
  ├── Qdrant Cloud
  └── Google Gemini
  ↓
Answer + Sources
```

## Technology Stack

- **Backend**: Python 3.12, FastAPI, Uvicorn, FastEmbed, Qdrant Client, Google GenAI SDK
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Vector DB**: Qdrant Cloud
- **Embeddings**: FastEmbed (`BAAI/bge-small-en-v1.5`)
- **LLM**: Google Gemini
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render

## Project Structure

- `backend/`: FastAPI application, RAG pipeline, and tests.
- `frontend/`: React/Vite web application.
- `data/`: Sample documents for testing.
- `docker-compose.yml`: Local Qdrant database configuration.

## Prerequisites

- Python 3.12
- Node.js & npm
- Google Gemini API Key
- Qdrant Cloud account

## Setup & Installation

### 1. Environment Variables

In the `backend/` directory, copy `.env.example` to `.env`:

```powershell
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your `GEMINI_API_KEY` and Qdrant Cloud credentials.

In the `frontend/` directory, copy `.env.example` to `.env`:

```powershell
cp frontend/.env.example frontend/.env
```

For local development, ensure:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production, the frontend uses:

```env
VITE_API_BASE_URL=https://devlens-x39l.onrender.com
```

### 2. Python Setup

Activate the virtual environment and start the backend:

```powershell
# Activate virtual environment (Windows)

.\.venv\Scripts\Activate.ps1

# Install dependencies

cd backend

pip install -r requirements.txt

# Start FastAPI server

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

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
4. The system will extract the text, chunk it, create embeddings using FastEmbed, and store them in Qdrant Cloud.

### How to ask a question

1. Once a document is uploaded, type a question in the chat input at the bottom.
2. Click the send icon.
3. DevLens will search the indexed documentation and provide a grounded answer with relevant sources.

### How RAG works in this project

1. **Ingestion**: Documents are split into chunks. Each chunk gets an embedding vector using FastEmbed (`BAAI/bge-small-en-v1.5`). These vectors and metadata are stored in Qdrant Cloud.
2. **Retrieval**: Your question is converted to an embedding. Qdrant is queried using cosine similarity to find the most relevant chunks.
3. **Generation**: The relevant chunks are appended to a prompt with instructions to generate an answer grounded in the retrieved documentation. This prompt is sent to Gemini to generate the answer.

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

## Deployment

### Frontend — Vercel

The React + Vite frontend is deployed on Vercel.

**Live Demo:**

[https://dev-lens-bc3jmeiii-anjali935kumari-8675.vercel.app/](https://dev-lens-bc3jmeiii-anjali935kumari-8675.vercel.app/)

### Backend — Render

The FastAPI backend is deployed on Render.

**Backend API:**

[https://devlens-x39l.onrender.com](https://devlens-x39l.onrender.com)

### Vector Database — Qdrant Cloud

Production document embeddings are stored in Qdrant Cloud.

## Common Troubleshooting Issues

- **Qdrant connection error**: Check that your Qdrant Cloud URL, API key, and collection name are correctly configured in `backend/.env`.
- **Gemini API Error**: Check that your `GEMINI_API_KEY` in `backend/.env` is valid and that your Gemini API quota is available.
- **Missing pypdf error**: Ensure all backend dependencies are installed in your activated virtual environment (`pip install -r backend/requirements.txt`).
- **Frontend can't connect to backend**: Ensure the backend is running on `localhost:8000` for local development and the frontend `.env` is configured with the correct `VITE_API_BASE_URL`.
- **Production frontend can't connect to backend**: Verify that `VITE_API_BASE_URL` is set to `https://devlens-x39l.onrender.com` in the Vercel project environment variables.