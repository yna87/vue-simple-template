import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

interface FrontendStackProps extends cdk.StackProps {
  githubOrg: string;
  githubRepo: string;
  githubOidcProviderArn?: string; // Optional: Reuse existing OIDC Provider instead of creating a new one
  basicAuthUser?: string; // Optional: Enable Basic Auth
  basicAuthPass?: string; // Optional: Enable Basic Auth
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // S3 Bucket for hosting static website
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: undefined, // Let CloudFormation generate a unique name
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Delete bucket on stack deletion (suitable for personal development)
      autoDeleteObjects: true, // Automatically delete objects when bucket is deleted
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // CloudFront Origin Access Control (OAC) - recommended over OAI
    const originAccessControl = new cloudfront.S3OriginAccessControl(
      this,
      'OAC',
      {
        description: `OAC for ${props.githubRepo}`,
        signing: cloudfront.Signing.SIGV4_ALWAYS,
      }
    );

    // CloudFront Function for Basic Auth (optional)
    let basicAuthFunction: cloudfront.Function | undefined;
    if (props.basicAuthUser && props.basicAuthPass) {
      // Read the function code template
      const functionCodeTemplate = fs.readFileSync(
        path.join(__dirname, 'functions', 'basic-auth.js'),
        'utf8'
      );

      // Encode credentials to Base64 (CloudFront Functions don't have btoa)
      const credentials = `${props.basicAuthUser}:${props.basicAuthPass}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');

      // Replace placeholders with actual values
      const functionCode = functionCodeTemplate
        .replace('%%BASIC_AUTH_BASE64%%', base64Credentials)
        .replace('%%REALM%%', props.githubRepo);

      basicAuthFunction = new cloudfront.Function(this, 'BasicAuthFunction', {
        code: cloudfront.FunctionCode.fromInline(functionCode),
        comment: 'Basic Authentication for CloudFront',
        runtime: cloudfront.FunctionRuntime.JS_2_0,
      });
    }

    // CloudFront Distribution
    // Note: S3BucketOrigin.withOriginAccessControl() automatically updates the bucket policy
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket, {
          originAccessControl: originAccessControl,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: basicAuthFunction
          ? [
              {
                function: basicAuthFunction,
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              },
            ]
          : undefined,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      // Price Class options (lower price class = lower cost):
      // - PRICE_CLASS_100: North America, Europe (lowest cost)
      // - PRICE_CLASS_200: Above + Asia Pacific, Middle East, Africa (recommended for Japan)
      // - PRICE_CLASS_ALL: All edge locations (highest coverage, highest cost)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });

    // GitHub OIDC Provider
    // Reuse existing OIDC Provider if ARN is provided, otherwise create a new one
    let githubOidcProvider: iam.IOpenIdConnectProvider;
    if (props.githubOidcProviderArn) {
      // Reference existing OIDC Provider
      githubOidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        'GitHubOidcProvider',
        props.githubOidcProviderArn
      );
    } else {
      // Create new OIDC Provider
      const provider = new iam.OpenIdConnectProvider(
        this,
        'GitHubOidcProvider',
        {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        }
      );
      // Always retain OIDC Provider to avoid breaking other projects that may reference it
      provider.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
      githubOidcProvider = provider;
    }

    // IAM Role for GitHub Actions
    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: new iam.WebIdentityPrincipal(
        githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:*`,
          },
        }
      ),
      description: 'Role for GitHub Actions to deploy to S3 and CloudFront',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Grant permissions to the GitHub Actions role
    websiteBucket.grantReadWrite(githubActionsRole);

    githubActionsRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubActionsRole.roleArn,
      description: 'IAM Role ARN for GitHub Actions',
    });

    new cdk.CfnOutput(this, 'GitHubOidcProviderArn', {
      value: githubOidcProvider.openIdConnectProviderArn,
      description:
        'GitHub OIDC Provider ARN (can be reused for other projects)',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Website URL',
    });
  }
}
