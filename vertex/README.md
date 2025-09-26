# Vertex AI Configuration

This directory contains Vertex AI setup and configuration files for the Translation Platform.

## Directory Structure

```
vertex/
├── secrets/                 # Service account credentials (NOT in Git)
│   └── vertex-ai-credentials.json
├── requirements.txt         # Python dependencies for Vertex AI
└── README.md               # This file
```

## Setup Instructions

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run Setup Script**:
```bash
python ../scripts/setup-vertex-ai.py
```

3. **Test Configuration**:
```bash
python ../scripts/test_vertex_ai.py
```

## Important Security Notes

⚠️ **NEVER commit the `secrets/` directory to Git!**

The `secrets/` directory contains sensitive credentials that must be kept secure:
- It's already in `.gitignore`
- For production, use Google Secret Manager
- Rotate keys quarterly
- Use different keys for dev/staging/production

## Credentials Location

- **Development**: `./vertex/secrets/vertex-ai-credentials.json`
- **Docker**: Mount as volume at `/app/vertex/secrets/`
- **Production**: Use Google Secret Manager or environment variables

## Quick Test

After setup, test your configuration:

```python
import os
from google.cloud import aiplatform

# Initialize
aiplatform.init(
    project=os.getenv('GCP_PROJECT_ID'),
    location=os.getenv('VERTEX_AI_LOCATION')
)

# Test connection
from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-2.5-pro-latest")
response = model.generate_content("Hello!")
print(response.text)
```

## Documentation

For detailed setup instructions, see: `../docs/setup/vertex-ai-setup.md`