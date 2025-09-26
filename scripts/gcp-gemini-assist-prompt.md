# GCP Gemini Cloud Assist Prompt

## Copy this entire prompt to Gemini Cloud Assist:

I need to set up Vertex AI for a document translation platform that will use Gemini 2.5 Pro. Please provide me with the following information and execute these configurations:

### 1. Project Information
- What is my current project ID?
- What is my project number?
- What is my current billing account ID?
- Is billing enabled on this project?

### 2. API Enablement
Please enable the following APIs and confirm each is enabled:
- Vertex AI API (aiplatform.googleapis.com)
- Cloud Resource Manager API (cloudresourcemanager.googleapis.com)
- IAM Service Account Credentials API (iamcredentials.googleapis.com)
- Cloud Billing API (cloudbilling.googleapis.com)
- Cloud Storage API (storage.googleapis.com)

### 3. Service Account Setup
Create a service account with these specifications:
- Name: vertex-ai-translator
- Display Name: Vertex AI Translator Service Account
- Description: Service account for document translation platform using Vertex AI

Then grant these IAM roles to the service account:
- roles/aiplatform.user (Vertex AI User)
- roles/aiplatform.serviceAgent (Vertex AI Service Agent)
- roles/storage.objectViewer (Storage Object Viewer)

Provide the full service account email address created.

### 4. Vertex AI Configuration
- What regions are available for Vertex AI and Gemini 2.5 Pro?
- Which region would you recommend for lowest latency from my current location?
- Is Gemini 2.5 Pro (gemini-2.5-pro-latest) available in us-central1?
- What are the current quota limits for Gemini 2.5 Pro in my project?

### 5. Cost and Quotas
- What is my current monthly spending limit?
- What are the current pricing rates for Gemini 2.5 Pro (input/output tokens)?
- What are my current quotas for:
  - Gemini 2.5 Pro requests per minute
  - Total token limits per request
  - Concurrent requests

### 6. Budget Alert Setup
Create a budget alert with these settings:
- Budget name: Translation Platform Monthly Budget
- Amount: $1000 USD
- Threshold alerts at: 50% ($500), 90% ($900), 100% ($1000)
- Send alerts to my email

### 7. Service Account Key Generation
For the service account vertex-ai-translator@[PROJECT_ID].iam.gserviceaccount.com:
- How many existing keys does it have?
- Generate the gcloud command to create a new JSON key that I can run locally

### 8. Verification Commands
Provide the gcloud commands to:
- Verify all APIs are enabled
- Check the service account IAM roles
- Test Vertex AI API access
- Get my project's Vertex AI endpoint URL

### 9. Quick Setup Script
Provide a single gcloud script that will:
1. Set my project as default
2. Enable all required APIs
3. Create the service account if it doesn't exist
4. Grant all required roles
5. Create the JSON key file

### 10. Final Configuration Values
Please provide these exact values I need for my .env file:
- GCP_PROJECT_ID=
- GCP_PROJECT_NUMBER=
- GCP_BILLING_ACCOUNT=
- GCP_SERVICE_ACCOUNT_EMAIL=
- VERTEX_AI_ENDPOINT=
- Recommended VERTEX_AI_LOCATION=

Also confirm:
- All APIs are enabled: YES/NO
- Service account has all roles: YES/NO
- Billing is active: YES/NO
- Budget alerts are set: YES/NO

Please execute all configurations where possible and provide the complete information requested.