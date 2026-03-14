import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'preact/hooks';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  });
  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: メッセージ追加時にスクロールさせたい
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const text = localInput.trim();
    if (!text || isLoading) return;
    setLocalInput('');
    append({ role: 'user', content: text });
  };

  return (
    <div class="fixed bottom-20 right-4 z-50 flex h-[500px] w-[360px] flex-col rounded-2xl bg-[var(--color-bg)] shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
      {/* Header */}
      <div class="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white max-sm:rounded-none">
        <span class="text-sm font-bold">milkmaccya に聞く</span>
        <button
          type="button"
          onClick={onClose}
          class="text-white/80 transition-colors hover:text-white"
          aria-label="チャットを閉じる"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p class="text-center text-sm text-gray-400">ブログの内容について何でも聞いてください</p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role as 'user' | 'assistant'} content={m.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={localInput}
        isLoading={isLoading}
        onInputChange={(e) => setLocalInput((e.target as HTMLInputElement).value)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
