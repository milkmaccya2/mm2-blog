# Walkthrough - Renovate Setup

## 概要
ライブラリの自動アップデートを行うため、Renovateの設定ファイル (`renovate.json`) を追加しました。

## 実装内容
- `renovate.json`: 日本時間での実行設定、マイナー/パッチアップデートの自動マージ設定などを行いました。
  - **スケジュール**: 毎週月曜日の朝9時より前に実行（週末にまとめて確認できます）
  - **自動マージ**: マイナー/パッチアップデート、および `devDependencies` のアップデートは自動マージの対象としています。
  - **同時実行制限**: 一度に作成されるPRを制限してノイズを減らしています。

## 今後の手順（ユーザー操作）
Renovateを有効にするには、以下の手順を行ってください。

1. **GitHub Appのインストール**
   GitHub上のリポジトリに対してRenovate Appをインストールしてください。
   - [Renovate Appのインストールページ](https://github.com/apps/renovate)
   - 「Install」ボタンをクリックし、対象のリポジトリを選択してください。

2. **Pull Requestの確認**
   Appをインストールすると、短時間で「Configure Renovate」という件名のPull Requestが作成されます（既存の `renovate.json` がある場合はDashboard Issueが作成されることもあります）。
   このPRの内容を確認し、マージすると自動更新が正式に開始されます。

3. **自動マージ設定（推奨）**
   GitHubリポジトリの「Settings」タブ -> 「General」 -> 「Pull Requests」セクションにある「Allow auto-merge」を有効にすると、CIがパスした際に自動的にマージされるようになります。

## 設定の確認
作成された `renovate.json` はプロジェクトルートに配置されています。必要に応じて設定を変更してください。
