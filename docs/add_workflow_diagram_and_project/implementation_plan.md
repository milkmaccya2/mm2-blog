# 実装計画 - ブログワークフロー図とプロジェクト追加

## 概要
`README.md` にブログの執筆・更新フローを説明する Mermaid 図を追加し、`src/pages/projects.astro` にこのブログ自体をプロジェクトとして追加します。

## 変更内容

### `README.md`
- ブログの仕組み（Notion -> Notion AI -> Gemini -> ブログ）を示す Mermaid 図を追加します。

### `src/pages/projects.astro`
- `mm2-blog` (Personal Blog) のカードを追加します。
- **Tags**: Astro, Tailwind CSS, Cloudflare Workers

## 検証計画
### 自動テスト
- `npm run build` でビルドが通ることを確認します。

### 手動確認
- `README.md` のプレビューで Mermaid 図が正しく表示されるか確認します（プレビュー機能がある場合、またはコードの正当性確認）。
- `npm run dev` でローカルサーバーを立ち上げ、`/projects` ページに新しいプロジェクトカードが表示されていることを確認します。
