# Notion Inbox 自動要約補完 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Cowork に渡すプロンプトを作成し、Notion Inbox の要約カラムを自動補完する定期タスクを構築する。

**Architecture:** Cowork スケジュールタスク（1時間ごと）として動作するプロンプトを `docs/prompts/` に保存。Claude (Cowork) が Notion MCP を使い、過去2時間以内に作成・要約が空のレコードを収集→本文取得→要約生成→書き戻しを自律実行する。外部 API 不要。

**Tech Stack:** Claude Desktop / Cowork, Notion MCP (`claude_ai_Notion`), Notion Inbox DB

---

### Task 1: ディレクトリ作成

**Files:**
- Create: `docs/prompts/` (ディレクトリ)

**Step 1: ディレクトリを作成する**

```bash
mkdir -p docs/prompts
```

**Step 2: Commit**

```bash
git add docs/prompts/.gitkeep
git commit -m "chore: add docs/prompts directory"
```

---

### Task 2: Cowork タスクプロンプトを作成する

**Files:**
- Create: `docs/prompts/notion-summarize-inbox.md`

**Step 1: プロンプトファイルを作成する**

以下の内容で `docs/prompts/notion-summarize-inbox.md` を作成する。

````markdown
# Notion Inbox 自動要約タスク

## 目的

Notion Inbox データベース内の「要約」カラムが空のレコードに、自動的に要約を生成・書き込む。

## 実行タイミング

1時間ごとにスケジュール実行。対象は **過去2時間以内に作成されたレコード** のみ。

---

## 手順

### Step 1: 対象レコードの収集

以下の5クエリを **並列実行** する。

**共通パラメータ（全クエリに付与）:**
```
data_source_url: "collection://2b93611b-eab8-805f-99b5-000b39248424"
filters:
  created_date_range:
    start_date: "[現在時刻 - 2時間]"
    end_date:   "[現在時刻]"
```

**クエリ一覧:**
1. `"inbox"` — 汎用・タグなし
2. `"日記 子供 育児 生活 体調 妻"` — 生活・育児系
3. `"AI 技術 Frontend Web プログラミング"` — 技術系
4. `"キャリア 仕事 アサイン チーム"` — 仕事系
5. `"ガジェット ファッション 買い物 自己啓発 メモ"` — その他

5クエリの結果をページIDで重複排除して統合する。

### Step 2: 要約が空のレコードに絞り込む

統合結果のうち、`要約(text)` プロパティが空（または未設定）のレコードだけを残す。
対象がゼロの場合は「処理対象なし」と出力して終了する。

### Step 3: ページ本文を取得する

対象レコードそれぞれについて、`notion-fetch` または `API-get-block-children` でページ本文を取得する。

- 本文が取得できた場合 → Step 4 へ
- 本文が空の場合 → タイトルのみを使用して Step 4 へ
- 取得エラーの場合 → そのレコードはスキップし、完了レポートに記録する

### Step 4: 要約を生成する

以下のルールに従い要約を生成する。

**ルール:**
- 上限: 300文字
- 言語: 日本語
- 形式: 文章（箇条書き不可）
- 内容: タイトル・本文の核心を忠実に要約する。推論・補完・創作は行わない
- 本文が空でタイトルのみの場合: タイトルを1〜2文で言い換える程度にとどめる

### Step 5: Notion へ書き戻す

`mcp__claude_ai_Notion__notion-update-page` または `mcp__notion__API-patch-page` を使い、対象レコードの `要約(text)` プロパティを生成した要約で更新する。

### Step 6: 完了レポートを出力する

```
処理完了:
  - 処理件数: X件
  - スキップ（本文なし）: Y件
  - エラー: Z件
```

---

## 注意事項

- `notion-query-database-view` および `API-query-data-source` は使用不可（既知の制約）
- `notion-search` はセマンティック検索のため1クエリでは全件取得できない → 5クエリ並列で網羅
- 書き戻しに失敗した場合でも他のレコードの処理は継続する

## DB情報

| 項目 | 値 |
|------|----|
| DB ID | `2b93611beab880fc8a4cfdb981797149` |
| Collection URL | `collection://2b93611b-eab8-805f-99b5-000b39248424` |
| 要約プロパティ名 | `要約` (type: text) |
````

**Step 2: Commit**

```bash
git add docs/prompts/notion-summarize-inbox.md
git commit -m "feat: add Cowork prompt for Notion Inbox auto-summarize"
```

---

### Task 3: Cowork にスケジュールタスクとして登録する（手動）

これはコードではなく Claude Desktop の操作手順。

**Step 1: Claude Desktop を開く**

**Step 2: Cowork でスケジュールタスクを作成する**

- タスク名: `Notion Inbox 自動要約`
- スケジュール: `1時間ごと`
- タスク内容: `docs/prompts/notion-summarize-inbox.md` の内容をそのまま貼り付ける（または「このファイルを読んで実行して」と参照させる）

**Step 3: 初回手動実行でテストする**

Cowork のタスクを手動トリガーし、以下を確認:
- 処理完了レポートが出力されること
- 実際に Notion の要約カラムが更新されていること（Notion で対象レコードを開いて確認）
- エラーが出た場合はエラーメッセージをもとにプロンプトを修正する

---

### Task 4: プロンプトの動作確認・調整（必要に応じて）

**Step 1: 要約の品質を確認する**

生成された要約を数件チェック:
- 300文字以内に収まっているか
- 本文の核心が正確に要約されているか
- 推論・創作が入っていないか

**Step 2: 問題があればプロンプトを修正して Commit**

```bash
git add docs/prompts/notion-summarize-inbox.md
git commit -m "fix: adjust summarize prompt for better quality"
```

---

## 完了条件

- [ ] `docs/prompts/notion-summarize-inbox.md` が作成されている
- [ ] Cowork にスケジュールタスクとして登録されている
- [ ] 手動実行で要約が Notion に書き込まれることを確認
