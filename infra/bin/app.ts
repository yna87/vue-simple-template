#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = new cdk.App();

// GitHub repository information
const githubOrg = process.env.GITHUB_ORG;
const githubRepo = process.env.GITHUB_REPO;

if (!githubOrg || !githubRepo) {
  throw new Error(
    '\n❌ GITHUB_ORG and GITHUB_REPO are required!\n\n' +
      '💡 Quick start:\n' +
      '   1. cp .env.example .env\n' +
      '   2. Edit .env and set your repository info\n'
  );
}

// Stack name based on repository name to avoid collisions
const stackName = process.env.STACK_NAME || `${githubRepo}Stack`;

// Optional: ARN of existing GitHub OIDC Provider (if already exists in AWS account)
const githubOidcProviderArn = process.env.GITHUB_OIDC_PROVIDER_ARN;

// Optional: Basic Auth credentials
const basicAuthUser = process.env.BASIC_AUTH_USER;
const basicAuthPass = process.env.BASIC_AUTH_PASS;

// Validate Basic Auth configuration
if (
  (basicAuthUser && !basicAuthPass) ||
  (!basicAuthUser && basicAuthPass)
) {
  throw new Error(
    '\n❌ Both BASIC_AUTH_USER and BASIC_AUTH_PASS must be set to enable Basic Auth!\n\n' +
      '💡 Update your .env file:\n' +
      '   BASIC_AUTH_USER=admin\n' +
      '   BASIC_AUTH_PASS=your-secure-password\n'
  );
}

new FrontendStack(app, stackName, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  },
  githubOrg,
  githubRepo,
  githubOidcProviderArn,
  basicAuthUser,
  basicAuthPass,
});
