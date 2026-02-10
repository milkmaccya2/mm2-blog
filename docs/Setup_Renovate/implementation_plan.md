# Implementation Plan - Renovate Setup

## 概要
依存関係の自動更新ツールであるRenovateを導入するため、設定ファイルを追加します。
GitHub App版のRenovateを利用することを想定し、リポジトリに推奨設定をコミットします。

## 変更内容

### 1. 設定ファイルの作成 (`renovate.json`)
プロジェクトルートに `renovate.json` を作成し、以下の設定を行います。
- ベース設定: `config:best-practices`
- タイムゾーン: `Asia/Tokyo`
- スケジュール: 週末（金曜の夜〜月曜の朝）に限定し、平日のノイズを減らす
- ラベル: `dependencies`
- 自動マージ:
  - マイナー/パッチバージョンアップは自動マージ（CI成功時）
  - `devDependencies` は積極的に自動マージ
- PR作成制限: 一度に大量のPRが作成されないように制限 (`prConcurrentLimit`)

## 検証方法
- 設定ファイルが正しいJSON形式であることを確認する。
- GitHub Appをインストールした後、Onboarding PRが作成されるか、もしくは設定ファイルが認識されてDashboard Issueが作成されるかを確認する（これはマージ後の動作）。
