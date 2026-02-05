# Refactor POS-80 Project Link

POS-80 プロジェクトの詳細ページを作成する代わりに、GitHubのREADMEへの直接リンクに変更します。

## User Review Required

- 特になし。

## Proposed Changes

### Pages

#### [MODIFY] [projects.astro](file:///Users/yokoyama/git/mm2-blog/src/pages/projects.astro)
- POS-80 プロジェクトのリンク先を `https://github.com/milkmaccya2/thermal-printer-app/blob/main/README.md` に変更します。
- `target="_blank"` を追加します。

### Clean Up

#### [DELETE] [src/pages/projects/pos-80-thermal-printer.md](file:///Users/yokoyama/git/mm2-blog/src/pages/projects/pos-80-thermal-printer.md)
- 不要になった詳細ページを削除します。

#### [DELETE] [src/layouts/ProjectLayout.astro](file:///Users/yokoyama/git/mm2-blog/src/layouts/ProjectLayout.astro)
- 不要になったレイアウトを削除します。

## Verification Plan

### Manual Verification
- ローカルプレビューで `Projects` ページを確認します。
- POS-80 のリンクをクリックし、GitHubのページが新しいタブで開くことを確認します。
