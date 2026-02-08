# 実装計画: GSAP アニメーションの共通化

## 概要
GSAP の初期化とアニメーション定義を `src/scripts/animations.ts` に集約し、`BaseLayout.astro` で読み込むことで、サイト全体で統一的なアニメーション管理を実現します。

## 変更内容

### 1. 新規ファイル作成: `src/scripts/animations.ts`
以下の機能を持つスクリプトを作成します。
- `gsap` と `ScrollTrigger` のインポートと登録。
- `initAnimations`関数の定義:
    - `gsap.matchMedia()` を使用したレスポンシブおよび Reduced Motion 対応。
    - 共通クラス（例: `.fade-in-up`, `.reveal-wrap`, `.animate-blob`）に対するアニメーション定義（`ScrollTrigger` 設定含む）。
    - 要素の存在チェック（`document.querySelectorAll` の結果確認）を行い、存在する要素に対してのみアニメーションを設定（エラー回避）。
- Astro のライフサイクルイベントへのフック:
    - `astro:page-load`: `initAnimations()` の実行。
    - `astro:before-swap`: `mm.revert()` によるクリーンアップ。

### 2. 修正: `src/layouts/BaseLayout.astro`
- `<head>` タグ内または `<body>` の最後で、`src/scripts/animations.ts` をインポートする `<script>` タグを追加します。
  ```html
  <script>
    import '../scripts/animations.ts';
  </script>
  ```

### 3. 修正: `src/pages/index.astro`
- 現在の `<script>` ブロック内のロジックを削除します。
- 必要な HTML クラス（`.fade-in-up`, `.animate-blob` 等）はそのまま維持します。

## 検証計画
- `http://localhost:4321` を開き、トップページのアニメーションが以前と同様に動作することを確認。
- `http://localhost:4321/about` や `http://localhost:4321/blog` など他のページに遷移し、開発者ツールのコンソールに GSAP 関連の警告（"target not found"）が出ないことを確認。
- 任意のブログ記事ページなどで、試しに `.fade-in-up` クラスを持つ要素を追加し、アニメーションが適用されるか確認（オプション）。
