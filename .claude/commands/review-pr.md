---
description: PRの差分とCopilotレビューを確認・分析する
arguments:
  - name: pr_number
    description: PR番号
    required: true
---

以下のPR #$ARGUMENTS.pr_number について、差分とレビューコメントを取得し分析してください。

## 1. 差分を取得
```bash
gh pr diff $ARGUMENTS.pr_number
```

## 2. PR情報とコメントを取得
```bash
gh pr view $ARGUMENTS.pr_number --comments
```

## 3. コード行へのレビューコメントを取得
```bash
gh api repos/:owner/:repo/pulls/$ARGUMENTS.pr_number/comments
```

## 4. レビュー（Approve/Request changes等）を取得
```bash
gh api repos/:owner/:repo/pulls/$ARGUMENTS.pr_number/reviews
```

---

上記のコマンドを実行して情報を取得した後、以下の形式で分析結果を報告してください：

### 📋 PR概要
- PRのタイトルと説明を簡潔にまとめる

### 📝 変更内容
- 変更されたファイルと主な変更点を箇条書きで説明

### 🔍 レビュー指摘事項
- GitHub Copilot や他のレビュアーからのコメントを一覧化
- 各コメントの対象ファイル・行番号を明記

### 💡 対応提案
- 各指摘事項に対する具体的な修正案を提示
- 可能であればコード例も含める
