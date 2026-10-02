import os
from google import genai
from google.genai import types
from app.config import settings

class LLMService:
    def __init__(self):
        # We assume GEMINI_API_KEY is either in env or explicitly passed
        # Ensure that google-genai is properly initialized.
        api_key = settings.gemini_api_key
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None
            
        self.model_name = settings.gemini_model

    def generate_answer(self, prompt: str) -> str:
        if not self.client:
            return "Error: Gemini API key is not configured."
            
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig()
            )
            return response.text
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return f"Error calling Gemini API: {str(e)}"

llm_service = LLMService()

def get_llm_service() -> LLMService:
    return llm_service
