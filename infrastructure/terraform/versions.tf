terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    # Configure this based on your environment
    # bucket         = "hda-terraform-state"
    # key            = "infrastructure/terraform.tfstate"
    # region         = "us-east-1"
    # encrypt        = true
    # dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "HDA-Translation-Platform"
      ManagedBy   = "Terraform"
      Owner       = var.owner_email
      CostCenter  = var.cost_center
    }
  }
}

provider "aws" {
  alias  = "dr_region"
  region = var.dr_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "HDA-Translation-Platform"
      ManagedBy   = "Terraform"
      Owner       = var.owner_email
      CostCenter  = var.cost_center
      Purpose     = "DisasterRecovery"
    }
  }
}