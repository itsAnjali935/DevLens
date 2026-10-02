from app.services.chunker import chunk_text

def test_chunk_text_empty():
    assert chunk_text("") == []
    assert chunk_text("   ") == []

def test_chunk_text_basic():
    # 10 words
    text = "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10"
    
    # Chunk size 5, overlap 2
    chunks = chunk_text(text, chunk_size=5, chunk_overlap=2)
    
    assert len(chunks) == 4
    assert chunks[0] == "word1 word2 word3 word4 word5"
    # Overlap is 2, so it should start at index 3 (word4)
    assert chunks[1] == "word4 word5 word6 word7 word8"
    assert chunks[2] == "word7 word8 word9 word10"
    assert chunks[3] == "word10"

def test_chunk_text_no_overlap():
    text = "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10"
    chunks = chunk_text(text, chunk_size=5, chunk_overlap=0)
    
    assert len(chunks) == 2
    assert chunks[0] == "word1 word2 word3 word4 word5"
    assert chunks[1] == "word6 word7 word8 word9 word10"
