# テスト自動化導入 (Walkthrough)

## 実施内容

### 1. Playwrightのセットアップ
- `npm install -D @playwright/test` でライブラリをインストール
- `playwright.config.ts` を作成し、Astroのプレビューサーバー (`http://localhost:4322`) と連携するように設定

### 2. E2Eテストの作成
- `tests/e2e.spec.ts` を作成し、以下のテストケースを実装
  - トップページのタイトルと見出しの確認
  - ブログ記事一覧が表示されることの確認
  - ナビゲーション（Aboutページへの遷移）の確認

### 3. CI/CD設定
- `.github/workflows/ci.yml` に `test` ジョブを追加
- PR作成時やmainブランチへのプッシュ時に自動でE2Eテストが実行されるように設定

## 検証結果

### ローカルでのテスト実行
`npx playwright test` を実行し、全テストがパスすることを確認しました。

```bash
Running 3 tests using 3 workers
  3 passed (10.6s)
```

### 次のステップ
- GitHub Actions上での動作確認（コードをプッシュ後に確認）
- 必要に応じてテストケースの追加（例: テーマ切り替え、検索機能など）
