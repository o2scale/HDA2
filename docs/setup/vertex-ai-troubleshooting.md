# Vertex AI Troubleshooting Guide

## Common Issues and Solutions

### 1. Authentication Issues

#### Error: "Could not automatically determine credentials"

**Symptoms**:
```
google.auth.exceptions.DefaultCredentialsError: Could not automatically determine credentials
```

**Solutions**:

1. **Check environment variable**:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
# Should output: ./vertex/secrets/vertex-ai-credentials.json
```

2. **Verify file exists**:
```bash
ls -la vertex/secrets/vertex-ai-credentials.json
```

3. **Set environment variable explicitly**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./vertex/secrets/vertex-ai-credentials.json"
```

4. **For Windows**:
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=.\vertex\secrets\vertex-ai-credentials.json
```

---

### 2. API Not Enabled

#### Error: "Vertex AI API has not been used in project"

**Symptoms**:
```
403 Vertex AI API has not been used in project XXX before or it is disabled
```

**Solutions**:

1. **Enable via gcloud**:
```bash
gcloud services enable aiplatform.googleapis.com --project=YOUR_PROJECT_ID
```

2. **Enable via Console**:
- Go to [APIs & Services](https://console.cloud.google.com/apis/library)
- Search for "Vertex AI API"
- Click Enable

3. **Verify it's enabled**:
```bash
gcloud services list --enabled | grep aiplatform
```

---

### 3. Permission Denied

#### Error: "Permission denied on resource"

**Symptoms**:
```
403 Permission 'aiplatform.models.predict' denied on resource
```

**Solutions**:

1. **Check service account roles**:
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:vertex-ai-translator"
```

2. **Add missing roles**:
```bash
# Add Vertex AI User role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:vertex-ai-translator@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Add Service Agent role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:vertex-ai-translator@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.serviceAgent"
```

---

### 4. Quota Exceeded

#### Error: "Quota exceeded for quota metric"

**Symptoms**:
```
429 Quota exceeded for quota metric 'Generate content requests per minute'
```

**Solutions**:

1. **Check current quotas**:
- Go to [Quotas page](https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/quotas)
- Filter by "Gemini"

2. **Request quota increase**:
- Click on the quota you need to increase
- Click "Edit Quotas"
- Enter new limit and justification

3. **Implement rate limiting**:
```python
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(3)
)
def call_vertex_ai(prompt):
    # Your API call here
    pass
```

---

### 5. Region Not Available

#### Error: "The region 'XX' is not supported"

**Symptoms**:
```
400 The region 'asia-south1' is not supported for Vertex AI
```

**Solutions**:

1. **Use supported regions**:
   - us-central1 (recommended)
   - us-east1
   - us-west1
   - europe-west1
   - europe-west4
   - asia-southeast1

2. **Update .env file**:
```env
VERTEX_AI_LOCATION=us-central1
```

---

### 6. Model Not Found

#### Error: "Model not found"

**Symptoms**:
```
404 Model projects/XXX/locations/XXX/publishers/google/models/gemini-2.5-pro not found
```

**Solutions**:

1. **Use correct model name**:
```python
# Correct
model = GenerativeModel("gemini-2.5-pro-latest")

# Also correct
model = GenerativeModel("gemini-2.5-pro-001")
```

2. **Check available models**:
```bash
gcloud ai models list --region=us-central1
```

---

### 7. Billing Not Enabled

#### Error: "Billing account is not enabled"

**Symptoms**:
```
403 Cloud Billing API has not been enabled for project
```

**Solutions**:

1. **Enable billing**:
- Go to [Billing](https://console.cloud.google.com/billing)
- Link a billing account to your project

2. **For new accounts**:
- Claim $300 free credits
- Set up payment method

3. **Enable Billing API**:
```bash
gcloud services enable cloudbilling.googleapis.com
```

---

### 8. Invalid Credentials File

#### Error: "Invalid service account credentials"

**Symptoms**:
```
ValueError: Service account info was not in the expected format
```

**Solutions**:

1. **Verify JSON format**:
```bash
python -m json.tool vertex/secrets/vertex-ai-credentials.json
```

2. **Regenerate key**:
```bash
gcloud iam service-accounts keys create \
  vertex/secrets/vertex-ai-credentials.json \
  --iam-account=vertex-ai-translator@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

---

### 9. Network/Firewall Issues

#### Error: "Connection timeout"

**Symptoms**:
```
TimeoutError: Connection to aiplatform.googleapis.com timed out
```

**Solutions**:

1. **Check network connectivity**:
```bash
ping aiplatform.googleapis.com
curl https://aiplatform.googleapis.com
```

2. **Behind corporate proxy**:
```python
import os
os.environ['HTTP_PROXY'] = 'http://proxy.company.com:8080'
os.environ['HTTPS_PROXY'] = 'http://proxy.company.com:8080'
```

3. **Firewall rules**:
- Ensure port 443 is open for HTTPS
- Allow traffic to *.googleapis.com

---

### 10. Docker-Specific Issues

#### Error: "Credentials not found in container"

**Solutions**:

1. **Mount credentials volume**:
```yaml
# docker-compose.yml
volumes:
  - ./vertex/secrets:/app/vertex/secrets:ro
environment:
  - GOOGLE_APPLICATION_CREDENTIALS=/app/vertex/secrets/vertex-ai-credentials.json
```

2. **Check file permissions**:
```bash
docker exec container_name ls -la /app/vertex/secrets/
```

3. **Use environment variable in container**:
```dockerfile
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/vertex/secrets/vertex-ai-credentials.json
```

---

## Debugging Commands

### Check Configuration

```bash
# View current configuration
gcloud config list

# Check authenticated accounts
gcloud auth list

# View project details
gcloud projects describe YOUR_PROJECT_ID

# List enabled services
gcloud services list --enabled

# Check service account
gcloud iam service-accounts describe \
  vertex-ai-translator@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Test API Access

```bash
# Get access token
TOKEN=$(gcloud auth print-access-token)

# Test Vertex AI API
curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  "https://aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/models"
```

### Python Debug Script

```python
import os
import sys
from pathlib import Path

def debug_vertex_ai():
    """Debug Vertex AI configuration."""

    print("=== Environment Variables ===")
    env_vars = [
        'GCP_PROJECT_ID',
        'VERTEX_AI_LOCATION',
        'GOOGLE_APPLICATION_CREDENTIALS'
    ]
    for var in env_vars:
        value = os.getenv(var, "NOT SET")
        print(f"{var}: {value}")

    print("\n=== Credentials File ===")
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if creds_path:
        if Path(creds_path).exists():
            print(f"✓ File exists: {creds_path}")
            print(f"  Size: {Path(creds_path).stat().st_size} bytes")
        else:
            print(f"✗ File not found: {creds_path}")

    print("\n=== Import Test ===")
    try:
        import google.cloud.aiplatform
        print("✓ google.cloud.aiplatform imported")
        print(f"  Version: {google.cloud.aiplatform.__version__}")
    except ImportError as e:
        print(f"✗ Import failed: {e}")

    print("\n=== Connection Test ===")
    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel

        project = os.getenv('GCP_PROJECT_ID')
        location = os.getenv('VERTEX_AI_LOCATION')

        vertexai.init(project=project, location=location)
        print(f"✓ Initialized with project={project}, location={location}")

        model = GenerativeModel("gemini-2.5-pro-latest")
        print("✓ Model loaded")

        response = model.generate_content("Say 'test'")
        print(f"✓ Response: {response.text[:50]}")

    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    debug_vertex_ai()
```

---

## Getting Help

### Resources

1. **Vertex AI Documentation**: https://cloud.google.com/vertex-ai/docs
2. **Gemini API Reference**: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini
3. **GCP Status Page**: https://status.cloud.google.com
4. **Stack Overflow**: Tag with `google-cloud-vertex-ai`

### Support Channels

1. **Free Support**:
   - Community forums
   - Stack Overflow
   - GitHub issues

2. **Paid Support**:
   - GCP Support (if you have a support plan)
   - Professional services

### Logging

Enable detailed logging for debugging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# For Google Cloud libraries
import google.cloud.logging
client = google.cloud.logging.Client()
client.setup_logging()
```

---

## Prevention Checklist

To avoid common issues:

- [ ] Service account has correct IAM roles
- [ ] APIs are enabled before first use
- [ ] Credentials file is valid JSON
- [ ] Environment variables are set correctly
- [ ] Using a supported region
- [ ] Billing is enabled
- [ ] Quotas are sufficient
- [ ] Network allows HTTPS to *.googleapis.com
- [ ] Credentials are not committed to Git
- [ ] Different credentials for dev/prod