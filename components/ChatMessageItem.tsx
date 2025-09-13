import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole, TranslationStyle } from '../types';
import { BotIcon, UserIcon, TranslateIcon, SpinnerIcon } from './Icons';

interface ChatMessageItemProps {
  message: ChatMessage;
  onTranslate: (style: TranslationStyle) => void;
}

const TRANSLATION_STYLES: { id: TranslationStyle; label: string }[] = [
    { id: 'news_summary', label: '🎯 Fun News' },
    { id: 'witty_expert', label: '🍳 Witty Expert' },
    { id: 'formal', label: '💼 Formal' },
    { id: 'detailed_explanation', label: '📖 Detailed Explanation' },
    { id: 'friendly_chat', label: '👋 Friendly Chat' },
];

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onTranslate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === MessageRole.USER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerClasses = isUser ? 'flex items-start gap-3 justify-end' : 'flex items-start gap-3';
  const bubbleClasses = isUser ? 'bg-cyan-600 text-white rounded-l-xl rounded-br-xl' : 'bg-slate-700 text-slate-200 rounded-r-xl rounded-bl-xl';
  const Avatar = isUser ? UserIcon : BotIcon;
  const avatarOrder = isUser ? 'order-2' : 'order-1';

  const formatContent = (content: string) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        return (
          <pre key={index} className="bg-slate-800/70 rounded-md p-3 my-2 overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        );
      }
      return part.split('\n').map((line, i) => <span key={`${index}-${i}`}>{line}<br/></span>);
    });
  };

  const handleTranslateClick = (style: TranslationStyle) => {
    onTranslate(style);
    setIsMenuOpen(false);
  }

  const hasTranslations = message.translations && Object.keys(message.translations).length > 0;

  return (
    <div className={`${containerClasses} my-4`}>
      <div className={`${avatarOrder} flex-shrink-0`}>
        <Avatar className="h-8 w-8 p-1.5 rounded-full bg-slate-600 text-slate-300" />
      </div>
      <div className={`order-1 max-w-xl p-3 px-4 shadow-md ${bubbleClasses}`}>
        <div className="whitespace-pre-wrap">{formatContent(message.content)}</div>
        
        {hasTranslations && (
            <div className="mt-3 pt-3 border-t border-slate-600/50 text-slate-300 space-y-3">
                {Object.entries(message.translations ?? {}).map(([style, content]) => {
                    const styleLabel = TRANSLATION_STYLES.find(s => s.id === style)?.label || style;
                    return content && (
                        <div key={style}>
                            <p className="text-xs font-bold uppercase text-cyan-400/80 tracking-wider">{styleLabel} Translation</p>
                            <p className="whitespace-pre-wrap text-sm mt-1">{content}</p>
                        </div>
                    )
                })}
            </div>
        )}

        {message.translatingStyle && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <SpinnerIcon className="w-4 h-4 animate-spin" />
                <span>Translating ({TRANSLATION_STYLES.find(s => s.id === message.translatingStyle)?.label || message.translatingStyle})...</span>
            </div>
        )}

        {!isUser && message.content && (
          <div className="mt-2 text-right relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-label="Choose translation style"
            >
              <TranslateIcon className="w-4 h-4" />
              <span>Translate</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-52 bg-slate-600 border border-slate-500 rounded-md shadow-lg z-20 py-1">
                {TRANSLATION_STYLES.map(({id, label}) => {
                    const isTranslated = !!message.translations?.[id];
                    const isTranslating = message.translatingStyle === id;
                    const isDisabled = isTranslated || isTranslating;
                    return (
                        <button
                            key={id}
                            onClick={() => handleTranslateClick(id)}
                            disabled={isDisabled}
                            className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isTranslating ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <span className="w-4"></span>}
                            <span>{label}{isTranslated ? ' ✓' : ''}</span>
                        </button>
                    )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;