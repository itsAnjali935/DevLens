from typing import List
from fastembed import TextEmbedding


class EmbeddingService:
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model_name = model_name
        self.model = TextEmbedding(model_name=model_name)

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single string of text."""
        vector = list(self.model.embed([text]))[0]
        return vector.tolist()

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        vectors = self.model.embed(texts)
        return [vector.tolist() for vector in vectors]


# Global instance
embedding_service = EmbeddingService()


def get_embedding_service() -> EmbeddingService:
    return embedding_service