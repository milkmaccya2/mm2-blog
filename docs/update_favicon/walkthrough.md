# Walkthrough: Update Favicon

ブログのfaviconを抹茶ティーの画像に更新しました。

## 変更内容

### 画像ファイルの追加
- `public/favicon.png`: 新しい抹茶ティーのアイコン画像を追加。

### 画像ファイルの削除
- `public/favicon.svg`: 旧Astroロゴ。
- `public/favicon.ico`: 旧favicon。

### コードの修正
`src/components/BaseHead.astro` のfavicon参照を更新しました。

```diff
- <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
- <link rel="icon" href="/favicon.ico" />
+ <link rel="icon" type="image/png" href="/favicon.png" />
```

## 検証結果

### 手動検証
- ローカルサーバー (`http://localhost:4321`) を起動し、ブラウザのタブに新しい抹茶ティーのアイコンが表示されることを確認しました。
