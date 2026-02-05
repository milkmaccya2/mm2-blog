# POS-80 Project Addition

ユーザーからのリクエストを受けて、POS-80 Thermal Printer Controller のプロジェクト紹介ページを追加しました。

## Changes

### Pages

#### [NEW] [src/pages/projects/pos-80-thermal-printer.md](file:///Users/yokoyama/git/mm2-blog/src/pages/projects/pos-80-thermal-printer.md)
- 詳細なプロジェクト説明、機能、技術スタック、アーキテクチャ図を含むMarkdownファイル。
- Mermaid.js の図表がレンダリングされるように構成されています。

#### [MODIFY] [src/pages/projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- 新しいプロジェクトページへのリンクを追加しました。

### Layouts

#### [NEW] [src/layouts/ProjectLayout.astro](file:///Users/yokoyama/git/mm2-blog/src/layouts/ProjectLayout.astro)
- プロジェクト詳細ページ用の専用レイアウト。
- `BaseLayout` を拡張し、Mermaid.js のサポートを追加しています。

## Verification Results

### Manual Verification
- `npm run build` が正常に完了することを確認しました。
- `npm run preview` でブラウザテストを実施し、以下の点を確認しました：
    - プロジェクト一覧に POS-80 が表示されること。
    - 詳細ページに遷移できること。
    - Mermaid 作図（アーキテクチャ図）が正しくレンダリングされること。

![Architecture Diagram](project_details_architecture_1770292810414.png)
