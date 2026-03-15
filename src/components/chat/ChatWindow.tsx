import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface Props {
  onClose: () => void;
}

const transport = new DefaultChatTransport({ api: '/api/chat' });

export default function ChatWindow({ onClose }: Props) {
  const { messages, sendMessage, status, error } = useChat({ transport });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  // biome-ignore lint/correctness/useExhaustiveDependencies: メッセージ追加時にスクロールさせたい
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[360px] flex-col rounded-2xl bg-[var(--color-bg)] shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white max-sm:rounded-none">
        <span className="text-sm font-bold">milkmaccya に聞く</span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 transition-colors hover:text-white"
          aria-label="チャットを閉じる"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            ブログの内容について何でも聞いてください
          </p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role as 'user' | 'assistant'} parts={m.parts} />
        ))}
        {error && (
          <p className="mt-2 text-center text-xs text-red-500">
            エラーが発生しました。しばらくしてからお試しください。
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput isLoading={isLoading} onSubmit={(text) => sendMessage({ text })} />
    </div>
  );
}
