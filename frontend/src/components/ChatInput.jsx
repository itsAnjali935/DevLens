import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [question, setQuestion] = useState('');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSend(question.trim());
      setQuestion('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end w-full bg-white dark:bg-[#18181b] border border-pink-200 dark:border-white/10 rounded-xl shadow-sm dark:shadow-inner focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200/50 dark:focus-within:border-pink-500/50 dark:focus-within:ring-1 dark:focus-within:ring-pink-500/30 transition-all p-2.5"
    >
      <textarea
        ref={textareaRef}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask a question about the documentation..."
        className="w-full max-h-[150px] bg-transparent border-0 resize-none focus:ring-0 px-3 py-2.5 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 outline-none text-[15px] leading-relaxed scrollbar-thin scrollbar-thumb-pink-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent transition-colors"
        rows="1"
      />
      
      <button
        type="submit"
        disabled={!question.trim() || disabled}
        className={`ml-3 p-2.5 rounded-lg flex-shrink-0 transition-all duration-200 ${
          question.trim() && !disabled
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 text-white hover:shadow-md hover:shadow-pink-500/20 dark:shadow-[0_0_15px_rgba(236,72,153,0.3)]'
            : 'bg-pink-50 text-pink-200 border border-pink-100 dark:bg-white/5 dark:text-zinc-600 dark:border-white/5 cursor-not-allowed'
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;
