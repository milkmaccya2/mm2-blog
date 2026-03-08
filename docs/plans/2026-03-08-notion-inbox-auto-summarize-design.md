# Notion Inbox 自動要約補完タスク — 設計書

作成日: 2026-03-08

## 概要

Notion Inbox データベースの「要約」カラムが空のレコードに対して、Claude (Cowork) がページ本文を読み自動的に要約を生成・書き込む定期タスク。

## 実行環境

**Claude Desktop / Cowork**
- スケジュール: 1時間ごと
- 外部API不要（Claude 自身が要約を生成）
- Notion MCP を使って読み書き

## 対象データ

- **DB**: Notion Inbox (`collection://2b93611b-eab8-805f-99b5-000b39248424`)
- **条件**: 過去2時間以内に作成 かつ 要約フィールドが空
- **プロパティ**: 名前(title), 日付(created_time), 要約(text), URL(url), タグ(multi_select)

## 処理フロー

```
[Cowork 1時間ごとに起動]
        ↓
① 過去2時間以内に作成・要約が空のレコードを収集
   - notion-search を複数クエリ並列実行（created_date_range フィルタ付き）
   - ページIDで重複排除
   - 要約フィールドが空のものだけ残す
        ↓
② 各レコードのページ本文を取得
   - notion-fetch または API-get-block-children で本文取得
   - 本文が空の場合はタイトルのみ使用
        ↓
③ 要約を生成（Claude が実行）
   - 300文字以内の日本語散文
   - 箇条書き不可
   - タイトル・本文の内容を忠実に要約（推論・創作しない）
        ↓
④ Notion へ書き戻し
   - API-patch-page で 要約(text) プロパティを更新
        ↓
[完了: 「X件処理、Y件スキップ（本文なし）」を出力]
```

## 要約生成ルール

- 上限: 300文字
- 言語: 日本語
- 形式: 文章（箇条書き不可）
- 内容: 本文の核心を忠実に。推論・補完・創作は行わない
- 本文が空の場合: タイトルのみで要約、または「（本文なし）」としてスキップ

## Notion MCP の制約対応

`notion-query-database-view` / `API-query-data-source` は使用不可（既知の制約）。
代わりに `notion-search` を以下の5クエリで並列実行し重複排除する:

| クエリ | 用途 |
|--------|------|
| "inbox" | 汎用・タグなし |
| "日記 子供 育児 生活 体調 妻" | 生活・育児系 |
| "AI 技術 Frontend Web プログラミング" | 技術系 |
| "キャリア 仕事 アサイン チーム" | 仕事系 |
| "ガジェット ファッション 買い物 自己啓発 メモ" | その他 |

全クエリに `created_date_range: { past 2 hours }` フィルタを付与。

## 成果物

- `docs/prompts/notion-summarize-inbox.md` — Cowork に渡すタスクプロンプト

## 今後の拡張候補（現時点では対象外）

- URL フェッチによる外部記事の要約
- タグ自動付与
- 要約品質のレビューフロー
