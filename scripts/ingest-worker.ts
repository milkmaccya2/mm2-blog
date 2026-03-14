// npx wrangler dev scripts/ingest-worker.ts --remote で実行
// チャンクJSONを受け取り、embedding + Vectorize upsertを行う

export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

interface Chunk {
  id: string;
  text: string;
  source: string;
  title: string;
  section?: string;
  url?: string;
  date?: string;
}

const BATCH_SIZE = 10;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('POST chunks JSON to this endpoint', { status: 405 });
    }

    const chunks: Chunk[] = await request.json();
    console.log(`Received ${chunks.length} chunks`);

    let upserted = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => c.text);

      const embeddings = await env.AI.run('@cf/baai/bge-m3', {
        text: texts,
      });

      const vectors = batch.map((chunk, idx) => ({
        id: chunk.id,
        values: embeddings.data[idx],
        metadata: {
          text: chunk.text,
          source: chunk.source,
          title: chunk.title,
          section: chunk.section ?? '',
          url: chunk.url ?? '',
          date: chunk.date ?? '',
        },
      }));

      await env.VECTORIZE.upsert(vectors);
      upserted += vectors.length;
      console.log(`Upserted ${upserted}/${chunks.length}`);
    }

    return Response.json({ success: true, upserted });
  },
};
