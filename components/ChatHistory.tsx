import React, { useRef, useEffect } from 'react';
import { ChatMessage, TranslationStyle } from '../types';
import ChatMessageItem from './ChatMessageItem';
import TypingIndicator from './TypingIndicator';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onTranslate: (messageIndex: number, style: TranslationStyle) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, onTranslate }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showTypingIndicator = isLoading && messages.length > 0 && messages[messages.length - 1].content === '';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="max-w-4xl mx-auto w-full">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center text-slate-500 mt-8">
            <p className="text-lg">Welcome to Chat Anything!</p>
            <p>Type a message below to start the conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessageItem
              key={index}
              message={msg}
              onTranslate={(style) => onTranslate(index, style)}
            />
          ))
        )}
        {showTypingIndicator && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatHistory;