from typing import List
from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        # Load the model once to be reused
        self.model = SentenceTransformer(model_name)
        
    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single string of text."""
        # encode returns a numpy array, convert to list of floats for Qdrant
        vector = self.model.encode(text)
        return vector.tolist()
        
    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        vectors = self.model.encode(texts)
        return vectors.tolist()

# Global instance to avoid reloading the model on every request
embedding_service = EmbeddingService()

def get_embedding_service() -> EmbeddingService:
    return embedding_service
