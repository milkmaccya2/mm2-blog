import { isToolUIPart, type UIDataTypes, type UIMessagePart, type UITools } from 'ai';

type Part = UIMessagePart<UIDataTypes, UITools>;

interface Props {
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  lastAssistantParts?: Part[];
}

function isToolSearching(parts: Part[]): boolean {
  return parts.some(
    (p) => isToolUIPart(p) && p.state !== 'output-available' && p.state !== 'output-error'
  );
}

function hasText(parts: Part[]): boolean {
  return parts.some((p) => p.type === 'text' && p.text.length > 0);
}

export default function ChatStatusIndicator({ status, lastAssistantParts }: Props) {
  const isActive = status === 'submitted' || status === 'streaming';
  if (!isActive) return null;

  const parts = lastAssistantParts ?? [];
  const searching = isToolSearching(parts);
  const hasTextContent = hasText(parts);

  let label: string | null = null;
  if (searching) {
    label = 'ブログを検索中';
  } else if (!hasTextContent) {
    label = '回答を生成中';
  }

  if (!label) return null;

  return (
    <div className="mb-3 flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-bg-secondary,#f3f4f6)] px-4 py-2 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        <span>{label}</span>
        <span className="flex gap-0.5">
          <span className="animate-bounce text-lg leading-none [animation-delay:0ms]">.</span>
          <span className="animate-bounce text-lg leading-none [animation-delay:150ms]">.</span>
          <span className="animate-bounce text-lg leading-none [animation-delay:300ms]">.</span>
        </span>
      </div>
    </div>
  );
}
