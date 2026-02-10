# Walkthrough: Sentry Integration

## 変更点
- `package.json`: `@sentry/astro` を追加。Astro 6 beta との競合を避けるため `overrides` を設定。
- `astro.config.mjs`: Sentryインテグレーションを追加。
- `sentry.client.config.js`: クライアントサイドのエラー監視設定を追加（セッション録画のサンプリング調整済み）。
- `sentry.server.config.js`: サーバーサイドのエラー監視設定を追加。

## 確認事項
- `npm run dev` でエラーが出ないこと。
- ビルドが通ること (`npm run build`)。
- Sentryの設定値がユーザー要望通り (`sampleRate: 1.0`, etc.) であること。
