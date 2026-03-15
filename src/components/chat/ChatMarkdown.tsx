import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';
import remarkGfm from 'remark-gfm';

const remarkPlugins = [remarkGfm, remarkCjkFriendlyGfmStrikethrough, remarkCjkFriendly];
const rehypePlugins = [rehypeSanitize];

const components: Components = {
  h1: ({ children }) => <h1 className="mb-2 text-base font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-1.5 text-sm font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="mb-0.5">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {children}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs last:mb-0 dark:bg-gray-800">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return <code className="font-mono">{children}</code>;
    }
    return (
      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs dark:bg-gray-800">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="min-w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-semibold dark:border-gray-600 dark:bg-gray-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-2 py-1 dark:border-gray-600">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-gray-300 pl-3 text-gray-600 last:mb-0 dark:border-gray-500 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

interface Props {
  content: string;
}

export default function ChatMarkdown({ content }: Props) {
  return (
    <div className="min-w-0">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
