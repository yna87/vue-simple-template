# 機能追加メモ

## 推奨する実装順序

1. **Vue Router** - 複数ページへの拡張の基礎
2. **UIコンポーネントライブラリ** - 実用的なサンプルの充実
3. **Pinia** - 状態管理のベストプラクティス
4. **Husky + lint-staged** - 開発体験の向上
5. **E2Eテスト** - 品質保証の強化

---

## 優先度: 高

### ルーティング機能の追加 (Vue Router)
- 複数ページアプリケーションへの対応
- ルート設定の型安全性
- ナビゲーションガード、動的ルーティングの例

### 状態管理の追加 (Pinia)
- グローバル状態管理のベストプラクティス
- TypeScriptとの統合
- Devtools対応

### 再利用可能なUIコンポーネントライブラリの構築
- Button, Input, Card, Modal などの基本コンポーネント
- アクセシビリティ対応（ARIA属性、キーボード操作）
- 各コンポーネントのStorybookストーリー
- バリエーション（サイズ、色、状態）の体系化

### E2Eテストの追加
- Playwrightを使ったエンドツーエンドテスト（既にインストール済み）
- ユーザーフローのテストシナリオ例
- CI/CDパイプラインへの統合

---

## 優先度: 中

### APIクライアント統合
- Axios または Fetch API のラッパー
- TanStack Query (Vue Query) によるデータフェッチング
- エラーハンドリング、リトライロジック
- モック/インターセプターの設定例

### フォームバリデーション
- Zodによるスキーマバリデーション
- VeeValidateとの統合
- エラーメッセージの国際化対応

### 環境変数管理の強化
- `.env.example` の提供
- 環境ごとの設定（dev/staging/prod）
- TypeScriptによる型定義（`ImportMetaEnv`）

### Pre-commit Hooks (Husky + lint-staged)
- コミット前の自動Lint/Format実行
- コミットメッセージの規約（Conventional Commits）
- 品質の自動チェック

### ユーティリティ関数・Composables の拡充
- useLocalStorage, useDebounce, useThrottle
- useBreakpoints（レスポンシブデザイン）
- useFetch, useAsync などの非同期処理用

---

## 優先度: 中〜低

### ダークモードサポート
- Tailwind CSS v4のダークモード機能活用
- テーマ切り替えの実装
- LocalStorageでの設定保存

### 国際化 (i18n)
- vue-i18nの統合
- 多言語サポートの実装例
- 日時、数値のロケール対応

### エラーハンドリング強化
- グローバルエラーハンドラー
- エラーバウンダリーコンポーネント
- エラーログの収集（Sentry等との統合例）

### パフォーマンス最適化ツール
- Bundle Analyzer の統合
- Lighthouse CIの追加
- Core Web Vitals の監視

### ドキュメント充実
- アーキテクチャ設計ドキュメント
- コンポーネント開発ガイドライン
- コントリビューションガイド
- ディレクトリ構造の説明

### アクセシビリティ強化
- すでにStorybook a11yアドオンは導入済み
- フォーカス管理のユーティリティ
- スクリーンリーダー対応の検証

---

## すでに優れている点

- モダンなビルド環境（Vite, TypeScript）
- 充実したテスト環境（Vitest, Storybook Test）
- CI/CDパイプライン完備
- AWS CDKによるインフラコード
- コード品質ツール（ESLint, Prettier）
- セキュリティスキャン（Gitleaks）
- パフォーマンス最適化されたCI（キャッシュ設定）
