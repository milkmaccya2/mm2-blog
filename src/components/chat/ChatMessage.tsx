import type { UIMessagePart } from 'ai';

interface Props {
  role: 'user' | 'assistant';
  parts: UIMessagePart[];
}

export default function ChatMessage({ role, parts }: Props) {
  const isUser = role === 'user';
  const text = parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('');

  if (!text) return null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-[var(--color-bg-secondary,#f3f4f6)] text-[var(--color-text)] dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
