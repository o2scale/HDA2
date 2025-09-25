# HDA Translation Platform

AI-powered document translation platform for handwritten Arabic documents using Google Vertex AI and modern cloud infrastructure.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ and npm
- Supabase account (free tier for development)
- Google Cloud account with Vertex AI enabled

### Development Setup

1. **Set up Supabase Development Project**
   ```bash
   # Create a free project at https://supabase.com
   # Copy your project credentials
   ```

2. **Configure Environment**
   ```bash
   cp .env.development .env
   # Edit .env with your Supabase credentials
   ```

3. **Start Development Environment**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. **Access Services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Celery Flower: http://localhost:5555 (admin/admin)

## 📚 Documentation

- [Infrastructure Setup Guide](docs/INFRASTRUCTURE_SETUP.md)
- [Product Requirements](docs/prd.md)
- [System Architecture](docs/architecture.md)
- [Frontend Specifications](docs/front-end-spec.md)
- [Development Stories](docs/stories/)

## 🏗️ Project Structure

```
HDA2/
├── backend/              # FastAPI Python backend
├── frontend/            # React TypeScript frontend
├── infrastructure/      # Docker, K8s, Terraform configs
├── docs/               # Project documentation
├── docker-compose.*.yml # Docker configurations
└── .env.*              # Environment templates
```

## 🛠️ Technology Stack

- **Backend**: FastAPI, Python 3.13, Celery, SQLAlchemy
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Database**: Supabase (PostgreSQL with pgvector)
- **AI/ML**: Google Vertex AI Gemini 2.5 Pro
- **Infrastructure**: Docker, Kubernetes, DigitalOcean/AWS
- **Storage**: Supabase Storage / DigitalOcean Spaces
- **Cache**: Redis
- **Monitoring**: Sentry

## 🔐 Security

- JWT-based authentication
- Row-level security (RLS) in Supabase
- Multi-tenant architecture with schema isolation
- SSL/TLS encryption
- API rate limiting

## 🚢 Deployment

### Production Deployment

See [Infrastructure Setup Guide](docs/INFRASTRUCTURE_SETUP.md) for detailed deployment instructions.

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Deploy to DigitalOcean/AWS
docker compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

- Supabase Dashboard for database metrics
- Sentry for error tracking
- Custom health checks at `/health`

## 🤝 Contributing

This project uses BMad Method™ for AI-driven development. See the `.bmad-core` directory for agent configurations.

## 📝 License

Proprietary - O2Scale

## 📧 Contact

Project Lead: anjai@o2scale.com