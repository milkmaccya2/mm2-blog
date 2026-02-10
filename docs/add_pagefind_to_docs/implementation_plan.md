# 実装計画 - PageFindのドキュメント追加

## 概要
PageFindがプロジェクトの検索エンジンとして導入されているため、関連するドキュメントとプロジェクトデータを更新し、技術スタックの一部として明示する。

## 変更内容
1.  **README.md の更新**
    *   「技術スタック」セクションに `Pagefind (Search Indexing)` を追加する。
    *   詳細すぎるセクション（「パフォーマンス監視」、「依存関係の自動更新」）を削除し、内容を整理する。
    *   「プロジェクト構成」セクションに、`.github`, `docs`, `tests`, `src/data` 等のディレクトリに加え、`tailwind.config.js`, `sentry.*.config.js` などの重要な設定ファイルを追加する。
2.  **src/data/projects.ts の更新**
    *   `mm2-blog` プロジェクトの `tags` 配列に `'Pagefind'` を追加する。

## 確認方法
- README.md の表示を確認。
- `npm run dev` 起動後、プロジェクトページ (`/projects`) で mm2-blog のタグに Pagefind が含まれていることを確認。
