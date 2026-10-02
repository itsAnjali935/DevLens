from typing import List

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[str]:
    """
    Split text into overlapping chunks deterministically.
    Avoids producing empty chunks.
    """
    if not text or not text.strip():
        return []
        
    text = text.strip()
    words = text.split()
    chunks = []
    
    if len(words) == 0:
        return []
        
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk = " ".join(chunk_words)
        if chunk.strip():
            chunks.append(chunk)
            
        i += (chunk_size - chunk_overlap)
        
        # Prevent infinite loop if chunk_overlap >= chunk_size
        if chunk_size - chunk_overlap <= 0:
            break
            
    return chunks
