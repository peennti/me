export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export type TranslationStyle = 'news_summary' | 'witty_expert' | 'formal' | 'detailed_explanation' | 'friendly_chat';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  translations?: {
    [key in TranslationStyle]?: string;
  };
  translatingStyle?: TranslationStyle | null;
}