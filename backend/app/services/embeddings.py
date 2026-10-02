from typing import List
from sentence_transformers import SentenceTransformer


class EmbeddingService:
    def __init__(self, model_name: str = "paraphrase-MiniLM-L3-v2"):
        self.model_name = model_name
        self.model = None

    def _get_model(self):
        """Load the model only when an embedding is actually needed."""
        if self.model is None:
            self.model = SentenceTransformer(self.model_name)
        return self.model

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single string of text."""
        vector = self._get_model().encode(text)
        return vector.tolist()

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        vectors = self._get_model().encode(texts)
        return vectors.tolist()


# Create the service without loading the model.
embedding_service = EmbeddingService()


def get_embedding_service() -> EmbeddingService:
    return embedding_service
