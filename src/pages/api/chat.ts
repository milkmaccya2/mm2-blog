import { env } from 'cloudflare:workers';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import type { APIRoute } from 'astro';
import { formatContext, searchRelevantChunks } from '@/lib/chat/rag';
import { buildPromptWithContext } from '@/lib/chat/system-prompt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();

  // 最新のユーザーメッセージでRAG検索（Vectorizeがローカルで使えない場合はスキップ）
  const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user');

  let context = '';
  if (lastUserMessage) {
    try {
      const results = await searchRelevantChunks(lastUserMessage.content, env.AI, env.VECTORIZE);
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
    messages,
  });

  return result.toUIMessageStreamResponse();
};
