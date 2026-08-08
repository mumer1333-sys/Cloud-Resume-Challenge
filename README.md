# Cloud Resume Challenge

A serverless, SECURITY-first resume website built entirely on AWS using Infrastructure as Code and a fully automated CI/CD pipeline.

## Live site
[https://d1g5mums18tcg4.cloudfront.net](https://d1g5mums18tcg4.cloudfront.net)

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Terraform](https://img.shields.io/badge/IaC-Terraform-623CE4)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)


## Architecture
- S3 (static hosting) → CloudFront (CDN + HTTPS) → Browser
- Browser → API Gateway → Lambda → DynamoDB (visitor counter)

## Security decisions

| Decision | What it defends against | Why |
|---|---|---|
| S3 bucket fully private, all 4 public access blocks enabled | Direct public access to storage, bypassing CDN/HTTPS entirely | Storage should never be the public entry point only the CDN should be |
| CloudFront Origin Access Control (OAC) instead of legacy OAI | Impersonation of CloudFront by other services | OAC uses SigV4 signed requests; it's AWS's current recommended approach, more secure than the deprecated OAI method |
| S3 bucket policy scoped to a specific CloudFront distribution ARN (not a wildcard) | Any other AWS customer's CloudFront distribution reading this bucket | Least privilege only *this* distribution should ever have read access |
| Lambda IAM role scoped to only `dynamodb:GetItem` / `dynamodb:UpdateItem` on one table ARN | Lambda being able to read/write other DynamoDB tables or perform destructive actions | Least privilege — the function only needs to increment a counter, nothing more |
| Lambda Permission scoped to a specific API Gateway ARN | Any API Gateway in AWS being able to invoke this Lambda | AWS requires explicit invoke permission even between wired up services "deny by default" |
| Dedicated IAM user for GitHub Actions, scoped to only S3 object actions + CloudFront invalidation | A leaked CI/CD credential granting broad AWS account access | If this key ever leaked, the blast radius is limited to website files only |
| AWS credentials stored as GitHub Secrets, never hardcoded | Credentials being exposed in a public repo's commit history | Secrets are encrypted at rest and injected only at workflow runtime |
| HTTPS enforced via CloudFront (`redirect-to-https`) | Unencrypted traffic between visitor and site | All traffic in transit is encrypted, no exceptions |

## How it works

### Static site delivery
1. A visitor requests the CloudFront URL.
2. CloudFront serves cached static files (HTML/CSS/JS) over HTTPS.
3. On a cache miss, CloudFront retrieves the file from a private S3 bucket, authenticated via Origin Access Control (OAC) the bucket itself has no public access.

### Visitor counter
1. On page load, client-side JavaScript (`main.js`) calls an API Gateway HTTP API endpoint.
2. API Gateway invokes a Lambda function (Python).
3. Lambda performs an atomic increment operation on a DynamoDB table and returns the updated count as JSON.
4. The frontend displays the count.

### Deployment
1. A `git push` to `main` triggers a GitHub Actions workflow.
2. The workflow syncs the `Website/` folder to S3 and invalidates the CloudFront cache no manual deployment steps required.

## Possible future improvements
- Custom domain via Route 53 + ACM certificate
- CloudWatch alarms/dashboards for Lambda errors and DynamoDB throttling
- Unit tests for the Lambda function
- WAF (Web Application Firewall) in front of CloudFront

## Tech stack

| Layer | Technology |
|---|---|
| Static hosting | Amazon S3 |
| CDN / HTTPS | Amazon CloudFront |
| API | Amazon API Gateway (HTTP API) |
| Compute | AWS Lambda (Python 3.12) |
| Database | Amazon DynamoDB |
| Infrastructure as Code | Terraform |
| CI/CD | GitHub Actions |
| Frontend | HTML, CSS, JavaScript |

## Project structure

```
Lambda/
  counter.py
Terraform/
  main.tf
  variables.tf
  outputs.tf
Website/
  index.html
  style.css
  main.js
.github/workflows/
  deploy.yml
README.md
```
