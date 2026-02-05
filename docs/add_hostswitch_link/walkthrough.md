# Projects Page Addition

ブログに「Projects」ページを追加し、HostSwitchなどの個人開発プロダクトを紹介できるようにしました。

## Changes

### Pages

#### [NEW] [projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- 新しいプロジェクト一覧ページ。
- 現在は HostSwitch が掲載されています。

### Components

#### [MODIFY] [Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- ナビゲーションに「Projects」リンクを追加しました。

## Verification Results

### Automated Tests
- `npm run build` によりビルドが成功することを確認しました。

### Manual Verification
- ローカルプレビューにて、以下の点を確認しました：
    - ヘッダーに「Projects」リンクが表示されること。
    - リンクをクリックすると `/projects` に遷移すること。
    - ページ内に HostSwitch の情報とリンクが正しく表示されること。

![Projects Page](projects_page_verification_1770284406523.png)
