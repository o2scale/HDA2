#!/usr/bin/env python3
"""
Test script to verify Vertex AI connectivity and configuration.
This script tests the connection to Google Vertex AI and the Gemini 2.5 Pro model.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

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


def check_environment_variables():
    """Check if all required environment variables are set."""
    print_header("Checking Environment Variables")

    required_vars = [
        'GCP_PROJECT_ID',
        'GCP_REGION',
        'VERTEX_AI_LOCATION',
        'VERTEX_AI_MODEL',
        'GOOGLE_APPLICATION_CREDENTIALS'
    ]

    all_set = True
    env_values = {}

    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask credentials path for security
            if var == 'GOOGLE_APPLICATION_CREDENTIALS':
                display_value = f".../{Path(value).name}" if value else "Not set"
            else:
                display_value = value
            print_success(f"{var}: {display_value}")
            env_values[var] = value
        else:
            print_error(f"{var}: Not set")
            all_set = False

    if not all_set:
        print_error("\nSome environment variables are missing!")
        print_info("Please check your .env file and ensure all variables are set")
        return None

    # Check if credentials file exists
    creds_path = env_values.get('GOOGLE_APPLICATION_CREDENTIALS')
    if creds_path and not Path(creds_path).exists():
        print_error(f"\nCredentials file not found: {creds_path}")
        print_info("Please run the setup script or download the service account key")
        return None

    return env_values


def test_vertex_ai_connection(env_values):
    """Test connection to Vertex AI."""
    print_header("Testing Vertex AI Connection")

    try:
        # Import Vertex AI libraries
        print_info("Importing Vertex AI libraries...")
        import vertexai
        from vertexai.generative_models import GenerativeModel
        print_success("Libraries imported successfully")

    except ImportError as e:
        print_error(f"Failed to import Vertex AI libraries: {e}")
        print_info("Please install required packages:")
        print("  pip install google-cloud-aiplatform>=1.78.0")
        return False

    try:
        # Initialize Vertex AI
        project_id = env_values['GCP_PROJECT_ID']
        location = env_values['VERTEX_AI_LOCATION']

        print_info(f"Initializing Vertex AI with project: {project_id}, location: {location}")
        vertexai.init(project=project_id, location=location)
        print_success("Vertex AI initialized successfully")

        # Test model access
        model_name = env_values['VERTEX_AI_MODEL']
        print_info(f"Loading model: {model_name}")
        model = GenerativeModel(model_name)
        print_success("Model loaded successfully")

        # Test text generation
        print_info("Testing text generation...")
        test_prompt = "Say 'Hello from Vertex AI!' and nothing else."
        response = model.generate_content(test_prompt)

        if response and response.text:
            print_success("Text generation successful!")
            print_info(f"Response: {response.text.strip()}")
        else:
            print_warning("Received empty response from model")
            return False

        return True

    except Exception as e:
        print_error(f"Connection test failed: {e}")
        print_info("Common issues:")
        print("  1. Check if APIs are enabled in GCP Console")
        print("  2. Verify service account has correct permissions")
        print("  3. Ensure billing is enabled for the project")
        print("  4. Check if the region supports Vertex AI")
        return False


def test_advanced_features(env_values):
    """Test advanced Vertex AI features."""
    print_header("Testing Advanced Features")

    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel, GenerationConfig

        # Initialize
        project_id = env_values['GCP_PROJECT_ID']
        location = env_values['VERTEX_AI_LOCATION']
        vertexai.init(project=project_id, location=location)

        model = GenerativeModel(env_values['VERTEX_AI_MODEL'])

        # Test with generation config
        print_info("Testing with generation configuration...")
        config = GenerationConfig(
            temperature=0.2,
            max_output_tokens=100,
            top_p=0.8,
        )

        response = model.generate_content(
            "Translate 'Hello World' to Spanish",
            generation_config=config
        )

        if response and response.text:
            print_success(f"Translation test: {response.text.strip()}")
        else:
            print_warning("Translation test returned empty response")

        # Test token counting (if available)
        print_info("Testing token counting...")
        try:
            count_response = model.count_tokens("This is a test sentence for token counting.")
            if hasattr(count_response, 'total_tokens'):
                print_success(f"Token count: {count_response.total_tokens}")
            else:
                print_info("Token counting not available or different response format")
        except Exception as e:
            print_info(f"Token counting not supported: {e}")

        return True

    except Exception as e:
        print_error(f"Advanced features test failed: {e}")
        return False


def display_cost_estimates():
    """Display cost estimates for Vertex AI usage."""
    print_header("Cost Estimates")

    print_info("Vertex AI Gemini 2.5 Pro Pricing (as of 2025):")
    print("  • Input tokens: $0.00025 per 1K tokens")
    print("  • Output tokens: $0.00100 per 1K tokens")
    print()
    print_info("Example Usage Costs:")
    print("  • 1 page extraction (≈500 tokens): $0.0001")
    print("  • 1 page translation (≈1000 tokens): $0.0010")
    print("  • 100-page document full processing: ≈$0.15")
    print("  • 1000 documents/month (100 pages each): ≈$150")
    print()
    print_warning("Remember to set up budget alerts in GCP Console!")


def main():
    """Main test execution."""
    print_header("Vertex AI Configuration Test")

    # Check environment
    env_values = check_environment_variables()
    if not env_values:
        sys.exit(1)

    # Test connection
    if not test_vertex_ai_connection(env_values):
        sys.exit(1)

    # Test advanced features
    test_advanced_features(env_values)

    # Display cost information
    display_cost_estimates()

    print_header("Test Complete!")
    print_success("Vertex AI is properly configured and ready to use")
    print()
    print_info("Next steps:")
    print("  1. Set up budget alerts in GCP Console")
    print("  2. Review security settings for service account")
    print("  3. Test from within Docker container")
    print("  4. Proceed with Story 1.1 implementation")


if __name__ == "__main__":
    main()