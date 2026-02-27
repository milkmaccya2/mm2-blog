# GTM導入の計画

Google Tag Managerをアプリケーションに追加し、アクセス解析などを可能にします。

## 実装内容
1. `PUBLIC_GTM_ID` の環境変数を定義し、`.env` および `.env.example` に追記します。
2. `src/layouts/BaseLayout.astro` に、`PUBLIC_GTM_ID` が存在する場合のみ GTM のタグ（`<script>` と `<noscript>`）を出力するように実装を追加します。

## 対象ファイル
### Layout
#### [MODIFY] BaseLayout.astro(file:///Users/yokoyama/git/mm2-blog/src/layouts/BaseLayout.astro)
- 環境変数 `PUBLIC_GTM_ID` の読み込み
- `<head>` 内への `<script>` タグ追加
- `<body>` 直下への `<noscript>` タグ追加

### Config
#### [MODIFY] .env.example(file:///Users/yokoyama/git/mm2-blog/.env.example)
- `PUBLIC_GTM_ID` を追加
#### [MODIFY] .env(file:///Users/yokoyama/git/mm2-blog/.env)
- `PUBLIC_GTM_ID` を追加
