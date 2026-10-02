import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const askQuestion = async (question) => {
  const response = await api.post('/api/chat/', { question });
  return response.data;
};
