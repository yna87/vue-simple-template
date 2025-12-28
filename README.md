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
- **Vitest** - 高速なユニットテストフレームワーク
  - Vue Test Utils - Vue コンポーネントのテストユーティリティ
  - jsdom - DOM 環境のシミュレーション
- **GitHub Actions** - CI/CD パイプライン
  - CI: 型チェック・Lint・テスト・ビルド検証
  - Storybook のビルド・テスト
  - Gitleaks による機密情報スキャン
  - CD: CloudFront + S3 へのデプロイ
- **AWS CDK** - インフラストラクチャコード
  - CloudFront + S3 による静的ホスティング

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

# Storybook の起動
pnpm storybook

# テストの実行
pnpm test              # すべてのテストを実行
pnpm test:unit         # ユニットテストのみ実行
pnpm test:storybook    # Storybook テストのみ実行

# コードの lint チェック
pnpm lint

# コードのフォーマット
pnpm format

# 型チェック
pnpm type-check

# プロダクションビルド
pnpm build
```

## CI/CD

このテンプレートには GitHub Actions を使用した CI/CD パイプラインが設定されています。

### ワークフロー

- **ci-frontend** - フロントエンドの品質チェック
  - 型チェック（TypeScript）
  - Lint チェック（ESLint）
  - ユニットテスト（Vitest）
  - ビルド検証

- **ci-storybook** - Storybook のテスト
  - Storybook のビルド検証
  - ストーリーベースのテスト実行

- **gitleaks** - セキュリティスキャン
  - 機密情報（API キー、パスワードなど）の検出

すべてのワークフローは `main` ブランチへの push と pull request 時に自動実行されます。

### パフォーマンス最適化

CI の実行時間を短縮するため、以下のキャッシュが設定されています：

- **pnpm キャッシュ** - 依存関係のインストール時間を短縮
- **Vite ビルドキャッシュ** - ビルド時間を短縮
- **Vitest キャッシュ** - テスト実行時間を短縮
- **Playwright ブラウザキャッシュ** - ブラウザのダウンロード時間を短縮（約1-2分）

キャッシュは `pnpm-lock.yaml` の変更時に自動的に更新されます。

## デプロイ

このテンプレートには、CloudFront + S3 を使用した AWS デプロイ機能が含まれています（オプション）。

- AWS CDK による Infrastructure as Code
- GitHub Actions OIDC 認証（アクセスキー不要）
- デフォルトは手動デプロイ、自動デプロイも簡単に有効化可能

詳細なセットアップ手順は [infra/README.md](infra/README.md) を参照してください。

## ライセンス

[MIT License](LICENSE)
