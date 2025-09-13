import { GoogleGenAI, Chat } from "@google/genai";
import { TranslationStyle } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const initializeChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly conversational AI. Be concise but informative.',
    },
  });
};

const getTranslationPrompt = (targetLanguage: string, style: TranslationStyle, text: string): string => {
    switch (style) {
        case 'news_summary':
            return `Translate the following text into ${targetLanguage}. The translation should be fun, funny, and easy to understand, as if explaining news to a friend. Keep the main points and substance of the original text. Text: "${text}"`;
        case 'witty_expert':
            return `Translate the following text into ${targetLanguage}. The translation should be smart, witty, and knowledgeable. Provide a complete and detailed translation, but add some appropriate humor or jokes to make it fun and engaging. Text: "${text}"`;
        case 'formal':
            return `Translate the following text into ${targetLanguage} using formal language. The tone should be professional and suitable for official communication. Text: "${text}"`;
        case 'detailed_explanation':
            return `Translate the following text into ${targetLanguage}. Provide a detailed translation, explaining any nuances, cultural context, or complex terms to ensure a deep understanding. The response should be comprehensive. Text: "${text}"`;
        case 'friendly_chat':
            return `Translate the following text into ${targetLanguage} in a casual, friendly, and conversational tone, as if you were talking to a close friend. Use informal language and slang where appropriate. Text: "${text}"`;
    }
}

export const translateText = async (text: string, targetLanguage: string, style: TranslationStyle): Promise<string> => {
    try {
        const prompt = getTranslationPrompt(targetLanguage, style, text);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Translation failed:', error);
        throw new Error('Failed to translate text.');
    }
};