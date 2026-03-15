import { type FormEvent, useState } from 'react';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface Props {
  isLoading: boolean;
  onSubmit: (text: string) => void;
}

export default function ChatInput({ isLoading, onSubmit }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    onSubmit(text);
    setInput('');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'chat_question',
      chat_question_text: text.slice(0, 100),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-600"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="質問を入力..."
        disabled={isLoading}
        className="flex-1 rounded-lg border border-gray-300 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? '...' : '送信'}
      </button>
    </form>
  );
}
