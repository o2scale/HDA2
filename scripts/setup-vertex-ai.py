#!/usr/bin/env python3
"""
Vertex AI Setup Script
This script helps set up and verify Google Cloud Platform and Vertex AI configuration
for the translation platform.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, Any

# Colors for terminal output
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_header(text: str):
    """Print a formatted header."""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}{text}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")


def print_success(text: str):
    """Print success message."""
    print(f"{GREEN}✓ {text}{RESET}")


def print_error(text: str):
    """Print error message."""
    print(f"{RED}✗ {text}{RESET}")


def print_warning(text: str):
    """Print warning message."""
    print(f"{YELLOW}⚠ {text}{RESET}")


def print_info(text: str):
    """Print info message."""
    print(f"{BLUE}ℹ {text}{RESET}")


def check_gcloud_installed() -> bool:
    """Check if gcloud CLI is installed."""
    try:
        result = subprocess.run(['gcloud', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print_success("Google Cloud SDK is installed")
            return True
    except FileNotFoundError:
        pass

    print_error("Google Cloud SDK is not installed")
    print_info("Please install it from: https://cloud.google.com/sdk/docs/install")
    return False


def check_authentication() -> Dict[str, Any]:
    """Check current gcloud authentication status."""
    try:
        result = subprocess.run(['gcloud', 'auth', 'list', '--format=json'],
                              capture_output=True, text=True)
        if result.returncode == 0:
            accounts = json.loads(result.stdout)
            if accounts:
                active_account = next((acc for acc in accounts if acc.get('status') == 'ACTIVE'), None)
                if active_account:
                    print_success(f"Authenticated as: {active_account.get('account')}")
                    return {'authenticated': True, 'account': active_account.get('account')}
                else:
                    print_warning("No active account found")
            else:
                print_warning("Not authenticated with Google Cloud")
        return {'authenticated': False}
    except Exception as e:
        print_error(f"Error checking authentication: {e}")
        return {'authenticated': False}


def get_current_project() -> str:
    """Get the current GCP project."""
    try:
        result = subprocess.run(['gcloud', 'config', 'get-value', 'project'],
                              capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            project_id = result.stdout.strip()
            print_success(f"Current project: {project_id}")
            return project_id
        else:
            print_warning("No project set")
            return ""
    except Exception as e:
        print_error(f"Error getting project: {e}")
        return ""


def enable_apis(project_id: str) -> bool:
    """Enable required APIs for the project."""
    print_header("Enabling Required APIs")

    apis = [
        'aiplatform.googleapis.com',  # Vertex AI
        'cloudresourcemanager.googleapis.com',  # Resource Manager
        'iam.googleapis.com',  # IAM
        'cloudbilling.googleapis.com',  # Billing
        'storage.googleapis.com',  # Cloud Storage (for model access)
    ]

    all_enabled = True
    for api in apis:
        print_info(f"Enabling {api}...")
        result = subprocess.run([
            'gcloud', 'services', 'enable', api,
            '--project', project_id
        ], capture_output=True, text=True)

        if result.returncode == 0:
            print_success(f"Enabled {api}")
        else:
            print_error(f"Failed to enable {api}: {result.stderr}")
            all_enabled = False

    return all_enabled


def create_service_account(project_id: str) -> str:
    """Create a service account for Vertex AI."""
    print_header("Creating Service Account")

    service_account_name = 'vertex-ai-translator'
    service_account_email = f"{service_account_name}@{project_id}.iam.gserviceaccount.com"

    # Check if service account already exists
    result = subprocess.run([
        'gcloud', 'iam', 'service-accounts', 'describe',
        service_account_email,
        '--project', project_id
    ], capture_output=True, text=True)

    if result.returncode == 0:
        print_info(f"Service account already exists: {service_account_email}")
    else:
        # Create service account
        result = subprocess.run([
            'gcloud', 'iam', 'service-accounts', 'create',
            service_account_name,
            '--display-name', 'Vertex AI Translator Service Account',
            '--project', project_id
        ], capture_output=True, text=True)

        if result.returncode == 0:
            print_success(f"Created service account: {service_account_email}")
        else:
            print_error(f"Failed to create service account: {result.stderr}")
            return ""

    # Grant required roles
    roles = [
        'roles/aiplatform.user',
        'roles/aiplatform.serviceAgent',
        'roles/storage.objectViewer'
    ]

    for role in roles:
        print_info(f"Granting role: {role}")
        result = subprocess.run([
            'gcloud', 'projects', 'add-iam-policy-binding',
            project_id,
            '--member', f'serviceAccount:{service_account_email}',
            '--role', role
        ], capture_output=True, text=True)

        if result.returncode == 0:
            print_success(f"Granted {role}")
        else:
            print_warning(f"Issue granting {role}: {result.stderr}")

    return service_account_email


def create_service_account_key(project_id: str, service_account_email: str) -> bool:
    """Create and download service account key."""
    print_header("Creating Service Account Key")

    # Create secrets directory if it doesn't exist
    secrets_dir = Path('vertex/secrets')
    secrets_dir.mkdir(parents=True, exist_ok=True)

    key_file_path = secrets_dir / 'vertex-ai-credentials.json'

    if key_file_path.exists():
        print_warning(f"Key file already exists at {key_file_path}")
        response = input("Do you want to create a new key? (y/n): ")
        if response.lower() != 'y':
            return True

    # Create new key
    result = subprocess.run([
        'gcloud', 'iam', 'service-accounts', 'keys', 'create',
        str(key_file_path),
        '--iam-account', service_account_email,
        '--project', project_id
    ], capture_output=True, text=True)

    if result.returncode == 0:
        print_success(f"Created key file at {key_file_path}")
        print_warning("IMPORTANT: Keep this file secure and never commit it to git!")
        return True
    else:
        print_error(f"Failed to create key: {result.stderr}")
        return False


def create_env_file() -> bool:
    """Create .env file from .env.example."""
    print_header("Creating .env File")

    env_example = Path('.env.example')
    env_file = Path('.env')

    if not env_example.exists():
        print_error(".env.example file not found")
        return False

    if env_file.exists():
        print_warning(".env file already exists")
        response = input("Do you want to overwrite it? (y/n): ")
        if response.lower() != 'y':
            return True

    # Get project ID
    project_id = input("Enter your GCP Project ID: ")

    # Read .env.example and update with actual values
    with open(env_example, 'r') as f:
        env_content = f.read()

    # Replace placeholders
    env_content = env_content.replace('your-project-id', project_id)

    # Write .env file
    with open(env_file, 'w') as f:
        f.write(env_content)

    print_success("Created .env file with project configuration")
    print_info("Please update other configuration values as needed")
    return True


def setup_cost_alerts(project_id: str):
    """Guide for setting up cost alerts."""
    print_header("Cost Management Setup")

    print_info("Please complete the following steps in the GCP Console:")
    print()
    print("1. Go to: https://console.cloud.google.com/billing/budgets")
    print("2. Click 'Create Budget'")
    print("3. Set budget name: 'Translation Platform Monthly Budget'")
    print("4. Set amount: $1000 (or your preferred cap)")
    print("5. Add threshold rules:")
    print("   - 50% ($500) - Email alert")
    print("   - 90% ($900) - Email alert")
    print("   - 100% ($1000) - Email alert")
    print("6. Add cost allocation labels:")
    print("   - environment: development")
    print("   - application: translation-platform")
    print("   - cost-center: engineering")
    print()
    input("Press Enter when you've completed the budget setup...")


def main():
    """Main setup process."""
    print_header("Vertex AI Setup for Translation Platform")

    # Check prerequisites
    if not check_gcloud_installed():
        sys.exit(1)

    # Check authentication
    auth_info = check_authentication()
    if not auth_info.get('authenticated'):
        print_info("Please authenticate with Google Cloud:")
        print(f"  Run: {YELLOW}gcloud auth login{RESET}")
        sys.exit(1)

    # Get or set project
    project_id = get_current_project()
    if not project_id:
        project_id = input("Enter your GCP Project ID: ")
        print_info(f"Setting project to {project_id}")
        subprocess.run(['gcloud', 'config', 'set', 'project', project_id])

    # Enable APIs
    if not enable_apis(project_id):
        print_warning("Some APIs failed to enable. Please check and retry.")

    # Create service account
    service_account_email = create_service_account(project_id)
    if not service_account_email:
        print_error("Failed to create service account")
        sys.exit(1)

    # Create service account key
    if not create_service_account_key(project_id, service_account_email):
        print_error("Failed to create service account key")
        sys.exit(1)

    # Create .env file
    if not create_env_file():
        print_error("Failed to create .env file")
        sys.exit(1)

    # Guide for cost alerts
    setup_cost_alerts(project_id)

    print_header("Setup Complete!")
    print_success("Vertex AI configuration is complete")
    print_info("Next steps:")
    print("1. Install Python dependencies: pip install google-cloud-aiplatform")
    print("2. Run the test script: python scripts/test_vertex_ai.py")
    print("3. Complete cost alert setup in GCP Console")
    print("4. Review and update .env file with remaining configuration")


if __name__ == "__main__":
    main()