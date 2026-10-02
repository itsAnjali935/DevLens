from typing import List, Dict, Any, Tuple
import uuid
from qdrant_client import QdrantClient
from qdrant_client.http import models

from app.config import settings
from app.services.embeddings import get_embedding_service

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key if settings.qdrant_api_key else None
        )
        self.collection_name = settings.qdrant_collection
        self.embedding_service = get_embedding_service()
        self._ensure_collection_exists()
        self._ensure_filename_index()

    def _ensure_collection_exists(self):
        try:
            collections = self.client.get_collections().collections
            if not any(c.name == self.collection_name for c in collections):
                # all-MiniLM-L6-v2 has dimension 384
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=384,
                        distance=models.Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Error checking/creating Qdrant collection: {e}")
            
    def _ensure_filename_index(self):
        try:
            self.client.create_payload_index(
                collection_name=self.collection_name,
                field_name="filename",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
        except Exception as e:
            print(f"Error creating filename index: {e}")

    def add_chunks(self, chunks: List[str], metadata: Dict[str, Any]) -> int:
        if not chunks:
            return 0
            
        filename = metadata.get("filename")
        if filename:
            try:
                self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="filename",
                                match=models.MatchValue(value=filename)
                            )
                        ]
                    )
                )
            except Exception as e:
                print(f"Error deleting old chunks for {filename}: {e}")
                
        embeddings = self.embedding_service.get_embeddings(chunks)
        
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point_id = str(uuid.uuid4())
            
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = i
            chunk_metadata["text"] = chunk
            
            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload=chunk_metadata
                )
            )
            
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        return len(chunks)

    def search(self, query: str, top_k: int = 4) -> List[Tuple[Dict[str, Any], float]]:
        query_vector = self.embedding_service.get_embedding(query)

        try:
            results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=top_k,
                with_payload=True
            ).points

            return [(result.payload, result.score) for result in results]

        except Exception as e:
            print(f"Error searching Qdrant: {e}")
            return []

vector_store = VectorStore()

def get_vector_store() -> VectorStore:
    return vector_store
