import requests
import os

base_url = "http://127.0.0.1:8000"
file_path = r"c:\Users\SATIS\OneDrive\Desktop\DevLens\data\fastapi.txt"

print("1. Testing Upload Endpoint...")
with open(file_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(f"{base_url}/api/documents/upload", files=files)
    
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

print("\n2. Testing Chat Endpoint...")
chat_data = {"question": "What endpoint provides the interactive API documentation?"}
response = requests.post(f"{base_url}/api/chat/", json=chat_data)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
