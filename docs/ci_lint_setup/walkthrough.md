
# CI/CD Lint設定 ウォークスルー

## 実施した変更
- `.github/workflows/ci.yml` を作成しました。
    - PR作成時およびMainブランチへのPush時に `npm run lint` (Biome) を実行します。

## 次のステップ (ユーザー作業)

### 1. Branch Protectionの設定
この設定を行うことで、Lintエラーがある状態での本番マージを防ぎ、"不壊のデプロイ"を実現します。

1. GitHubリポジトリの **Settings** > **Branches** を開きます。
2. **Add branch protection rule** をクリックします。
3. **Branch name pattern** に `main` と入力します。
4. **Require status checks to pass before merging** にチェックを入れます。
5. 検索ボックスで **Lint** (CIで定義したジョブ名) を検索し、選択します。
   - ※まだCIが一度も走っていない場合、候補に出ないことがあります。その場合は一度このPRをPushしてCIを走らせてください。
6. 画面下部の **Create** をクリックして保存します。

### 2. 動作確認
- このPRのChecksタブでLintが成功していることを確認してください。
