# Note記事連携 設計ドキュメント

## 概要

note.com に投稿した有料記事をトップページに掲載し、アウトプットの一覧性・発見性を高める。

## 目的

- noteのネームバリューとドメインパワーを活用しつつ、自分のブログからリンクする
- 書いた記事を一箇所にまとめてアウトプットとして可視化する
- 収益化コンテンツ（有料記事）であることを明示する

## 方針決定

| 検討項目 | 決定 | 理由 |
|----------|------|------|
| 表示場所 | トップページのセクション | 記事数が少ないため専用ページは不要 |
| 表示方法 | 独立セクション（Projectsと同形式） | 有料外部リンクとブログ記事を混在させない |
| データ管理 | 静的データ（`src/data/notes.ts`） | 記事数が少ない・外部APIへの依存を避ける |

## 実装内容

### 1. データファイル追加

**`src/data/notes.ts`**

```ts
export type NoteArticle = {
  title: string;
  url: string;
  pubDate: Date;
  description?: string;
  isPaid: boolean;
};

export const NOTES: NoteArticle[] = [
  // 記事を追加していく
];
```

### 2. コンポーネント追加

**`src/components/NoteCard.astro`**

各note記事カードのUI。以下を表示する：

- タイトル（外部リンク、`target="_blank" rel="noopener noreferrer"`）
- 公開日
- 説明文（`description` がある場合）
- 有料バッジ（`isPaid: true` の場合）
- 「noteで読む →」リンク

スタイルは既存の `ProjectCard.astro` に準拠する。

### 3. トップページ変更

**`src/pages/index.astro`**

Projectsセクションの下、Recent Postsセクションの上に「Note」セクションを追加する。

```
Hero
Projects     ← 既存
Note         ← 追加（ここ）
Recent Posts ← 既存
```

セクションヘッダーは既存の Projects セクションと同じマークアップパターンを踏襲する（スクランブルテキスト、アニメーション等）。

noteのプロフィールページへの「View All →」リンクも設置する。

## 今後の拡張

記事が増えた場合は `src/data/notes.ts` に追記するだけで対応できる。将来的に記事が10本以上になったタイミングでRSS取得や専用ページへの移行を検討する。
