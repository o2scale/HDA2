# Enterprise Translation, Transcription & Document Processing Platform Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for the Enterprise Translation, Transcription & Document Processing Platform, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Document Purpose and Scope

**Primary Objectives:**
- Define the technical blueprint for a multi-tenant SaaS platform processing 2TB+ of content
- Establish patterns for text extraction, translation, and verification workflows
- Document the modular monolith architecture with clear microservice migration paths
- Specify integration patterns between React frontend and Python FastAPI backend
- Outline infrastructure decisions for AWS deployment with Terraform IaC

**Key Architectural Drivers:**
1. **Quality Over Speed** - Prioritize translation accuracy (>95%) over processing time
2. **Multi-Tenancy First** - Built-in tenant isolation from day one
3. **AI Provider Flexibility** - Avoid vendor lock-in with abstraction layers
4. **Progressive Complexity** - MVP delivers value, then scales to enterprise
5. **Developer Experience** - AI agents can understand and implement from this document

### System Context

The platform addresses three core business models:
- **White-Label Enterprise** ($50K-$500K licensing) - On-premise deployment with full customization
- **SaaS Subscriptions** ($99-$999/month) - Multi-tenant cloud platform
- **AI API Aggregation** (20-30% markup) - Reselling AI services with value-add

**Technical Challenges Addressed:**
- Processing mixed-content PDFs (scanned + digital text)
- Maintaining concept accuracy across 6 languages (English, Hindi, Marathi, Bengali, Gujarati, German)
- Real-time progress updates for long-running text extraction jobs (minutes to hours)
- Scaling from single client (HDA) to 100+ enterprise organizations
- Handling Vertex AI Gemini 2.5 Pro API limitations and quotas (1M input/65K output tokens)

### Architecture Philosophy

**Design Principles:**
1. **Boring Technology Where Possible** - PostgreSQL, Redis, REST APIs
2. **Exciting Where Necessary** - Gemini 2.5 Pro for text extraction, WebSockets for real-time
3. **Data-Centric Design** - Let document processing workflow drive architecture
4. **Cost-Conscious Engineering** - Optimize for AWS Free Tier initially, scale efficiently
5. **Living Architecture** - Start monolithic, evolve to microservices as needed

**Key Architectural Decisions:**
- **Monorepo Structure** - Shared types between frontend/backend, atomic commits
- **Python Backend** - Superior AI/ML ecosystem for PDF processing
- **React + TypeScript Frontend** - Type safety and component reusability
- **AWS Infrastructure** - Following proven SaaS patterns (Stripe, Figma)
- **PostgreSQL with pgvector** - Future-ready for RAG and semantic search

### Starter Template or Existing Project

**Greenfield Rationale:**
While starter templates like T3 Stack or AWS Amplify could accelerate development, our specialized requirements justify a custom architecture:

1. **Unique Processing Pipeline** - No starter handles Text Extraction → Translation → Verification workflow
2. **Multi-Tenant Complexity** - Schema-per-tenant requires custom implementation
3. **AI Provider Abstraction** - Need custom integration layer for multiple providers
4. **Real-time Updates** - WebSocket/SSE hybrid not common in starters
5. **White-Label Support** - Theming system needs deep customization

**Build vs Buy Decisions:**
- **Build:** Text extraction pipeline, translation workflow, verification system
- **Buy/Use:** Stripe for payments, AWS services, Gemini API
- **Extend:** FastAPI framework, React component libraries

### Document Structure Guide

**How to Use This Architecture:**
1. **Developers** - Start with Tech Stack (source of truth) and Project Structure
2. **AI Agents** - Reference Data Models and API Specifications for implementation
3. **DevOps** - Focus on Deployment Architecture and Infrastructure sections
4. **Frontend Team** - Frontend Architecture section has component patterns
5. **Backend Team** - Backend Architecture covers services and database design

**Living Document Convention:**
- Version updates for major architectural changes
- Change log tracks all modifications
- Sections marked "Future" indicate post-MVP considerations
- Code examples are templates, not prescriptive implementations

### Related Documentation

**Prerequisite Documents:**
- `docs/prd.md` - Product Requirements Document (reviewed ✓)
- `docs/brief.md` - Project Brief with business context (reviewed ✓)

**Documents This Architecture Generates:**
- `docs/architecture/api-spec.yaml` - OpenAPI 3.0 specification
- `docs/architecture/database-schema.sql` - PostgreSQL DDL
- `infrastructure/terraform/` - Infrastructure as Code

### Technical Context and Constraints

**PDF Processing Challenges:**
- **Input Variety:** Documents range from clean digital PDFs to 300+ year old scanned manuscripts
- **File Sizes:** Individual PDFs up to 500MB, with 100-1000 pages
- **Text Extraction Complexity:** Mixed content (50% scanned, 50% digital text) within same document
- **Language Detection:** Documents contain 2-3 languages intermixed (Hindi + English common)
- **Format Preservation:** Need to maintain tables, headers, footnotes in translation

**Vertex AI Gemini 2.5 Pro Integration Specifics:**
- **Context Window:** 1 million input tokens, 65K output tokens (Vertex AI limits)
- **Rate Limits:** 2,000 requests per minute, 1 million tokens per minute
- **Latency:** 2-10 seconds per page depending on complexity
- **Cost:** ~$0.00125 per 1K characters for text extraction, ~$0.002 for translation
- **Accuracy:** 97% for printed text, 85% for handwritten content

**Performance Requirements:**
- **Concurrent Users:** 1,000+ across all tenants
- **Processing Throughput:** 100 PDFs simultaneously
- **API Response Time:** <200ms for CRUD, 2-60s for text extraction/translation
- **Real-time Updates:** WebSocket latency <100ms
- **Storage:** 2TB initial, scaling to 50TB within Year 1
- **Database Size:** 100GB+ with millions of translation pairs

**Multi-Tenant Technical Requirements:**
- **Isolation Level:** Complete data isolation via PostgreSQL schemas
- **Tenant Scale:** Support 100+ organizations
- **Customization:** Per-tenant theming, glossaries, workflows
- **Performance:** No tenant can impact another's performance
- **Backup:** Per-tenant backup and restore capabilities

**Infrastructure Constraints:**
- **Budget:** Start with <$500/month AWS costs
- **Regions:** US-East-1 primary, EU-West-1 for GDPR compliance
- **Compliance:** SOC 2 Type II preparation from Day 1
- **Availability:** 99.9% uptime SLA for enterprise clients
- **Disaster Recovery:** 4-hour RTO, 1-hour RPO

**Development Constraints:**
- **Team Size:** 2-3 developers initially
- **AI Agents:** Code must be understandable by Claude/GPT-4
- **Timeline:** MVP in 3 months (Epic 1)
- **Testing:** 80% backend coverage, 70% frontend
- **Documentation:** Self-documenting code with OpenAPI specs

### Technology Selection Rationale

**Why Python + FastAPI (not Node.js):**
- **PDF Libraries:** `pdfplumber` > Node alternatives for complex PDFs
- **AI SDKs:** First-class support from Google, OpenAI
- **Async Performance:** FastAPI matches Node.js performance
- **Type Safety:** Pydantic provides runtime validation
- **ML Ecosystem:** Future RAG implementation easier

**Why PostgreSQL + Supabase (not MongoDB/DynamoDB):**
- **ACID Compliance:** Critical for financial transactions
- **Schema-per-tenant:** Built-in isolation mechanism
- **pgvector Extension:** Native semantic search capability
- **Complex Queries:** JOIN operations for reporting
- **Supabase Benefits:** Automated backups, real-time subscriptions, built-in auth, storage, and seamless scaling

**Why React + TypeScript (not Vue/Svelte):**
- **Ecosystem:** Largest component library selection
- **Type Safety:** Catches errors at compile time
- **Team Familiarity:** Easier hiring and onboarding
- **shadcn/ui:** Modern, accessible components
- **Next.js Option:** Can migrate if SSR needed

**Why AWS (not GCP/Azure):**
- **Service Maturity:** Most comprehensive service offering
- **Cost Predictability:** Reserved instances for savings
- **Terraform Support:** Excellent IaC tooling
- **Marketplace:** Can sell our solution via AWS Marketplace
- **Compliance:** Built-in SOC 2, HIPAA, GDPR tools

### Critical Technical Decisions

**Monolith First, Microservices Ready:**
```
Phase 1 (Months 1-3): Modular Monolith
- Single deployable unit
- Clear module boundaries
- Internal event bus

Phase 2 (Months 4-6): Service Extraction
- Text Extraction Service → Lambda Functions
- Translation Service → ECS Tasks
- Keep core in monolith

Phase 3 (Months 7-9): Full Microservices
- API Gateway routing
- Service mesh with AppMesh
- Distributed tracing
```

**Data Flow Architecture:**
```
PDF Upload → S3 → SQS Message → Celery Worker →
→ Text Processing (Vertex AI) → PostgreSQL →
→ Translation Job → Celery Worker →
→ Translation (Vertex AI) → PostgreSQL →
→ WebSocket Update → Frontend
```

**Caching Strategy:**
- **Redis:** Session storage, job queues, real-time data
- **CloudFront:** Static assets, processed PDFs
- **Application Cache:** Translation memory, glossary terms
- **Database Cache:** Query results with 5-minute TTL

**Security Architecture:**
- **Zero Trust:** Verify every request
- **Defense in Depth:** Multiple security layers
- **Encryption:** At rest (AES-256) and in transit (TLS 1.3)
- **Secrets Management:** AWS Secrets Manager
- **Audit Logging:** Every action logged with CloudTrail

### Success Criteria for Architecture

This architecture succeeds if:
1. **AI agents can implement Epic 1** using only this document
2. **New developers onboard in <2 hours** with clear mental model
3. **System handles 100 concurrent PDF processing jobs** without degradation
4. **Multi-tenant isolation passes security audit** with zero data leaks
5. **Migration to microservices requires <1 week** when scale demands
6. **Processing accuracy exceeds 95%** for concept preservation
7. **Infrastructure costs scale linearly** with customer growth

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-23 | 1.0 | Initial architecture design based on PRD requirements | Winston (Architect) |
| 2025-09-24 | 1.1 | Major update based on UX spec gaps: Added Queue & State Management, Vertex AI Integration, Structure Preservation, Data Management, Real-time Features, Export System, Multi-tenant enhancements | Winston (Architect) |
| 2025-09-24 | 1.2 | Corrected deployment architecture: Removed Vercel, added DigitalOcean (primary) and AWS EC2 (alternative) options with Kubernetes readiness | Winston (Architect) |
| 2025-09-24 | 1.3 | Added pragmatic Kubernetes decision guide: Docker Compose recommended for 12-18 months, detailed complexity analysis and migration criteria | Winston (Architect) |

## High Level Architecture

### Technical Summary

The Enterprise Translation Platform employs a **modular monolith** architecture with clear service boundaries, enabling future decomposition into microservices as scaling demands. The system processes documents through a pipeline architecture: PDF ingestion → Text extraction → Translation → Human verification → Export.

**Core Architecture Patterns:**
- **Event-Driven Processing** - Asynchronous job queue for long-running tasks
- **CQRS Pattern** - Separate read/write paths for translation workflows
- **Repository Pattern** - Abstract data access for multi-tenant isolation
- **Strategy Pattern** - Pluggable AI providers (Gemini, OpenAI, Claude)
- **Observer Pattern** - Real-time progress updates via WebSockets

**Key Architectural Components:**
1. **API Gateway** - FastAPI with JWT authentication and rate limiting
2. **Processing Engine** - Celery workers with Redis message broker
3. **Data Layer** - Supabase PostgreSQL with schema-per-tenant isolation
4. **Storage Layer** - S3 for documents with CloudFront CDN
5. **Cache Layer** - Redis for sessions and translation memory
6. **Real-time Layer** - WebSocket/SSE for progress updates

### Platform and Infrastructure Choice

**Primary Cloud Provider: AWS**
```yaml
Core Services:
  Compute:
    - EC2: API servers (t3.medium → c5.xlarge)
    - ECS Fargate: Containerized workers
    - Lambda: Text extraction pre-processing functions

  Storage:
    - S3: Document storage with lifecycle policies
    - Supabase PostgreSQL: Primary database (scales automatically)
    - ElastiCache Redis: Caching and queues

  Networking:
    - CloudFront: CDN for processed documents
    - ALB: Load balancing with health checks
    - VPC: Network isolation with private subnets

  Security:
    - Secrets Manager: API keys and credentials
    - WAF: Protection against common attacks
    - CloudTrail: Audit logging

  Monitoring:
    - CloudWatch: Metrics and logging
    - X-Ray: Distributed tracing
    - SNS: Alert notifications

Infrastructure as Code:
  - Terraform: Resource provisioning
  - GitHub Actions: CI/CD pipeline
  - Docker: Container orchestration
```

**Cost Optimization Strategy:**
- Start with Reserved Instances for predictable workloads
- Use Spot Instances for batch processing
- Implement auto-scaling based on queue depth
- S3 Intelligent-Tiering for document storage
- Lambda for sporadic preprocessing tasks

### Repository Structure

**Monorepo Configuration:**
```
HDA2/
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── CODEOWNERS          # Code ownership
├── backend/
│   ├── api/                # FastAPI application
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Pydantic models
│   │   └── middleware/     # Auth, logging, CORS
│   ├── core/               # Core domain logic
│   │   ├── text_extraction/  # Text extraction processing
│   │   ├── translation/   # Translation engine
│   │   └── verification/  # Human review system
│   ├── workers/            # Celery workers
│   │   ├── tasks/         # Async task definitions
│   │   └── schedulers/    # Periodic tasks
│   ├── database/           # Database layer
│   │   ├── migrations/    # Alembic migrations
│   │   ├── repositories/  # Data access
│   │   └── schemas/       # SQLAlchemy models
│   └── tests/              # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── features/       # Feature modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API clients
│   │   ├── stores/         # State management
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── tests/              # Frontend tests
├── shared/
│   ├── types/              # Shared TypeScript types
│   ├── constants/          # Shared constants
│   └── utils/              # Shared utilities
├── infrastructure/
│   ├── terraform/          # IaC definitions
│   ├── docker/             # Dockerfiles
│   └── scripts/            # Deployment scripts
├── docs/
│   ├── api/               # API documentation
│   ├── architecture/      # Architecture docs
│   └── guides/            # User guides
└── packages/              # Shared packages
    ├── sdk-python/        # Python client SDK
    └── sdk-js/           # JavaScript SDK
```

### Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Applications"
        WEB[React Web App]
        MOBILE[Mobile App - Future]
        API_CLIENT[API SDKs]
    end

    %% CDN Layer
    CF[CloudFront CDN]

    %% API Gateway Layer
    subgraph "API Gateway"
        ALB[Application Load Balancer]
        FASTAPI[FastAPI Servers]
        WS[WebSocket Server]
    end

    %% Application Layer
    subgraph "Application Services"
        AUTH[Auth Service]
        DOC[Document Service]
        TEXT_SVC[Text Extraction Service]
        TRANS_SVC[Translation Service]
        VERIFY[Verification Service]
        EXPORT[Export Service]
    end

    %% Worker Layer
    subgraph "Background Workers"
        CELERY[Celery Workers]
        SCHEDULER[Beat Scheduler]
    end

    %% AI Provider Layer
    subgraph "AI Providers"
        VERTEX[Vertex AI Gemini 2.5 Pro]
        OPENAI[OpenAI - Future]
        CLAUDE[Claude - Future]
    end

    %% Data Layer
    subgraph "Data Storage"
        SUPABASE[(Supabase PostgreSQL)]
        REDIS[(Redis Cache)]
        S3[(S3 Documents)]
    end

    %% Monitoring Layer
    subgraph "Monitoring & Logging"
        CW[CloudWatch]
        XRAY[X-Ray]
        ALERTS[SNS Alerts]
    end

    %% Connections
    WEB --> CF
    CF --> ALB
    API_CLIENT --> ALB

    ALB --> FASTAPI
    ALB --> WS

    FASTAPI --> AUTH
    FASTAPI --> DOC
    FASTAPI --> TEXT_SVC
    FASTAPI --> TRANS_SVC
    FASTAPI --> VERIFY
    FASTAPI --> EXPORT

    DOC --> S3
    TEXT_SVC --> GEMINI
    TRANS_SVC --> GEMINI

    FASTAPI --> REDIS
    FASTAPI --> AURORA

    DOC --> CELERY
    TEXT_SVC --> CELERY
    TRANS_SVC --> CELERY

    CELERY --> REDIS
    CELERY --> AURORA
    CELERY --> S3

    WS --> REDIS

    FASTAPI --> CW
    CELERY --> CW
    CW --> ALERTS

    style WEB fill:#61DAFB
    style FASTAPI fill:#009688
    style AURORA fill:#FF9900
    style REDIS fill:#DC382D
    style S3 fill:#569A31
    style GEMINI fill:#4285F4
```

### Architectural Patterns

**1. Multi-Tenant Isolation Pattern**
```python
# Schema-per-tenant with automatic routing
class TenantContextMiddleware:
    """Automatically sets PostgreSQL search_path based on tenant"""
    async def __call__(self, request: Request):
        tenant_id = extract_tenant_from_jwt(request)
        request.state.db_schema = f"tenant_{tenant_id}"
        # Set search_path for all queries in this request
```

**2. Event-Driven Processing Pattern**
```python
# Document processing pipeline
EventFlow:
  1. PDF Upload → S3 + Database Record
  2. Event: "document.uploaded" → SQS
  3. Text Extraction Worker picks up message
  4. Event: "text_extraction.completed" → Translation Queue
  5. Translation Worker processes
  6. Event: "translation.ready" → WebSocket notification
```

**3. Circuit Breaker Pattern**
```python
# Protect against AI provider failures
class GeminiCircuitBreaker:
    """Fallback to alternative providers or queue for retry"""
    states = ["CLOSED", "OPEN", "HALF_OPEN"]
    failure_threshold = 5
    timeout = 60  # seconds
    fallback = AlternativeTextExtractionProvider()
```

**4. Translation Memory Pattern**
```python
# Cache frequently translated segments
class TranslationMemory:
    """Redis-backed translation cache with fuzzy matching"""
    def get_similar(self, text: str, threshold=0.85):
        # Return cached translation if similarity > threshold
        # Reduces API calls by ~40%
```

**5. Saga Pattern for Long Transactions**
```python
# Coordinate multi-step document processing
class DocumentProcessingSaga:
    steps = [
        UploadStep(),
        TextExtractionStep(compensate=DeleteFromS3),
        TranslationStep(compensate=RevertTextExtraction),
        NotificationStep(compensate=None)
    ]
    # Automatic rollback on failure
```

### Service Boundaries and Modules

**Core Modules (Within Monolith):**

1. **Authentication Module**
   - JWT token management
   - Multi-tenant user isolation
   - Role-based access control
   - SSO integration ready

2. **Document Management Module**
   - Upload/download orchestration
   - Version control
   - Metadata management
   - Access control

3. **Text Extraction Processing Module**
   - Image preprocessing
   - Gemini API integration
   - Text extraction pipeline
   - Quality validation

4. **Translation Module**
   - Language detection
   - Translation memory
   - Glossary management
   - Concept preservation logic

5. **Verification Module**
   - Human review workflow
   - Change tracking
   - Approval process
   - Quality metrics

6. **Export Module**
   - Format conversion
   - Template rendering
   - Batch export
   - Download management

**Future Microservice Candidates:**
```yaml
Phase 2 Extraction (Month 4-6):
  - Text Extraction Service → AWS Lambda + SQS
  - Translation Service → ECS Fargate
  - Export Service → Serverless containers

Phase 3 Full Decomposition (Month 7-9):
  - Authentication → Cognito/Auth0
  - Document Storage → Dedicated service
  - Notification → SNS/EventBridge
  - Analytics → Dedicated data pipeline
```

### Cross-Cutting Concerns

**1. Security**
- All services behind VPC
- TLS 1.3 for all communications
- Encryption at rest with KMS
- API rate limiting per tenant
- OWASP Top 10 protection via WAF

**2. Observability**
- Distributed tracing with X-Ray
- Structured logging to CloudWatch
- Custom metrics for business KPIs
- Real-time dashboards
- Alert thresholds with PagerDuty

**3. Performance**
- Response time budgets per service
- Automatic scaling policies
- Database connection pooling
- Query optimization with indexes
- CDN for static content

**4. Resilience**
- Health checks at every layer
- Graceful degradation
- Retry with exponential backoff
- Dead letter queues
- Chaos engineering tests

### Data Flow Example: PDF Translation

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant S3
    participant Queue
    participant Worker
    participant VertexAI
    participant DB
    participant WebSocket

    User->>Frontend: Upload PDF
    Frontend->>API: POST /documents/upload
    API->>S3: Store PDF
    API->>DB: Create document record
    API->>Queue: Publish text extraction task
    API-->>Frontend: 202 Accepted + Job ID

    Queue->>Worker: Deliver text extraction task
    Worker->>S3: Fetch PDF
    Worker->>VertexAI: Process pages
    VertexAI-->>Worker: Extracted text
    Worker->>DB: Store text extraction results
    Worker->>WebSocket: Progress update
    WebSocket-->>Frontend: Real-time status

    Worker->>Queue: Publish translation task
    Queue->>Worker: Deliver translation task
    Worker->>DB: Fetch extracted text
    Worker->>VertexAI: Translate text
    VertexAI-->>Worker: Translated content
    Worker->>DB: Store translation
    Worker->>WebSocket: Complete notification
    WebSocket-->>Frontend: Translation ready

    Frontend->>API: GET /documents/{id}/translation
    API->>DB: Fetch translation
    API-->>Frontend: Return translated document
```

### Scaling Strategy

**Horizontal Scaling Triggers:**
- CPU > 70% for 5 minutes → Add instance
- Queue depth > 100 → Add workers
- Response time > 500ms p95 → Add API servers
- Memory > 80% → Scale or optimize

**Vertical Scaling Thresholds:**
- Database connections > 80% → Upgrade RDS
- Storage > 80% → Expand volumes
- Worker memory pressure → Larger instances

**Cost-Aware Scaling:**
```python
# Smart scaling based on time and cost
if business_hours and high_priority:
    scale_immediately()
elif queue_depth > threshold and spot_available:
    add_spot_instances()
else:
    queue_for_batch_processing()
```

## Tech Stack

### Technology Selection Matrix

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Backend Framework** | FastAPI | 0.117.1 | Latest stable (Sep 2025), async support, automatic OpenAPI docs, Pydantic validation |
| **Backend Language** | Python | 3.13.7 | Latest stable (Aug 2025), JIT compiler, free-threaded mode, strong AI/ML ecosystem |
| **Task Queue** | Celery | 5.4.0 | Latest stable, mature async processing, Redis/RabbitMQ support |
| **Message Broker** | Redis | 7.4.0 | Latest stable, simple setup, pub/sub + queue, also serves as cache |
| **Database** | Supabase (PostgreSQL) | 16.4 | Latest Supabase uses PostgreSQL 16, with pgvector, real-time, auth built-in |
| **ORM** | SQLAlchemy | 2.0.35 | Latest 2.0.x, async support, migration tools, strong typing |
| **Frontend Framework** | React | 19.1.0 | Latest stable (Mar 2025), Server Components, improved Suspense |
| **UI Component Library** | Ant Design | 5.21.0 | Latest v5, enterprise components, accessibility, theming |
| **State Management** | Zustand | 5.0.1 | Latest stable, simple API, TypeScript first, devtools support |
| **Frontend Build** | Vite | 5.4.8 | Latest stable, fast HMR, ESM support, optimized builds |
| **API Client** | Axios + @tanstack/react-query | 1.6.7 + 5.59.0 | Latest versions, request caching, retry logic, optimistic updates |
| **Real-time** | Supabase Realtime | 2.57.4 | Built-in with Supabase client, WebSocket-based, presence, broadcast |
| **CSS Framework** | Tailwind CSS | 3.4.13 | Latest v3, utility-first, JIT compilation, dark mode |
| **Testing Backend** | Pytest | 8.3.3 | Latest stable, async support, fixtures, extensive plugins |
| **Testing Frontend** | Vitest + React Testing Library | 2.1.2 + 16.0.1 | Latest stable versions, fast, Jest compatible |
| **API Documentation** | OpenAPI/Swagger | 3.1.0 | Latest spec, auto-generated from FastAPI |
| **Containerization** | Docker | 27.3.1 | Latest stable (Sep 2025), multi-stage builds |
| **Orchestration** | Docker Compose / ECS | 2.29.7 / Latest | Local dev with Compose, production on ECS |
| **CI/CD** | GitHub Actions | Latest | Native integration, matrix builds, secrets management |
| **IaC** | Terraform | 1.9.6 | Latest stable, declarative infrastructure, OpenTofu compatible |
| **Monitoring** | CloudWatch + Sentry | Latest | AWS integration, error tracking, performance monitoring |
| **CDN** | CloudFront | Latest | Global edge locations, S3 integration |

### Backend Stack Details

**Core Dependencies:**
```python
# requirements.txt
fastapi==0.117.1
uvicorn[standard]==0.32.0
pydantic==2.9.2
pydantic-settings==2.5.2

# Database & Supabase
sqlalchemy==2.0.35
alembic==1.13.3
asyncpg==0.29.0
psycopg2-binary==2.9.9
supabase==2.8.1
pgvector==0.3.3

# Task Queue
celery[redis]==5.4.0
redis==5.0.8
flower==2.0.1  # Monitoring

# AI/ML
google-cloud-aiplatform==1.78.0  # Vertex AI SDK (NOT google-generativeai)
langchain==0.3.3  # Orchestration
langchain-google-vertexai==2.0.1
openai==1.51.0  # For embeddings
numpy==2.1.1
pandas==2.2.3

# Storage
boto3==1.35.28  # AWS S3
python-multipart==0.0.12  # File uploads

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dateutil==2.9.0

# Utils
httpx==0.27.2  # Async HTTP client
tenacity==9.0.0  # Retry logic
python-json-logger==2.0.7
pyyaml==6.0.2

# Development
pytest==8.3.3
pytest-asyncio==0.24.0
black==24.8.0
ruff==0.6.8
mypy==1.11.2
```

**FastAPI Application Structure:**
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_database()
    await init_redis()
    await init_celery()
    yield
    # Shutdown
    await close_connections()

app = FastAPI(
    title="Enterprise Translation Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure per environment
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Stack Details

**Core Dependencies:**
```json
// package.json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.26.2",
    "antd": "^5.21.0",
    "@ant-design/icons": "^5.5.1",
    "axios": "^1.7.7",
    "@tanstack/react-query": "^5.59.0",
    "zustand": "^5.0.1",
    "@supabase/supabase-js": "^2.57.4",
    "@supabase/auth-helpers-react": "^0.5.0",
    "dayjs": "^1.11.13",
    "react-pdf": "^9.1.1",
    "react-markdown": "^9.0.1",
    "react-syntax-highlighter": "^15.5.0",
    "recharts": "^2.12.7",
    "i18next": "^23.15.1",
    "react-i18next": "^15.0.2"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^8.6.0",
    "@typescript-eslint/parser": "^8.6.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.10.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2",
    "vite": "^5.4.8",
    "vitest": "^2.1.2",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.2"
  }
}
```

**Frontend Architecture Patterns:**
```typescript
// Store Pattern with Zustand
interface AppStore {
  user: User | null;
  documents: Document[];
  activeDocument: Document | null;

  // Actions
  setUser: (user: User) => void;
  loadDocuments: () => Promise<void>;
  selectDocument: (id: string) => void;
}

// API Layer with React Query
const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: DocumentAPI.fetchAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Real-time Updates
useEffect(() => {
  socket.on('translation.progress', (data) => {
    updateProgress(data.documentId, data.progress);
  });
}, []);
```

### Infrastructure Stack

**Docker Configuration:**
```dockerfile
# Backend Dockerfile (multi-stage)
FROM python:3.11-slim as builder
WORKDIR /build
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Docker Compose (Development):**
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: translation_platform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres/translation_platform
      REDIS_URL: redis://redis:6379
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    command: uvicorn main:app --reload --host 0.0.0.0

  celery:
    build: ./backend
    depends_on:
      - redis
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres/translation_platform
      REDIS_URL: redis://redis:6379
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    command: celery -A worker.celery worker --loglevel=info

  frontend:
    build: ./frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

### Development Tools

**Code Quality Tools:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.11.0
    hooks:
      - id: black
        language_version: python3.11

  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.1.6
    hooks:
      - id: ruff
        args: [--fix]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.1
    hooks:
      - id: mypy
        additional_dependencies: [types-all]

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.55.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
```

**VSCode Settings:**
```json
{
  "editor.formatOnSave": true,
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Security Dependencies

**Authentication & Authorization:**
```python
# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

# Rate Limiting
from slowapi import Limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000/hour"]
)

# CORS Configuration
origins = [
    "https://app.translation-platform.com",
    "https://staging.translation-platform.com",
    "http://localhost:3000"  # Development only
]
```

### Monitoring & Observability

**Application Monitoring:**
```python
# Sentry Integration
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[
        FastApiIntegration(transaction_style="endpoint"),
        SqlalchemyIntegration(),
    ],
    traces_sample_rate=0.1,
    profiles_sample_rate=0.1,
)

# Custom Metrics
from prometheus_client import Counter, Histogram, generate_latest

translation_counter = Counter(
    'translations_total',
    'Total number of translations',
    ['language', 'status']
)

translation_duration = Histogram(
    'translation_duration_seconds',
    'Translation processing time',
    ['language', 'page_count']
)
```

### Testing Strategy

**Backend Testing:**
```python
# pytest.ini
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
addopts = """
    --verbose
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
"""

# Test Structure
tests/
├── unit/           # Fast, isolated tests
├── integration/    # API endpoint tests
├── e2e/           # Full workflow tests
└── fixtures/      # Test data
```

**Frontend Testing:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      threshold: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Data Models

### Database Schema Design

**Multi-Tenant Architecture:**
```sql
-- Each tenant gets their own schema
CREATE SCHEMA tenant_001;
CREATE SCHEMA tenant_002;

-- Shared schema for system-wide data
CREATE SCHEMA shared;

-- Example tenant isolation
SET search_path TO tenant_001, shared, public;
```

### Core Entity Models

**1. Organization (Shared Schema)**
```python
class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = {"schema": "shared"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    schema_name = Column(String(63), unique=True, nullable=False)

    # Subscription & Limits
    plan_type = Column(Enum(PlanType), default=PlanType.STARTER)
    max_users = Column(Integer, default=5)
    max_storage_gb = Column(Integer, default=100)
    max_api_calls = Column(Integer, default=10000)

    # Settings
    settings = Column(JSONB, default=dict)
    features = Column(ARRAY(String), default=list)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    users = relationship("User", back_populates="organization")
```

**2. User (Tenant Schema)**
```python
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # Profile
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    language_preference = Column(String(10), default="en")
    timezone = Column(String(50), default="UTC")

    # Role & Permissions
    role = Column(Enum(UserRole), default=UserRole.TRANSLATOR)
    permissions = Column(ARRAY(String), default=list)

    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime(timezone=True))

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    documents = relationship("Document", back_populates="owner")
    translations = relationship("Translation", back_populates="translator")
    reviews = relationship("Review", back_populates="reviewer")
```

**3. Document (Tenant Schema)**
```python
class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Document Info
    title = Column(String(500), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(Enum(FileType), nullable=False)  # PDF, DOCX, TXT, IMAGE
    file_size_bytes = Column(BigInteger, nullable=False)
    page_count = Column(Integer)

    # Storage
    s3_key = Column(String(500), nullable=False, unique=True)
    s3_bucket = Column(String(255), nullable=False)
    storage_path = Column(String(1000))

    # Language
    source_language = Column(String(10), nullable=False)
    detected_languages = Column(JSONB)  # {"hi": 0.7, "en": 0.3}

    # Processing Status
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED)
    processing_started_at = Column(DateTime(timezone=True))
    processing_completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)

    # Metadata
    metadata = Column(JSONB, default=dict)
    tags = Column(ARRAY(String), default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="documents")
    text_extraction_results = relationship("TextExtractionResult", back_populates="document", cascade="all, delete-orphan")
    translations = relationship("Translation", back_populates="document", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_document_owner", "owner_id"),
        Index("idx_document_status", "status"),
        Index("idx_document_created", "created_at"),
    )
```

**4. TextExtractionResult (Tenant Schema)**
```python
class TextExtractionResult(Base):
    __tablename__ = "text_extraction_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    page_number = Column(Integer, nullable=False)

    # Text Extraction Data
    raw_text = Column(Text, nullable=False)
    structured_data = Column(JSONB)  # Paragraphs, headers, tables
    confidence_score = Column(Float)

    # Image Processing
    image_s3_key = Column(String(500))  # Processed page image
    text_regions = Column(JSONB)  # Bounding boxes, text regions

    # Gemini Specific
    gemini_response = Column(JSONB)  # Full API response
    tokens_used = Column(Integer)
    processing_time_ms = Column(Integer)

    # Status
    status = Column(Enum(TextExtractionStatus), default=TextExtractionStatus.PENDING)
    error_message = Column(Text)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    document = relationship("Document", back_populates="text_extraction_results")

    # Indexes
    __table_args__ = (
        Index("idx_text_extraction_document_page", "document_id", "page_number", unique=True),
    )
```

**5. Translation (Tenant Schema)**
```python
class Translation(Base):
    __tablename__ = "translations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    translator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Translation Info
    target_language = Column(String(10), nullable=False)
    translation_type = Column(Enum(TranslationType))  # MACHINE, HUMAN, HYBRID

    # Content (versioned)
    version = Column(Integer, default=1)
    translated_text = Column(Text, nullable=False)
    segments = Column(JSONB)  # Paragraph-level translations

    # Quality Metrics
    confidence_score = Column(Float)
    similarity_score = Column(Float)  # To original
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)

    # AI Processing
    model_used = Column(String(100))  # "gemini-2.5-pro"
    model_parameters = Column(JSONB)
    tokens_used = Column(Integer)
    cost_usd = Column(Numeric(10, 6))

    # Concept Preservation (for religious texts)
    preserved_terms = Column(JSONB)  # {"karma": "karma", "dharma": "dharma"}
    glossary_applied = Column(Boolean, default=False)

    # Status
    status = Column(Enum(TranslationStatus), default=TranslationStatus.IN_PROGRESS)
    completed_at = Column(DateTime(timezone=True))

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    document = relationship("Document", back_populates="translations")
    translator = relationship("User", back_populates="translations")
    reviews = relationship("Review", back_populates="translation")

    # Indexes
    __table_args__ = (
        Index("idx_translation_document_lang", "document_id", "target_language"),
        Index("idx_translation_status", "status"),
    )
```

**6. Review (Tenant Schema)**
```python
class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    translation_id = Column(UUID(as_uuid=True), ForeignKey("translations.id"))
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Review Content
    review_type = Column(Enum(ReviewType))  # ACCURACY, GRAMMAR, CULTURAL
    rating = Column(Integer)  # 1-5
    comments = Column(Text)

    # Corrections
    corrections = Column(JSONB)  # [{"original": "...", "corrected": "...", "reason": "..."}]

    # Status
    status = Column(Enum(ReviewStatus))
    approved = Column(Boolean)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    translation = relationship("Translation", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")
```

**7. TranslationMemory (Shared Schema)**
```python
class TranslationMemory(Base):
    __tablename__ = "translation_memory"
    __table_args__ = {"schema": "shared"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("shared.organizations.id"))

    # Source
    source_text = Column(Text, nullable=False)
    source_language = Column(String(10), nullable=False)
    source_hash = Column(String(64), nullable=False)  # SHA256

    # Target
    target_text = Column(Text, nullable=False)
    target_language = Column(String(10), nullable=False)

    # Quality
    usage_count = Column(Integer, default=1)
    confidence_score = Column(Float, default=1.0)
    is_verified = Column(Boolean, default=False)

    # Context
    domain = Column(String(50))  # religious, technical, legal
    metadata = Column(JSONB)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True))

    # Indexes with PostgreSQL trigram for fuzzy matching
    __table_args__ = (
        Index("idx_tm_source_hash", "source_hash"),
        Index("idx_tm_source_text_gin", "source_text", postgresql_using="gin"),
    )
```

**8. ProcessingJob (Tenant Schema)**
```python
class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))

    # Job Info
    job_type = Column(Enum(JobType))  # TEXT_EXTRACTION, TRANSLATION, EXPORT
    celery_task_id = Column(String(255), unique=True)

    # Progress
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    progress_percentage = Column(Integer, default=0)
    current_step = Column(String(255))
    total_steps = Column(Integer)

    # Timing
    queued_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    # Results
    result = Column(JSONB)
    error_message = Column(Text)
    error_traceback = Column(Text)

    # Resources
    cpu_seconds = Column(Float)
    memory_mb_peak = Column(Integer)

    # Relationships
    document = relationship("Document")
```

### Enums and Types

```python
from enum import Enum

class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    TRANSLATOR = "translator"
    REVIEWER = "reviewer"
    VIEWER = "viewer"

class FileType(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    IMAGE = "image"
    EPUB = "epub"

class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    TEXT_EXTRACTION_COMPLETE = "text_extraction_complete"
    READY = "ready"
    ERROR = "error"

class TranslationType(str, Enum):
    MACHINE = "machine"
    HUMAN = "human"
    HYBRID = "hybrid"

class ReviewStatus(str, Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVISION = "needs_revision"

class JobType(str, Enum):
    TEXT_EXTRACTION = "text_extraction"
    TRANSLATION = "translation"
    EXPORT = "export"
    BATCH = "batch"

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
```

### Database Indices and Optimization

```sql
-- Full-text search on translations
CREATE INDEX idx_translation_fulltext ON translations
USING GIN (to_tsvector('english', translated_text));

-- Fuzzy matching for translation memory
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_tm_source_trgm ON translation_memory
USING GIN (source_text gin_trgm_ops);

-- JSONB indices for metadata queries
CREATE INDEX idx_document_metadata ON documents
USING GIN (metadata);

-- Composite indices for common queries
CREATE INDEX idx_document_owner_status ON documents(owner_id, status, created_at DESC);
CREATE INDEX idx_translation_document_status ON translations(document_id, status);

-- Partial indices for active records
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
```

### Data Migrations Strategy

```python
# alembic.ini configuration
[alembic]
script_location = migrations
sqlalchemy.url = postgresql://user:pass@localhost/dbname

# Migration example
"""Add translation memory table

Revision ID: 001
Create Date: 2025-09-23
"""

def upgrade():
    op.create_table(
        'translation_memory',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('source_text', sa.Text(), nullable=False),
        sa.Column('target_text', sa.Text(), nullable=False),
        sa.Column('source_language', sa.String(10)),
        sa.Column('target_language', sa.String(10)),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        schema='shared'
    )

    # Add GIN index for full-text search
    op.execute(
        "CREATE INDEX idx_tm_source_gin ON shared.translation_memory "
        "USING GIN (to_tsvector('english', source_text))"
    )

def downgrade():
    op.drop_table('translation_memory', schema='shared')
```

### Redis Cache Schema

```python
# Cache key patterns
CACHE_KEYS = {
    "user_session": "session:{user_id}",
    "document_metadata": "doc:meta:{document_id}",
    "translation_progress": "trans:progress:{job_id}",
    "text_extraction_result": "text_extraction:{document_id}:{page_number}",
    "translation_memory": "tm:{source_hash}:{target_lang}",
    "rate_limit": "rate:{user_id}:{endpoint}",
    "tenant_config": "tenant:{tenant_id}:config"
}

# Cache TTLs (in seconds)
CACHE_TTL = {
    "user_session": 3600,  # 1 hour
    "document_metadata": 300,  # 5 minutes
    "translation_progress": 60,  # 1 minute
    "text_extraction_result": 86400,  # 24 hours
    "translation_memory": 604800,  # 7 days
    "rate_limit": 60,  # 1 minute
    "tenant_config": 3600  # 1 hour
}
```

### Data Validation Schemas (Pydantic)

```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict
from datetime import datetime

class DocumentUpload(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    source_language: str = Field(..., regex="^[a-z]{2}$")
    tags: List[str] = Field(default_factory=list, max_items=10)

    @validator('title')
    def sanitize_title(cls, v):
        return v.strip().replace('/', '-')

class TranslationRequest(BaseModel):
    document_id: UUID
    target_language: str = Field(..., regex="^[a-z]{2}$")
    preserve_terms: Optional[Dict[str, str]] = None
    use_glossary: bool = True
    priority: int = Field(default=5, ge=1, le=10)

class TranslationResponse(BaseModel):
    id: UUID
    status: TranslationStatus
    progress: int = Field(ge=0, le=100)
    estimated_completion: Optional[datetime]
    preview_text: Optional[str] = Field(None, max_length=500)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

### Supabase-Specific Models with pgvector

**Embeddings Table for RAG:**
```sql
-- Create embeddings table with pgvector
CREATE TABLE translation_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_id TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    chunk_metadata JSONB DEFAULT '{}',

    -- Vector embedding (1536 dimensions for OpenAI, 768 for Gemini)
    embedding vector(1536) NOT NULL,

    -- Embedding metadata
    model_name TEXT DEFAULT 'text-embedding-ada-002',
    tokens_used INTEGER,

    -- Search optimization
    source_language TEXT,
    target_language TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint for chunk
    UNIQUE(document_id, chunk_id)
);

-- Create indexes for similarity search
CREATE INDEX ON translation_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_embeddings_document
ON translation_embeddings(document_id);

CREATE INDEX idx_embeddings_language
ON translation_embeddings(source_language, target_language);

-- Function to search similar embeddings
CREATE OR REPLACE FUNCTION search_embeddings(
    query_embedding vector(1536),
    match_count INT DEFAULT 5,
    filter_document_id UUID DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    document_id UUID,
    chunk_text TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.document_id,
        e.chunk_text,
        1 - (e.embedding <=> query_embedding) AS similarity
    FROM translation_embeddings e
    WHERE (filter_document_id IS NULL OR e.document_id = filter_document_id)
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

**SQLAlchemy Model with pgvector:**
```python
from sqlalchemy import Column, String, Integer, ForeignKey, Text, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from sqlalchemy.ext.hybrid import hybrid_property
import numpy as np

class TranslationEmbedding(Base):
    __tablename__ = "translation_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"))
    chunk_id = Column(String(100), nullable=False)
    chunk_text = Column(Text, nullable=False)
    chunk_metadata = Column(JSONB, default=dict)

    # pgvector embedding column
    embedding = Column(Vector(1536), nullable=False)

    # Metadata
    model_name = Column(String(100), default='text-embedding-ada-002')
    tokens_used = Column(Integer)
    source_language = Column(String(10))
    target_language = Column(String(10))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    document = relationship("Document", back_populates="embeddings")

    @hybrid_property
    def embedding_list(self) -> List[float]:
        """Convert pgvector to Python list"""
        return self.embedding.tolist() if self.embedding else []

    @embedding_list.setter
    def embedding_list(self, value: List[float]):
        """Set embedding from Python list"""
        self.embedding = np.array(value)

    def cosine_similarity(self, other_embedding: List[float]) -> float:
        """Calculate cosine similarity with another embedding"""
        if not self.embedding:
            return 0.0

        a = np.array(self.embedding)
        b = np.array(other_embedding)

        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
```

**Supabase Client for Embeddings:**
```python
from supabase import create_client, Client
import openai
from typing import List, Dict, Any

class SupabaseEmbeddingService:
    """Service for managing embeddings in Supabase with pgvector"""

    def __init__(self, supabase_url: str, supabase_key: str):
        self.client: Client = create_client(supabase_url, supabase_key)
        openai.api_key = settings.OPENAI_API_KEY

    async def create_embeddings_for_document(
        self,
        document_id: str,
        text: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ) -> List[Dict[str, Any]]:
        """Create and store embeddings for document chunks"""

        # Split text into chunks
        chunks = self._create_chunks(text, chunk_size, chunk_overlap)

        embeddings = []
        for i, chunk in enumerate(chunks):
            # Generate embedding
            response = openai.Embedding.create(
                input=chunk,
                model="text-embedding-ada-002"
            )

            embedding_vector = response['data'][0]['embedding']

            # Store in Supabase
            result = self.client.table('translation_embeddings').insert({
                'document_id': document_id,
                'chunk_id': f"{document_id}_chunk_{i}",
                'chunk_text': chunk,
                'embedding': embedding_vector,
                'tokens_used': response['usage']['total_tokens'],
                'chunk_metadata': {
                    'chunk_index': i,
                    'chunk_size': len(chunk),
                    'total_chunks': len(chunks)
                }
            }).execute()

            embeddings.append(result.data[0])

        return embeddings

    async def search_similar_chunks(
        self,
        query: str,
        match_count: int = 5,
        document_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar text chunks using pgvector"""

        # Generate query embedding
        response = openai.Embedding.create(
            input=query,
            model="text-embedding-ada-002"
        )
        query_embedding = response['data'][0]['embedding']

        # Search using Supabase RPC function
        params = {
            'query_embedding': query_embedding,
            'match_count': match_count
        }

        if document_id:
            params['filter_document_id'] = document_id

        results = self.client.rpc('search_embeddings', params).execute()

        return results.data

    async def update_translation_memory(
        self,
        source_text: str,
        translated_text: str,
        source_lang: str,
        target_lang: str
    ) -> Dict[str, Any]:
        """Add to translation memory with embeddings"""

        # Generate embedding for source text
        response = openai.Embedding.create(
            input=source_text,
            model="text-embedding-ada-002"
        )
        embedding = response['data'][0]['embedding']

        # Store in translation memory
        result = self.client.table('translation_memory').insert({
            'source_text': source_text,
            'target_text': translated_text,
            'source_language': source_lang,
            'target_language': target_lang,
            'source_embedding': embedding,
            'confidence_score': 1.0,
            'is_verified': False
        }).execute()

        return result.data[0]

    def _create_chunks(
        self,
        text: str,
        chunk_size: int,
        overlap: int
    ) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]

            # Try to break at sentence boundary
            if end < len(text):
                last_period = chunk.rfind('.')
                if last_period > chunk_size * 0.8:
                    chunk = text[start:start + last_period + 1]
                    end = start + last_period + 1

            chunks.append(chunk)
            start = end - overlap

        return chunks
```

**Supabase Edge Function for Embeddings:**
```typescript
// supabase/functions/generate-embeddings/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  })
)

serve(async (req) => {
  const { document_id, text } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Generate embedding
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  })

  const embedding = response.data.data[0].embedding

  // Store in database
  const { data, error } = await supabase
    .from('translation_embeddings')
    .insert({
      document_id,
      chunk_text: text,
      embedding,
      model_name: 'text-embedding-ada-002',
      tokens_used: response.data.usage.total_tokens,
    })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## API Specifications

### RESTful API Design Principles

**Base URL Structure:**
```
https://api.translation-platform.com/v1
https://api-staging.translation-platform.com/v1
http://localhost:8000/api/v1  # Development
```

**API Versioning Strategy:**
- URL path versioning (`/v1`, `/v2`)
- Deprecation notices via headers
- 6-month sunset period for old versions
- Breaking changes trigger major version bump

**Standard Response Format:**
```json
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2025-09-23T10:30:00Z",
    "version": "1.0.0",
    "request_id": "req_abc123"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "has_next": true
  }
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "source_language",
        "message": "Must be a valid ISO 639-1 code"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

### Authentication & Authorization

**JWT Token Structure:**
```json
{
  "sub": "user_uuid",
  "tenant_id": "org_uuid",
  "schema": "tenant_001",
  "role": "translator",
  "permissions": ["document.read", "translation.write"],
  "exp": 1695465600,
  "iat": 1695379200
}
```

**Authentication Endpoints:**
```yaml
POST /auth/register:
  request:
    email: string
    password: string
    organization_name: string
  response:
    user: User
    organization: Organization
    access_token: string
    refresh_token: string

POST /auth/login:
  request:
    email: string
    password: string
  response:
    user: User
    access_token: string
    refresh_token: string

POST /auth/refresh:
  request:
    refresh_token: string
  response:
    access_token: string
    refresh_token: string

POST /auth/logout:
  headers:
    Authorization: Bearer {token}
  response:
    message: string
```

### Document Management API

**Document Endpoints:**
```yaml
POST /documents/upload:
  headers:
    Authorization: Bearer {token}
    Content-Type: multipart/form-data
  request:
    file: binary
    title: string
    source_language: string
    tags: string[]
    metadata: object
  response:
    document: Document
    upload_url: string  # S3 presigned URL

GET /documents:
  headers:
    Authorization: Bearer {token}
  query:
    page: integer
    limit: integer
    status: DocumentStatus
    search: string
    tags: string[]
    sort: string  # created_at, -created_at, title
  response:
    documents: Document[]
    pagination: Pagination

GET /documents/{id}:
  headers:
    Authorization: Bearer {token}
  response:
    document: Document
    text_extraction_status: TextExtractionStatus
    translations: Translation[]

DELETE /documents/{id}:
  headers:
    Authorization: Bearer {token}
  response:
    message: string

GET /documents/{id}/download:
  headers:
    Authorization: Bearer {token}
  query:
    format: string  # original, text, translated
    language: string  # For translated format
  response:
    download_url: string  # S3 presigned URL
```

### Text Extraction Processing API

**Text Extraction Endpoints:**
```yaml
POST /text-extraction/process/{document_id}:
  headers:
    Authorization: Bearer {token}
  request:
    pages: integer[]  # Optional, specific pages
    quality: string  # fast, balanced, accurate
    preserve_formatting: boolean
  response:
    job_id: string
    status: JobStatus
    estimated_time: integer  # seconds

GET /text-extraction/status/{job_id}:
  headers:
    Authorization: Bearer {token}
  response:
    status: JobStatus
    progress: integer  # 0-100
    pages_completed: integer
    total_pages: integer
    current_page: integer

GET /text-extraction/result/{document_id}:
  headers:
    Authorization: Bearer {token}
  query:
    page: integer  # Optional, specific page
  response:
    pages: TextExtractionResult[]
    extracted_text: string
    confidence: float
    metadata: object
```

### Translation API

**Translation Endpoints:**
```yaml
POST /translations/create:
  headers:
    Authorization: Bearer {token}
  request:
    document_id: string
    target_language: string
    translation_type: TranslationType
    preserve_terms: object  # {"karma": "karma"}
    use_glossary: boolean
    priority: integer
  response:
    translation: Translation
    job_id: string

GET /translations/{id}:
  headers:
    Authorization: Bearer {token}
  response:
    translation: Translation
    segments: TranslationSegment[]
    review_status: ReviewStatus

PUT /translations/{id}:
  headers:
    Authorization: Bearer {token}
  request:
    translated_text: string
    segments: TranslationSegment[]
  response:
    translation: Translation
    version: integer

POST /translations/{id}/review:
  headers:
    Authorization: Bearer {token}
  request:
    rating: integer  # 1-5
    comments: string
    corrections: Correction[]
    approved: boolean
  response:
    review: Review

GET /translations/memory/search:
  headers:
    Authorization: Bearer {token}
  query:
    text: string
    source_language: string
    target_language: string
    threshold: float  # 0.0-1.0
  response:
    matches: TranslationMemory[]
    best_match: TranslationMemory
```

### WebSocket Events

**Connection:**
```javascript
// Client connection
const socket = io('wss://api.translation-platform.com', {
  auth: {
    token: 'Bearer {jwt_token}'
  }
});

// Server authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  verifyJWT(token)
    .then(user => {
      socket.userId = user.id;
      socket.tenantId = user.tenant_id;
      next();
    })
    .catch(next);
});
```

**Event Specifications:**
```typescript
// Document Events
interface DocumentUploadProgress {
  documentId: string;
  progress: number;
  stage: 'uploading' | 'processing' | 'complete';
}

// Text Extraction Events
interface TextExtractionProgress {
  jobId: string;
  documentId: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  estimatedTimeRemaining: number;
}

// Translation Events
interface TranslationProgress {
  translationId: string;
  progress: number;
  segmentsCompleted: number;
  totalSegments: number;
  preview: string;  // First 100 chars
}

// Error Events
interface ProcessingError {
  type: 'text_extraction' | 'translation' | 'export';
  documentId: string;
  error: string;
  recoverable: boolean;
}
```

**Event Handlers:**
```javascript
// Server-side
socket.on('subscribe:document', (documentId) => {
  socket.join(`doc:${documentId}`);
});

socket.on('unsubscribe:document', (documentId) => {
  socket.leave(`doc:${documentId}`);
});

// Emit progress
io.to(`doc:${documentId}`).emit('text_extraction:progress', {
  jobId,
  documentId,
  currentPage: 5,
  totalPages: 20,
  progress: 25,
  estimatedTimeRemaining: 45
});

// Client-side
socket.on('text_extraction:progress', (data) => {
  updateProgressBar(data.progress);
  updatePageCounter(data.currentPage, data.totalPages);
});

socket.on('translation:complete', (data) => {
  showNotification('Translation ready!');
  loadTranslation(data.translationId);
});
```

### Rate Limiting & Quotas

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1695465600
X-RateLimit-Retry-After: 60
```

**Rate Limit Tiers:**
```yaml
FREE:
  requests_per_hour: 100
  documents_per_day: 5
  pages_per_document: 10
  api_calls_per_month: 1000

STARTER:
  requests_per_hour: 1000
  documents_per_day: 50
  pages_per_document: 100
  api_calls_per_month: 10000

PROFESSIONAL:
  requests_per_hour: 5000
  documents_per_day: 500
  pages_per_document: 500
  api_calls_per_month: 100000

ENTERPRISE:
  requests_per_hour: unlimited
  documents_per_day: unlimited
  pages_per_document: unlimited
  api_calls_per_month: unlimited
```

### Admin API

**Tenant Management:**
```yaml
GET /admin/organizations:
  headers:
    Authorization: Bearer {admin_token}
  response:
    organizations: Organization[]

PUT /admin/organizations/{id}:
  headers:
    Authorization: Bearer {admin_token}
  request:
    plan_type: PlanType
    max_users: integer
    max_storage_gb: integer
    features: string[]
  response:
    organization: Organization

POST /admin/organizations/{id}/migrate:
  headers:
    Authorization: Bearer {admin_token}
  request:
    target_plan: PlanType
  response:
    migration_status: string
    estimated_time: integer
```

**Usage Analytics:**
```yaml
GET /admin/analytics/usage:
  headers:
    Authorization: Bearer {admin_token}
  query:
    organization_id: string
    start_date: date
    end_date: date
    granularity: string  # hour, day, week, month
  response:
    usage: {
      api_calls: integer
      documents_processed: integer
      pages_text_extraction: integer
      translations: integer
      storage_gb: float
      costs: {
        gemini: float
        storage: float
        compute: float
      }
    }
```

### API SDK Examples

**Python Client:**
```python
from translation_platform import Client

client = Client(
    api_key="your_api_key",
    base_url="https://api.translation-platform.com/v1"
)

# Upload document
document = client.documents.upload(
    file="path/to/document.pdf",
    title="Important Document",
    source_language="hi"
)

# Start Text Extraction
text_extraction_job = client.text_extraction.process(
    document_id=document.id,
    quality="accurate"
)

# Monitor progress
while True:
    status = client.text_extraction.get_status(text_extraction_job.id)
    print(f"Progress: {status.progress}%")
    if status.status == "completed":
        break
    time.sleep(2)

# Translate
translation = client.translations.create(
    document_id=document.id,
    target_language="en",
    preserve_terms={"karma": "karma"}
)
```

**JavaScript/TypeScript Client:**
```typescript
import { TranslationClient } from '@translation-platform/client';

const client = new TranslationClient({
  apiKey: process.env.API_KEY,
  baseUrl: 'https://api.translation-platform.com/v1'
});

// Upload with progress
const document = await client.documents.upload({
  file: fileInput.files[0],
  title: 'Important Document',
  sourceLanguage: 'hi',
  onProgress: (progress) => {
    console.log(`Upload: ${progress}%`);
  }
});

// Real-time updates
client.subscribe(document.id, {
  onTextExtractionProgress: (data) => {
    updateUI(data);
  },
  onTranslationComplete: (data) => {
    showNotification('Translation ready!');
  }
});
```

### OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Enterprise Translation Platform API
  version: 1.0.0
  description: API for document text extraction, translation, and management

servers:
  - url: https://api.translation-platform.com/v1
    description: Production
  - url: https://api-staging.translation-platform.com/v1
    description: Staging

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Document:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        status:
          $ref: '#/components/schemas/DocumentStatus'
        created_at:
          type: string
          format: date-time

security:
  - bearerAuth: []

paths:
  /documents:
    get:
      summary: List documents
      operationId: listDocuments
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  documents:
                    type: array
                    items:
                      $ref: '#/components/schemas/Document'
```

## Frontend Architecture

### Component Architecture

**Design System Foundation:**
```typescript
// Theme Configuration (theme/index.ts)
export const theme = {
  colors: {
    primary: {
      50: '#EFF6FF',
      500: '#3B82F6',
      900: '#1E3A8A'
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  typography: {
    fonts: {
      body: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

// Component Library Structure
components/
├── atoms/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   └── Spinner/
├── molecules/       # Combinations of atoms
│   ├── FormField/
│   ├── Card/
│   ├── Modal/
│   └── Dropdown/
├── organisms/       # Complex components
│   ├── Header/
│   ├── Sidebar/
│   ├── DataTable/
│   └── FileUploader/
└── templates/       # Page layouts
    ├── DashboardLayout/
    ├── AuthLayout/
    └── PublicLayout/
```

### State Management Architecture

**Zustand Store Design:**
```typescript
// stores/useAppStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;

  // Document State
  documents: Document[];
  activeDocument: Document | null;
  documentFilters: DocumentFilters;

  // Translation State
  translations: Map<string, Translation>;
  activeTranslation: Translation | null;

  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  locale: string;

  // Actions
  setUser: (user: User | null) => void;
  loadDocuments: (filters?: DocumentFilters) => Promise<void>;
  selectDocument: (id: string) => void;
  updateTranslation: (id: string, data: Partial<Translation>) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        documents: [],
        activeDocument: null,
        documentFilters: {},
        translations: new Map(),
        activeTranslation: null,
        sidebarOpen: true,
        theme: 'light',
        locale: 'en',

        // Actions
        setUser: (user) => set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        }),

        loadDocuments: async (filters) => {
          const response = await DocumentAPI.list(filters);
          set((state) => {
            state.documents = response.data;
            state.documentFilters = filters || {};
          });
        },

        selectDocument: (id) => set((state) => {
          state.activeDocument = state.documents.find(d => d.id === id) || null;
        }),

        updateTranslation: (id, data) => set((state) => {
          const translation = state.translations.get(id);
          if (translation) {
            state.translations.set(id, { ...translation, ...data });
          }
        }),

        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),
      })),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          locale: state.locale,
        }),
      }
    )
  )
);

// Slice Pattern for Feature Stores
// stores/slices/documentSlice.ts
interface DocumentSlice {
  uploadProgress: Map<string, number>;
  processingJobs: Map<string, Job>;

  uploadDocument: (file: File, metadata: DocumentMetadata) => Promise<Document>;
  trackUploadProgress: (id: string, progress: number) => void;
  cancelUpload: (id: string) => void;
}

// stores/slices/translationSlice.ts
interface TranslationSlice {
  translationCache: Map<string, TranslationMemory[]>;
  activeSegment: number;

  searchTranslationMemory: (text: string) => Promise<TranslationMemory[]>;
  saveSegment: (segmentId: string, translation: string) => void;
  navigateSegment: (direction: 'next' | 'prev') => void;
}
```

### Routing Architecture

**React Router Configuration:**
```typescript
// router/index.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },
          {
            path: 'documents',
            children: [
              {
                index: true,
                element: <DocumentList />,
              },
              {
                path: ':documentId',
                element: <DocumentDetail />,
                loader: documentLoader,
              },
            ],
          },
          {
            path: 'translations',
            children: [
              {
                index: true,
                element: <TranslationList />,
              },
              {
                path: ':translationId/edit',
                element: <TranslationEditor />,
                loader: translationLoader,
              },
            ],
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
]);

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
```

### Data Fetching Architecture

**React Query Configuration:**
```typescript
// api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

// hooks/queries/useDocuments.ts
export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => DocumentAPI.list(filters),
    select: (data) => data.documents,
  });
}

export function useDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DocumentAPI.create,
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries(['documents']);
      queryClient.setQueryData(
        ['document', newDocument.id],
        newDocument
      );
    },
  });
}

// Optimistic Updates
export function useTranslationUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TranslationAPI.update,
    onMutate: async (variables) => {
      await queryClient.cancelQueries(['translation', variables.id]);

      const previousTranslation = queryClient.getQueryData([
        'translation',
        variables.id,
      ]);

      queryClient.setQueryData(
        ['translation', variables.id],
        (old: Translation) => ({
          ...old,
          ...variables.data,
        })
      );

      return { previousTranslation };
    },
    onError: (err, variables, context) => {
      if (context?.previousTranslation) {
        queryClient.setQueryData(
          ['translation', variables.id],
          context.previousTranslation
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['translation', variables.id]);
    },
  });
}
```

### Real-time Features with Supabase Realtime

**Supabase Realtime Service:**
```typescript
// services/supabase-realtime.ts
import { createClient, RealtimeChannel } from '@supabase/supabase-js'

class SupabaseRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  // Subscribe to document processing updates
  subscribeToDocument(documentId: string, callbacks: {
    onProgress?: (progress: number) => void
    onComplete?: (result: any) => void
    onError?: (error: any) => void
    onUsersChanged?: (users: any[]) => void
  }) {
    const channel = this.supabase
      .channel(`doc:${documentId}`, {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: `${user.id}` }
        }
      })

    // Postgres Changes for database updates
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'processing_jobs',
      filter: `document_id=eq.${documentId}`
    }, (payload) => {
      const job = payload.new
      if (job.status === 'PROCESSING' && callbacks.onProgress) {
        callbacks.onProgress(job.progress_percentage)
      } else if (job.status === 'COMPLETED' && callbacks.onComplete) {
        callbacks.onComplete(job.result)
      } else if (job.status === 'FAILED' && callbacks.onError) {
        callbacks.onError(job.error_message)
      }
    })

    // Broadcast for real-time collaboration
    channel.on('broadcast', { event: 'translation-update' }, ({ payload }) => {
      if (callbacks.onProgress) {
        callbacks.onProgress(payload.progress)
      }
    })

    // Presence for online users
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState()
      if (callbacks.onUsersChanged) {
        callbacks.onUsersChanged(Object.values(presenceState).flat())
      }
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track user presence
        await channel.track({
          user_id: user.id,
          username: user.username,
          online_at: new Date().toISOString()
        })
      }
    })

    this.channels.set(documentId, channel)
    return channel
  }

  // Broadcast translation progress
  async broadcastProgress(documentId: string, progress: number, segmentId?: string) {
    const channel = this.channels.get(documentId)
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'translation-progress',
        payload: {
          documentId,
          progress,
          segmentId,
          userId: user.id,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  // Clean up subscriptions
  unsubscribeFromDocument(documentId: string) {
    const channel = this.channels.get(documentId)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.channels.delete(documentId)
    }
  }
}

export const realtimeService = new SupabaseRealtimeService()

// React Hook for Supabase Realtime
export function useRealtimeDocument(documentId: string) {
  const [progress, setProgress] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!documentId) return

    const channel = realtimeService.subscribeToDocument(documentId, {
      onProgress: setProgress,
      onUsersChanged: setOnlineUsers,
      onError: setError,
      onComplete: (result) => {
        setProgress(100)
        toast.success('Translation completed!')
      }
    })

    return () => {
      realtimeService.unsubscribeFromDocument(documentId)
    }
  }, [documentId])

  return { progress, onlineUsers, error }
}

// Hook for collaborative translation editing
export function useCollaborativeTranslation(translationId: string) {
  const [segments, setSegments] = useState<TranslationSegment[]>([])
  const [activeCursors, setActiveCursors] = useState<Map<string, CursorPosition>>(new Map())

  useEffect(() => {
    const channel = supabase
      .channel(`translation:${translationId}`)
      .on('broadcast', { event: 'segment-update' }, ({ payload }) => {
        setSegments(prev =>
          prev.map(s => s.id === payload.segmentId ? { ...s, ...payload.changes } : s)
        )
      })
      .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
        setActiveCursors(prev => new Map(prev).set(payload.userId, payload.position))
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach(presence => {
          setActiveCursors(prev => {
            const next = new Map(prev)
            next.delete(presence.user_id)
            return next
          })
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [translationId])

  const broadcastSegmentUpdate = useCallback((segmentId: string, changes: any) => {
    channel.send({
      type: 'broadcast',
      event: 'segment-update',
      payload: { segmentId, changes, userId: user.id }
    })
  }, [])

  return { segments, activeCursors, broadcastSegmentUpdate }
}
```

### Performance Optimization

**Code Splitting & Lazy Loading:**
```typescript
// Lazy load routes
const DashboardOverview = lazy(() => import('./pages/Dashboard/Overview'));
const DocumentList = lazy(() => import('./pages/Documents/List'));
const TranslationEditor = lazy(() => import('./pages/Translations/Editor'));

// Suspense wrapper
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

// Virtual scrolling for large lists
import { VirtualList } from '@tanstack/react-virtual';

function DocumentTable({ documents }: { documents: Document[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <DocumentRow
            key={virtualRow.index}
            document={documents[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Memoization for expensive computations
const TranslationStats = memo(({ translations }: { translations: Translation[] }) => {
  const stats = useMemo(() => {
    return translations.reduce((acc, trans) => {
      acc.total++;
      acc[trans.status] = (acc[trans.status] || 0) + 1;
      acc.avgConfidence += trans.confidence_score || 0;
      return acc;
    }, { total: 0, avgConfidence: 0 });
  }, [translations]);

  return <StatsDisplay {...stats} />;
});
```

### Internationalization

**i18n Configuration:**
```typescript
// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: await import('./locales/en.json'),
  },
  hi: {
    translation: await import('./locales/hi.json'),
  },
  mr: {
    translation: await import('./locales/mr.json'),
  },
  bn: {
    translation: await import('./locales/bn.json'),
  },
  gu: {
    translation: await import('./locales/gu.json'),
  },
  de: {
    translation: await import('./locales/de.json'),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Usage in components
function DocumentUpload() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('documents.upload.title')}</h1>
      <p>{t('documents.upload.description')}</p>
      <Button>{t('common.actions.upload')}</Button>
    </div>
  );
}
```

### Error Handling

**Error Boundary & Fallbacks:**
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error reporting service
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

// API Error Handling
class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  if (event.reason instanceof APIError) {
    if (event.reason.statusCode === 401) {
      // Handle authentication error
      useAppStore.getState().setUser(null);
      router.navigate('/auth/login');
    } else {
      // Show error toast
      toast.error(event.reason.message);
    }
  }
});
```

### Testing Strategy

**Component Testing:**
```typescript
// __tests__/DocumentUpload.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentUpload } from '../DocumentUpload';

describe('DocumentUpload', () => {
  it('should upload file successfully', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();

    render(<DocumentUpload onUpload={onUpload} />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload/i);

    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(expect.objectContaining({
        file,
        title: 'test.pdf',
      }));
    });
  });

  it('should show error for invalid file type', async () => {
    const user = userEvent.setup();

    render(<DocumentUpload />);

    const file = new File(['content'], 'test.exe', { type: 'application/exe' });
    const input = screen.getByLabelText(/upload/i);

    await user.upload(input, file);

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
  });
});
```

## Backend Architecture

### Service Layer Architecture

**Core Service Structure:**
```python
# backend/api/services/base.py
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

T = TypeVar('T')

class BaseService(ABC, Generic[T]):
    """Base service with common CRUD operations"""

    def __init__(self, db: AsyncSession, tenant_schema: str):
        self.db = db
        self.tenant_schema = tenant_schema
        self._set_search_path()

    def _set_search_path(self):
        """Set PostgreSQL search path for tenant isolation"""
        self.db.execute(
            f"SET search_path TO {self.tenant_schema}, shared, public"
        )

    @abstractmethod
    async def get(self, id: str) -> Optional[T]:
        pass

    @abstractmethod
    async def list(self, skip: int = 0, limit: int = 100) -> List[T]:
        pass

    @abstractmethod
    async def create(self, data: dict) -> T:
        pass

    @abstractmethod
    async def update(self, id: str, data: dict) -> Optional[T]:
        pass

    @abstractmethod
    async def delete(self, id: str) -> bool:
        pass

# backend/api/services/document_service.py
class DocumentService(BaseService[Document]):
    """Document management service"""

    async def create_with_upload(
        self,
        file: UploadFile,
        metadata: DocumentMetadata,
        user_id: str
    ) -> Document:
        """Upload document to S3 and create database record"""

        # Validate file
        if not self._validate_file_type(file):
            raise ValidationError("Invalid file type")

        # Generate S3 key
        s3_key = f"{self.tenant_schema}/documents/{uuid4()}/{file.filename}"

        # Upload to S3
        s3_url = await self.s3_service.upload(file, s3_key)

        # Create document record
        document = Document(
            id=uuid4(),
            owner_id=user_id,
            title=metadata.title,
            original_filename=file.filename,
            file_type=self._get_file_type(file),
            file_size_bytes=file.size,
            s3_key=s3_key,
            s3_bucket=settings.S3_BUCKET,
            source_language=metadata.source_language,
            status=DocumentStatus.UPLOADED,
            tags=metadata.tags,
            metadata=metadata.extra
        )

        self.db.add(document)
        await self.db.commit()

        # Queue OCR job
        await self.queue_service.enqueue(
            'ocr.process',
            document_id=str(document.id),
            priority=metadata.priority
        )

        return document

    async def get_with_translations(
        self,
        document_id: str
    ) -> DocumentWithTranslations:
        """Get document with all translations"""

        query = (
            select(Document)
            .options(
                selectinload(Document.translations),
                selectinload(Document.ocr_results)
            )
            .where(Document.id == document_id)
        )

        result = await self.db.execute(query)
        document = result.scalar_one_or_none()

        if not document:
            raise NotFoundError(f"Document {document_id} not found")

        return DocumentWithTranslations.from_orm(document)
```

### API Layer Architecture

**FastAPI Application Structure:**
```python
# backend/api/main.py
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import sentry_sdk

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    # Startup
    await init_database_pool()
    await init_redis_pool()
    await init_celery_app()

    # Initialize Sentry
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            traces_sample_rate=0.1,
            profiles_sample_rate=0.1,
        )

    yield

    # Shutdown
    await close_database_pool()
    await close_redis_pool()

app = FastAPI(
    title="Enterprise Translation Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.DEBUG else None,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Custom middleware
@app.middleware("http")
async def add_tenant_context(request: Request, call_next):
    """Extract tenant from JWT and set context"""
    if request.url.path.startswith("/api"):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if token:
            try:
                payload = decode_jwt(token)
                request.state.tenant_id = payload.get("tenant_id")
                request.state.tenant_schema = payload.get("schema")
                request.state.user_id = payload.get("sub")
            except Exception:
                pass

    response = await call_next(request)
    return response

# Router registration
from api.routers import auth, documents, text_extraction, translations, admin

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(text_extraction.router, prefix="/api/text-extraction", tags=["Text Extraction"])
app.include_router(translations.router, prefix="/api/translations", tags=["Translations"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
```

**Dependency Injection:**
```python
# backend/api/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_db() -> AsyncSession:
    """Database session dependency"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        payload = decode_jwt(credentials.credentials)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        user = await UserService(db).get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_tenant_db(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> AsyncSession:
    """Get database session with tenant context"""
    tenant_schema = request.state.tenant_schema
    await db.execute(f"SET search_path TO {tenant_schema}, shared, public")
    return db

# Permission decorators
def require_permission(permission: str):
    """Require specific permission"""
    async def permission_checker(
        current_user: User = Depends(get_current_user)
    ):
        if permission not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return permission_checker
```

### Background Task Architecture

**Celery Configuration:**
```python
# backend/workers/celery_app.py
from celery import Celery
from celery.signals import task_prerun, task_postrun, task_failure
from kombu import Queue, Exchange
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

# Initialize Celery
celery_app = Celery(
    'translation_platform',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        'workers.tasks.ocr',
        'workers.tasks.translation',
        'workers.tasks.export',
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,

    # Task routing
    task_routes={
        'ocr.*': {'queue': 'ocr'},
        'translation.*': {'queue': 'translation'},
        'export.*': {'queue': 'export'},
        'email.*': {'queue': 'notifications'},
    },

    # Queue configuration
    task_queues=(
        Queue('ocr', Exchange('ocr'), routing_key='ocr'),
        Queue('translation', Exchange('translation'), routing_key='translation'),
        Queue('export', Exchange('export'), routing_key='export'),
        Queue('notifications', Exchange('notifications'), routing_key='notifications'),
    ),

    # Task execution limits
    task_soft_time_limit=300,  # 5 minutes
    task_time_limit=600,  # 10 minutes

    # Result backend settings
    result_expires=3600,  # 1 hour

    # Worker settings
    worker_prefetch_multiplier=2,
    worker_max_tasks_per_child=1000,
)

# Signal handlers
@task_prerun.connect
def task_prerun_handler(task_id, task, *args, **kwargs):
    """Set up task context"""
    # Set tenant context if available
    if 'tenant_schema' in kwargs:
        task.request.tenant_schema = kwargs['tenant_schema']

@task_failure.connect
def task_failure_handler(task_id, exception, *args, **kwargs):
    """Handle task failures"""
    # Log to Sentry
    sentry_sdk.capture_exception(exception)

    # Update job status in database
    if 'job_id' in kwargs:
        update_job_status(kwargs['job_id'], JobStatus.FAILED, str(exception))
```

**OCR Task Implementation:**
```python
# backend/workers/tasks/ocr.py
from celery import Task
from typing import Dict, Any
import asyncio

class OCRTask(Task):
    """Base class for OCR tasks with progress tracking"""

    def __init__(self):
        self.gemini_client = None
        self.s3_client = None
        self.db_session = None

    def before_start(self, task_id, args, kwargs):
        """Initialize connections"""
        self.gemini_client = GeminiClient(api_key=settings.GEMINI_API_KEY)
        self.s3_client = S3Client()
        self.db_session = create_session(kwargs.get('tenant_schema'))

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        """Cleanup connections"""
        if self.db_session:
            self.db_session.close()

@celery_app.task(base=OCRTask, bind=True, max_retries=3)
def process_document_ocr(
    self,
    document_id: str,
    tenant_schema: str,
    quality: str = 'balanced'
) -> Dict[str, Any]:
    """Process document OCR with Gemini 2.5 Pro"""

    try:
        # Get document from database
        document = self.db_session.query(Document).get(document_id)
        if not document:
            raise ValueError(f"Document {document_id} not found")

        # Update status
        document.status = DocumentStatus.PROCESSING
        self.db_session.commit()

        # Download from S3
        file_content = self.s3_client.download(document.s3_key)

        # Convert PDF to images
        pages = pdf_to_images(file_content)
        total_pages = len(pages)

        # Process each page
        ocr_results = []
        for idx, page_image in enumerate(pages):
            # Update progress
            progress = (idx / total_pages) * 100
            self.update_state(
                state='PROGRESS',
                meta={
                    'current': idx + 1,
                    'total': total_pages,
                    'progress': progress
                }
            )

            # Send to WebSocket
            send_websocket_event(
                f"doc:{document_id}",
                'ocr:progress',
                {
                    'documentId': document_id,
                    'currentPage': idx + 1,
                    'totalPages': total_pages,
                    'progress': progress
                }
            )

            # OCR with Gemini
            ocr_result = await self.process_page_with_gemini(
                page_image,
                quality=quality
            )

            # Save OCR result
            ocr_record = OCRResult(
                document_id=document_id,
                page_number=idx + 1,
                raw_text=ocr_result['text'],
                structured_data=ocr_result['structured'],
                confidence_score=ocr_result['confidence'],
                tokens_used=ocr_result['tokens'],
                processing_time_ms=ocr_result['time_ms']
            )

            self.db_session.add(ocr_record)
            ocr_results.append(ocr_record)

        # Update document status
        document.status = DocumentStatus.OCR_COMPLETE
        document.processing_completed_at = datetime.utcnow()
        self.db_session.commit()

        # Queue translation if requested
        if document.auto_translate:
            queue_translation.delay(
                document_id=document_id,
                tenant_schema=tenant_schema
            )

        return {
            'document_id': document_id,
            'pages_processed': total_pages,
            'status': 'completed'
        }

    except Exception as e:
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=2 ** self.request.retries)

    async def process_page_with_gemini(
        self,
        page_image: bytes,
        quality: str
    ) -> Dict[str, Any]:
        """Process single page with Gemini 2.5 Pro"""

        prompt = self._build_ocr_prompt(quality)

        start_time = time.time()
        response = await self.gemini_client.generate_content(
            model="gemini-2.5-pro",
            contents=[
                {
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {
                            "mime_type": "image/png",
                            "data": base64.b64encode(page_image).decode()
                        }}
                    ]
                }
            ],
            generation_config={
                "temperature": 0.1,
                "top_p": 0.95,
                "max_output_tokens": 8192,
            }
        )

        processing_time = (time.time() - start_time) * 1000

        # Parse response
        extracted_text = response.text
        structured_data = self._extract_structure(extracted_text)

        return {
            'text': extracted_text,
            'structured': structured_data,
            'confidence': self._calculate_confidence(response),
            'tokens': response.usage_metadata.total_tokens,
            'time_ms': processing_time
        }
```

### AI Integration Layer

**Gemini Client Wrapper:**
```python
# backend/core/ai/gemini_client.py
import google.generativeai as genai
from typing import Optional, Dict, Any, List
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

class GeminiClient:
    """Wrapper for Gemini 2.5 Pro API with retry logic and caching"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-pro')
        self.cache = RedisCache()

        # Rate limiting
        self.rate_limiter = RateLimiter(
            max_requests_per_minute=2000,
            max_tokens_per_minute=1000000
        )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def extract_text_from_image(
        self,
        image: bytes,
        language_hint: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extract text from image using OCR"""

        # Check cache
        cache_key = f"ocr:{hashlib.sha256(image).hexdigest()}"
        cached = await self.cache.get(cache_key)
        if cached:
            return cached

        # Rate limit check
        await self.rate_limiter.acquire()

        # Build prompt
        prompt = self._build_ocr_prompt(language_hint)

        # Call Gemini
        response = await self.model.generate_content_async([
            prompt,
            {"mime_type": "image/png", "data": image}
        ])

        result = {
            'text': response.text,
            'confidence': self._estimate_confidence(response),
            'tokens_used': response.usage_metadata.total_tokens
        }

        # Cache result
        await self.cache.set(cache_key, result, ttl=86400)  # 24 hours

        return result

    async def translate_text(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        context: Optional[str] = None,
        preserve_terms: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Translate text with concept preservation"""

        # Check translation memory
        tm_match = await self.check_translation_memory(
            text, source_lang, target_lang
        )
        if tm_match and tm_match['confidence'] > 0.95:
            return tm_match

        # Build translation prompt
        prompt = self._build_translation_prompt(
            text, source_lang, target_lang, context, preserve_terms
        )

        # Call Gemini
        response = await self.model.generate_content_async(prompt)

        translation = response.text

        # Apply preserved terms
        if preserve_terms:
            for original, preserved in preserve_terms.items():
                translation = translation.replace(original, preserved)

        # Save to translation memory
        await self.save_to_translation_memory(
            text, translation, source_lang, target_lang
        )

        return {
            'translation': translation,
            'confidence': self._estimate_confidence(response),
            'tokens_used': response.usage_metadata.total_tokens
        }

    def _build_translation_prompt(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        context: Optional[str],
        preserve_terms: Optional[Dict[str, str]]
    ) -> str:
        """Build optimized translation prompt"""

        lang_names = {
            'en': 'English',
            'hi': 'Hindi',
            'mr': 'Marathi',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'de': 'German'
        }

        prompt = f"""Translate the following text from {lang_names[source_lang]} to {lang_names[target_lang]}.

        Important instructions:
        1. Maintain the original meaning and tone
        2. Preserve formatting (paragraphs, lists, etc.)
        3. For religious/philosophical texts, preserve concept accuracy over literal translation
        """

        if context:
            prompt += f"\n4. Context: {context}"

        if preserve_terms:
            prompt += f"\n5. Keep these terms unchanged: {preserve_terms}"

        prompt += f"\n\nText to translate:\n{text}\n\nTranslation:"

        return prompt
```

### Security Layer

**Authentication & Authorization:**
```python
# backend/core/security/auth.py
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    """Authentication and authorization service"""

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)

        to_encode.update({"exp": expire})

        return jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        return jwt.encode(
            {
                "sub": user_id,
                "type": "refresh",
                "exp": datetime.utcnow() + timedelta(days=30)
            },
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def decode_token(token: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            return payload
        except JWTError:
            raise UnauthorizedError("Invalid token")

# Rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per hour"],
    storage_uri=settings.REDIS_URL
)

# Input validation
from pydantic import BaseModel, validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization_name: Optional[str]

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v
```

### Database Layer

**Async SQLAlchemy Setup:**
```python
# backend/database/session.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import asyncpg

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'),
    echo=settings.DEBUG,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Async session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Connection pool monitoring
async def get_pool_status():
    """Get connection pool statistics"""
    pool = engine.pool
    return {
        'size': pool.size(),
        'checked_in': pool.checkedin(),
        'checked_out': pool.checkedout(),
        'overflow': pool.overflow(),
        'total': pool.total()
    }

# Multi-tenant schema management
async def create_tenant_schema(tenant_id: str):
    """Create new tenant schema"""
    schema_name = f"tenant_{tenant_id.replace('-', '_')}"

    async with engine.begin() as conn:
        # Create schema
        await conn.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")

        # Set search path
        await conn.execute(f"SET search_path TO {schema_name}")

        # Create tables in tenant schema
        await conn.run_sync(Base.metadata.create_all)

    return schema_name

# Repository pattern
class BaseRepository:
    """Base repository with common database operations"""

    def __init__(self, session: AsyncSession, model_class):
        self.session = session
        self.model_class = model_class

    async def get(self, id: Any) -> Optional[Any]:
        return await self.session.get(self.model_class, id)

    async def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict] = None
    ) -> List[Any]:
        query = select(self.model_class)

        if filters:
            for key, value in filters.items():
                query = query.where(
                    getattr(self.model_class, key) == value
                )

        query = query.offset(skip).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def create(self, obj_in: Dict) -> Any:
        db_obj = self.model_class(**obj_in)
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj

    async def update(self, id: Any, obj_in: Dict) -> Optional[Any]:
        db_obj = await self.get(id)
        if db_obj:
            for key, value in obj_in.items():
                setattr(db_obj, key, value)
            await self.session.commit()
            await self.session.refresh(db_obj)
        return db_obj

    async def delete(self, id: Any) -> bool:
        db_obj = await self.get(id)
        if db_obj:
            await self.session.delete(db_obj)
            await self.session.commit()
            return True
        return False
```

## Queue & State Management Architecture

### Distributed Queue Design

**Queue Technology Stack:**
- **Primary Queue:** Supabase Queue (built on pg_queue extension)
- **Fallback Queue:** Redis with Bull.js for complex workflows
- **State Store:** Supabase PostgreSQL with JSONB for job metadata
- **Priority System:** Multi-level priority with tenant-based allocation

### Queue Priority Resolution

```typescript
enum QueuePriority {
  CRITICAL = 0,    // System-critical tasks
  HIGH = 10,       // Premium tenant tasks
  NORMAL = 50,     // Standard processing
  LOW = 100,       // Batch operations
  DEFERRED = 999   // Best-effort tasks
}

interface QueueItem {
  id: string;
  tenant_id: string;
  priority: QueuePriority;
  type: 'text_extraction' | 'translation' | 'export';
  payload: any;
  max_retries: number;
  retry_count: number;
  status: JobStatus;
  created_at: Date;
  scheduled_for?: Date;
  started_at?: Date;
  completed_at?: Date;
  error?: string;
}
```

### State Persistence Layer

```sql
-- Job state table with comprehensive metadata
CREATE TABLE job_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  job_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 50,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  progress JSONB DEFAULT '{"current": 0, "total": 0}',
  result JSONB,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queue queries
CREATE INDEX idx_job_states_queue ON job_states(status, priority, scheduled_for)
  WHERE status IN ('pending', 'scheduled');
CREATE INDEX idx_job_states_tenant ON job_states(tenant_id, created_at DESC);
```

### Queue Ownership & Permissions Model

```python
class QueuePermissions:
    """Tenant-aware queue permissions"""

    PERMISSIONS = {
        'admin': ['create', 'read', 'update', 'delete', 'priority_override'],
        'user': ['create', 'read', 'update'],
        'viewer': ['read']
    }

    @staticmethod
    async def can_modify_job(user_id: str, job_id: str) -> bool:
        job = await get_job(job_id)
        user = await get_user(user_id)

        # Users can only modify their tenant's jobs
        if user.tenant_id != job.tenant_id:
            return False

        # Check role-based permissions
        return 'update' in QueuePermissions.PERMISSIONS.get(user.role, [])
```

### WebSocket Event Schema

```typescript
// Real-time progress events
interface ProgressEvent {
  type: 'progress.update' | 'progress.complete' | 'progress.error';
  job_id: string;
  tenant_id: string;
  timestamp: Date;
  data: {
    current: number;
    total: number;
    message?: string;
    details?: any;
  };
}

// WebSocket message routing
class ProgressBroadcaster {
  private connections: Map<string, Set<WebSocket>>;

  async broadcast(event: ProgressEvent) {
    // Get all connections for this tenant
    const tenantConnections = this.connections.get(event.tenant_id);

    if (tenantConnections) {
      const message = JSON.stringify(event);
      tenantConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }
}
```

### Queue Processing Architecture

```mermaid
graph TB
    subgraph "Queue Processing Flow"
        A[API Request] --> B{Queue Router}
        B -->|High Priority| C[Priority Queue]
        B -->|Normal| D[Standard Queue]
        B -->|Batch| E[Batch Queue]

        C --> F[Worker Pool 1]
        D --> G[Worker Pool 2]
        E --> H[Worker Pool 3]

        F --> I[State Manager]
        G --> I
        H --> I

        I --> J[(Job States DB)]
        I --> K[WebSocket Broadcaster]

        K --> L[Client Updates]
    end
```

## Vertex AI Integration Architecture

### Vertex AI Configuration

**Important:** Using Google Cloud Vertex AI, NOT the standard Gemini API.

```python
from google.cloud import aiplatform
from google.oauth2 import service_account

class VertexAIConfig:
    """Vertex AI Gemini 2.5 Pro configuration"""

    PROJECT_ID = "translation-platform-prod"
    LOCATION = "us-central1"
    MODEL_ID = "gemini-2.5-pro"

    # Token limits
    MAX_INPUT_TOKENS = 1_048_576  # 1M tokens
    MAX_OUTPUT_TOKENS = 65_536    # 65K tokens

    # Token calculations
    TOKENS_PER_CHAR = 0.25  # ~4 chars per token
    TOKENS_PER_PAGE = 500   # Average page estimation

    # Pricing (Vertex AI specific)
    PRICE_PER_MILLION_INPUT_TOKENS = {
        'standard': 1.25,    # Up to 200K tokens
        'long': 2.50        # Over 200K tokens
    }
    PRICE_PER_MILLION_OUTPUT_TOKENS = 10.0
```

### Token Management Strategy

```python
class TokenManager:
    """Smart token counting and batching"""

    def estimate_tokens(self, text: str) -> int:
        """Estimate token count before API call"""
        # Use tiktoken or similar for accurate counting
        return len(text) // 4  # Rough estimate

    def calculate_batch_size(self, pages: List[Page]) -> List[List[Page]]:
        """Smart batching under 1M token limit"""
        batches = []
        current_batch = []
        current_tokens = 0

        # Reserve 20% buffer for safety
        safe_limit = int(VertexAIConfig.MAX_INPUT_TOKENS * 0.8)

        for page in pages:
            page_tokens = self.estimate_tokens(page.content)

            if current_tokens + page_tokens > safe_limit:
                # Start new batch
                batches.append(current_batch)
                current_batch = [page]
                current_tokens = page_tokens
            else:
                current_batch.append(page)
                current_tokens += page_tokens

        if current_batch:
            batches.append(current_batch)

        return batches

    def handle_output_limit(self, response: str) -> List[str]:
        """Handle 65K output token limit by chunking"""
        if self.estimate_tokens(response) > VertexAIConfig.MAX_OUTPUT_TOKENS:
            # Implement intelligent chunking
            return self.chunk_response(response)
        return [response]
```

### Vertex AI Client Implementation

```python
class VertexAIClient:
    """Vertex AI Gemini 2.5 Pro client with retry logic"""

    def __init__(self):
        self.credentials = service_account.Credentials.from_service_account_file(
            'vertex-ai-credentials.json'
        )
        aiplatform.init(
            project=VertexAIConfig.PROJECT_ID,
            location=VertexAIConfig.LOCATION,
            credentials=self.credentials
        )

    async def process_ocr_with_structure(self, image_bytes: bytes) -> OCRResult:
        """OCR with layout preservation"""

        model = aiplatform.GenerativeModel(VertexAIConfig.MODEL_ID)

        prompt = """
        Extract text from this image preserving:
        1. Original layout and structure
        2. Indentation and spacing
        3. Line breaks and paragraphs
        4. Table structures if present

        Return in structured JSON format:
        {
          "text": "extracted text with formatting",
          "structure": {
            "paragraphs": [...],
            "indentation_levels": [...],
            "special_elements": [...]
          }
        }
        """

        response = await model.generate_content_async(
            [prompt, Image.from_bytes(image_bytes)],
            generation_config={
                "temperature": 0.1,  # Low temperature for accuracy
                "top_p": 0.95,
                "max_output_tokens": 8192
            }
        )

        return self.parse_ocr_response(response)
```

### Cost Optimization Strategies

```python
class CostOptimizer:
    """Vertex AI cost optimization"""

    def __init__(self):
        self.cache = TranslationCache()
        self.token_manager = TokenManager()

    async def optimize_request(self, content: str, operation: str) -> dict:
        """Optimize API requests for cost"""

        strategies = {
            'cache_check': await self.check_cache(content),
            'batch_similar': self.batch_similar_content(content),
            'reuse_glossary': self.apply_glossary_first(content),
            'progressive_processing': self.process_progressively(content)
        }

        # Calculate cost estimate
        tokens = self.token_manager.estimate_tokens(content)
        estimated_cost = self.calculate_cost(tokens, operation)

        return {
            'strategies_applied': strategies,
            'estimated_tokens': tokens,
            'estimated_cost': estimated_cost
        }

    def calculate_cost(self, input_tokens: int, operation: str) -> float:
        """Calculate Vertex AI costs"""
        if input_tokens <= 200_000:
            input_cost = (input_tokens / 1_000_000) * 1.25
        else:
            # First 200K at standard rate, rest at long context rate
            input_cost = (200_000 / 1_000_000) * 1.25
            input_cost += ((input_tokens - 200_000) / 1_000_000) * 2.50

        # Estimate output tokens
        output_tokens = input_tokens  # Rough 1:1 estimate
        output_cost = (output_tokens / 1_000_000) * 10.0

        return input_cost + output_cost
```

## Structure Preservation Architecture

### Layout Extraction Pipeline

```python
class LayoutExtractor:
    """Extract and preserve document structure during OCR"""

    def __init__(self):
        self.pdf_analyzer = PDFLayoutAnalyzer()
        self.structure_detector = StructureDetector()

    async def extract_with_layout(self, pdf_path: str) -> DocumentStructure:
        """Extract text while preserving layout"""

        # Use pdfplumber for initial structure analysis
        import pdfplumber

        structure = DocumentStructure()

        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                # Extract layout elements
                layout = {
                    'text_blocks': page.extract_text_lines(),
                    'tables': page.extract_tables(),
                    'images': page.images,
                    'bbox_data': page.chars  # Character-level bounding boxes
                }

                # Analyze structure
                structure.add_page(
                    self.analyze_page_structure(layout, page_num)
                )

        return structure

    def analyze_page_structure(self, layout: dict, page_num: int) -> PageStructure:
        """Analyze page structure for preservation"""

        return PageStructure(
            page_number=page_num,
            paragraphs=self.detect_paragraphs(layout['text_blocks']),
            indentation_map=self.calculate_indentation(layout['bbox_data']),
            line_spacing=self.analyze_line_spacing(layout['text_blocks']),
            special_regions=self.identify_special_regions(layout)
        )
```

### Structure-Aware Translation Prompts

```python
class StructureAwareTranslator:
    """Translation that preserves document structure"""

    def create_structure_prompt(self, text: str, structure: DocumentStructure) -> str:
        """Create translation prompt that preserves structure"""

        prompt = f"""
        Translate the following text from [source] to [target] while preserving:

        1. INDENTATION: Maintain exact indentation levels
           {structure.get_indentation_guide()}

        2. LINE BREAKS: Preserve all line breaks and paragraph spacing
           Total paragraphs: {len(structure.paragraphs)}

        3. SPECIAL FORMATTING:
           - Headers: {structure.header_positions}
           - Lists: {structure.list_positions}
           - Quotes: {structure.quote_positions}

        4. RELIGIOUS/CULTURAL ELEMENTS:
           - Keep Sanskrit terms in original script
           - Preserve verse numbering
           - Maintain shloka structure

        TEXT TO TRANSLATE:
        {text}

        Return translation with EXACT structure preserved.
        """

        return prompt
```

### HTML/PDF Renderer with Formatting

```python
class StructurePreservingRenderer:
    """Render documents maintaining original formatting"""

    def render_to_html(self, content: str, structure: DocumentStructure) -> str:
        """Generate HTML preserving structure"""

        html_parts = ['<div class="preserved-document">']

        for para in structure.paragraphs:
            style = self.calculate_style(para)
            html_parts.append(
                f'<p style="{style}">{self.escape_html(para.text)}</p>'
            )

        html_parts.append('</div>')

        return '\n'.join(html_parts)

    def render_to_pdf(self, content: str, structure: DocumentStructure) -> bytes:
        """Generate PDF with preserved formatting"""

        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        # Create custom styles based on structure
        styles = self.create_styles_from_structure(structure)

        # Build PDF with preserved layout
        story = []
        for element in structure.elements:
            if element.type == 'paragraph':
                style = styles[element.style_id]
                story.append(Paragraph(element.text, style))
            elif element.type == 'spacer':
                story.append(Spacer(1, element.height))

        # Generate PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        doc.build(story)

        return buffer.getvalue()
```

## Advanced Data Management Systems

### Glossary Version Control

```python
class GlossaryVersionControl:
    """Git-like version control for translation glossaries"""

    def __init__(self):
        self.storage = SupabaseStorage()

    async def create_version(self, glossary_id: str, changes: dict) -> str:
        """Create new glossary version"""

        version = {
            'id': str(uuid.uuid4()),
            'glossary_id': glossary_id,
            'version_number': await self.get_next_version(glossary_id),
            'changes': changes,
            'created_by': current_user.id,
            'created_at': datetime.utcnow(),
            'parent_version': await self.get_current_version(glossary_id)
        }

        await self.storage.insert('glossary_versions', version)
        return version['id']

    async def merge_versions(self, version_a: str, version_b: str) -> dict:
        """Merge two glossary versions"""

        a = await self.get_version(version_a)
        b = await self.get_version(version_b)

        # Three-way merge
        common_ancestor = await self.find_common_ancestor(a, b)

        merged = self.three_way_merge(
            common_ancestor['terms'],
            a['terms'],
            b['terms']
        )

        return merged
```

### Translation Memory with Fuzzy Matching

```python
class TranslationMemory:
    """Translation memory with fuzzy matching using pgvector"""

    def __init__(self):
        self.embedder = TextEmbedder()  # For semantic similarity
        self.min_similarity = 0.85

    async def store_translation(self, source: str, target: str, metadata: dict):
        """Store translation pair with embedding"""

        embedding = await self.embedder.embed(source)

        await db.execute("""
            INSERT INTO translation_memory
            (source_text, target_text, source_embedding, metadata, tenant_id)
            VALUES ($1, $2, $3, $4, $5)
        """, source, target, embedding, json.dumps(metadata), current_tenant.id)

    async def fuzzy_search(self, text: str, threshold: float = 0.85) -> List[dict]:
        """Find similar translations using vector similarity"""

        embedding = await self.embedder.embed(text)

        results = await db.fetch("""
            SELECT
                source_text,
                target_text,
                1 - (source_embedding <=> $1) as similarity,
                metadata
            FROM translation_memory
            WHERE
                tenant_id = $2
                AND 1 - (source_embedding <=> $1) > $3
            ORDER BY similarity DESC
            LIMIT 10
        """, embedding, current_tenant.id, threshold)

        # Additional fuzzy matching with Levenshtein distance
        enhanced_results = []
        for result in results:
            levenshtein_score = self.calculate_similarity(text, result['source_text'])
            result['combined_score'] = (result['similarity'] + levenshtein_score) / 2
            enhanced_results.append(result)

        return sorted(enhanced_results, key=lambda x: x['combined_score'], reverse=True)
```

### Template Storage and Management

```python
class TemplateManager:
    """Manage reusable processing templates"""

    async def create_template(self, name: str, config: dict) -> str:
        """Create processing template for repeated use"""

        template = {
            'id': str(uuid.uuid4()),
            'name': name,
            'tenant_id': current_tenant.id,
            'config': {
                'source_language': config.get('source_language'),
                'target_language': config.get('target_language'),
                'ocr_settings': config.get('ocr_settings', {}),
                'translation_settings': config.get('translation_settings', {}),
                'glossary_id': config.get('glossary_id'),
                'structure_preservation': config.get('structure_preservation', True),
                'batch_size': config.get('batch_size', 10)
            },
            'created_at': datetime.utcnow()
        }

        await self.storage.insert('processing_templates', template)
        return template['id']

    async def apply_template(self, document_id: str, template_id: str):
        """Apply template to document processing"""

        template = await self.get_template(template_id)

        # Queue processing with template configuration
        await queue.enqueue(
            'process_document',
            document_id=document_id,
            **template['config']
        )
```

## Real-time Features Architecture

### WebSocket Implementation

```python
class WebSocketManager:
    """Manage WebSocket connections with tenant isolation"""

    def __init__(self):
        self.connections: Dict[str, Set[WebSocket]] = defaultdict(set)
        self.heartbeat_interval = 30  # seconds

    async def connect(self, websocket: WebSocket, tenant_id: str, user_id: str):
        """Establish WebSocket connection"""

        await websocket.accept()

        # Store connection with tenant isolation
        connection_id = f"{tenant_id}:{user_id}"
        self.connections[tenant_id].add(websocket)

        # Start heartbeat
        asyncio.create_task(self.heartbeat(websocket, connection_id))

        # Send initial state
        await self.send_initial_state(websocket, tenant_id, user_id)

    async def broadcast_progress(self, tenant_id: str, job_id: str, progress: dict):
        """Broadcast progress to tenant connections"""

        message = {
            'type': 'progress',
            'job_id': job_id,
            'data': progress,
            'timestamp': datetime.utcnow().isoformat()
        }

        dead_connections = set()

        for websocket in self.connections[tenant_id]:
            try:
                await websocket.send_json(message)
            except:
                dead_connections.add(websocket)

        # Clean up dead connections
        for websocket in dead_connections:
            self.connections[tenant_id].discard(websocket)
```

### Polling Fallback System

```python
class PollingFallback:
    """Graceful fallback when WebSocket unavailable"""

    def __init__(self):
        self.poll_interval = 2000  # ms
        self.max_poll_duration = 300000  # 5 minutes

    async def get_progress(self, job_id: str, last_update: str = None) -> dict:
        """Get progress updates via polling"""

        query = """
            SELECT
                job_id,
                status,
                progress,
                updated_at
            FROM job_states
            WHERE job_id = $1
        """

        if last_update:
            query += " AND updated_at > $2"
            result = await db.fetchrow(query, job_id, last_update)
        else:
            result = await db.fetchrow(query, job_id)

        if result:
            return {
                'job_id': result['job_id'],
                'status': result['status'],
                'progress': result['progress'],
                'updated_at': result['updated_at'].isoformat(),
                'next_poll': self.poll_interval
            }

        return {'status': 'no_update', 'next_poll': self.poll_interval}
```

## Export System Architecture

### Multi-Format Export Service

```python
class ExportService:
    """Handle document exports with structure preservation"""

    def __init__(self):
        self.renderers = {
            'pdf': PDFRenderer(),
            'docx': DocxRenderer(),
            'txt': TextRenderer(),
            'html': HTMLRenderer()
        }
        self.page_parser = PageRangeParser()

    async def export_document(self, document_id: str, options: ExportOptions) -> bytes:
        """Export document with specified options"""

        # Parse page ranges
        pages = self.page_parser.parse(options.page_range)

        # Load document content
        content = await self.load_document_content(
            document_id,
            pages,
            options.include_original,
            options.include_ocr,
            options.include_translation
        )

        # Apply structure preservation
        if options.preserve_formatting:
            content = await self.apply_structure(content, document_id)

        # Render to format
        renderer = self.renderers[options.format]
        output = await renderer.render(content, options)

        # Queue for background processing if large
        if len(pages) > 50:
            return await self.queue_large_export(document_id, options)

        return output
```

### Page Range Parser

```python
class PageRangeParser:
    """Parse complex page range expressions"""

    def parse(self, range_expr: str) -> List[int]:
        """
        Parse expressions like:
        - "1-5" -> [1,2,3,4,5]
        - "1-5,20-50,75,90-100" -> [1,2,3,4,5,20,21,...,50,75,90,91,...,100]
        - "all" -> all pages
        - "even" -> even pages only
        - "odd" -> odd pages only
        """

        if range_expr == "all":
            return self.get_all_pages()
        elif range_expr == "even":
            return [p for p in self.get_all_pages() if p % 2 == 0]
        elif range_expr == "odd":
            return [p for p in self.get_all_pages() if p % 2 == 1]

        pages = set()

        for part in range_expr.split(','):
            part = part.strip()

            if '-' in part:
                start, end = map(int, part.split('-'))
                pages.update(range(start, end + 1))
            else:
                pages.add(int(part))

        return sorted(list(pages))
```

## Multi-tenant Architecture Enhancements

### Tenant Resource Allocation

```python
class TenantResourceManager:
    """Manage per-tenant resource allocation"""

    def __init__(self):
        self.tenant_limits = {}
        self.load_tenant_configurations()

    async def allocate_resources(self, tenant_id: str) -> ResourceAllocation:
        """Allocate resources based on tenant tier"""

        tenant = await self.get_tenant(tenant_id)

        allocation = ResourceAllocation(
            max_concurrent_jobs=self.get_job_limit(tenant.tier),
            queue_priority=self.get_priority(tenant.tier),
            storage_quota_gb=self.get_storage_quota(tenant.tier),
            api_rate_limit=self.get_rate_limit(tenant.tier),
            max_file_size_mb=self.get_file_size_limit(tenant.tier)
        )

        # Apply tenant-specific overrides
        if tenant.custom_limits:
            allocation.merge(tenant.custom_limits)

        return allocation

    def get_job_limit(self, tier: str) -> int:
        """Get concurrent job limit by tier"""
        limits = {
            'free': 1,
            'starter': 5,
            'professional': 20,
            'enterprise': 100
        }
        return limits.get(tier, 1)
```

### Tenant-Specific Queue Priorities

```python
class TenantQueueManager:
    """Manage tenant-specific queue priorities"""

    async def enqueue_with_priority(self, job: Job, tenant_id: str) -> str:
        """Enqueue job with tenant-based priority"""

        tenant = await self.get_tenant(tenant_id)

        # Calculate effective priority
        base_priority = job.priority
        tenant_boost = self.get_tenant_priority_boost(tenant.tier)

        # Check tenant's queue depth
        queue_depth = await self.get_tenant_queue_depth(tenant_id)
        depth_penalty = min(queue_depth * 2, 50)  # Prevent queue flooding

        effective_priority = max(0, base_priority - tenant_boost + depth_penalty)

        # Enqueue with calculated priority
        job.priority = effective_priority
        job.tenant_id = tenant_id

        return await self.queue.enqueue(job)
```

## Performance Optimization Architecture

### Token Usage Optimization

```python
class TokenOptimizer:
    """Optimize token usage for cost and performance"""

    def __init__(self):
        self.cache = TokenCache()
        self.deduplicator = ContentDeduplicator()

    async def optimize_batch(self, documents: List[Document]) -> List[Batch]:
        """Optimize document batching for token efficiency"""

        # Deduplicate content
        unique_content = self.deduplicator.process(documents)

        # Group similar content
        groups = self.group_by_similarity(unique_content)

        batches = []
        for group in groups:
            # Create optimal batches
            batch = await self.create_optimal_batch(group)
            batches.append(batch)

        return batches

    async def create_optimal_batch(self, documents: List[Document]) -> Batch:
        """Create batch optimized for token limits"""

        batch = Batch()
        current_tokens = 0

        # Sort by priority and size
        sorted_docs = sorted(documents, key=lambda d: (d.priority, -d.token_count))

        for doc in sorted_docs:
            if current_tokens + doc.token_count <= VertexAIConfig.MAX_INPUT_TOKENS * 0.9:
                batch.add(doc)
                current_tokens += doc.token_count
            else:
                break

        return batch
```

### Caching Strategy

```python
class CachingStrategy:
    """Multi-layer caching for translations"""

    def __init__(self):
        self.memory_cache = MemoryCache(max_size="100MB")
        self.redis_cache = RedisCache(ttl=3600)
        self.db_cache = DatabaseCache()

    async def get_translation(self, source: str, target_lang: str) -> Optional[str]:
        """Get cached translation with fallback layers"""

        cache_key = self.generate_key(source, target_lang)

        # L1: Memory cache
        result = self.memory_cache.get(cache_key)
        if result:
            return result

        # L2: Redis cache
        result = await self.redis_cache.get(cache_key)
        if result:
            self.memory_cache.set(cache_key, result)
            return result

        # L3: Database cache
        result = await self.db_cache.get(cache_key)
        if result:
            await self.redis_cache.set(cache_key, result)
            self.memory_cache.set(cache_key, result)
            return result

        return None

    async def cache_translation(self, source: str, target_lang: str, translation: str):
        """Cache translation at all layers"""

        cache_key = self.generate_key(source, target_lang)

        # Write through all cache layers
        self.memory_cache.set(cache_key, translation)
        await self.redis_cache.set(cache_key, translation)
        await self.db_cache.set(cache_key, translation)
```

## Project Structure

### Complete Repository Organization

```
HDA2/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── cd-staging.yml      # Deploy to staging
│   │   └── cd-production.yml   # Deploy to production
│   └── CODEOWNERS
│
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application
│   │   ├── dependencies.py     # Dependency injection
│   │   ├── middleware.py       # Custom middleware
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── documents.py
│   │       ├── ocr.py
│   │       ├── translations.py
│   │       └── admin.py
│   │
│   ├── core/
│   │   ├── config.py           # Settings management
│   │   ├── security.py         # Auth utilities
│   │   ├── exceptions.py       # Custom exceptions
│   │   └── ai/
│   │       ├── gemini_client.py
│   │       ├── translation_memory.py
│   │       └── embeddings.py
│   │
│   ├── services/
│   │   ├── base.py            # Base service class
│   │   ├── document_service.py
│   │   ├── ocr_service.py
│   │   ├── translation_service.py
│   │   └── supabase_service.py
│   │
│   ├── models/
│   │   ├── base.py            # SQLAlchemy base
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── translation.py
│   │   └── embeddings.py       # pgvector models
│   │
│   ├── schemas/
│   │   ├── user.py            # Pydantic schemas
│   │   ├── document.py
│   │   ├── translation.py
│   │   └── common.py
│   │
│   ├── workers/
│   │   ├── celery_app.py      # Celery configuration
│   │   └── tasks/
│   │       ├── ocr.py
│   │       ├── translation.py
│   │       ├── export.py
│   │       └── embeddings.py
│   │
│   ├── database/
│   │   ├── session.py         # Database connection
│   │   ├── supabase.py        # Supabase client
│   │   └── migrations/
│   │       └── alembic/
│   │
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── index.tsx          # Application entry
│   │   ├── App.tsx            # Root component
│   │   ├── router.tsx         # Route configuration
│   │   │
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   │
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── documents/
│   │   │   ├── translations/
│   │   │   └── admin/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSupabase.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useTranslation.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts         # API client
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   └── websocket.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── appStore.ts
│   │   │   └── slices/
│   │   │
│   │   ├── types/
│   │   │   ├── models.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── styles/
│   │       ├── globals.css
│   │       └── theme.ts
│   │
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── .env.example
│
├── supabase/
│   ├── migrations/            # Supabase migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_pgvector_setup.sql
│   │   └── 003_rls_policies.sql
│   ├── functions/             # Edge functions
│   │   ├── process-webhook/
│   │   └── generate-embeddings/
│   └── seed.sql              # Seed data
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.dev.yml
│   │   └── docker-compose.prod.yml
│   │
│   ├── kubernetes/            # Future K8s configs
│   │   ├── deployments/
│   │   ├── services/
│   │   └── configmaps/
│   │
│   └── scripts/
│       ├── setup-dev.sh
│       ├── deploy-staging.sh
│       └── deploy-prod.sh
│
├── docs/
│   ├── architecture.md       # This document
│   ├── prd.md               # Product requirements
│   ├── api/                 # API documentation
│   └── guides/              # User guides
│
├── .env.example
├── Makefile
├── README.md
└── package.json              # Root package for scripts
```

### Environment Configuration

**.env Structure:**
```env
# Supabase
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# Gemini AI
GEMINI_API_KEY=AIza...

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256

# AWS S3 (for document storage)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=translation-documents

# Application
ENVIRONMENT=development
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Makefile Commands

```makefile
# Development
.PHONY: dev
dev:
	docker-compose -f infrastructure/docker/docker-compose.dev.yml up

.PHONY: install
install:
	cd backend && pip install -r requirements-dev.txt
	cd frontend && npm install

.PHONY: migrate
migrate:
	cd backend && alembic upgrade head
	supabase db push

# Testing
.PHONY: test
test:
	cd backend && pytest
	cd frontend && npm test

.PHONY: test-coverage
test-coverage:
	cd backend && pytest --cov=api --cov-report=html
	cd frontend && npm run test:coverage

# Linting
.PHONY: lint
lint:
	cd backend && ruff check . && mypy .
	cd frontend && npm run lint

.PHONY: format
format:
	cd backend && black . && ruff check --fix .
	cd frontend && npm run format

# Build
.PHONY: build
build:
	docker build -t translation-backend ./backend
	docker build -t translation-frontend ./frontend

# Deployment
.PHONY: deploy-staging
deploy-staging:
	./infrastructure/scripts/deploy-staging.sh

.PHONY: deploy-prod
deploy-prod:
	./infrastructure/scripts/deploy-prod.sh
```

## Deployment Architecture

### Deployment Platform Decision Matrix

**Critical Requirements:**
- Kubernetes readiness for future scaling
- Docker containerization support
- Cost-effective for initial deployment
- Easy migration path to enterprise scale

### Recommended Deployment Strategy

#### Primary Option: DigitalOcean (Existing Client Infrastructure)
**Rationale:** Client already has DigitalOcean infrastructure with Ubuntu servers configured

```yaml
DigitalOcean Deployment:
  Compute:
    - Type: Droplets (Ubuntu 22.04 LTS)
    - Initial: 2x 4GB RAM / 2 vCPUs ($40/month total)
    - Scaling: Add droplets as needed

  Container Orchestration:
    - Phase 1: Docker Compose (Simple, fast deployment)
    - Phase 2: DigitalOcean Kubernetes (DOKS) when scale demands

  Database:
    - Supabase Cloud (Managed PostgreSQL)
    - No need for self-hosted database

  Storage:
    - DigitalOcean Spaces (S3-compatible)
    - $5/month for 250GB

  Load Balancing:
    - DigitalOcean Load Balancer ($12/month)
    - SSL termination included

  Benefits:
    - Existing client familiarity
    - Lower cost than AWS
    - Simple Kubernetes migration
    - Good for 100-1000 concurrent users
```

#### Alternative Option: AWS EC2 (Enterprise Ready)
**Use Case:** When enterprise features and scale are required

```yaml
AWS EC2 Deployment:
  Compute:
    - Type: t3.medium instances
    - Auto Scaling Groups for elasticity
    - Spot instances for workers (70% cost savings)

  Container Orchestration:
    - Phase 1: ECS Fargate (Serverless containers)
    - Phase 2: EKS (Managed Kubernetes) for enterprise

  Load Balancing:
    - Application Load Balancer (ALB)
    - AWS WAF integration for security

  Benefits:
    - Enterprise-grade infrastructure
    - Global scale capability
    - Advanced monitoring (CloudWatch)
    - Seamless integration with AWS services
```

### Container Architecture (Platform Agnostic)

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

# Backend Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes-Ready Architecture

```yaml
# deployment.yaml (works on both DOKS and EKS)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: translation-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: translation-platform
  template:
    metadata:
      labels:
        app: translation-platform
    spec:
      containers:
      - name: frontend
        image: registry.digitalocean.com/translation/frontend:latest
        ports:
        - containerPort: 80
      - name: backend
        image: registry.digitalocean.com/translation/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### Critical Decision: Do We Need Kubernetes?

#### The Honest Assessment: NO (Not for 12-18 months)

**Current Scale Analysis:**
```yaml
Our Requirements:
  Concurrent Users: 100-1,000
  Tenants: 1 initially, 100+ in Year 1
  Processing Pattern: Long-running batch jobs (10-30 min)
  Traffic Type: Burst during business hours, quiet at night
  Team Size: Single development team
  Services: 2 (frontend + backend)

Kubernetes Sweet Spot:
  Concurrent Users: 10,000+
  Services: 20+ microservices
  Teams: Multiple teams deploying independently
  Requirements: Service mesh, complex routing, multi-region

Verdict: We're 10x below the threshold where K8s makes sense
```

#### Deployment Complexity Comparison

```yaml
Docker Compose Complexity:
  Files to Manage: 1 (docker-compose.yml)
  Lines of Config: ~50
  Learning Curve: 1 week
  Debugging: docker logs [service]
  Deployment Time: 5 minutes
  Monthly Maintenance: 2 hours

Kubernetes Complexity:
  Files to Manage: 10+ YAML files
  Lines of Config: 500+
  Learning Curve: 2-3 months
  Debugging: kubectl logs, describe, events (complex)
  Deployment Time: 30+ minutes
  Monthly Maintenance: 20+ hours

Cost of Complexity:
  - K8s adds $200+/month in infrastructure
  - K8s requires 100+ hours of additional DevOps work
  - K8s delays time-to-market by 1-2 months
```

### Recommended Progressive Deployment Strategy

#### Phase 1: Docker Compose (Months 1-12) ✅ RECOMMENDED

```yaml
# docker-compose.yml - This is ALL you need!
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    restart: always

  backend:
    image: registry.digitalocean.com/translation/backend:latest
    environment:
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
      - VERTEX_AI_KEY_PATH=/secrets/vertex-ai-key.json
    volumes:
      - ./secrets:/secrets:ro
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2  # Simple scaling

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis-data:/data

  celery-worker:
    image: registry.digitalocean.com/translation/backend:latest
    command: celery -A app.worker worker --loglevel=info
    environment:
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
    restart: always
    deploy:
      replicas: 3  # Scale workers based on load

  celery-beat:
    image: registry.digitalocean.com/translation/backend:latest
    command: celery -A app.worker beat --loglevel=info
    environment:
      - DATABASE_URL=${SUPABASE_URL}
      - REDIS_URL=redis://redis:6379
    restart: always

volumes:
  redis-data:
```

**Deployment Script:**
```bash
#!/bin/bash
# deploy.sh - Complete deployment in 10 lines

echo "🚀 Deploying Translation Platform..."

# Build and push
docker build -t registry.digitalocean.com/translation/backend:latest ./backend
docker push registry.digitalocean.com/translation/backend:latest

# Deploy to servers
ssh deploy@${DEPLOY_HOST} "
  cd /app
  docker-compose pull
  docker-compose up -d --remove-orphans
  docker system prune -f
"

echo "✅ Deployment complete!"
```

**Why This Works:**
- Handles 1,000 concurrent users easily
- Costs $40-60/month total
- Deploys in 5 minutes
- Self-healing with restart policies
- Zero complexity overhead

#### Phase 2: Docker Swarm (Months 12-18) - ONLY IF NEEDED

```bash
# Only if you exceed 1,000 concurrent users
docker swarm init
docker stack deploy -c docker-compose.yml translation

# Benefits:
# - Built into Docker (no new tools)
# - Automatic load balancing
# - Rolling updates
# - Secret management
# - 80% of K8s benefits, 20% complexity
```

#### Phase 3: Kubernetes (Month 18+) - EVALUATE CAREFULLY

**Decision Matrix for Kubernetes:**
```python
def should_adopt_kubernetes():
    """
    Only consider Kubernetes when multiple conditions are true
    """
    conditions = {
        'concurrent_users': current_users > 5000,
        'daily_deployments': deployments_per_day > 10,
        'service_count': number_of_services > 10,
        'team_size': engineering_teams > 3,
        'regions': deployment_regions > 1,
        'compliance': requires_complex_network_policies,
    }

    # Need at least 3 conditions to justify K8s
    if sum(conditions.values()) >= 3:
        return "Consider Kubernetes"
    else:
        return "Stay with Docker Compose/Swarm"
```

### The Hidden Costs of Premature Kubernetes Adoption

```yaml
What Kubernetes Actually Costs:
  Infrastructure:
    - Minimum 3 nodes for HA: +$60/month
    - Monitoring stack (Prometheus/Grafana): +$40/month
    - Log aggregation (ELK/Loki): +$40/month
    - Ingress controller: +$20/month
    Total: +$160/month minimum

  Engineering Time:
    - Initial setup: 40-80 hours
    - Learning curve: 100+ hours per engineer
    - Ongoing maintenance: 20 hours/month
    - Debugging complexity: 5x increase

  Operational Overhead:
    - 15+ YAML files to maintain
    - ConfigMaps and Secrets management
    - Network policies
    - RBAC configurations
    - Persistent volume management
    - Certificate management
    - Resource limits and requests tuning
    - Pod disruption budgets
    - Horizontal pod autoscalers

  Opportunity Cost:
    - Time NOT spent on product features
    - Delayed time to market
    - Engineer frustration and context switching
```

### Monitoring That Actually Matters

```yaml
Simple Monitoring for Docker Compose:
  Essential Metrics:
    - CPU/Memory usage: DigitalOcean monitoring (free)
    - Application errors: Sentry ($24/month)
    - Uptime: UptimeRobot (free)
    - Database: Supabase dashboard (included)

  Simple Health Checks:
    - /health endpoint returning 200 OK
    - Database connectivity check
    - Redis ping
    - Celery worker status

  Total Cost: $24/month
  Setup Time: 2 hours
```

### Migration Path (When Actually Needed)

```mermaid
graph LR
    A[Docker Compose<br/>Months 1-12] -->|If >1000 users| B[Docker Swarm<br/>Months 12-18]
    B -->|If >5000 users| C[Kubernetes<br/>Month 18+]

    A -->|Monitor| A1{Scale Issues?}
    A1 -->|No| A2[Stay with<br/>Docker Compose]
    A1 -->|Yes| B

    B -->|Monitor| B1{Need Multi-region?}
    B1 -->|No| B2[Stay with Swarm]
    B1 -->|Yes| C
```

### What to Focus On Instead of Kubernetes

```yaml
High-Impact Areas for Your Time and Money:

1. Vertex AI Optimization (Saves $100s/month):
   - Better prompt engineering
   - Smarter batching algorithms
   - Caching frequently translated phrases
   - Glossary optimization

2. User Experience (Increases retention):
   - Faster perceived performance
   - Better error messages
   - Progress indicators that don't lie
   - Smooth file uploads

3. Data Quality (Core value prop):
   - Structure preservation algorithms
   - Better OCR preprocessing
   - Sanskrit term validation
   - Quality scoring systems

4. Simple Operational Excellence:
   - Automated backups (cron + S3)
   - Basic monitoring (free tools)
   - Simple deployment scripts
   - Clear runbooks

5. Business Features (Revenue growth):
   - Better multi-tenant isolation
   - Usage analytics
   - Billing integration
   - White-label capabilities

Time Saved by NOT Using K8s: 100+ hours
Money Saved: $200+/month
Stress Saved: Immeasurable
```

### Phase 1: Initial Deployment Architecture

**Architecture Overview:**
```mermaid
graph TB
    subgraph "Client Layer"
        WEB[React App on EC2/DigitalOcean]
        MOBILE[Future Mobile App]
    end

    subgraph "Supabase Cloud"
        AUTH[Supabase Auth]
        DB[(PostgreSQL + pgvector)]
        STORAGE[Supabase Storage]
        REALTIME[Realtime Subscriptions]
        EDGE[Edge Functions]
    end

    subgraph "External Services"
        GEMINI[Gemini 2.5 Pro API]
        S3[AWS S3 for Large Files]
    end

    subgraph "Background Processing"
        WORKER[Celery Workers on Railway]
        REDIS[Redis on Upstash]
    end

    WEB --> AUTH
    WEB --> DB
    WEB --> STORAGE
    WEB --> REALTIME

    EDGE --> GEMINI
    WORKER --> GEMINI
    WORKER --> S3
    WORKER --> DB
    WORKER --> REDIS
```

### Deployment Services

**Frontend Deployment Options:**

**Option 1: AWS EC2 (Primary Choice)**
```json
{
  "platform": "AWS EC2",
  "instance_type": "t3.medium",
  "deployment": "Docker containers with nginx",
  "scaling": "Auto Scaling Groups",
  "load_balancer": "Application Load Balancer",
  "benefits": [
    "Full control over environment",
    "Easy horizontal/vertical scaling",
    "Kubernetes ready (EKS migration path)",
    "Consistent with backend infrastructure"
  ]
}
```

**Option 2: DigitalOcean (Alternative - Existing Infrastructure)**
```json
{
  "platform": "DigitalOcean Droplets",
  "deployment": "Docker containers",
  "orchestration": "Kubernetes (DOKS) ready",
  "benefits": [
    "Existing client infrastructure",
    "Lower cost than AWS",
    "Simple Kubernetes integration",
    "Ubuntu servers already configured"
  ],
  "considerations": [
    "Client already has DigitalOcean setup",
    "Familiar deployment patterns",
    "Cost-effective for current scale"
  ]
}
```

**Deployment Architecture:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "environmentVariables": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

**Backend API Deployment (Railway/Render):**
```yaml
services:
  api:
    build: ./backend
    environment:
      - DATABASE_URL=${{SUPABASE_DATABASE_URL}}
      - REDIS_URL=${{REDIS_URL}}
    healthcheck:
      path: /health
      port: 8000
    scaling:
      min_instances: 1
      max_instances: 5
      target_cpu: 70

  worker:
    build: ./backend
    command: celery -A workers.celery_app worker
    environment:
      - DATABASE_URL=${{SUPABASE_DATABASE_URL}}
      - REDIS_URL=${{REDIS_URL}}
    scaling:
      min_instances: 2
      max_instances: 10
```

### Supabase Configuration

**Database Setup:**
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create vector similarity index
CREATE INDEX ON translation_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
```

**Edge Functions for Webhooks:**
```typescript
// supabase/functions/process-document/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { document_id, action } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Trigger background processing
  await fetch(`${Deno.env.get('WORKER_URL')}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id, action })
  })

  return new Response(JSON.stringify({ success: true }))
})
```

### Monitoring & Observability

**Application Monitoring:**
```yaml
Monitoring Stack:
  - Supabase Dashboard: Database metrics, API usage
  - CloudWatch/DigitalOcean Monitoring: Frontend performance
  - Sentry: Error tracking (frontend + backend)
  - Upstash Console: Redis metrics
  - Custom Dashboard: Business metrics

Alerts:
  - Database connection pool > 80%
  - API response time > 500ms (p95)
  - OCR processing queue > 100 items
  - Translation accuracy < 85%
  - Storage usage > 80%
```

### CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Run Tests
        run: |
          cd backend
          pip install -r requirements-dev.txt
          pytest

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: |
          docker build -t frontend:${{ github.sha }} ./frontend
          docker tag frontend:${{ github.sha }} $ECR_REGISTRY/frontend:latest

      - name: Push to Registry
        run: docker push $ECR_REGISTRY/frontend:latest

      - name: Deploy to EC2/DigitalOcean
        run: |
          ssh deploy@${{ secrets.DEPLOY_HOST }} 'docker pull $ECR_REGISTRY/frontend:latest && docker-compose up -d'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up --token=${{ secrets.RAILWAY_TOKEN }}

  migrate-database:
    needs: [deploy-frontend, deploy-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Supabase Migrations
        run: |
          supabase db push --db-url=${{ secrets.DATABASE_URL }}
```

### Cost Optimization

**Monthly Cost Breakdown (Phase 1):**
```yaml
Supabase Pro: $25/month
  - 8GB database
  - 250GB bandwidth
  - 100GB storage
  - Unlimited API requests

EC2 t3.medium: $30/month
  - Frontend hosting (React + nginx)
  - Full control & scalability
  - OR DigitalOcean Droplet: $20/month
  - Edge functions

Railway/Render: $20-50/month
  - API server (1-2 instances)
  - Celery workers (2-4 instances)

Upstash Redis: $10/month
  - 10GB storage
  - 100K commands/day

Total: ~$75-105/month (supporting 10K users)
```

### Security Measures

**Security Configuration:**
```yaml
API Security:
  - JWT authentication with refresh tokens
  - Rate limiting per user/IP
  - Input validation with Pydantic
  - SQL injection prevention via ORM

Database Security:
  - Row Level Security (RLS) enabled
  - Column encryption for sensitive data
  - SSL/TLS for all connections
  - Regular backups (daily)

Application Security:
  - CORS properly configured
  - CSP headers implemented
  - Secrets in environment variables
  - No sensitive data in logs
```

## Supabase Scaling Strategy

### Seamless Growth Without Migration

**Supabase Tier Progression:**
- **Free Tier ($0):** Development and testing
- **Pro ($25/month):** MVP with 10-20 organizations
- **Team ($599/month):** 50-100 organizations
- **Enterprise ($3,999/month):** 100+ organizations with custom resources

**Scaling Path:**
```mermaid
graph LR
    A[Pro Tier<br/>$25/month] -->|Growth| B[Team Tier<br/>$599/month]
    B -->|Scale| C[Enterprise<br/>$3,999/month]
    C -->|Custom| D[Custom Contract<br/>Negotiated]
```

**Resource Scaling by Tier:**

| Resource | Pro | Team | Enterprise |
|----------|-----|------|------------|
| Database | 8GB | 100GB | Custom |
| Bandwidth | 250GB | 5TB | Unlimited |
| Storage | 100GB | 1TB | Custom |
| API Requests | Unlimited | Unlimited | Unlimited |
| Concurrent Connections | 60 | 200 | Custom |
| Support | Community | Email | Priority + SLA |

**Scaling Advantages:**
1. **Zero Migration:** Upgrade tiers without any code changes
2. **Automatic Scaling:** Resources scale with your plan
3. **Global CDN:** Built-in edge caching worldwide
4. **Multi-Region:** Available in 30+ regions
5. **No DevOps:** Supabase handles all infrastructure
6. **Cost Predictable:** Fixed monthly pricing per tier

**When to Upgrade Tiers:**

```python
# Simple monitoring for tier upgrade triggers
async def check_scaling_needs():
    metrics = await get_usage_metrics()

    if metrics.database_size > 7.5:  # 75% of 8GB
        alert("Consider upgrading to Team tier")

    if metrics.monthly_bandwidth > 200:  # 80% of 250GB
        alert("Bandwidth approaching limit")

    if metrics.concurrent_users > 50:
        alert("Connection pool needs expansion")

    # No migration needed - just upgrade in dashboard!
```

## Performance Benchmarks & SLAs

### Core Philosophy: Quality First

> **FUNDAMENTAL PRINCIPLE**: Translation and OCR quality are non-negotiable. We optimize for accuracy, context preservation, and faithfulness to source material. Users will wait for quality output rather than receive fast but poor translations.

### Quality-Driven Performance Targets

**Quality Metrics (Non-Negotiable):**
| Metric | MVP Requirement | Measurement | Priority |
|--------|-----------------|-------------|----------|
| OCR Accuracy | > 95% printed, > 85% handwritten | Character-level accuracy | **CRITICAL** |
| Translation Fidelity | > 90% context preserved | Human evaluation + BLEU > 0.8 | **CRITICAL** |
| Cultural Context | 100% preserved | Manual review for religious texts | **CRITICAL** |
| Terminology Consistency | 100% within document | Translation memory validation | **CRITICAL** |
| Sanskrit Transliteration | 100% accurate | IAST/Devanagari validation | **CRITICAL** |

**Processing Times (Acceptable for Quality):**
| Operation | Time Budget | Quality Check | User Expectation |
|-----------|-------------|---------------|------------------|
| OCR Processing | 30-60s per page | Multi-pass validation | "Quality takes time" |
| Translation | 2-10s per paragraph | Context window optimization | Progress indicator shown |
| Quality Review | 5-10s per page | Automated + sampling | Worth the wait |
| Document Processing | 5-15 min per book | Full pipeline with checks | Background processing |

**System Reliability:**
- **Translation Consistency**: 100% (same input = same output)
- **Context Window**: Full 2M tokens utilized when needed
- **Retry Logic**: Automatic 3x retry for quality assurance
- **Human-in-the-loop**: Flag low-confidence translations

### Development Priorities

```yaml
Phase 1 (MVP - Months 1-3):
  Focus: "Make it RIGHT"
  - Maximum OCR accuracy using Gemini 2.5 Pro's best models
  - Context-aware translation with full 2M token window
  - Translation memory for consistency
  - Extensive quality validation
  Quality: Primary concern, speed secondary

Phase 2 (Enhancement - Months 4-6):
  Focus: "Make it BETTER"
  - Add glossary management for domain terms
  - Implement review workflows
  - Enhanced context preservation algorithms
  - A/B testing translation strategies
  Quality: Continuous improvement via feedback

Phase 3 (Scale - Months 7+):
  Focus: "Make it FASTER (without compromising quality)"
  - Optimize only after quality benchmarks met
  - Intelligent caching of validated translations
  - Parallel processing where quality permits
  - Pre-processing for common patterns
  Quality: Maintained at high standard
```

### Quality-First Development Guidelines

**For Developers - Quality Over Speed:**
```python
# CORRECT Approach - Quality First
async def translate_document(doc_id: str):
    """Prioritize accuracy and context preservation"""
    document = await get_document(doc_id)

    # Use maximum context window for better translation
    full_context = await build_document_context(document)

    # Multiple validation passes
    ocr_result = await gemini_ocr_with_validation(
        document.image,
        confidence_threshold=0.95,
        retry_on_low_confidence=True
    )

    # Preserve context across paragraphs
    translation = await gemini_translate_with_context(
        text=ocr_result.text,
        context=full_context,
        previous_translations=await get_translation_memory(doc_id),
        glossary=await get_domain_glossary(document.domain),
        temperature=0.3  # Lower temperature for consistency
    )

    # Validate translation quality
    quality_score = await validate_translation_quality(
        source=ocr_result.text,
        translation=translation,
        check_consistency=True,
        check_terminology=True
    )

    if quality_score < 0.9:
        # Flag for human review rather than accepting poor quality
        await flag_for_review(doc_id, translation, quality_score)

    await save_translation(doc_id, translation, quality_score)
    return translation

# WRONG Approach - Speed over Quality
async def translate_document_fast(doc_id: str):
    """Don't do this - sacrifices quality for speed"""
    document = await get_document(doc_id)

    # Quick and dirty OCR - NO!
    ocr = await quick_ocr(document.image)

    # Translate without context - NO!
    translation = await gemini_translate(ocr.text)

    await save_translation(doc_id, translation)
    return translation
```

### Performance Optimization Strategies

```typescript
// Frontend Optimization
const DocumentList = lazy(() => import('./pages/Documents/List'))
const memoizedTranslations = useMemo(() => processTranslations(data), [data])

// Backend Optimization
@cache(ttl=300)  # 5-minute cache
async def get_translation_memory(text: str, lang: str):
    return await db.query_similar(text, lang)

// Database Optimization
CREATE INDEX CONCURRENTLY idx_translations_composite
ON translations(document_id, target_language, status)
WHERE status = 'COMPLETED';
```

## Disaster Recovery & Business Continuity

### Backup Strategy

**Data Backup Schedule:**
```yaml
Database:
  Frequency: Every 6 hours
  Retention: 30 days
  Type: Point-in-time recovery
  Location: Cross-region S3 bucket

Documents:
  Frequency: Real-time (S3 versioning)
  Retention: 90 days
  Type: Versioned objects
  Location: S3 with cross-region replication

Application Code:
  Frequency: On every commit
  Retention: Indefinite
  Type: Git repository
  Location: GitHub + mirror repository
```

### Recovery Objectives

| Scenario | RTO | RPO | Strategy |
|----------|-----|-----|----------|
| Database Failure | 1 hour | 6 hours | Restore from Supabase backup |
| Region Outage | 4 hours | 1 hour | Failover to DR region |
| Data Corruption | 2 hours | 24 hours | Point-in-time recovery |
| Security Breach | 30 min | 0 | Immediate lockdown & audit |

### Disaster Recovery Procedures

```bash
# 1. Database Recovery
supabase db restore --backup-id <backup_id>

# 2. Document Recovery
aws s3 sync s3://backup-bucket s3://primary-bucket --delete

# 3. Cache Rebuild
redis-cli FLUSHALL
python scripts/rebuild_cache.py

# 4. Service Health Verification
curl https://api.platform.com/health
pytest tests/smoke/
```

## Operational Runbook

### Deployment Procedures

**Production Deployment Checklist:**
```markdown
- [ ] Run test suite (pytest, vitest)
- [ ] Update version in package.json/setup.py
- [ ] Create git tag
- [ ] Deploy to staging
- [ ] Run smoke tests on staging
- [ ] Create backup of production database
- [ ] Deploy to production (blue-green)
- [ ] Verify health checks
- [ ] Monitor error rates for 30 minutes
- [ ] Update status page
```

### Health Check Endpoints

```python
# Health check implementation
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": settings.VERSION,
        "database": await check_db_health(),
        "redis": await check_redis_health(),
        "storage": await check_s3_health(),
        "gemini_api": await check_gemini_health()
    }

@app.get("/health/detailed")
@require_permission("admin")
async def detailed_health():
    return {
        "connections": {
            "database": engine.pool.status(),
            "redis": redis_client.info(),
        },
        "metrics": {
            "active_jobs": await get_active_jobs_count(),
            "queue_depth": await get_queue_depth(),
            "error_rate": await get_error_rate_5min()
        }
    }
```

### Monitoring & Alerts

**Critical Alerts:**
| Metric | Threshold | Action |
|--------|-----------|--------|
| API Error Rate | > 1% | Page on-call engineer |
| Response Time | > 2s (p95) | Alert dev team |
| Queue Depth | > 1000 | Scale workers |
| Disk Usage | > 80% | Cleanup + scale storage |
| Memory Usage | > 90% | Restart + investigate leak |

## API Versioning Strategy

### Version Management

```typescript
// API Version Negotiation
app.use('/api/v1', v1Router)  // Current stable
app.use('/api/v2', v2Router)  // Beta
app.use('/api/latest', v2Router)  // Alias to latest

// Version in Headers
response.headers['X-API-Version'] = '1.0.0'
response.headers['X-API-Deprecation'] = 'true'  // If applicable
response.headers['X-API-Sunset'] = '2026-03-01'  // Deprecation date
```

### Breaking Change Policy

**Deprecation Timeline:**
1. **Announcement** - 6 months before deprecation
2. **Warning Headers** - 3 months before
3. **Console Warnings** - 1 month before
4. **Sunset** - API version removed

**Client SDK Updates:**
```python
# SDK with version compatibility
from translation_platform import Client

client = Client(
    api_key="...",
    api_version="v1",  # Explicit version
    auto_upgrade=False  # Don't auto-migrate
)
```

## Success Metrics & KPIs

### Quality-Driven Success Criteria

> **CORE PRINCIPLE**: Quality of translation and context preservation are the primary success metrics. Speed and scale are secondary to delivering accurate, culturally-sensitive translations.

### MVP Quality Standards (Months 1-3)

**Quality Metrics (Non-Negotiable):**
- **Text Extraction Accuracy**: > 95% for printed, > 85% for handwritten
- **Translation Quality**: BLEU score > 0.8 (professional quality)
- **Context Preservation**: > 90% (measured by human review)
- **Terminology Consistency**: 100% within documents
- **Sanskrit/Religious Terms**: 100% accuracy (zero tolerance for errors)
- **Cultural Sensitivity**: 100% preserved meaning and context

**Acceptable Processing Times:**
- **Full Book Translation**: 10-30 minutes (quality over speed)
- **Per-Page OCR**: 30-60 seconds (with validation)
- **Translation Review**: 5-10 seconds per paragraph
- **Quality Checks**: As long as needed for accuracy

**User Success Metrics:**
- **Translation Acceptance Rate**: > 80% without edits
- **User Trust Score**: > 4.5/5 for translation quality
- **Repeat Usage**: > 70% return for second document
- **Quality Feedback**: Incorporated within 48 hours

### Growth Phase (Months 4-6)

**Enhanced Quality Features:**
- **Domain-Specific Glossaries**: 95% term accuracy
- **Multi-Reviewer Consensus**: Available for critical texts
- **Version Control**: Track all translation iterations
- **Quality Audit Trail**: 100% transparency

**Efficiency Improvements (Without Quality Loss):**
- **Smart Caching**: Reuse validated translations
- **Batch Processing**: Maintain quality per item
- **Progressive Enhancement**: Show draft then final
- **Parallel Validation**: Speed up quality checks

### Mature Platform (Year 1+)

**Industry-Leading Quality:**
- **Text Extraction Accuracy**: > 97% printed, > 90% handwritten
- **Translation Quality**: BLEU > 0.85, Human eval > 95%
- **Zero Cultural Errors**: For religious/sensitive content
- **Professional Certification**: Translation industry standards
- **ISO Compliance**: For translation quality management

**Sustainable Operations:**
- **Quality at Scale**: Same standards for 1 or 1000 documents
- **Automated QA**: ML-based quality validation
- **Expert Network**: Human reviewers for edge cases
- **Continuous Learning**: Improve from every translation

## Glossary of Terms

### Technical Terms

| Term | Definition |
|------|------------|
| **API Gateway** | Entry point for all client API requests, handles routing, rate limiting, and authentication |
| **BLEU Score** | Bilingual Evaluation Understudy - metric for evaluating machine translation quality (0-1 scale) |
| **CDC** | Change Data Capture - tracking and capturing changes in database for replication |
| **CORS** | Cross-Origin Resource Sharing - security feature controlling resource access across domains |
| **DLQ** | Dead Letter Queue - storage for messages that cannot be processed successfully |
| **Edge Function** | Serverless function deployed close to users for low-latency execution |
| **Fuzzy Matching** | Approximate string matching technique for translation memory |
| **GraphQL** | Query language for APIs allowing clients to request specific data |
| **HMR** | Hot Module Replacement - development feature for instant code updates |
| **JIT Compiler** | Just-In-Time compiler in Python 3.13 for performance optimization |
| **JWT** | JSON Web Token - secure method for transmitting information between parties |
| **LRU Cache** | Least Recently Used cache eviction strategy |
| **MFA** | Multi-Factor Authentication for enhanced security |
| **OCR** | Optical Character Recognition - converting images to machine-readable text |
| **PgVector** | PostgreSQL extension for vector similarity search and embeddings |
| **RAG** | Retrieval-Augmented Generation - AI technique combining search with generation |
| **RLS** | Row Level Security - PostgreSQL feature for data access control |
| **RPC** | Remote Procedure Call - protocol for executing functions on remote servers |
| **RTO/RPO** | Recovery Time/Point Objective - disaster recovery metrics |
| **Server Components** | React 19 feature for server-side rendering of components |
| **SLA** | Service Level Agreement - performance and availability guarantees |
| **SSE** | Server-Sent Events - protocol for server-to-client streaming |
| **SSOT** | Single Source of Truth - centralized data authority |
| **TDD** | Test-Driven Development methodology |
| **TM** | Translation Memory - database of previously translated content |
| **TTL** | Time To Live - expiration time for cached data |
| **UUID** | Universally Unique Identifier for resource identification |
| **Vector Embedding** | Numerical representation of text for similarity search |
| **WebSocket** | Protocol for persistent bidirectional communication |
| **Worker Pool** | Collection of background processes for parallel task execution |

### Business Terms

| Term | Definition |
|------|------------|
| **Multi-tenant** | Single application instance serving multiple customers with data isolation |
| **SaaS** | Software as a Service - cloud-based software delivery model |
| **White-label** | Rebrandable platform for partners to offer as their own product |
| **Freemium** | Business model with free tier and paid premium features |
| **Enterprise Plan** | Highest tier offering with custom features and SLA |
| **Churn Rate** | Percentage of customers who stop using the service |
| **NPS** | Net Promoter Score - customer satisfaction metric (-100 to +100) |
| **MRR** | Monthly Recurring Revenue from subscriptions |
| **CAC** | Customer Acquisition Cost |
| **LTV** | Lifetime Value of a customer |
| **B2B** | Business-to-Business sales model |
| **API Marketplace** | Platform for third-party integrations and extensions |
| **Tenant** | Individual customer organization in multi-tenant architecture |
| **Onboarding** | Process of setting up new customers on the platform |
| **Retention** | Keeping existing customers active and engaged |

### Platform-Specific Terms

| Term | Definition |
|------|------------|
| **Supabase** | Open-source Firebase alternative providing database, auth, and real-time |
| **Gemini 2.5 Pro** | Google's AI model with 2M token window and superior OCR capabilities |
| **FastAPI** | Modern Python web framework for building APIs |
| **Celery** | Distributed task queue for Python |
| **Redis** | In-memory data store used for caching and queues |
| **PostgreSQL** | Advanced open-source relational database |
| **Docker** | Container platform for application deployment |
| **Kubernetes** | Container orchestration platform for scaling |
| **nginx** | Web server for serving React static files |
| **Sentry** | Error tracking and performance monitoring |
| **Datadog** | Infrastructure and application monitoring platform |
| **GitHub Actions** | CI/CD automation platform |
| **Anthropic Claude** | AI assistant used for code generation and review |
| **Next.js** | React framework for production applications |
| **Tailwind CSS** | Utility-first CSS framework |

## Conclusion

### Executive Summary

The Enterprise Translation Platform architecture represents a pragmatic approach to building a scalable, multi-tenant SaaS solution. By choosing Supabase as our complete platform, we achieve:

1. **Rapid Time-to-Market** - 3 months to MVP vs 6+ months with custom infrastructure
2. **Cost Efficiency** - $75/month initial to $3,999/month enterprise with no migrations
3. **Built-in Scaling** - Seamless growth from 10 to 100K+ users on same platform
4. **AI-Ready Infrastructure** - Native pgvector support for RAG implementations
5. **Zero DevOps** - Supabase handles all infrastructure, scaling, and maintenance

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Supabase (all tiers) | One platform from MVP to Enterprise |
| Real-time | Supabase Realtime | No additional WebSocket infrastructure |
| AI Processing | Gemini 2.5 Pro | Best OCR accuracy for multi-language |
| Frontend | React 19 + TypeScript | Modern stack with Server Components |
| Backend | FastAPI + Python 3.13 | AI/ML ecosystem + async performance |

### Risk Mitigation

**Identified Risks & Mitigations:**
1. **Vendor Lock-in** → Abstraction layers for all external services
2. **Scaling Limits** → Supabase scales to enterprise needs
3. **AI API Costs** → Caching + translation memory
4. **Multi-tenancy Complexity** → Schema-per-tenant isolation
5. **Performance Bottlenecks** → Horizontal scaling + caching

### Future Roadmap

**Phase 1 (Months 1-3):** MVP with core OCR/translation
**Phase 2 (Months 4-6):** Multi-tenant scaling, API marketplace
**Phase 3 (Months 7-9):** Enterprise features, white-label
**Phase 4 (Months 10-12):** AWS migration if needed

### Final Recommendations

1. **Start with Supabase** - Proven path for rapid development
2. **Monitor scaling triggers** - Know when to migrate
3. **Maintain abstraction layers** - Keep options open
4. **Focus on quality** - Translation accuracy drives adoption
5. **Iterate based on feedback** - Let customers guide evolution

This architecture provides a solid foundation for the Enterprise Translation Platform, balancing immediate delivery needs with long-term scalability requirements. The modular design ensures that as the platform grows, components can be independently scaled or replaced without major rewrites.

---

*Document Version: 1.3*
*Last Updated: September 24, 2025*
*Next Review: December 2025*
*Maintainer: Winston (System Architect)*