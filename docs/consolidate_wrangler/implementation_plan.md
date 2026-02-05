# 実装計画：Wrangler設定ファイルの統合

## 目的
プロジェクト内に存在する重複した設定ファイル (`wrangler.json`, `wrangler.jsonc`) を整理し、正しい設定に統一する。

## 現状分析
- **`wrangler.json`**: プロジェクト名が `mm2-blog` と正しく設定されており、静的アセットの配信設定 (`assets`) も適切。
- **`wrangler.jsonc`**: プロジェクト名が `exo-kuiper` (テンプレート由来？) となっており、設定内容もこのプロジェクトの実態（静的サイト）と一部乖離している可能性がある。
- **`astro.config.mjs`**: `site` 設定が `https://example.com` のまま。

## 提案する変更
1. **`wrangler.jsonc` の削除**: 不要な（誤った名前の）設定ファイルを削除する。
2. **`wrangler.json` の更新** (必要に応じて): `.jsonc` に含まれていた新しい `compatibility_date` やフラグを取り込む（必要であれば）。
3. **`astro.config.mjs` の修正**: `site` を `https://blog.milkmaccya.com` に更新する。

## 実行計画
1. `wrangler.jsonc` を削除。
2. `astro.config.mjs` を更新。
3. `npm run build` で確認。

## ユーザーレビュー
- `wrangler.jsonc` を削除して良いか。
