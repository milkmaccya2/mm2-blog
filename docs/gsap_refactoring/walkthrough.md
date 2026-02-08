# 修正内容の確認 (Walkthrough)

## 変更ファイル一覧
| ファイルパス | 変更タイプ | 説明 |
| --- | --- | --- |
| `src/scripts/animations.ts` | 新規作成 | GSAPアニメーションの共通ロジックファイル |
| `src/layouts/BaseLayout.astro` | 変更 | 共通スクリプトの読み込みを追加 |
| `src/pages/index.astro` | 変更 | インラインスクリプトの削除 |

## 実装ステップ
1. `src/scripts` ディレクトリを作成する。
2. `src/scripts/animations.ts` を作成し、共通ロジックを実装する。
3. `src/layouts/BaseLayout.astro` にスクリプトのインポートを追加する。
4. `src/pages/index.astro` から不要になったスクリプトを削除する。
