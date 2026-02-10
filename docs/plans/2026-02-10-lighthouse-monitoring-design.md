# Lighthouse パフォーマンス定期監視 設計ドキュメント

## 概要

本番サイトのパフォーマンスを週次で自動計測し、スコアが閾値を下回った場合に GitHub Issue を自動起票する仕組み。

## 方針

- **ツール**: Lighthouse CI (`@lhci/cli`)
- **実行環境**: GitHub Actions (スケジュール実行)
- **コスト**: 無料 (GitHub Actions 無料枠内)
- **通知方法**: GitHub Issue 自動起票

## ワークフロー全体像

```
スケジュール (毎週月曜 09:00 JST / UTC 00:00)
    ↓
Lighthouse CI で本番サイトを計測 (3回実行して中央値を取得)
    ↓
スコアを閾値と比較
    ↓
閾値未満 → GitHub Issue を自動起票
閾値以上 → 何もしない (ログのみ)
```

## 閾値

| カテゴリ | 閾値 |
|---|---|
| Performance | 90 |
| Accessibility | 90 |
| Best Practices | 90 |
| SEO | 90 |

## 計測対象

- トップページ (必要に応じて追加可能)
- 3回計測して中央値を使用 (Lighthouse の結果ブレ対策)

## ワークフロー詳細

**ファイル**: `.github/workflows/lighthouse.yml`

### ステップ

1. リポジトリをチェックアウト
2. Lighthouse CI をインストール
3. 本番 URL に対して Lighthouse を3回実行
4. 結果の JSON をパース
5. 閾値と比較し、下回ったカテゴリがあれば Issue 起票
6. レポート HTML を Artifact として保存 (30日間)

### 設計上のポイント

- `workflow_dispatch` により手動実行も可能 (動作確認用)
- Issue 重複防止: 同じタイトルの Open Issue が存在する場合はスキップ
- Artifact にレポート HTML を保存し、詳細を後から確認可能

## Issue フォーマット

```
タイトル: ⚠️ Lighthouse スコア低下検知

本文:
  Performance:    85 (閾値: 90) ❌
  Accessibility:  95 (閾値: 90) ✅
  Best Practices: 92 (閾値: 90) ✅
  SEO:            88 (閾値: 90) ❌

  詳細レポート: [Artifact リンク]
  計測日時: 2026-02-10
  対象URL: https://...
```

## 技術選定理由

PageSpeed Insights API と比較検討した結果、Lighthouse CI を採用:

- 週1回の実行なので CI の実行時間・コストは問題にならない
- 閾値設定やレポートのカスタマイズ性が高い
- Google 公式ツールで実績豊富
