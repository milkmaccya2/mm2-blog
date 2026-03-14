import { useEffect, useRef, useState } from 'preact/hooks';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: メッセージ追加時にスクロールさせたい
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const allMessages = [...messages, userMessage];
    setMessages(allMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          try {
            const data = JSON.parse(line.slice(6));
            // UI message stream format: type "text" contains text content
            if (data.type === 'text' && data.value) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + data.value } : m
                )
              );
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch {
      setError('エラーが発生しました。しばらくしてからお試しください。');
    } finally {
      setIsLoading(false);
    }
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
          <ChatMessage key={m.id} role={m.role} content={m.content} />
        ))}
        {error && <p class="mt-2 text-center text-xs text-red-500">{error}</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={(e) => setInput((e.target as HTMLInputElement).value)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
