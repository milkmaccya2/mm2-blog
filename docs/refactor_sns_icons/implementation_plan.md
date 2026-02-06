# Social Icons Refactoring Implementation Plan

現在のハードコードされたSNSアイコン（HeaderとFooter）を、DRY原則に従い共通化します。

## ユーザーレビューが必要な項目

- 特になし

## 提案される変更

### データ定義

#### [MODIFY] [consts.ts](file:///Users/yokoyama/git/mm2-blog/src/consts.ts)
- SNSリンクとアイコンデータ（SVGパスなど）を含む `SOCIAL_LINKS` 定数を追加します。

### コンポーネント作成

#### [NEW] [src/components/SocialLinks.astro](file:///Users/yokoyama/git/mm2-blog/src/components/SocialLinks.astro)
- `SOCIAL_LINKS` データを読み込み、リンクのリストを生成するコンポーネントを作成します。
- `Header` と `Footer` で異なるスタイル（文字色など）に対応するため、適切なprops（例: `class`、またはバリアント）を受け取れるようにします。

### 既存コンポーネントの修正

#### [MODIFY] [Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- ハードコードされたソーシャルリンク部分を `SocialLinks` コンポーネントに置き換えます。

#### [MODIFY] [Footer.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Footer.astro)
- ハードコードされたソーシャルリンク部分を `SocialLinks` コンポーネントに置き換えます。

## 検証計画

### 手動検証
- `npm run dev` を実行し、ブラウザで以下の点を確認します。
    - ヘッダーのSNSアイコン（X, GitHub, RSS）が正しく表示され、リンクが機能すること。
    - フッターのSNSアイコン（X, GitHub, RSS）が正しく表示され、リンクが機能すること。
    - デザイン（色、配置、ホバー効果）がリファクタリング前と変わらないこと。
