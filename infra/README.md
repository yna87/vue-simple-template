# Infrastructure Setup

このディレクトリには、AWS CDKを使用してCloudFront + S3でフロントエンドアプリケーションをホスティングするためのインフラコードが含まれています。

## 前提条件

- [AWS CLI](https://aws.amazon.com/cli/)がインストールされ、設定されていること
- [AWS CDK](https://aws.amazon.com/cdk/)の基本的な理解
- AWSアカウントの管理者権限

## セットアップ手順

### 1. 依存関係のインストール

```bash
cd infra
pnpm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成し、あなたのプロジェクト情報に更新してください：

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```bash
# GitHub repository information
GITHUB_ORG=your-github-org       # あなたのGitHub組織名またはユーザー名
GITHUB_REPO=your-repo-name       # リポジトリ名

# Optional: 既存のOIDC Provider ARNがあれば設定
# GITHUB_OIDC_PROVIDER_ARN=arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com

# Optional: Basic認証を有効にする場合（コメントアウトを解除）
# BASIC_AUTH_USER=admin
# BASIC_AUTH_PASS=your-secure-password
```

**重要**:

- `.env` ファイルは `.gitignore` で除外されており、Gitにコミットされません
- Stack名はリポジトリ名から自動生成されます（例: `my-project` → `my-projectStack`）
- これにより、同じAWSアカウントで複数のプロジェクトをデプロイしてもリソース名が衝突しません

### 3. AWS環境の設定

デフォルトでは `ap-northeast-1`（東京）リージョンにデプロイされます。別のリージョンを使用する場合は `.env` に追加してください：

```bash
CDK_DEFAULT_REGION=us-east-1  # 米国東部など
```

### 4. CDKのブートストラップ（初回のみ）

AWSアカウントとリージョンでCDKを初めて使用する場合は、ブートストラップが必要です：

```bash
npx cdk bootstrap
```

### 5. デプロイ前の確認

まず、作成されるリソースを確認します：

```bash
# CloudFormationテンプレートの確認
pnpm run synth

# または差分確認（初回は全て新規作成として表示されます）
pnpm run diff
```

### 6. デプロイ

内容を確認したら、デプロイを実行します：

```bash
pnpm run deploy
```

デプロイが完了すると、以下の情報が出力されます：

- **BucketName**: S3バケット名
- **DistributionId**: CloudFrontディストリビューションID
- **DistributionDomainName**: CloudFrontのドメイン名
- **GitHubActionsRoleArn**: GitHub Actions用のIAMロールARN
- **GitHubOidcProviderArn**: GitHub OIDC Provider ARN（他のプロジェクトでも再利用可能）
- **WebsiteURL**: ウェブサイトのURL

### 7. GitHub Secrets と Variables の設定

GitHub Actionsからデプロイできるように、以下の値をリポジトリに設定してください。

#### Secrets の設定

1. GitHubリポジトリの **Settings** > **Secrets and variables** > **Actions** > **Secrets** タブに移動
2. 以下のSecretを追加：

| Secret名       | 値                                | 説明                           |
| -------------- | --------------------------------- | ------------------------------ |
| `AWS_ROLE_ARN` | CDKの出力: `GitHubActionsRoleArn` | GitHub Actions用のIAMロールARN |

#### Variables の設定

1. **Settings** > **Secrets and variables** > **Actions** > **Variables** タブに移動
2. 以下のVariablesを追加：

| Variable名                   | 値                          | 説明                               |
| ---------------------------- | --------------------------- | ---------------------------------- |
| `AWS_REGION`                 | 例: `ap-northeast-1`        | AWSリージョン（デフォルト: 東京）  |
| `S3_BUCKET_NAME`             | CDKの出力: `BucketName`     | S3バケット名                       |
| `CLOUDFRONT_DISTRIBUTION_ID` | CDKの出力: `DistributionId` | CloudFrontディストリビューションID |

## デプロイ方法

セットアップ完了後、以下の方法でデプロイできます。

### 手動デプロイ（デフォルト）

1. GitHubリポジトリの **Actions** タブに移動
2. **deploy-frontend** ワークフローを選択
3. **Run workflow** をクリック

### 自動デプロイの有効化

**main ブランチへの push 時に自動デプロイしたい場合**は、`.github/workflows/deploy.yml` を編集してください。

ファイル内の `on.push` のコメントアウトを解除します：

```yaml
on:
  workflow_dispatch:

  # 以下のコメントアウトを解除すると自動デプロイが有効になります
  push:
    branches: [main]
```

これにより、main ブランチへマージされるたびに自動的にデプロイされます。

## インフラの更新

CDKコードを変更した場合：

```bash
# 変更内容の確認
pnpm run diff

# デプロイ
pnpm run deploy
```

## インフラの削除

インフラを削除する場合：

```bash
npx cdk destroy
```

**このテンプレートは個人開発向けに設定されています。**

**削除されるリソース**:

- ✅ S3 バケットとその中のオブジェクト（全て削除されます）
- ✅ CloudFront Distribution
- ✅ CloudFront Origin Access Control
- ✅ IAM Role（GitHub Actions用）

**削除されないリソース**:

- ⚠️ **GitHub OIDC Provider**: 他のプロジェクトでも使用される可能性があるため、常に保持されます
  - 不要な場合は、以下のコマンドで手動削除できます：
    ```bash
    aws iam delete-open-id-connect-provider --open-id-connect-provider-arn <ARN>
    ```

**プロダクション環境で使用する場合**: `lib/frontend-stack.ts` で以下の設定を変更してください：

```typescript
removalPolicy: cdk.RemovalPolicy.RETAIN,  // バケットを保持
autoDeleteObjects: false,                  // オブジェクトを保持
```

## 既存のOIDC Providerを使用する場合

AWSアカウントに既にGitHub Actions用のOIDC Provider（`token.actions.githubusercontent.com`）が存在する場合は、`.env` ファイルにARNを設定することで再利用できます：

```bash
# .env
GITHUB_OIDC_PROVIDER_ARN=arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com
```

OIDC ProviderのARNは以下のコマンドで確認できます：

```bash
aws iam list-open-id-connect-providers
```

環境変数を設定しない場合は、新しいOIDC Providerが自動的に作成されます。

## Basic認証の設定

デプロイしたアプリケーションにBasic認証をかけることができます。

### Basic認証を有効にする

`.env` ファイルに以下の設定を追加してください：

```bash
# Basic認証の有効化
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=your-secure-password
```

**セキュリティのヒント**:

- パスワードは十分に複雑なものを使用してください
- `.env` ファイルは `.gitignore` で除外されているため、Gitにコミットされません
- 本番環境では、より強固な認証方式の使用を検討してください

### Basic認証を無効にする

Basic認証を無効にしたい場合は、`.env` ファイルから `BASIC_AUTH_USER` と `BASIC_AUTH_PASS` をコメントアウトまたは削除して、再デプロイしてください。

```bash
pnpm run deploy
```

### 仕組み

Basic認証は CloudFront Functions を使用して実装されています。これにより：

- 低コスト（Lambda@Edgeより安価）
- レスポンスが速い
- 管理が簡単

すべてのリクエストに対してBasic認証が求められます。正しい認証情報を入力しないとアクセスできません。

## トラブルシューティング

### OIDC Provider already exists

このエラーが発生した場合は、既にGitHub Actions用のOIDC Providerがアカウントに存在しています。上記の「既存のOIDC Providerを使用する場合」セクションを参照して、既存のOIDC Provider ARNを指定してください。

### CloudFront Distribution作成に時間がかかる

CloudFrontディストリビューションの作成には15〜20分程度かかることがあります。

## 参考リンク

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
