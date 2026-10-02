import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex w-full mb-6 justify-start group">
      <div className="flex flex-row max-w-[85%] items-end gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-pink-50 dark:bg-[#18181b] border border-pink-100 dark:border-white/10 shadow-sm dark:shadow-none relative overflow-hidden transition-colors">
          <Loader2 className="w-4 h-4 text-pink-500 dark:text-pink-400 animate-spin absolute" />
        </div>
        <div className="flex flex-col items-start">
          <div className="px-5 py-3.5 rounded-2xl shadow-sm dark:shadow-none bg-white dark:bg-[#18181b] border border-pink-100 dark:border-white/10 text-slate-500 dark:text-zinc-400 rounded-bl-sm text-sm flex items-center gap-3 transition-colors">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
            <span className="font-medium">Retrieving context...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
