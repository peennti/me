import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, MessageRole, TranslationStyle } from './types';
import { initializeChat, translateText } from './services/geminiService';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage] = useState<string>('th');

  useEffect(() => {
    try {
      const chatSession = initializeChat();
      setChat(chatSession);
    } catch (e) {
      console.error(e);
      setError('Failed to initialize the chat session. Please check your API key.');
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!chat || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      role: MessageRole.USER,
      content: messageText,
    };

    setMessages(prevMessages => [...prevMessages, userMessage, { role: MessageRole.MODEL, content: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: messageText });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkText,
          };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`Error generating response: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);
  
  const handleTranslateMessage = useCallback(async (messageIndex: number, style: TranslationStyle) => {
    const messageToTranslate = messages[messageIndex];
    if (!messageToTranslate || messageToTranslate.role !== MessageRole.MODEL) {
        return;
    }
    
    // Prevent re-translation or multiple translations at once
    if (messageToTranslate.translatingStyle || (messageToTranslate.translations && messageToTranslate.translations[style])) {
        return;
    }

    setMessages(prev => prev.map((msg, index) =>
        index === messageIndex ? { ...msg, translatingStyle: style } : msg
    ));
    setError(null);

    try {
        const translatedContent = await translateText(messageToTranslate.content, targetLanguage, style);
        setMessages(prev => prev.map((msg, index) => {
            if (index === messageIndex) {
                return {
                    ...msg,
                    translations: {
                        ...(msg.translations || {}),
                        [style]: translatedContent,
                    },
                    translatingStyle: null,
                };
            }
            return msg;
        }));
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        console.error(errorMessage);
        setError(`Translation failed: ${errorMessage}`);
        setMessages(prev => prev.map((msg, index) =>
            index === messageIndex ? { ...msg, translatingStyle: null } : msg
        ));
    }
  }, [messages, targetLanguage]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHistory messages={messages} isLoading={isLoading} onTranslate={handleTranslateMessage} />
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
          <ErrorDisplay error={error} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;