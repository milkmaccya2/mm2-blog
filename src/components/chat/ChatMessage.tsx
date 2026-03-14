interface Props {
  role: 'user' | 'assistant';
  content: React.ReactNode;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-[var(--color-bg-secondary,#f3f4f6)] text-[var(--color-text)] dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
