# Vertex AI Setup Guide

## Overview

This guide provides step-by-step instructions for setting up Google Cloud Platform (GCP) and Vertex AI for the Translation Platform. This setup enables the use of Gemini 2.5 Pro model for text extraction and translation capabilities.

## Prerequisites

1. **Google Account**: You need a Google account to access GCP
2. **Billing Account**: Credit card for GCP billing (or free trial credits)
3. **Administrative Access**: Ability to create projects and enable APIs
4. **Python 3.8+**: For running setup scripts
5. **Git**: For version control

## Quick Setup

For automated setup, use our setup script:

```bash
# Run the setup script
python scripts/setup-vertex-ai.py

# Test the configuration
python scripts/test_vertex_ai.py
```

## Manual Setup Steps

### 1. Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Enter project details:
   - **Project name**: `translation-platform-prod`
   - **Project ID**: Auto-generated or custom
   - **Organization**: Select if applicable
4. Click "Create"
5. Note down the Project ID for later use

### 2. Enable Billing

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Link a billing account to your project
3. Set up spending limits:
   - Navigate to Budgets & Alerts
   - Create budget with $1000 monthly cap
   - Set alerts at 50% ($500) and 90% ($900)

### 3. Enable Required APIs

Navigate to [APIs & Services](https://console.cloud.google.com/apis/library) and enable:

```bash
# Using gcloud CLI
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable cloudbilling.googleapis.com
gcloud services enable storage.googleapis.com
```

Or enable manually in the Console:
- Vertex AI API
- Cloud Resource Manager API
- Identity and Access Management (IAM) API
- Cloud Billing API
- Cloud Storage API

### 4. Create Service Account

1. Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter details:
   - **Name**: `vertex-ai-translator`
   - **ID**: `vertex-ai-translator`
   - **Description**: Service account for Vertex AI translation platform
4. Click "Create and Continue"
5. Add roles:
   - `Vertex AI User` (roles/aiplatform.user)
   - `Vertex AI Service Agent` (roles/aiplatform.serviceAgent)
   - `Storage Object Viewer` (roles/storage.objectViewer)
6. Click "Done"

### 5. Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. Save the downloaded file as `vertex-ai-credentials.json`
7. Move it to `vertex/secrets/` directory:

```bash
# Create secrets directory
mkdir -p vertex/secrets

# Move credentials (adjust path as needed)
mv ~/Downloads/[key-file].json vertex/secrets/vertex-ai-credentials.json

# Verify it's in .gitignore
grep "vertex-ai-credentials.json" .gitignore
```

### 6. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your values:
```env
# Google Cloud / Vertex AI Configuration
GCP_PROJECT_ID=your-actual-project-id
GCP_REGION=us-central1
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-2.5-pro-latest
GOOGLE_APPLICATION_CREDENTIALS=./vertex/secrets/vertex-ai-credentials.json
```

### 7. Install Python Dependencies

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install google-cloud-aiplatform>=1.78.0
pip install python-dotenv
```

### 8. Verify Setup

Run the test script to verify everything is configured correctly:

```bash
python scripts/test_vertex_ai.py
```

Expected output:
```
✓ Environment variables configured
✓ Vertex AI initialized successfully
✓ Model loaded successfully
✓ Text generation successful!
```

## Cost Management

### Pricing Overview

Gemini 2.5 Pro pricing (as of 2025):
- **Input tokens**: $0.00025 per 1K tokens
- **Output tokens**: $0.00100 per 1K tokens
- **Maximum context**: 1,048,576 input tokens, 65,536 output tokens

### Estimated Costs

| Usage | Estimated Cost |
|-------|---------------|
| 1 page extraction | ~$0.0001 |
| 1 page translation | ~$0.0010 |
| 100-page document | ~$0.15 |
| 1000 docs/month (100 pages) | ~$150 |

### Setting Up Budget Alerts

1. Go to [Budgets & Alerts](https://console.cloud.google.com/billing/budgets)
2. Click "Create Budget"
3. Configure:
   - **Name**: Translation Platform Monthly Budget
   - **Amount**: $1000
   - **Thresholds**:
     - 50% - Email alert
     - 90% - Email alert
     - 100% - Email alert + consider auto-shutdown
4. Add cost allocation labels:
   - `environment`: `development` or `production`
   - `application`: `translation-platform`
   - `cost-center`: `engineering`

## Security Best Practices

### 1. Credential Management

- **Never commit credentials to Git**
- Store production credentials in Secret Manager
- Rotate service account keys quarterly
- Use different service accounts for dev/prod

### 2. IAM Permissions

- Follow least-privilege principle
- Regularly audit service account permissions
- Remove unused service accounts
- Enable audit logging for API calls

### 3. Environment Isolation

```bash
# Development credentials
GOOGLE_APPLICATION_CREDENTIALS=./vertex/secrets/vertex-ai-credentials-dev.json

# Production (use Secret Manager)
GOOGLE_APPLICATION_CREDENTIALS=/secrets/vertex-ai-credentials-prod.json
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Error**: `Could not automatically determine credentials`

**Solution**:
```bash
# Set credentials explicitly
export GOOGLE_APPLICATION_CREDENTIALS="./vertex/secrets/vertex-ai-credentials.json"

# Or use gcloud auth
gcloud auth application-default login
```

#### 2. API Not Enabled

**Error**: `Vertex AI API has not been used in project`

**Solution**:
```bash
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID
```

#### 3. Quota Exceeded

**Error**: `Quota exceeded for quota metric`

**Solution**:
- Check quotas in [GCP Console](https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/quotas)
- Request quota increase if needed
- Implement rate limiting in application

#### 4. Region Not Available

**Error**: `The region is not supported`

**Solution**:
- Use supported regions: us-central1, us-east1, us-west1, europe-west1, europe-west4, asia-southeast1
- Update VERTEX_AI_LOCATION in .env

#### 5. Billing Not Enabled

**Error**: `Cloud Billing API has not been enabled`

**Solution**:
1. Enable billing for the project
2. Link a valid payment method
3. Enable Cloud Billing API

### Verification Commands

```bash
# Check current project
gcloud config get-value project

# List enabled APIs
gcloud services list --enabled

# Check service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:vertex-ai-translator"

# Test API access
curl -X GET \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/models"
```

## Docker Integration

For running in Docker containers:

1. **Mount credentials**:
```yaml
# docker-compose.yml
services:
  backend:
    volumes:
      - ./vertex/secrets:/app/vertex/secrets:ro
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/app/vertex/secrets/vertex-ai-credentials.json
```

2. **Build with credentials** (not recommended for production):
```dockerfile
# Dockerfile
COPY vertex/secrets/vertex-ai-credentials.json /app/credentials.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
```

3. **Use Secret Manager** (recommended for production):
```python
# Use Google Secret Manager in production
from google.cloud import secretmanager

client = secretmanager.SecretManagerServiceClient()
name = f"projects/{project_id}/secrets/vertex-ai-credentials/versions/latest"
response = client.access_secret_version(request={"name": name})
credentials = response.payload.data.decode("UTF-8")
```

## Next Steps

After completing this setup:

1. ✅ Run test script to verify configuration
2. ✅ Set up cost monitoring and alerts
3. ✅ Review security settings
4. ✅ Test from Docker environment
5. ✅ Document any project-specific configurations
6. ✅ Proceed with Story 1.1 (Project Foundation)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
3. Contact the infrastructure team
4. Open an issue in the project repository

## Appendix

### Useful Links

- [GCP Console](https://console.cloud.google.com)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini 2.5 Pro Guide](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini)
- [IAM Roles Reference](https://cloud.google.com/iam/docs/roles-reference)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

### Required Permissions Reference

| Role | Purpose |
|------|---------|
| `roles/aiplatform.user` | Use Vertex AI resources |
| `roles/aiplatform.serviceAgent` | Vertex AI service operations |
| `roles/storage.objectViewer` | Read model artifacts from storage |

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `translation-platform-123` |
| `GCP_REGION` | Default GCP region | `us-central1` |
| `VERTEX_AI_LOCATION` | Vertex AI service location | `us-central1` |
| `VERTEX_AI_MODEL` | Model name | `gemini-2.5-pro-latest` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to credentials JSON | `./vertex/secrets/vertex-ai-credentials.json` |