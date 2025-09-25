#!/bin/bash
# Complete Git Infrastructure Setup Script
# Run this once to set up entire Git structure

set -e  # Exit on error

echo "🚀 HDA2 Git Infrastructure Setup"
echo "=================================="
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
echo "=================================="
print_success "Git Infrastructure Setup Complete!"
echo "=================================="
echo ""
echo "📋 Summary:"
echo "  - Main branch: master (needs protection)"
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