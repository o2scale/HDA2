# Lovable Frontend Integration Guide

## Overview
This guide helps you integrate your Lovable-generated frontend (HDA2-FE) into the main HDA2 monorepo structure while preserving all the rapid prototyping work you've done.

## Pre-Integration Checklist

### 1. Document Current State
Before starting migration, document:

```markdown
## Lovable Frontend Inventory
- [ ] List all implemented pages/routes
- [ ] Document all UI components created
- [ ] Note any custom animations or interactions
- [ ] List all API endpoints being called (even mocked)
- [ ] Document authentication flow (if any)
- [ ] Export any Lovable-specific settings
```

### 2. Backup Everything
```bash
# In HDA2-FE repository
git add .
git commit -m "final Lovable state before migration"
git tag lovable-final-v1.0
git push --tags
git push origin main
```

## Migration Process

### Step 1: Prepare HDA2 Monorepo

```bash
# In HDA2 repository
git checkout -b story/1.1-lovable-integration

# Create monorepo structure (excluding frontend)
mkdir -p backend shared scripts

# Create workspace package.json
cat > package.json << 'EOF'
{
  "name": "hda2-monorepo",
  "private": true,
  "workspaces": [
    "frontend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && uvicorn main:app --reload",
    "build": "npm run build:frontend",
    "build:frontend": "cd frontend && npm run build"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
```

### Step 2: Migrate Lovable Frontend

```bash
# Copy Lovable frontend
cp -r ../HDA2-FE ./frontend

# Remove Lovable's git history (we're tracking in main repo now)
rm -rf ./frontend/.git

# Check what we got
ls -la frontend/
```

### Step 3: Analyze Tech Stack Alignment

Create a comparison file:

```bash
# Check Lovable's package.json
cat frontend/package.json | grep -E "react|vite|typescript|tailwind"

# Document versions for comparison
cat > docs/lovable-tech-audit.md << 'EOF'
# Lovable Tech Stack Audit

## Current Lovable Stack
- React: [version from package.json]
- Vite: [version]
- TypeScript: [version]
- Tailwind: [version]
- Additional libraries: [list them]

## Target Stack (from tech-stack.md)
- React: 19.1.0
- Vite: 5.4.8
- TypeScript: 5.6.2
- Tailwind: 3.4.13

## Compatibility Notes
- [ ] Version differences that need attention
- [ ] Additional libraries to keep
- [ ] Libraries to replace/remove
EOF
```

### Step 4: Configure API Integration

```javascript
// frontend/src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  baseURL: API_BASE_URL,

  // Health check to test backend connection
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Wrap existing Lovable API calls
  async lovableEndpoint(data: any) {
    // Adapt Lovable's expected endpoints to our backend
    const response = await fetch(`${API_BASE_URL}/your-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### Step 5: Environment Variable Alignment

```bash
# Create frontend/.env.local
cat > frontend/.env.local << 'EOF'
# Backend API
VITE_API_URL=http://localhost:8000/api

# Supabase (from Lovable)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Any other Lovable variables
# Map them here with VITE_ prefix
EOF
```

### Step 6: Update Vite Configuration

```javascript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## Backend Setup for Lovable

### Create Minimal FastAPI Backend

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="HDA Translation Platform API")

# Configure CORS for Lovable frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternative port
        os.getenv("FRONTEND_URL", "*")  # Production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "HDA Translation Platform"}

# Add mock endpoints for Lovable features
@app.get("/api/documents")
async def get_documents():
    # Return mock data matching Lovable's expectations
    return {
        "documents": [
            {"id": 1, "name": "Sample.pdf", "status": "completed"},
            # Add structure matching your Lovable frontend
        ]
    }
```

## Docker Integration

```yaml
# docker-compose.yml (updated for Lovable)
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules  # Preserve node_modules
    environment:
      - VITE_API_URL=http://localhost:8000/api
    command: npm run dev

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/translation_platform
      - FRONTEND_URL=http://localhost:5173
    command: uvicorn main:app --reload --host 0.0.0.0
```

## Testing Integration

### 1. Test Lovable Frontend Standalone
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
# Document what works/what breaks
```

### 2. Test Backend API
```bash
cd ../backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
uvicorn main:app --reload
# Visit http://localhost:8000/api/health
```

### 3. Test Integrated System
```bash
# From root directory
docker-compose up
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Test if frontend can call backend
```

## Validation Checklist

### UI/UX Preservation
- [ ] All pages load without errors
- [ ] Styling looks correct (Tailwind classes work)
- [ ] Navigation between pages works
- [ ] Forms render correctly
- [ ] Modals/popups function
- [ ] Animations still work
- [ ] Responsive design intact

### Functionality Check
- [ ] Mock data displays correctly
- [ ] Buttons have correct handlers
- [ ] Form submissions work (even if just console.log)
- [ ] Authentication flow (if any) works
- [ ] File upload components render
- [ ] Search/filter features work

### API Integration
- [ ] Frontend can reach backend health endpoint
- [ ] CORS is properly configured
- [ ] Environment variables are loaded
- [ ] API client is configured correctly
- [ ] Error handling works

## Common Issues & Solutions

### Issue 1: Module Not Found Errors
```bash
# Solution: Clear and reinstall
rm -rf frontend/node_modules
cd frontend && npm install
```

### Issue 2: CORS Errors
```python
# Add to backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 3: Environment Variables Not Loading
```javascript
// Check vite.config.ts
console.log('API URL:', import.meta.env.VITE_API_URL);
// Should log: http://localhost:8000/api
```

### Issue 4: Lovable-Specific Dependencies Missing
```bash
# Compare package.json files
diff HDA2-FE/package.json frontend/package.json
# Install any missing dependencies
npm install [missing-package]
```

## Post-Migration Cleanup

### 1. Archive Original Repository
```bash
cd ../HDA2-FE
git add .
git commit -m "ARCHIVED: Migrated to HDA2 monorepo"
git push origin main

# Add archive notice to README
echo "# ARCHIVED - Moved to HDA2 Monorepo" > README.md
echo "This repository has been integrated into the main HDA2 repository." >> README.md
git add README.md
git commit -m "Add archive notice"
git push origin main
```

### 2. Update Documentation
```markdown
# frontend/README.md
# HDA2 Frontend

Originally generated with Lovable.dev and migrated to monorepo structure.

## Lovable Features
- [List features created in Lovable]

## Migration Date
- Migrated: [Date]
- Original repo: HDA2-FE (archived)
```

### 3. Create Refactoring Plan
```markdown
# docs/lovable-refactoring-plan.md
# Lovable Code Refactoring Plan

## Phase 1: Stabilization (Week 1-2)
- Fix any broken features
- Ensure all API connections work
- Add error boundaries

## Phase 2: Alignment (Week 3-4)
- Update to target React version
- Align with coding standards
- Add TypeScript strict mode

## Phase 3: Enhancement (Week 5-6)
- Add missing tests
- Improve performance
- Enhance error handling
```

## Success Metrics

Your integration is successful when:

1. ✅ All Lovable features work in new structure
2. ✅ Frontend and backend communicate properly
3. ✅ Docker runs both services together
4. ✅ You can develop with hot reload
5. ✅ Tests pass (when added)
6. ✅ Can deploy to production

## Next Steps

After successful integration:

1. Continue with Story 1.2 (PDF Upload & Storage)
2. Connect Lovable UI to real backend endpoints
3. Gradually refactor Lovable code to match standards
4. Add tests for Lovable components
5. Optimize performance and bundle size

---

Remember: The goal is to preserve your Lovable work while building a solid foundation for scaling. Take it step by step, and don't hesitate to keep Lovable patterns that work well!