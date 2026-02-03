# スマホビューの余白修正

## 変更内容

### [src/layouts/BlogPost.astro](file:///Users/yokoyama/git/mm2-blog/src/layouts/BlogPost.astro)

モバイルビューでの過剰な余白を解消し、テキストの可読性を向上させました。

#### 主な変更点
1. **`<main>` タグのスタイル上書き**
   - Global CSS (`src/styles/global.css`) による `max-width: calc(100% - 2em)` と `padding: 3em 1em` の適用を打ち消すため、強制的にフル幅とパディング調整を行いました。
   - `class="max-w-full! px-0! md:px-4!"` を追加。

2. **内部コンテナの幅制限解除**
   - 内部の `<div>` に適用されていた `max-w-[calc(100%-2em)]` を削除しました。
   - 代わりに `w-full max-w-[720px]` を設定し、記事の最大幅を維持しつつ、モバイルでは画面幅を有効活用できるようにしました。

```diff
-		<main>
+		<main class="max-w-full! px-0! md:px-4!">
 			<article>
 				<div class="w-full">
...
 				</div>
 				<div
-					class="w-[720px] max-w-[calc(100%-2em)] mx-auto p-4 text-gray-700 prose prose-lg prose-headings:text-black hover:prose-a:text-blue-500"
+					class="w-full max-w-[720px] mx-auto px-4 text-gray-700 prose prose-lg prose-headings:text-black hover:prose-a:text-blue-500"
 				>
```

## 検証結果
- モバイルビューにおいて、左右の余白が `1rem` (px-4) ずつとなり、テキスト領域が大幅に広がりました。
- デスクトップビュー（720px以上）の表示は以前と変わらず、中央寄せが維持されていることを想定しています。

### 目次のスタイル調整

1. **インデントロジックの変更**
   - 見出し2 (H2) を基準（インデントなし）とするように変更しました。
   - インデント幅をスマホ向けに縮小・最適化しました。

```diff
													1: 'ml-0',
-													2: 'ml-2 md:ml-4',
-													3: 'ml-4 md:ml-8',
+													2: 'ml-0',
+													3: 'ml-2 md:ml-4',
```

2. **リストスタイルの変更**
   - 黒丸（bullet points）を表示 (`list-disc`) しつつ、親要素の左パディング (`ml-4`) を除去しました。
   - `list-outside` を指定し、マーカーをコンテンツ領域の外に出すことで、本文の左端を揃えつつ、親コンテナのパディング内にマーカーを表示させています。
   - これにより、画面幅を有効活用しつつ、リストとしての構造も維持しました。
