# Vue Simple Template

Vue 3 + TypeScript + Vite をベースにした、モダンなフロントエンド開発環境のテンプレートリポジトリです。

## 特徴

このテンプレートには以下のツールが設定済みです：

- **Vue 3** - プログレッシブフレームワーク（`<script setup>` 構文を使用）
- **TypeScript** - 型安全な開発環境
- **Vite** - 高速なビルドツール
- **Tailwind CSS v4** - ユーティリティファーストの CSS フレームワーク
- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマッター
- **Storybook** - UI コンポーネント開発・テスト環境
  - Storybook Test (addon-vitest) - ストーリーベースのテスト

## このテンプレートの使い方

### GitHub でテンプレートリポジトリとして使用する

1. このリポジトリのページで「Use this template」ボタンをクリック
2. 新しいリポジトリ名を入力して作成
3. 作成したリポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### ローカルでセットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## 利用可能なコマンド

```bash
# 開発サーバーの起動
pnpm dev

# コードの lint チェック
pnpm lint

# コードのフォーマット
pnpm format

# Storybook の起動
pnpm storybook
```

## ライセンス

[MIT License](LICENSE)
