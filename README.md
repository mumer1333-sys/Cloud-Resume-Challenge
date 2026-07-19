# Cloud Resume Challenge — Enhanced

A serverless AWS resume website built with S3, CloudFront, Lambda, 
DynamoDB, API Gateway, Terraform, and GitHub Actions CI/CD.

## Architecture
Coming soon — will add diagram when complete.

## Security decisions
- S3 bucket locked down behind CloudFront Origin Access Control
- Lambda function scoped IAM role — no wildcards
- HTTPS enforced end to end
- Credentials stored as GitHub Secrets, never hardcoded

## Live site
Coming soon.

## Tech stack
AWS S3 · CloudFront · Lambda · DynamoDB · API Gateway · 
Terraform · GitHub Actions · Python · JavaScript
