import os
from pypdf import PdfReader

def extract_text_from_file(file_path: str, filename: str) -> str:
    """
    Extract text from supported document types (.txt, .md, .pdf).
    """
    ext = os.path.splitext(filename)[1].lower()
    
    if ext in ['.txt', '.md']:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
            
    elif ext == '.pdf':
        text = ""
        reader = PdfReader(file_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
        
    else:
        raise ValueError(f"Unsupported file type: {ext}")
