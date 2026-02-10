# E2E Smoke Tests Design

## Goal

全ページの基本動作を保証するスモークテストを実装する。
「デプロイしたらページが壊れていた」という事故を防ぐことが目的。

## Scope

- テストレベル: スモークテスト（表示確認のみ）
- ユーザーシナリオやコンテンツの詳細検証は対象外

## Test Target Pages

| Page | Path | Description |
|------|------|-------------|
| Homepage | `/` | トップページ |
| Blog Index | `/blog` | ブログ一覧 |
| Latest Blog Post | `/blog/[slug]` | 最新記事（動的取得） |
| About | `/about` | Aboutページ |
| Projects | `/projects` | Projectsページ |

## Common Assertions (All Pages)

全ページで以下を検証する:

- Navigation (`nav` role) が表示される
- Main content (`main` role) が表示される
- Footer (`contentinfo` role) が表示される
- Page title が空でない

## Page-Specific Assertions

### Homepage (`/`)

- `h1` に "Milkmaccya's Log" が表示される

### Blog Index (`/blog`)

- リストアイテム（記事）が 1 件以上存在する

### Latest Blog Post (`/blog/[slug]`)

- `/blog` から最初の記事リンクの `href` を取得して遷移
- 記事タイトルの `h1` が表示される
- `article` 要素が存在する

### About (`/about`)

- `h1` に "About" が表示される

### Projects (`/projects`)

- `h1` に "Projects" が表示される

## Test Structure

```
tests/e2e.spec.ts

describe('Smoke Tests')
  ├── test('homepage')
  ├── test('blog index')
  ├── test('latest blog post')
  ├── test('about page')
  └── test('projects page')
```

- 1 ファイル、5 テストケース
- 共通チェックはヘルパー関数 `verifyLayout(page)` に集約
- 各テストは共通チェック + 固有チェック 1〜2 個

## Design Decisions

- **スモークテストに絞る**: 壊れにくく、メンテナンスコストが低い
- **最新記事を動的取得**: 記事追加に自動追従、固定スラッグに依存しない
- **セマンティックロール利用**: CSS クラスではなく ARIA ロールで要素を特定し、マークアップ変更に強くする
