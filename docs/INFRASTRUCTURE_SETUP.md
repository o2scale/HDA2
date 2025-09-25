# Infrastructure Setup Guide

## Overview

This guide covers setting up the HDA Translation Platform infrastructure using:
- **Supabase Cloud** for database (both development and production)
- **DigitalOcean** or **AWS EC2** for application hosting
- **Docker** for containerization
- **Kubernetes** for orchestration (when scaling)

## 1. Supabase Setup

### Why Supabase for Both Dev and Production?

As per your recommendation, using Supabase for both environments helps:
- Identify integration issues early
- Maintain consistency between environments
- Leverage Supabase's built-in features (Auth, Realtime, Storage)
- Eliminate local PostgreSQL setup complexity

### Setting Up Development Supabase Project

1. **Create Development Project**
   ```bash
   # Go to https://supabase.com
   # Sign up/Login
   # Click "New Project"
   # Name: "hda-translation-dev"
   # Database Password: [Generate strong password]
   # Region: Choose closest to your location
   # Pricing Plan: Free tier is sufficient for development
   ```

2. **Get Development Credentials**
   - Go to Settings → API
   - Copy:
     - `Project URL` → `SUPABASE_DEV_URL`
     - `anon public` key → `SUPABASE_DEV_ANON_KEY`
     - `service_role` key → `SUPABASE_DEV_SERVICE_KEY`

   - Go to Settings → Database
   - Copy connection string → `SUPABASE_DEV_DATABASE_URL`

3. **Configure Development Environment**
   ```bash
   # Copy environment template
   cp .env.development .env

   # Edit .env and add your Supabase credentials
   nano .env
   ```

### Setting Up Production Supabase Project

1. **Create Production Project**
   ```bash
   # Create a separate project for production
   # Name: "hda-translation-prod"
   # Region: Choose based on your users' location
   # Pricing Plan: Pro ($25/month) or higher based on needs
   ```

2. **Configure Production Settings**
   - Enable Point-in-Time Recovery
   - Set up daily backups
   - Configure connection pooling
   - Enable SSL enforcement

3. **Set Up Database Schema**
   ```bash
   # Run migrations on Supabase
   npx supabase db push --db-url="$DATABASE_URL"

   # Or use SQL editor in Supabase Dashboard
   # Copy contents of infrastructure/supabase/migrations/001_initial_schema.sql
   ```

## 2. Storage Setup

### Option A: Supabase Storage (Recommended for Starting)

1. **Enable Supabase Storage**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES
     ('documents', 'documents', false),
     ('exports', 'exports', false),
     ('temp', 'temp', false);
   ```

2. **Set Storage Policies**
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload documents"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

   -- Allow users to read their own documents
   CREATE POLICY "Users can read own documents"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'documents' AND auth.uid() = owner);
   ```

### Option B: DigitalOcean Spaces (For Scale)

1. **Create Space**
   ```bash
   # In DigitalOcean Control Panel
   # Create Space: "hda-documents"
   # Region: NYC3 or closest to your servers
   # Enable CDN
   ```

2. **Generate Access Keys**
   - Go to API → Spaces Keys
   - Generate New Key
   - Save Access Key and Secret Key

## 3. Local Development Setup

### Prerequisites
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Start Development Environment
```bash
# Clone repository
git clone https://github.com/your-org/HDA2.git
cd HDA2

# Set up environment
cp .env.development .env
# Edit .env with your Supabase credentials

# Start services
docker compose -f docker-compose.dev.yml up -d

# Check services
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f backend
```

### Verify Supabase Connection
```bash
# Test database connection
docker compose -f docker-compose.dev.yml exec backend python -c "
from sqlalchemy import create_engine
import os
engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    result = conn.execute('SELECT 1')
    print('Database connected:', result.fetchone())
"
```

## 4. DigitalOcean Deployment

### Initial Server Setup

1. **Create Droplets**
   ```bash
   # Create 2 Ubuntu 22.04 droplets
   # Size: 4GB RAM / 2 vCPUs ($40/month each)
   # Region: Same as your Supabase region if possible
   # Add SSH keys for access
   ```

2. **Configure Droplets**
   ```bash
   # SSH into each droplet
   ssh root@your-droplet-ip

   # Update system
   apt update && apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com | sh

   # Install Docker Compose
   apt install docker-compose-plugin

   # Create app directory
   mkdir -p /opt/hda
   cd /opt/hda
   ```

3. **Set Up Load Balancer**
   - Create DigitalOcean Load Balancer
   - Add both droplets to the pool
   - Configure health checks: `/health`
   - Enable SSL termination with Let's Encrypt

### Deploy Application

1. **Copy Files to Server**
   ```bash
   # From local machine
   rsync -avz --exclude=node_modules --exclude=.git \
     ./ root@your-droplet-ip:/opt/hda/
   ```

2. **Configure Production Environment**
   ```bash
   # On server
   cd /opt/hda
   cp .env.production .env
   nano .env  # Add your production credentials
   ```

3. **Start Services**
   ```bash
   # Pull/Build images
   docker compose -f docker-compose.prod.yml build

   # Start services
   docker compose -f docker-compose.prod.yml up -d

   # Check status
   docker compose -f docker-compose.prod.yml ps
   ```

## 5. Kubernetes Deployment (Future Scale)

### DigitalOcean Kubernetes (DOKS)

1. **Create Cluster**
   ```bash
   # Using DigitalOcean CLI
   doctl kubernetes cluster create hda-cluster \
     --region nyc3 \
     --size s-2vcpu-4gb \
     --count 3
   ```

2. **Deploy Application**
   ```bash
   # Apply Kubernetes manifests
   kubectl apply -f infrastructure/k8s/namespace.yaml
   kubectl apply -f infrastructure/k8s/configmap.yaml
   kubectl apply -f infrastructure/k8s/secrets.yaml
   kubectl apply -f infrastructure/k8s/deployments/
   kubectl apply -f infrastructure/k8s/services/
   kubectl apply -f infrastructure/k8s/ingress.yaml
   ```

### AWS EKS (Alternative)

1. **Create EKS Cluster**
   ```bash
   eksctl create cluster \
     --name hda-cluster \
     --region us-east-1 \
     --nodegroup-name workers \
     --node-type t3.medium \
     --nodes 3
   ```

## 6. CI/CD Setup

### GitHub Actions

1. **Set Repository Secrets**
   ```
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_KEY
   DOCKER_REGISTRY_TOKEN
   DEPLOY_HOST
   DEPLOY_SSH_KEY
   ```

2. **Deploy on Push**
   ```yaml
   # .github/workflows/deploy.yml configured
   # Automatically deploys on push to main branch
   ```

## 7. Monitoring Setup

### Application Monitoring

1. **Sentry Setup**
   ```bash
   # Sign up at sentry.io
   # Create project
   # Get DSN
   # Add to .env: SENTRY_DSN=your-dsn
   ```

2. **Supabase Monitoring**
   - Use Supabase Dashboard for database metrics
   - Set up alerts for connection pool usage
   - Monitor API request rates

3. **Server Monitoring**
   ```bash
   # Install monitoring agent (DigitalOcean)
   curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash
   ```

## 8. Backup Strategy

### Database Backups

1. **Supabase Automatic Backups**
   - Daily backups included in Pro plan
   - Point-in-time recovery available
   - Can restore to any point in last 7 days

2. **Manual Backups**
   ```bash
   # Export database
   pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

   # Upload to S3/Spaces
   aws s3 cp backup-*.sql s3://hda-backups/
   ```

### Document Backups

```bash
# Sync documents to backup location
aws s3 sync s3://hda-documents s3://hda-documents-backup --delete
```

## 9. SSL/TLS Setup

### Using Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d hda-platform.com -d app.hda-platform.com

# Auto-renewal
certbot renew --dry-run
```

## 10. Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   ```bash
   # Check connection string format
   # Should be: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

   # Test with psql
   psql "$DATABASE_URL" -c "SELECT version();"
   ```

2. **Docker Memory Issues**
   ```bash
   # Increase Docker memory
   # Edit /etc/docker/daemon.json
   {
     "default-ulimits": {
       "memlock": {
         "Name": "memlock",
         "Hard": -1,
         "Soft": -1
       }
     }
   }
   ```

3. **Redis Connection Issues**
   ```bash
   # Check Redis is running
   docker compose exec redis redis-cli ping
   ```

## 11. Security Checklist

- [ ] Change all default passwords
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Configure firewall rules
- [ ] Set up fail2ban for SSH
- [ ] Enable audit logging
- [ ] Rotate API keys regularly
- [ ] Use secrets management for production
- [ ] Enable 2FA on all admin accounts
- [ ] Regular security updates
- [ ] Implement rate limiting

## 12. Cost Estimation

### Development Environment
- Supabase Free Tier: $0/month
- Local Docker: $0/month
- **Total: $0/month**

### Production Environment (Initial)
- Supabase Pro: $25/month
- DigitalOcean Droplets (2x): $80/month
- DigitalOcean Load Balancer: $12/month
- DigitalOcean Spaces: $5/month
- Domain: $15/year
- **Total: ~$125/month**

### Production Environment (Scaled)
- Supabase Team: $599/month
- DigitalOcean Kubernetes: $120/month (3 nodes)
- Additional services: $50/month
- **Total: ~$770/month**

## Next Steps

1. Set up Supabase development project
2. Configure local development environment
3. Test all services are connecting properly
4. Begin development with Epic 1 stories
5. Set up staging environment
6. Prepare production deployment

## Support Resources

- Supabase Documentation: https://supabase.com/docs
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Docker Documentation: https://docs.docker.com
- Kubernetes Documentation: https://kubernetes.io/docs

## Contact

For infrastructure support, contact the DevOps team or create an issue in the repository.