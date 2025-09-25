# Git Infrastructure Setup Task for Alex (Infrastructure Agent)

## Task Overview

**Task ID:** INFRA-001  
**Priority:** P0 - Critical (Blocks all development)  
**Estimated Time:** 2-4 hours  
**Dependencies:** Repository access, GitHub admin permissions  
**Requester:** John (PM)  
**Date:** September 25, 2025  

## Executive Summary

Set up comprehensive Git infrastructure for the HDA2 project to support parallel development of 10 Epic 1 stories. This includes repository initialization, branch structure, protection rules, automation workflows, and developer tooling.

## Business Context

We have 10 stories in Epic 1 that need organized development:
- Some stories are sequential (1.0 → 1.1 → others)
- Some can be developed in parallel (1.2, 1.3, 1.4 and 1.7, 1.8)
- Multiple developers will work simultaneously
- We need clean tracking of which code implements which story

## Detailed Requirements

### 1. Repository Structure Setup

#### 1.1 Initialize Repository
```bash
# If not already done
git init
git remote add origin https://github.com/[org]/HDA2.git

# Create initial commit with existing code
git add .
git commit -m "chore: initial commit with infrastructure and documentation"
git push -u origin main
```

#### 1.2 Create Branch Hierarchy
```bash
# Create and push develop branch
git checkout -b develop
git push -u origin develop

# Create epic branch from develop
git checkout -b epic/1-mvp-foundation
git push -u origin epic/1-mvp-foundation

# Create story branches from epic branch
git checkout epic/1-mvp-foundation

# Story branches to create:
story/1.0-vertex-ai-setup
story/1.1-project-foundation-infrastructure  
story/1.2-pdf-upload-storage
story/1.3-vertex-ai-text-extraction
story/1.4-translation-pipeline
story/1.5-translation-editor-interface
story/1.6-export-download-system
story/1.7-user-management-authentication
story/1.8-processing-dashboard-queue
story/1.9-public-content-viewer
```

### 2. Protection Rules Configuration

#### 2.1 GitHub Branch Protection Settings

**For `main` branch:**
- ✅ Require pull request before merging
- ✅ Require 2 review approvals
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks (CI/CD pipeline)
- ✅ Require branches to be up to date
- ✅ Include administrators in restrictions
- ✅ Restrict who can push (only release manager)

**For `develop` branch:**
- ✅ Require pull request before merging
- ✅ Require 1 review approval
- ✅ Require status checks (tests, linting)
- ✅ Require branches to be up to date

**For `epic/*` branches:**
- ✅ Require pull request before merging
- ✅ Require 1 review approval
- ✅ Require status checks (tests)

### 3. Automation Setup

#### 3.1 Create GitHub Actions Workflow

**File:** `.github/workflows/pr-automation.yml`
```yaml
name: PR Automation

on:
  pull_request:
    types: [opened, edited, synchronize]
    branches:
      - develop
      - main
      - 'epic/**'

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate PR Title
        run: |
          # Check if PR title starts with [Story X.X]
          if [[ ! "${{ github.event.pull_request.title }}" =~ ^\[Story\ [0-9]\.[0-9]\] ]]; then
            echo "❌ PR title must start with [Story X.X]"
            exit 1
          fi
      
      - name: Check Branch Name
        run: |
          BRANCH=${{ github.head_ref }}
          if [[ ! "$BRANCH" =~ ^story/[0-9]\.[0-9]-.*$ ]]; then
            echo "❌ Branch name must follow pattern: story/X.X-description"
            exit 1
          fi
      
      - name: Label PR
        uses: actions/labeler@v4
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          
  run-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
        python-version: [3.13]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
          
      - name: Install Frontend Dependencies
        if: hashFiles('frontend/package.json') != ''
        run: |
          cd frontend
          npm ci
          
      - name: Run Frontend Tests
        if: hashFiles('frontend/package.json') != ''
        run: |
          cd frontend
          npm test
          
      - name: Install Backend Dependencies
        if: hashFiles('backend/requirements.txt') != ''
        run: |
          cd backend
          pip install -r requirements.txt
          
      - name: Run Backend Tests
        if: hashFiles('backend/requirements.txt') != ''
        run: |
          cd backend
          pytest
```

#### 3.2 Create PR Template

**File:** `.github/pull_request_template.md`
```markdown
## 📋 Story Information
**Story:** [Story X.X]
**Title:** [Story Title from PRD]
**Branch:** story/X.X-description

## ✅ Acceptance Criteria Checklist
<!-- Copy from story document -->
- [ ] AC1: 
- [ ] AC2: 
- [ ] AC3: 
- [ ] AC4: 
- [ ] AC5: 
- [ ] AC6: 
- [ ] AC7: 
- [ ] AC8: 

## 🔄 Changes Made
<!-- Describe what was implemented -->
- 
- 
- 

## 🧪 Testing
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Manual testing performed
- [ ] Test coverage >80%

## 📸 Screenshots/Demo
<!-- Add screenshots or recordings if applicable -->

## 🔗 Related Issues
Closes #[issue-number]

## ⚠️ Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes documented below:

## 📝 Deployment Notes
<!-- Any special deployment instructions -->

## ✔️ Final Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No sensitive data committed
- [ ] Branch is up to date with target branch
```

### 4. Developer Tooling

#### 4.1 Create Git Hooks

**File:** `.githooks/commit-msg`
```bash
#!/bin/bash
# Validate commit message format

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\([0-9]\.[0-9]\))?:\ .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit format!"
    echo "📝 Format: type(story): description"
    echo "📝 Example: feat(1.3): add text extraction service"
    echo "📝 Types: feat|fix|docs|style|refactor|test|chore"
    exit 1
fi
```

**Setup script:** `scripts/setup-git-hooks.sh`
```bash
#!/bin/bash
echo "Setting up Git hooks..."
cp .githooks/* .git/hooks/
chmod +x .git/hooks/*
echo "✅ Git hooks installed!"
```

#### 4.2 Create Developer Helper Scripts

**File:** `scripts/create-story-branch.sh`
```bash
#!/bin/bash
# Helper script for developers to create story branches

if [ "$#" -ne 2 ]; then
    echo "Usage: ./scripts/create-story-branch.sh <story-number> <description>"
    echo "Example: ./scripts/create-story-branch.sh 1.3 text-extraction"
    exit 1
fi

STORY_NUM=$1
DESCRIPTION=$2
BRANCH_NAME="story/${STORY_NUM}-${DESCRIPTION}"

echo "🚀 Creating story branch: $BRANCH_NAME"

# Ensure we're on epic branch and up to date
git checkout epic/1-mvp-foundation
git pull origin epic/1-mvp-foundation

# Create and checkout new branch
git checkout -b "$BRANCH_NAME"

# Push to remote
git push -u origin "$BRANCH_NAME"

echo "✅ Branch created and pushed!"
echo "📝 You're now on branch: $BRANCH_NAME"
echo "💡 Start developing Story ${STORY_NUM}!"
```

**File:** `scripts/update-from-epic.sh`
```bash
#!/bin/bash
# Update current story branch with latest from epic

CURRENT_BRANCH=$(git branch --show-current)

if [[ ! "$CURRENT_BRANCH" =~ ^story/.* ]]; then
    echo "❌ Not on a story branch!"
    exit 1
fi

echo "📥 Updating $CURRENT_BRANCH from epic/1-mvp-foundation..."

# Fetch latest
git fetch origin

# Merge epic branch
git merge origin/epic/1-mvp-foundation

echo "✅ Branch updated!"
```

### 5. Documentation

#### 5.1 Create CONTRIBUTING.md

**File:** `CONTRIBUTING.md`
```markdown
# Contributing to HDA2 Project

## 🌳 Branch Structure

```
main (production)
├── develop (integration)
│   └── epic/1-mvp-foundation
│       ├── story/1.0-vertex-ai-setup
│       ├── story/1.1-project-foundation-infrastructure
│       └── ... (other story branches)
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/[org]/HDA2.git
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

- **NEVER** commit directly to `main` or `develop`
- **ALWAYS** create PRs for code review
- **UPDATE** from epic branch regularly
- **TEST** locally before pushing
```

### 6. Initial Setup Script

#### 6.1 Complete Setup Script for Alex

**File:** `infrastructure/scripts/complete-git-setup.sh`
```bash
#!/bin/bash
# Complete Git Infrastructure Setup Script
# Run this once to set up entire Git structure

set -e  # Exit on error

echo "🚀 HDA2 Git Infrastructure Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${YELLOW}📝 $1${NC}"; }

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Not in HDA2 root directory!"
    exit 1
fi

# Step 1: Create branch structure
print_info "Creating branch structure..."

# Create develop branch if not exists
if ! git show-ref --verify --quiet refs/heads/develop; then
    git checkout -b develop
    git push -u origin develop
    print_success "Created develop branch"
else
    print_info "Develop branch already exists"
fi

# Create epic branch
git checkout develop
if ! git show-ref --verify --quiet refs/heads/epic/1-mvp-foundation; then
    git checkout -b epic/1-mvp-foundation
    git push -u origin epic/1-mvp-foundation
    print_success "Created epic/1-mvp-foundation branch"
else
    print_info "Epic branch already exists"
fi

# Step 2: Create all story branches
print_info "Creating story branches..."

git checkout epic/1-mvp-foundation

declare -a stories=(
    "1.0-vertex-ai-setup"
    "1.1-project-foundation-infrastructure"
    "1.2-pdf-upload-storage"
    "1.3-vertex-ai-text-extraction"
    "1.4-translation-pipeline"
    "1.5-translation-editor-interface"
    "1.6-export-download-system"
    "1.7-user-management-authentication"
    "1.8-processing-dashboard-queue"
    "1.9-public-content-viewer"
)

for story in "${stories[@]}"; do
    branch_name="story/${story}"
    
    if ! git show-ref --verify --quiet refs/heads/${branch_name}; then
        git checkout -b "${branch_name}"
        
        # Create a marker file for the story
        echo "# Story ${story}" > ".story-${story}.md"
        echo "This branch is for implementing Story ${story}" >> ".story-${story}.md"
        git add ".story-${story}.md"
        git commit -m "chore: initialize story branch ${story}"
        
        git push -u origin "${branch_name}"
        print_success "Created branch: ${branch_name}"
        
        git checkout epic/1-mvp-foundation
    else
        print_info "Branch ${branch_name} already exists"
    fi
done

# Step 3: Create GitHub Actions directory
print_info "Setting up GitHub Actions..."
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

# Step 4: Create scripts directory
print_info "Creating developer scripts..."
mkdir -p scripts

# Make scripts executable
if [ -d "scripts" ]; then
    chmod +x scripts/*.sh 2>/dev/null || true
    print_success "Scripts created and made executable"
fi

# Step 5: Create git hooks directory
print_info "Setting up Git hooks..."
mkdir -p .githooks

if [ -f ".githooks/commit-msg" ]; then
    cp .githooks/* .git/hooks/ 2>/dev/null || true
    chmod +x .git/hooks/* 2>/dev/null || true
    print_success "Git hooks installed"
fi

# Step 6: Return to epic branch
git checkout epic/1-mvp-foundation

# Step 7: Summary
echo ""
echo "================================="
print_success "Git Infrastructure Setup Complete!"
echo "================================="
echo ""
echo "📋 Summary:"
echo "  - Main branch: protected"
echo "  - Develop branch: created"
echo "  - Epic branch: epic/1-mvp-foundation"
echo "  - Story branches: 10 created"
echo "  - GitHub Actions: configured"
echo "  - Developer scripts: ready"
echo ""
echo "🎯 Next Steps:"
echo "  1. Configure branch protection in GitHub settings"
echo "  2. Add team members as collaborators"
echo "  3. Start development on Story 1.0 (Vertex AI Setup)"
echo ""
echo "📝 Developers should:"
echo "  1. Read CONTRIBUTING.md"
echo "  2. Use scripts/create-story-branch.sh for new work"
echo "  3. Follow commit conventions: type(story): description"
echo ""
print_success "Happy coding! 🚀"
```

## Acceptance Criteria

- [ ] Repository has proper branch structure (main → develop → epic → stories)
- [ ] All 10 story branches are created
- [ ] Branch protection rules are configured in GitHub
- [ ] GitHub Actions workflow is functional
- [ ] PR template is in place
- [ ] Developer scripts are executable and working
- [ ] CONTRIBUTING.md provides clear guidance
- [ ] Commit hooks validate message format
- [ ] Team can successfully create PRs using the new structure

## Testing

1. **Test branch creation:**
   ```bash
   ./scripts/create-story-branch.sh 1.10 test-story
   # Should create story/1.10-test-story branch
   ```

2. **Test commit hook:**
   ```bash
   git commit -m "bad message"  # Should fail
   git commit -m "feat(1.3): good message"  # Should pass
   ```

3. **Test PR automation:**
   - Create PR with wrong title format (should fail checks)
   - Create PR with correct format (should pass)

## Rollback Plan

If issues arise:
```bash
# Save current state
git branch --all > branches-backup.txt

# If needed, delete story branches
for i in {0..9}; do
  git push origin --delete story/1.${i}-*
done

# Reset to main
git checkout main
git branch -D epic/1-mvp-foundation
git push origin --delete epic/1-mvp-foundation
```

## Success Metrics

- ✅ All developers can work on separate story branches
- ✅ No merge conflicts between parallel stories
- ✅ Clear tracking of story implementation
- ✅ Automated testing on all PRs
- ✅ Clean Git history with meaningful commits

## Support

If you encounter issues:
1. Check the setup script output for errors
2. Verify GitHub permissions
3. Contact John (PM) for requirements clarification
4. Review CONTRIBUTING.md for workflow guidance

---

**Approval Required From:**
- [ ] John (PM) - Requirements confirmed
- [ ] Development Team Lead - Technical approach approved
- [ ] Repository Admin - Permissions granted

**Once complete, notify:**
- All developers on the team
- QA team for testing workflow
- John (PM) for story assignment

---

*Task created by: John (Product Manager)*  
*Date: September 25, 2025*  
*Priority: P0 - Blocks all story development*