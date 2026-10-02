import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../services/api';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setIsUploading(true);
    setStatus(null);
    try {
      const result = await uploadDocument(file);
      setStatus({ 
        type: 'success', 
        message: `Indexed "${result.filename}" (${result.chunks_created} chunks)` 
      });
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.detail || err.message || "Failed to upload document" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#18181b] rounded-2xl border border-pink-100 dark:border-white/10 shadow-xl shadow-pink-900/5 dark:shadow-none p-6 mb-8 group transition-all duration-300 hover:shadow-pink-900/10 hover:border-pink-200 dark:hover:border-white/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center transition-colors">
          <div className="bg-pink-100 dark:bg-pink-500/10 p-1.5 rounded border border-pink-200 dark:border-pink-500/20 mr-2.5 shadow-sm dark:shadow-none transition-colors">
            <File className="w-4 h-4 text-pink-500 dark:text-pink-400" />
          </div>
          Knowledge Base
        </h2>
      </div>
      
      <div 
        className={`relative border border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-pink-400 bg-pink-50 dark:border-pink-500/50 dark:bg-pink-500/10' 
            : 'border-pink-200 bg-pink-50/30 group-hover:border-pink-300 dark:border-white/10 dark:bg-[#09090b]/50 dark:group-hover:border-white/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept=".txt,.md,.pdf"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-3 rounded-full transition-colors duration-300 ${isUploading ? 'bg-pink-100 border border-pink-200 dark:bg-pink-500/10 dark:border-pink-500/20' : 'bg-white border border-pink-100 shadow-sm dark:bg-white/5 dark:border-white/5 dark:shadow-none'}`}>
            <Upload className={`w-6 h-6 transition-colors ${isUploading ? 'text-pink-500 dark:text-pink-400 animate-bounce' : 'text-pink-300 group-hover:text-pink-400 dark:text-zinc-500 dark:group-hover:text-zinc-400'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1 transition-colors">
              {isUploading ? 'Indexing document...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium transition-colors">
              Supports .txt, .md, .pdf
            </p>
          </div>
        </div>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-lg flex items-start text-sm border backdrop-blur-sm shadow-sm dark:shadow-none transition-colors ${
          status.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' 
            : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span className="font-medium">{status.message}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
