# RSSフィード復活と独自実装の検証

## Changes
### `src/pages/rss.xml.js` の改修
Astro v6 (beta) と `@astrojs/rss` の互換性問題により、RSS生成処理を独自実装に置き換えました。

- `@astrojs/rss` のインポートを削除
- 手動でRSS 2.0形式のXMLを生成するコードを実装
    - 記事データの取得 (`getCollection('blog')`)
    - 出版日順（降順）へのソート
    - 各記事のアイテム生成（タイトル、リンク、GUID、説明、出版日）

## Verification Results
### Automated Tests
- `curl` コマンドによるローカル環境での確認
    - `/rss.xml` が正常に取得できること。
    - XMLヘッダー、チャンネル情報、各記事アイテムが含まれていること。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>milkmaccya or something</title>
		<description>Welcome to my website!</description>
        <!-- ... items ... -->
    </channel>
</rss>
```
