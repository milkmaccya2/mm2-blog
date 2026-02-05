# Add Tech Stack to Projects

プロジェクト一覧に詳細な技術スタックの情報を追加します。

## User Review Required

- 特になし。

## Proposed Changes

### Pages

#### [MODIFY] [src/pages/projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- 各プロジェクトカードに以下の技術スタックを追加します。

**HostSwitch**
- TypeScript, Node.js, Biome, Vitest, Docusaurus

**POS-80 Thermal Printer Controller**
- Astro, React, TailwindCSS, Node.js, pnpm, Sharp, Puppeteer, Google Calendar API, PM2

## Verification Plan

### Manual Verification
- `npm run dev` で表示を確認します。
- 技術スタックのリストが正しく表示され、デザインが崩れていないことを確認します。
