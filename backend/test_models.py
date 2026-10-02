import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No GEMINI_API_KEY found.")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
    print("Fetching models...")
    models = client.models.list()
    working_models = []
    
    for m in models:
        model_name = m.name
        # Only interested in models that support generateContent
        if 'generateContent' not in m.supported_actions:
            continue
            
        print(f"Testing {model_name}...")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Hello, reply with just 'OK'"
            )
            print(f"SUCCESS {model_name}: {response.text.strip()}")
            working_models.append(model_name)
        except Exception as e:
            print(f"FAILED {model_name}: {e}")
            
    print("\nWorking models:")
    for wm in working_models:
        print(wm)
except Exception as e:
    print(f"Error: {e}")
