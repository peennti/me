
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message here..."
        disabled={isLoading}
        className="w-full bg-slate-800 border border-slate-600 rounded-full py-3 pl-5 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;
