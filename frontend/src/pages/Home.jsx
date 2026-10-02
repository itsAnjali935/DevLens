import React, { useState, useRef, useEffect } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import { askQuestion } from '../services/api';
import { BookOpen, Moon, Sun } from 'lucide-react';

const Home = () => {
  const [theme, setTheme] = useState('light');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am DevLens, your documentation assistant. Upload some documentation above, and ask me any questions about it.',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (question) => {
    // Add user question to UI
    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      const response = await askQuestion(question);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage = {
        role: 'assistant',
        content: "I encountered an error trying to answer that question. " + 
                 (error.response?.data?.detail || "Please make sure the backend is running and API keys are set.")
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7fa] dark:bg-[#09090b] text-[#4a1f33] dark:text-zinc-300 font-sans flex flex-col items-center selection:bg-pink-300/40 dark:selection:bg-pink-500/30 transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="w-full border-b border-pink-100 dark:border-white/10 bg-[#fff7fa]/90 dark:bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-pink-100 dark:bg-pink-500/10 p-1.5 rounded-md border border-pink-200 dark:border-pink-500/20 shadow-sm transition-colors duration-300">
              <BookOpen className="w-5 h-5 text-pink-500 dark:text-pink-400" />
            </div>
            <span className="font-bold text-slate-800 dark:text-zinc-100 tracking-tight transition-colors duration-300">DevLens</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-white dark:bg-zinc-900 border border-pink-100 dark:border-white/10 shadow-sm text-slate-500 dark:text-zinc-400 hover:bg-pink-50 dark:hover:bg-zinc-800 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-full border border-pink-100 dark:border-white/10 shadow-sm transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">API Connected</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full max-w-3xl px-6 pt-14 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight mb-4 transition-colors duration-300">
          Ask your documentation.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-400 dark:to-rose-300">Get grounded answers.</span>
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium transition-colors duration-300">
          Upload technical specifications, readmes, and guides. Instantly query your knowledge base using state-of-the-art AI.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl px-6 flex flex-col flex-grow pb-12">
        
        <DocumentUpload />

        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-white dark:bg-[#18181b] rounded-2xl border border-pink-100 dark:border-white/10 shadow-xl overflow-hidden min-h-[600px] mt-4 relative shadow-pink-900/5 dark:shadow-black/50 transition-colors duration-300">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-pink-50 dark:border-white/5 bg-pink-50/50 dark:bg-transparent flex items-center justify-between transition-colors duration-300">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Session</h3>
            <span className="text-xs text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-500/10 px-2 py-1 rounded-md font-medium border border-pink-200 dark:border-pink-500/20 transition-colors duration-300">Gemini Flash Latest</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-pink-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white dark:bg-[#18181b] border-t border-pink-100 dark:border-white/10 transition-colors duration-300">
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
          
        </div>
        
      </main>
      
    </div>
  );
};

export default Home;
