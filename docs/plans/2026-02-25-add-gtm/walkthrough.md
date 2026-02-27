# GTM導入の完了報告

GTM (Google Tag Manager) のタグを追加する実装が完了しました。

## 変更内容
- `PUBLIC_GTM_ID` を環境変数として定義しました（`.env` および `.env.example` に項目を追加）。
- `src/layouts/BaseLayout.astro` を修正し、`PUBLIC_GTM_ID` が設定されている場合のみ GTM の `<script>` タグと `<noscript>` タグを出力するように対応しました。

## 次のアクション（User側で実施）
1. [Google Tag Manager](https://tagmanager.google.com/) にてコンテナを作成（または既存のコンテナIDを確認）してください。
2. 対象プロジェクトの `.env` ファイルを開き、`PUBLIC_GTM_ID` に自身のコンテナID（例: `GTM-XXXXXXX`）を設定してください。
3. （必要に応じて）本番環境のデプロイ時の環境変数設定（Cloudflare Pages や Vercel 等）にも `PUBLIC_GTM_ID` を追加してください。

---

render_diffs(file:///Users/yokoyama/git/mm2-blog/src/layouts/BaseLayout.astro)
