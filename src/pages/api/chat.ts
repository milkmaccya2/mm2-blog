import { env } from 'cloudflare:workers';
import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import type { APIRoute } from 'astro';
import { formatContext, searchRelevantChunks } from '@/lib/chat/rag';
import { buildPromptWithContext } from '@/lib/chat/system-prompt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const modelMessages = await convertToModelMessages(messages);

  // 最新のユーザーメッセージでRAG検索（Vectorizeがローカルで使えない場合はスキップ）
  const lastUserMessage = messages.findLast((m) => m.role === 'user');

  let context = '';
  if (lastUserMessage) {
    try {
      const userText =
        lastUserMessage.parts
          ?.filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join('') ?? '';
      const results = await searchRelevantChunks(userText, env.AI, env.VECTORIZE);
      context = formatContext(results);
    } catch {
      context = '（RAG検索は利用できない環境のためスキップ）';
    }
  }

  const anthropic = createAnthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildPromptWithContext(context),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
};
