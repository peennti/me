
import React from 'react';
import { BotIcon } from './Icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4">
      <div className="flex-shrink-0">
         <BotIcon className="h-8 w-8 p-1.5 rounded-full bg-slate-600 text-slate-300" />
      </div>
      <div className="bg-slate-700 rounded-r-xl rounded-bl-xl p-3 px-4 shadow-md flex items-center space-x-1.5">
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
