---
trigger: always_on
---

# Git Branching Strategy
- コードの変更や機能追加を行う際は、必ず `main` ブランチから新しいトピックブランチ（例: `feature/xxx` や `fix/xxx`）を作成し、チェックアウトしてから作業を開始すること。
- ユーザーから明示的な指示がない限り、直接 `main` ブランチで作業しないこと。