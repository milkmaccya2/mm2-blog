# Personal Projects Page Addition

ユーザーリクエストに基づき、ブログに「Personal Projects」ページを追加しました。
複数の反復を経て、レイアウトの調整、技術スタックの追加、およびタイトルの変更を行いました。

## Final Changes

### Pages

#### [NEW] [src/pages/projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- **タイトル**: "Personal Projects"
- **掲載プロジェクト**:
    1. **POS-80 Thermal Printer Controller**
        - 説明: Raspberry Piに接続されたPOS-80サーマルプリンターを制御するWebインターフェース。
        - Tech Stack: Astro, React, TailwindCSS, Node.js, pnpm, Sharp, Puppeteer, Google Calendar API, Raspberry Pi, PM2
        - Link: GitHub README
    2. **HostSwitch**
        - 説明: hostsファイルを快適に切り替えるCLIツール。
        - Tech Stack: TypeScript, Node.js, Biome, Vitest, Docusaurus
        - Link: Documentation Site

### Navigation

#### [MODIFY] [src/components/Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- ナビゲーションメニューに「Projects」へのリンクを追加しました。

## Verification Results

### Manual Verification
- `npm run preview` にて以下の点を確認しました：
    - ページタイトルが "Personal Projects" であること。
    - 各プロジェクトカード間に適切なマージンがあること。
    - 技術スタックのバッジが正しく表示され、"Raspberry Pi" が含まれていること。
    - 左側のボーダーデザインがカード全体（リンクまで）をカバーしていること。

![Final Projects Page](final_projects_page_1770294357613.png)
