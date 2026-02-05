# 実装計画: Faviconの更新

ブログのfaviconを、現在のAstroロゴから抹茶ティーをモチーフにしたシンプルな画像に変更します。

## ユーザーレビューが必要な事項
- 生成された画像の確認（デザインが意図通りか）

## 変更内容

### 画像リソース
#### [NEW] [favicon.png](file:///Users/yokoyama/git/mm2-blog/public/favicon.png)
- 生成AIを使用して作成する抹茶ティーのアイコン画像。

#### [DELETE] [favicon.svg](file:///Users/yokoyama/git/mm2-blog/public/favicon.svg)
- 既存のAstroロゴ画像。

#### [DELETE] [favicon.ico](file:///Users/yokoyama/git/mm2-blog/public/favicon.ico)
- 既存のfaviconファイル。

### コンポーネント
#### [MODIFY] [BaseHead.astro](file:///Users/yokoyama/git/mm2-blog/src/components/BaseHead.astro)
- faviconの読み込みパスを `.svg` / `.ico` から `.png` に変更します。

## 検証計画

### 自動テスト
- 特になし（ビジュアル変更のため）

### 手動検証
1. `npm run dev` でサーバーを起動する。
2. ブラウザでトップページを開く。
3. タブのfaviconが抹茶ティーの画像になっていることを目視確認する。
