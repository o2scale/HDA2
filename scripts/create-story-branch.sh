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