# Add POS-80 Project Page

POS-80 サーマルプリンターのプロジェクト紹介ページを追加します。
提供された詳細なドキュメントを掲載するため、個別のプロジェクト詳細ページを作成します。

## User Review Required

- **画像**: プリンターの実機画像があるとより伝わりやすいため、後ほど `src/assets` または `public` に画像を追加していただくことを推奨します。
- **Mermaid**: アーキテクチャ図を表示するため、Mermaid.js をCDN経由で読み込みます。

## Proposed Changes

### Layouts

#### [NEW] [ProjectLayout.astro](file:///Users/yokoyama/git/mm2-blog/src/layouts/ProjectLayout.astro)
- `BaseLayout` をラップし、プロジェクト詳細ページ用のレイアウトを定義します。
- **Mermaid.js** の初期化スクリプトを含めます。
- Markdownコンテンツを綺麗に表示するための `prose` クラスを適用します。

### Pages

#### [NEW] [pos-80-thermal-printer.md](file:///Users/yokoyama/git/mm2-blog/src/pages/projects/pos-80-thermal-printer.md)
- 提供されたMarkdownコンテンツを配置します。
- `ProjectLayout` を使用します。

#### [MODIFY] [projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- 新しいプロジェクトへのリンクを追加します。

## Verification Plan

### Manual Verification
- `npm run dev` でローカルサーバーを起動します。
- `/projects` から新しいプロジェクトページへ遷移できることを確認します。
- 詳細ページで Mermaid 図が正しくレンダリングされることを確認します。
