---
description: タグとの差分を確認し、追加指示があれば実行
argument-hint: <tag-name> [追加の指示]
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git tag:*), Read, Glob, Grep
---

## Git Diff Context

- Target tag: $1
- Changed files: !`git diff --name-only $1`
- Detailed diff: !`git diff $1`
- Commits since tag: !`git log --oneline $1..HEAD`

## Task

差分情報を分析してください。

追加の指示がある場合はそれに従ってください：
$ARGUMENTS
