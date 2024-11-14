import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DemoNodejsRustLambdaStack, DemoProps} from '../lib/demo-nodejs-rust-lambda-stack';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export function initializeEnvVars() {
  const envFilePath = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(envFilePath)) {
    throw new Error(
      `.env file not found at ${envFilePath}; try copying .env.EXAMPLE to .env and editing it to contain the correct values`
    );
  }
  dotenv.config({path: envFilePath});
}

const app = new cdk.App();

initializeEnvVars();
const momentoApiKey = getEnvVar('MOMENTO_API_KEY');
const momentoFlushApiKey = getEnvVar('MOMENTO_FLUSH_API_KEY');
const momentoCacheName = getEnvVar('MOMENTO_CACHE_NAME');
const logLevel = getEnvVar('LOG_LEVEL');
const awsRegion = getEnvVar('AWS_REGION');

const demoProps: DemoProps = {
  momentoApiKey: momentoApiKey,
  momentoFlushApiKey: momentoFlushApiKey,
  momentoCacheName: momentoCacheName,
  logLevel: logLevel,
  architecture: cdk.aws_lambda.Architecture.ARM_64,
};

const cdkStackProps = {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

  env: {region: awsRegion, account: process.env.CDK_DEFAULT_ACCOUNT},
};

new DemoNodejsRustLambdaStack(app, 'DemoNodejsRustLambdaStack', demoProps, cdkStackProps);
