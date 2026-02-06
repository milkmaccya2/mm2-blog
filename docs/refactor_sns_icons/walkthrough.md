# Social Icons Refactoring Walkthrough

SNSアイコンのハードコードを排除し、DRY原則に基づいて共通化を行いました。また、セキュリティ向上のため外部リンクセキュリティ対策を実施しました。

## 変更内容

### 1. データの一元管理
`src/consts.ts` に `SOCIAL_LINKS` 定数を定義し、SNSリンク情報（ラベル、URL、SVGパス）を集約しました。

### 2. 共通コンポーネントの作成
`src/components/SocialLinks.astro` を作成しました。
- `consts.ts` のデータを使用してリンクを生成します。
- **セキュリティ対策**: すべてのリンクに `rel="noopener noreferrer"` を付与しました。
- **柔軟なスタイル**: `Header` と `Footer` のデザイン差異を吸収するため、`linkClass` プロパティでクラスを上書き可能にしました（デフォルトはヘッダー用のスタイル）。

### 3. 各コンポーネントへの適用
#### Header.astro
共通コンポーネントを使用するように変更しました。デフォルトのスタイルが適用されます。

```astro
<div class="hidden gap-2 social-links md:flex">
    <SocialLinks />
</div>
```

#### Footer.astro
共通コンポーネントを使用し、フッター用の配色（`text-gray-500`等）を適用しました。

```astro
<div class="flex justify-center gap-4 mt-4">
    <SocialLinks linkClass="text-gray-500 hover:text-gray-700" />
</div>
```

## 検証結果

### ビルド確認
`npm run build` が正常に完了することを確認しました。

### 確認事項
ブラウザで以下の点を確認してください：
- ヘッダーとフッターの各SNSアイコンが正しく表示されているか。
- 各リンクが新しいタブで開き、`rel="noopener noreferrer"` が付与されているか（開発者ツールで確認可能）。
- `Header` は黒ベース、`Footer` はグレーベースの色が維持されているか。
