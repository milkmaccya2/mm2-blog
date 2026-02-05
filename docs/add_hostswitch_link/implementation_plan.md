# Create Projects Page

ブログに「Projects」ページを追加し、HostSwitchなどの個人開発プロダクトを紹介できるようにします。

## User Review Required

- 特になし。

## Proposed Changes

### Pages

#### [NEW] [projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- `BaseLayout` を使用した新しいページを作成します。
- 以下の内容を含むリストを表示します：
    - **HostSwitch**
        - 説明: A CLI tool for switching hosts file.
        - リンク: `https://milkmaccya2.github.io/hostswitch/en/`

### Components

#### [MODIFY] [Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- ナビゲーションメニューに「Projects」を追加します。
- リンク先は `/projects` とします。

```astro
<HeaderLink href="/projects">Projects</HeaderLink>
```

## Verification Plan

### Manual Verification
- ローカルプレビュー (`npm run dev`) で確認します。
- ヘッダーの「Projects」リンクをクリックし、`/projects` ページに遷移することを確認します。
- `/projects` ページに「HostSwitch」の情報が表示され、リンクが正しく機能することを確認します。
