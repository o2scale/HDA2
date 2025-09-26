# HDA Translation Platform - Frontend

**Source:** Generated from Lovable.dev AI platform
**Original Repository:** https://github.com/o2scale/token-forge-dash.git
**Purpose:** Frontend UI for HDA Translation Platform
**Framework:** React + TypeScript + Vite + Tailwind CSS

## 📁 Directory Structure

This is the frontend application for the HDA Translation Platform, generated using Lovable.dev AI platform. It provides the user interface for:

- Document upload and management
- Translation editor interface
- Glossary management system
- User dashboard
- Export functionality

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔗 Integration Points

This frontend connects to the HDA backend API:
- API Base URL: Set in environment variables
- Authentication: Supabase Auth
- File Upload: Supabase Storage / S3
- Real-time Updates: Supabase Realtime

## 📋 Development Notes

### Current Implementation Status
- ✅ Basic UI components created
- ✅ Routing structure defined
- ✅ Tailwind CSS configured
- ⏳ Needs API integration
- ⏳ Needs authentication setup
- ⏳ Needs state management setup

### Next Steps for Developers
1. Review existing components in `src/components`
2. Connect to backend API endpoints
3. Implement Supabase authentication
4. Add state management (Redux/Zustand)
5. Implement file upload functionality

## 🔧 Environment Variables

Create a `.env` file with:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:8000
```

## 📝 Important Files

- `src/App.tsx` - Main application component
- `src/pages/` - Page components
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and API clients
- `tailwind.config.ts` - Tailwind CSS configuration

## 🎨 UI Features Implemented

Based on the HDA requirements, this frontend includes:
- Document upload interface
- Translation editor with side-by-side view
- Glossary management system
- User dashboard
- Export options
- Responsive design for all devices

## 🔄 Git Integration

This frontend is part of the HDA2 repository structure:
```
HDA2/
├── frontend-hda/     ← You are here
├── backend/          ← FastAPI backend
├── docs/            ← Documentation
└── infrastructure/  ← Docker & K8s configs
```

## 👥 For Developers

This frontend was AI-generated as a starting point. You'll need to:
1. Review and refactor the generated code
2. Connect it to the actual backend APIs
3. Implement proper error handling
4. Add loading states and optimistic updates
5. Test all functionality

---

**Note:** This is AI-generated code from Lovable.dev and serves as a foundation. Review and test thoroughly before production use.