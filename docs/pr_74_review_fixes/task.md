
# PRレビュー対応: パンくずリストの実装品質向上

## 概要
PR #74 に対する追加のレビュー指摘事項への対応を行う。  
主な内容は、バグ修正、重複コードの排除、パフォーマンス改善、不要な記述の削除である。

## タスクリスト

### 1. バグ修正: `buildBreadcrumbs` のリンク生成ロジックの修正
- [ ] `src/layouts/BaseLayout.astro`: `segments.indexOf` による不正確なパス再構築を修正し、ループ内で累積的にパスを構築するようにリファクタリングする。

### 2. パフォーマンス改善: `buildBreadcrumbs` の初期化順序の変更
- [ ] `src/layouts/BaseLayout.astro`: ホームページ（ルートパス）の判定を最初に行い、不要な `items` 配列の初期化を防ぐ。

### 3. リファクタリング: `Breadcrumb.astro` のスタイル修正
- [ ] `src/components/Breadcrumb.astro`: インラインスタイルで指定されている `max-width: 960px;` が冗長（CSSクラスやスタイルブロックでカバーされている）なため削除する。

### 4. リファクタリング: `Breadcrumb.astro` の SVG 重複排除
- [ ] `src/components/Breadcrumb.astro`: ホームアイコンの SVG が2箇所で重複しているため、定数化して再利用する形に変更する。

### 5. リファクタリング: `Breadcrumb.astro` の不要な条件分岐削除
- [ ] `src/components/Breadcrumb.astro`: `isLast` ブロック内の `index === 0` という到達不能な条件分岐（ホームの場合のみ該当するが、そもそも描画されない）を削除する。
