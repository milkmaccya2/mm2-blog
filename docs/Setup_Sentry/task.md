# Task: Sentryの導入

## 概要
GoogleのSentryチームが推奨する設定に基づき、AstroプロジェクトにSentryを導入する。
ユーザー指定の設定値（サンプリングレート等）を適用し、効率的なエラー監視とセッションリプレイを実現する。

## 要件
1. `@sentry/astro` パッケージをインストールする。
2. 以下の設定を適用する:
    - `sampleRate: 1.0` (全エラー送信)
    - `replaysSessionSampleRate: 0` (通常セッションは録画しない)
    - `replaysOnErrorSampleRate: 1.0` (エラー発生時は100%録画)
3. 必要に応じて `sentry.client.config.js` および `sentry.server.config.js` を作成・設定する。
4. `astro.config.mjs` に統合を追加する。

## 完了条件
- [x] Sentry SDKがインストールされていること。
- [x] 指定されたサンプリング設定が反映されていること。
- [x] 環境変数経由でDSNが設定されていること（`.env`）。
- [x] ビルドが正常に通ること。
