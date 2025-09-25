# Contributing to HDA2 Project

## 🌳 Branch Structure

```
master (production)
├── develop (integration)
│   └── epic/1-mvp-foundation
│       ├── story/1.0-vertex-ai-setup
│       ├── story/1.1-project-foundation-infrastructure
│       └── ... (other story branches)
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/o2scale/HDA2.git
   cd HDA2
   ```

2. **Set up Git hooks**
   ```bash
   ./scripts/setup-git-hooks.sh
   ```

3. **Create your story branch**
   ```bash
   ./scripts/create-story-branch.sh 1.3 text-extraction
   ```

## 📝 Commit Convention

Format: `type(story): description`

Examples:
- `feat(1.3): add text extraction service`
- `fix(1.2): resolve file upload timeout`
- `docs(1.5): update editor component API`
- `test(1.4): add translation pipeline tests`

## 🔄 Development Workflow

1. **Start from epic branch**
   ```bash
   git checkout epic/1-mvp-foundation
   git pull origin epic/1-mvp-foundation
   ```

2. **Create story branch**
   ```bash
   ./scripts/create-story-branch.sh 1.3 text-extraction
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(1.3): implement vertex ai integration"
   ```

4. **Keep branch updated**
   ```bash
   ./scripts/update-from-epic.sh
   ```

5. **Push changes**
   ```bash
   git push origin story/1.3-text-extraction
   ```

6. **Create Pull Request**
   - Title: `[Story 1.3] Vertex AI Text Extraction Integration`
   - Target: `epic/1-mvp-foundation`
   - Fill out PR template

## 📋 Story Development Order

### Sequential (Must be done in order):
1. Story 1.0 - Vertex AI Setup (BLOCKER)
2. Story 1.1 - Infrastructure
3. Story 1.5 - Editor (after 1.3 & 1.4)
4. Story 1.6 - Export (after 1.5)

### Parallel Track 1:
- Story 1.2 - Upload & Storage
- Story 1.3 - Text Extraction
- Story 1.4 - Translation Pipeline

### Parallel Track 2:
- Story 1.7 - User Management
- Story 1.8 - Dashboard
- Story 1.9 - Public Viewer

## ✅ PR Checklist

- [ ] Branch follows naming convention
- [ ] Commits follow convention
- [ ] All tests pass
- [ ] PR template completed
- [ ] Linked to story issue
- [ ] No merge conflicts

## 🚨 Important Notes

- **NEVER** commit directly to `master` or `develop`
- **ALWAYS** create PRs for code review
- **UPDATE** from epic branch regularly
- **TEST** locally before pushing