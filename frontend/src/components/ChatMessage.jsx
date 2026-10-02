import React from 'react';
import { User, Bot } from 'lucide-react';
import SourceList from './SourceList';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm dark:shadow-none transition-colors ${
          isUser 
            ? 'bg-gradient-to-br from-pink-400 to-rose-400 border-pink-300 dark:from-pink-500 dark:to-rose-500 dark:border-pink-400' 
            : 'bg-white border-pink-100 dark:bg-[#18181b] dark:border-white/10'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-pink-500 dark:text-pink-400" />}
        </div>
        
        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-sm transition-colors ${
            isUser 
              ? 'bg-gradient-to-br from-pink-500 to-rose-500 border border-pink-400 text-white rounded-br-sm shadow-pink-500/20 dark:from-pink-600 dark:to-rose-600 dark:border-pink-500 dark:shadow-none' 
              : 'bg-white border border-pink-100 text-slate-800 dark:bg-[#18181b] dark:border-white/10 dark:text-zinc-300 rounded-bl-sm w-full'
          }`}>
            
            {isUser ? (
              <div className="whitespace-pre-wrap text-[15px] font-medium">{message.content}</div>
            ) : (
              <div className="w-full">
                <div 
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(message.content) }}
                />
                
                {message.sources && message.sources.length > 0 && (
                  <SourceList sources={message.sources} />
                )}
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
};

// Extremely simple and naive markdown parser for MVP purposes.
// Real world would use ReactMarkdown or marked.
function formatMarkdownToHtml(text) {
  if (!text) return "";
  
  let html = text
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
    
  // Handle simple lists
  html = html.replace(/(?:^|\n)- (.*)/g, '<li>$1</li>');
  html = html.replace(/<\/li><li>/g, '</li><li>');
  if (html.includes('<li>')) {
    html = html.replace(/<li>.*<\/li>/s, '<ul>$&</ul>');
  }
    
  return `<p>${html}</p>`;
}

export default ChatMessage;
