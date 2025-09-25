# Core Configuration Variables

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "hda-translation"
}

variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "dr_region" {
  description = "Disaster recovery AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "owner_email" {
  description = "Email of the infrastructure owner"
  type        = string
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "engineering"
}

# Networking Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for deployment"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 100
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS in GB"
  type        = number
  default     = 1000
}

variable "enable_multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = false
}

# Redis Configuration
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of Redis cache nodes"
  type        = number
  default     = 1
}

# ECS Configuration
variable "ecs_api_cpu" {
  description = "CPU units for API service (1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "ecs_api_memory" {
  description = "Memory for API service in MB"
  type        = number
  default     = 1024
}

variable "ecs_worker_cpu" {
  description = "CPU units for worker service"
  type        = number
  default     = 1024
}

variable "ecs_worker_memory" {
  description = "Memory for worker service in MB"
  type        = number
  default     = 2048
}

variable "api_desired_count" {
  description = "Desired number of API service instances"
  type        = number
  default     = 2
}

variable "worker_desired_count" {
  description = "Desired number of worker instances"
  type        = number
  default     = 2
}

# Auto Scaling Configuration
variable "api_min_capacity" {
  description = "Minimum number of API instances"
  type        = number
  default     = 1
}

variable "api_max_capacity" {
  description = "Maximum number of API instances"
  type        = number
  default     = 10
}

variable "worker_min_capacity" {
  description = "Minimum number of worker instances"
  type        = number
  default     = 1
}

variable "worker_max_capacity" {
  description = "Maximum number of worker instances"
  type        = number
  default     = 20
}

# S3 Configuration
variable "enable_versioning" {
  description = "Enable versioning for S3 buckets"
  type        = bool
  default     = true
}

variable "enable_encryption" {
  description = "Enable encryption for S3 buckets"
  type        = bool
  default     = true
}

variable "lifecycle_glacier_days" {
  description = "Days before transitioning to Glacier"
  type        = number
  default     = 90
}

variable "lifecycle_expiration_days" {
  description = "Days before object expiration"
  type        = number
  default     = 365
}

# Monitoring Configuration
variable "enable_detailed_monitoring" {
  description = "Enable detailed CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "enable_xray" {
  description = "Enable AWS X-Ray tracing"
  type        = bool
  default     = true
}

# Security Configuration
variable "enable_waf" {
  description = "Enable AWS WAF"
  type        = bool
  default     = true
}

variable "ssl_certificate_arn" {
  description = "ARN of ACM SSL certificate"
  type        = string
  default     = ""
}

variable "allowed_ip_ranges" {
  description = "IP ranges allowed to access admin endpoints"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Domain Configuration
variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = ""
}

variable "create_route53_zone" {
  description = "Create Route53 hosted zone"
  type        = bool
  default     = false
}

# Backup Configuration
variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for RDS"
  type        = bool
  default     = true
}

# Cost Optimization
variable "enable_spot_instances" {
  description = "Use Spot instances for workers"
  type        = bool
  default     = false
}

variable "spot_max_price" {
  description = "Maximum price for Spot instances"
  type        = string
  default     = ""
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}