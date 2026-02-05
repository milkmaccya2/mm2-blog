# 実装計画 - QR Noteプロジェクトの追加

## ゴール
Projectsページ (`src/pages/projects.astro`) に、新しいプロジェクト「QR Note」の紹介を追加する。

## ユーザーレビューが必要な事項
特になし。提供された情報を元に作成済。

## 変更内容

### `src/components/ProjectCard.astro`
- **[NEW]** `src/components/ProjectCard.astro`
    - プロジェクト情報を表示するための再利用可能なコンポーネントを作成します。
    - プロパティ:
        - `title`: プロジェクト名
        - `description`: 説明
        - `url`: プロジェクトのURL（デモサイトなど）
        - `repoUrl`: GitHubリポジトリのURL（オプション）
        - `tags`: 技術スタックの配列
        - `linkText`: リンクのテキスト（デフォルト: "View on GitHub"）

### `src/pages/projects.astro`
- **[MODIFY]** `src/pages/projects.astro`
    - 新しく作成した `ProjectCard` コンポーネントを使用するようにリファクタリングします。
    - 既存の「POS-80 Thermal Printer Controller」と「HostSwitch」を `ProjectCard` に置き換えます。
    - 新しいプロジェクト「QR Note」を追加します。
        - タイトル: QR Note
        - 説明: スマホとPCのちょっとした橋渡しアプリ
        - リンク: https://qrnote-sandy.vercel.app
        - リポジトリURL: https://github.com/milkmaccya2/qrnote/blob/main/README.md
        - 技術スタック: Next.js, React, Tailwind CSS, qrcode, Web Speech API, MediaRecorder API, AWS S3, PWA, TypeScript

## 検証計画

### 自動テスト
- 特になし

### 手動検証
1. 開発サーバーを起動 (`npm run dev`)
2. ブラウザで `http://localhost:4321/projects` にアクセス
3. QR Noteのセクションが表示されていることを確認
4. 既存のプロジェクト（POS-80, HostSwitch）が表示崩れなく正しく表示されていることを確認
5. コンポーネント化によるレイアウトの差異がないか確認
6. 各リンクが正しいことを確認
