from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_empty_question():
    response = client.post("/api/chat/", json={"question": ""})
    assert response.status_code == 400
    assert "cannot be empty" in response.json()["detail"]
    
def test_chat_missing_question():
    response = client.post("/api/chat/", json={})
    assert response.status_code == 422 # Pydantic validation error
    
def test_upload_invalid_file_type():
    # Mocking file upload
    files = {'file': ('test.jpg', b'fake image data', 'image/jpeg')}
    response = client.post("/api/documents/upload", files=files)
    
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]
