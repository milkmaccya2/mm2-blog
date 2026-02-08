# 実装計画: 公式ScrambleTextPluginの導入

## 概要
ホームページの特定の見出しに対して、GSAPの公式 `ScrambleTextPlugin` を使用したアニメーションを実装します。（以前のカスタム実装を置き換えます）

## 変更ファイル
1.  `src/scripts/animations.ts`:
    - `ScrambleTextPlugin` をインポートし、登録。
    - 以前のカスタム関数 `animateScrambleText` を削除。
    - 公式プラグイン `scrambleText: { ... }` を使用するコードに置き換え。

## 詳細手順

### 1. `src/scripts/animations.ts` の修正
- `import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';` を追加。
- `gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);` に更新。
- `.scramble-text` 要素に対するアニメーション定義を以下のように変更：
    ```javascript
    gsap.to(target, {
      duration: 1.5,
      scrambleText: {
        text: originalText,
        chars: '!<>-_\\/[]{}—=+*^?#________',
        revealDelay: 0.5,
        speed: 0.3,
      },
      scrollTrigger: { ... }
    });
    ```
- 古いヘルパー関数 `animateScrambleText` を削除。

### 2. 検証
- `npm run dev` でローカルサーバーを起動。
- ブラウザでトップページを開き、スクロールしてアニメーションが以前と同様、またはよりスムーズに動作することを確認。
