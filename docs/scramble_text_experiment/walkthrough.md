# 変更履歴 (Walkthrough)

## 変更内容

### 1. `src/scripts/animations.ts`
- **GSAP公式 `ScrambleTextPlugin` の導入**:
    - Webflowによる買収後のライセンス変更により無料化されたため、公式プラグインを採用しました。
    - `gsap/ScrambleTextPlugin` からインポートし、`gsap.registerPlugin` で登録しました。
- **コードの簡素化**:
    - 以前作成した自前の `animateScrambleText` 関数を削除しました。
    - 公式プラグインの API (`scrambleText: { ... }`) を使用することで、コード量が減り、可読性が向上しました。
    - `revealDelay` や `speed` などのパラメータを使用して、アニメーションの微調整を行いました。

## 確認方法
1.  開発サーバーを起動: `npm run dev`
2.  ブラウザでトップページ (`http://localhost:4321`) にアクセス。
3.  「Projects」および「Recent Posts」セクションが表示される際に、スクランブルテキストアニメーションが正常に動作することを確認してください。
