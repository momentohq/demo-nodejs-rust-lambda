import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DemoNodejsRustLambdaStack, DemoProps} from '../lib/demo-nodejs-rust-lambda-stack';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

const app = new cdk.App();

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
};

const momentoApiKey = getEnvVar('MOMENTO_API_KEY');
const logLevel = getEnvVar('LOG_LEVEL');

const demoProps: DemoProps = {
  momentoApiKey: momentoApiKey,
  logLevel: logLevel,
  architecture: cdk.aws_lambda.Architecture.ARM_64,
};

new DemoNodejsRustLambdaStack(app, 'DemoNodejsRustLambdaStack', demoProps, cdkStackProps);
