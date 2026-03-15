import { isTextUIPart, type UIDataTypes, type UIMessagePart, type UITools } from 'ai';
import ChatMarkdown from './ChatMarkdown';

interface SourceUrlPart {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
}

interface Props {
  role: 'user' | 'assistant';
  parts: UIMessagePart<UIDataTypes, UITools>[];
}

export default function ChatMessage({ role, parts }: Props) {
  const isUser = role === 'user';
  const text = parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join('');

  const sources = parts.filter((p): p is SourceUrlPart => p.type === 'source-url');

  if (!text) return null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-[var(--color-bg-secondary,#f3f4f6)] text-[var(--color-text)] dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {isUser ? <p className="whitespace-pre-wrap">{text}</p> : <ChatMarkdown content={text} />}
        {sources.length > 0 && (
          <details className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-600">
            <summary className="cursor-pointer text-xs font-semibold text-gray-500 select-none dark:text-gray-400">
              参照元（{sources.length}件）
            </summary>
            <ul className="mt-1 space-y-0.5">
              {sources.map((s) => (
                <li key={s.sourceId}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {s.title || s.url}
                    <span className="sr-only">（新しいタブで開きます）</span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
