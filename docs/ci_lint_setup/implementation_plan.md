
# CI/CD Lint設定 実装計画 (再修正版)

## 概要
`package.json` に条件分岐ロジックを埋め込む手法（スマートではない手法）を廃止し、GitHub ActionsとGitHubの「Branch Protection Rule（ブランチ保護ルール）」を組み合わせた標準的かつスマートな構成を提案します。

この構成により：
1. **GitHub Actions**: PRおよびMainブランチに対するLintチェックを自動実行します。
2. **Branch Protection (推奨設定)**: Lintチェックが通らない限り `main` ブランチへのマージを禁止します。
3. **Cloudflare Pages**: マージされた（＝Lintを通過した）クリーンなコードのみを自動デプロイします。また、PRのプレビュー環境はLintの結果に関わらずデプロイされます（Cloudflare側でLintを行わないため）。

## ユーザーレビューが必要な事項
- このフローを実現するには、**GitHubの設定画面での操作**（ブランチ保護ルールの有効化）が必要です。
- コード上の変更はGitHub Actionsのワークフロー追加のみとなり、既存のビルドコマンドは汚しません。

## 変更内容

### プロジェクトルート
#### [NEW] .github/workflows/ci.yml
- Lint (Biome) を実行するワークフロー。
- トリガー:
    - `pull_request`: 全ブランチ
    - `push`: `main` ブランチ

### GitHub設定 (ユーザー作業)
実装完了後、GitHubリポジトリ設定にて以下を行う必要があります：
1. `Settings` > `Branches` > `Add rule` (main)
2. `Require status checks to pass before merging` をオンにする
3. 作成した `Lint` ジョブを必須チェックとして選択する

これにより、「LintエラーがあるコードはMainに入らない（＝本番デプロイされない）」かつ「PRプレビューは（GitHub Actionsが落ちていても）Cloudflare側で生成される」状態が実現します。

## 検証計画
### 手動検証
1. LintエラーになるPRを作成する。
    - **GitHub Actions**: ❌ (失敗)
    - **Cloudflare Pages**: ✅ (プレビューデプロイ成功)
    - **マージ**: ❌ (ブランチ保護によりブロックされる) -> **本番デプロイ不可**
2. Lintエラーを修正する。
    - **GitHub Actions**: ✅ (成功)
    - **マージ**: ✅ (可能になる) -> **本番デプロイ実行**
