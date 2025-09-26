#!/usr/bin/env python3
"""
Validation script for Story 1.0 - Vertex AI Setup
This script checks what's been completed and what still needs manual configuration.
"""

import os
import sys
from pathlib import Path

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

def check_item(description: str, condition: bool) -> bool:
    """Check an item and print result."""
    if condition:
        print(f"{GREEN}[OK]{RESET} {description}")
        return True
    else:
        print(f"{RED}[MISSING]{RESET} {description}")
        return False

def main():
    print_header("Story 1.0: Vertex AI Setup - Validation Checklist")

    total_checks = 0
    passed_checks = 0

    # Infrastructure Checks
    print(f"\n{BLUE}INFRASTRUCTURE (Should all be green):{RESET}")

    total_checks += 1
    if check_item(".env.example exists", Path(".env.example").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item("scripts/setup-vertex-ai.py exists", Path("scripts/setup-vertex-ai.py").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item("scripts/test_vertex_ai.py exists", Path("scripts/test_vertex_ai.py").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item("vertex/requirements.txt exists", Path("vertex/requirements.txt").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item("vertex/secrets/ directory exists", Path("vertex/secrets").is_dir()):
        passed_checks += 1

    total_checks += 1
    if check_item("docs/setup/vertex-ai-setup.md exists", Path("docs/setup/vertex-ai-setup.md").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item("docs/setup/vertex-ai-troubleshooting.md exists", Path("docs/setup/vertex-ai-troubleshooting.md").exists()):
        passed_checks += 1

    # Check .gitignore
    total_checks += 1
    gitignore_ok = False
    if Path(".gitignore").exists():
        with open(".gitignore", "r") as f:
            content = f.read()
            if "vertex-ai-credentials.json" in content:
                gitignore_ok = True
    if check_item(".gitignore includes vertex-ai-credentials.json", gitignore_ok):
        passed_checks += 1

    # Manual Configuration Checks
    print(f"\n{YELLOW}MANUAL CONFIGURATION (Need your action):{RESET}")

    total_checks += 1
    if check_item("vertex/secrets/vertex-ai-credentials.json exists",
                  Path("vertex/secrets/vertex-ai-credentials.json").exists()):
        passed_checks += 1

    total_checks += 1
    if check_item(".env file exists", Path(".env").exists()):
        passed_checks += 1

        # If .env exists, check for required variables
        if Path(".env").exists():
            from dotenv import load_dotenv
            load_dotenv()

            env_vars = [
                ("GCP_PROJECT_ID", os.getenv("GCP_PROJECT_ID")),
                ("VERTEX_AI_LOCATION", os.getenv("VERTEX_AI_LOCATION")),
                ("GOOGLE_APPLICATION_CREDENTIALS", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            ]

            for var_name, var_value in env_vars:
                total_checks += 1
                if check_item(f"{var_name} is set", var_value is not None):
                    passed_checks += 1

    # Summary
    print_header("VALIDATION SUMMARY")

    infrastructure_ready = passed_checks >= 8  # First 8 checks

    if infrastructure_ready:
        print(f"{GREEN}[OK] Infrastructure is READY{RESET}")
        print(f"\nPassed: {passed_checks}/{total_checks} checks")

        if passed_checks == total_checks:
            print(f"\n{GREEN}*** STORY 1.0 IS COMPLETE! ***{RESET}")
            print("\nYou can now:")
            print("1. Run: python scripts/test_vertex_ai.py")
            print("2. Proceed to Story 1.1")
        else:
            print(f"\n{YELLOW}*** MANUAL STEPS REQUIRED ***{RESET}")
            print("\n1. Run the setup script:")
            print("   python scripts/setup-vertex-ai.py")
            print("\n2. Follow the prompts to:")
            print("   - Configure GCP project")
            print("   - Enable APIs")
            print("   - Create service account")
            print("   - Download credentials")
            print("\n3. Create .env from .env.example:")
            print("   cp .env.example .env")
            print("   # Edit .env with your actual values")
            print("\n4. Test the configuration:")
            print("   pip install -r vertex/requirements.txt")
            print("   python scripts/test_vertex_ai.py")

            print(f"\n{BLUE}TIP:{RESET} Use the GCP Gemini Assistant prompt:")
            print("   cat scripts/gcp-gemini-assist-prompt.md")
            print("   # Copy the content to Gemini in GCP Console")
    else:
        print(f"{RED}[ERROR] Infrastructure is NOT ready{RESET}")
        print(f"Passed: {passed_checks}/{total_checks} checks")
        print("\nPlease check the missing infrastructure files.")

    return 0 if passed_checks == total_checks else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except ImportError:
        print(f"{YELLOW}Note: Install python-dotenv for full validation:{RESET}")
        print("pip install python-dotenv")
        sys.exit(1)