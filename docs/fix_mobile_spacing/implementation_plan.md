# スマホビューの余白修正計画

## 概要
スマートフォンのビューにおいて、左右のpaddingとmarginが過剰であり、テキストの可読性が低下している問題を修正する。

## 問題点
- `src/styles/global.css` の `main` タグに対するスタイル (`max-width: calc(100% - 2em)`, `padding: 3em 1em`) が適用されている。
- `src/layouts/BlogPost.astro` 内部の `div` にも `max-w-[calc(100%-2em)]` と `p-4` が適用されており、マージン・パディングが二重に適用されている状態となっている。
- これにより、特に幅の狭いモバイル端末でテキスト表示領域が極端に狭くなっている。

## 変更内容

### [src/layouts/BlogPost.astro](file:///Users/yokoyama/git/mm2-blog/src/layouts/BlogPost.astro)

1. **`<main>` タグへのクラス追加**
   - Global CSSの影響をリセットし、適切な余白を設定する。
   - `class="w-full max-w-4xl mx-auto px-4"` 程度に設定し、モバイルでの可読性を確保する。

2. **内部 `<div>` のスタイル調整**
   - `max-w-[calc(100%-2em)]` を削除し、親要素 (`main`) の幅に合わせる (`w-full`)。
   - `p-4` は維持するか、デザインバランスを見て調整する。

## 検証計画
- `npm run dev` でローカルサーバーを起動。
- ブラウザの開発者ツール（モバイルモード）で余白が改善されているか確認する。
