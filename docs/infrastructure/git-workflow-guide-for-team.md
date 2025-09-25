# Git Workflow Guide for HDA2 Development Team

**Document Version:** 1.0
**Date:** September 25, 2025
**Prepared By:** Alex (Infrastructure)
**For:** John (PM) and Development Team

---

## 🎯 Executive Summary

The Git infrastructure for HDA2 is now fully configured to support parallel development of Epic 1's 10 stories. This guide provides everything developers need to start working immediately.

## 📊 Current Status

### ✅ What's Ready
- **Repository:** https://github.com/o2scale/HDA2
- **Branch Structure:** Complete hierarchy created
- **Automation:** PR validation and testing configured
- **Developer Tools:** Helper scripts ready
- **Documentation:** CONTRIBUTING.md available

### ⏳ Pending (Requires GitHub Admin)
- Branch protection rules need to be configured in GitHub settings
- Team members need repository access

---

## 🌳 Branch Structure

```
master (production - protected)
│
├── develop (integration - protected)
│   │
│   └── epic/1-mvp-foundation (epic branch)
│       │
│       ├── story/1.0-vertex-ai-setup ← START HERE (BLOCKER)
│       ├── story/1.1-project-foundation-infrastructure
│       ├── story/1.2-pdf-upload-storage
│       ├── story/1.3-vertex-ai-text-extraction
│       ├── story/1.4-translation-pipeline
│       ├── story/1.5-translation-editor-interface
│       ├── story/1.6-export-download-system
│       ├── story/1.7-user-management-authentication
│       ├── story/1.8-processing-dashboard-queue
│       └── story/1.9-public-content-viewer
```

---

## 🚀 Developer Quick Start

### 1. Initial Setup (One-Time)

```bash
# Clone repository
git clone https://github.com/o2scale/HDA2.git
cd HDA2

# Install git hooks
./scripts/setup-git-hooks.sh

# Switch to your assigned story branch
git checkout story/1.X-your-story-name
```

### 2. Daily Workflow

```bash
# Start your day - update from epic branch
./scripts/update-from-epic.sh

# Make changes and commit
git add .
git commit -m "feat(1.X): implement feature description"

# Push your changes
git push origin story/1.X-your-story-name
```

### 3. Creating Pull Request

1. Go to: https://github.com/o2scale/HDA2
2. Click "Pull requests" → "New pull request"
3. Set base: `epic/1-mvp-foundation`
4. Set compare: `story/1.X-your-story`
5. Title: `[Story 1.X] Your Story Title`
6. Fill out the PR template completely

---

## 📋 Story Assignment & Dependencies

### 🔴 Critical Path (Sequential)
These MUST be done in order:

| Story | Title | Assigned To | Status | Dependency |
|-------|-------|------------|---------|------------|
| **1.0** | Vertex AI Setup | _________ | 🔴 BLOCKER | None - START HERE |
| **1.1** | Infrastructure | _________ | Blocked | Needs 1.0 |

### 🟡 Parallel Track 1
Can start after 1.1 is complete:

| Story | Title | Assigned To | Status |
|-------|-------|------------|---------|
| **1.2** | PDF Upload & Storage | _________ | Blocked |
| **1.3** | Text Extraction | _________ | Blocked |
| **1.4** | Translation Pipeline | _________ | Blocked |

### 🟢 Parallel Track 2
Can start after 1.1 is complete:

| Story | Title | Assigned To | Status |
|-------|-------|------------|---------|
| **1.7** | User Management | _________ | Blocked |
| **1.8** | Dashboard | _________ | Blocked |
| **1.9** | Public Viewer | _________ | Blocked |

### 🔵 Final Integration
Must wait for other stories:

| Story | Title | Assigned To | Depends On |
|-------|-------|------------|------------|
| **1.5** | Editor Interface | _________ | 1.3 + 1.4 |
| **1.6** | Export System | _________ | 1.5 |

---

## ⚙️ Automated Checks

Every PR will automatically run:

1. **PR Title Check** - Must start with `[Story X.X]`
2. **Branch Name Check** - Must be `story/X.X-description`
3. **Frontend Tests** - If frontend code changed
4. **Backend Tests** - If backend code changed
5. **Commit Message Check** - Format: `type(story): description`

---

## 📝 Commit Message Convention

```
feat(1.3): add text extraction service     ✅ Good
fix(1.2): resolve upload timeout issue     ✅ Good
feat: add new feature                      ❌ Bad - missing story number
added extraction service                   ❌ Bad - missing type and story
```

**Types:** feat | fix | docs | style | refactor | test | chore

---

## 🛠️ Helper Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/setup-git-hooks.sh` | Install commit validation | Run once after cloning |
| `scripts/update-from-epic.sh` | Pull latest changes | Run daily before work |
| `scripts/create-story-branch.sh` | Create new story branch | For new stories only |

---

## 🚨 Important Rules

### DO's ✅
- Always work on your assigned story branch
- Update from epic branch daily
- Create PRs for all changes
- Follow commit message format
- Complete PR template
- Test locally before pushing

### DON'Ts ❌
- Never commit directly to master or develop
- Don't work on someone else's story branch
- Don't merge without PR approval
- Don't skip the PR template
- Don't force push to shared branches

---

## 📊 Development Flow Diagram

```
1. Developer assigned Story 1.3
         ↓
2. Checkout story/1.3-text-extraction
         ↓
3. Update from epic/1-mvp-foundation
         ↓
4. Implement features
         ↓
5. Commit with proper format
         ↓
6. Push to origin
         ↓
7. Create PR to epic branch
         ↓
8. Automated checks run
         ↓
9. Code review
         ↓
10. Merge to epic branch
         ↓
11. Ready for next story
```

---

## 🔥 Troubleshooting

### Problem: Can't push to branch
```bash
# Solution: Pull latest changes first
git pull origin story/1.X-your-story
# Resolve any conflicts
git push origin story/1.X-your-story
```

### Problem: Commit rejected by hook
```bash
# Solution: Use correct format
git commit -m "feat(1.3): your message here"
```

### Problem: PR checks failing
- Check PR title starts with `[Story X.X]`
- Ensure branch name follows pattern
- Run tests locally first

---

## 📞 Support & Questions

### For Git Issues
- Check CONTRIBUTING.md first
- Contact Alex (Infrastructure)

### For Story Requirements
- Review story document in `docs/stories/`
- Contact John (PM)

### For Code Review
- Tag senior developer in PR
- Follow PR template checklist

---

## 🎯 Next Steps for PM

1. **Assign developers to stories** (fill in table above)
2. **Share this document** with all developers
3. **Ensure GitHub access** for all team members
4. **Schedule kickoff** for Story 1.0 (Vertex AI Setup)
5. **Set up daily standups** to track progress

---

## 📅 Recommended Timeline

### Week 1
- Day 1-2: Story 1.0 (Vertex AI Setup)
- Day 3-5: Story 1.1 (Infrastructure)

### Week 2
- Start parallel tracks:
  - Team A: Stories 1.2, 1.3, 1.4
  - Team B: Stories 1.7, 1.8, 1.9

### Week 3
- Story 1.5 (Editor)
- Story 1.6 (Export)
- Integration testing

---

## ✅ Checklist for Developers

Before starting development:
- [ ] Repository cloned
- [ ] Git hooks installed
- [ ] Assigned to a story
- [ ] On correct branch
- [ ] Reviewed story requirements
- [ ] Understand dependencies

Before creating PR:
- [ ] All tests pass locally
- [ ] Commit messages follow format
- [ ] PR title starts with [Story X.X]
- [ ] PR template completed
- [ ] No merge conflicts

---

## 📋 Quick Reference

**Repository:** https://github.com/o2scale/HDA2
**Main Documentation:** `CONTRIBUTING.md`
**Story Documents:** `docs/stories/`
**PR Template:** Auto-loads when creating PR
**Commit Format:** `type(story): description`

---

*This document should be shared with all developers before they begin work. Please update the assignment table and redistribute as team members are assigned to stories.*