# Cloud Resume Challenge Enhanced

A fully serverless AWS resume website built with security-first principles.

## Architecture
- S3 (static hosting) → CloudFront (CDN + HTTPS) → Browser
- Browser → API Gateway → Lambda → DynamoDB (visitor counter)

## Security Decisions
- S3 bucket completely private — accessible only via CloudFront OAC
- Lambda function scoped IAM role — no wildcard permissions
- HTTPS enforced end to end via CloudFront
- All credentials stored as GitHub Secrets — never hardcoded

## Tech Stack
AWS S3 · CloudFront · Lambda · DynamoDB · API Gateway
Terraform · GitHub Actions · Python · JavaScript

## Live Site
Coming soon

## Status
In progress
