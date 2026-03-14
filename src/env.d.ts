/// <reference types="astro/client" />

declare module 'cloudflare:workers' {
  interface CloudflareEnv {
    AI: Ai;
    VECTORIZE: VectorizeIndex;
    ANTHROPIC_API_KEY: string;
  }
  const env: CloudflareEnv;
  export { env };
}
