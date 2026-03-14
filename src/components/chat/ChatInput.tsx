interface Props {
  input: string;
  isLoading: boolean;
  onInputChange: (e: Event) => void;
  onSubmit: (e: Event) => void;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} class="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-600">
      <input
        type="text"
        value={input}
        onInput={onInputChange}
        placeholder="質問を入力..."
        disabled={isLoading}
        class="flex-1 rounded-lg border border-gray-300 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? '...' : '送信'}
      </button>
    </form>
  );
}
