import React from 'react';
import { BookOpen, FileText } from 'lucide-react';

const SourceList = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-pink-100 dark:border-white/10 transition-colors">
      <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center transition-colors">
        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
        Source Documents
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((source, idx) => (
          <div key={idx} className="bg-pink-50/50 dark:bg-[#09090b]/80 rounded-xl p-3 border border-pink-100 dark:border-white/5 hover:border-pink-200 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-inner">
            <div className="flex items-center text-slate-700 dark:text-zinc-300 font-semibold mb-2 truncate transition-colors">
              <FileText className="w-4 h-4 mr-2 text-pink-500 dark:text-pink-400 flex-shrink-0 transition-colors" />
              <span className="truncate text-[13px]" title={source.document}>{source.document}</span>
              <span className="ml-auto text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-white dark:bg-white/5 px-2 py-0.5 rounded-full border border-pink-100 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
                Chunk {source.chunk}
              </span>
            </div>
            <div className="text-[12px] text-slate-600 dark:text-zinc-400 line-clamp-2 italic leading-relaxed pl-6 border-l-2 border-pink-300/50 dark:border-pink-500/30 ml-[7px] transition-colors">
              "{source.preview}"
            </div>
            {source.score && (
              <div className="text-[10px] text-pink-500/80 dark:text-pink-400/80 mt-3 flex justify-end font-mono font-medium transition-colors">
                sim: {source.score.toFixed(3)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceList;
