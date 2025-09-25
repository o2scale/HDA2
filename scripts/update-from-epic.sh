#!/bin/bash
# Update current story branch with latest from epic

CURRENT_BRANCH=$(git branch --show-current)

if [[ ! "$CURRENT_BRANCH" =~ ^story/.* ]]; then
    echo "❌ Not on a story branch!"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

echo "📥 Updating $CURRENT_BRANCH from epic/1-mvp-foundation..."

# Fetch latest
git fetch origin

# Merge epic branch
git merge origin/epic/1-mvp-foundation

if [ $? -eq 0 ]; then
    echo "✅ Branch updated successfully!"
else
    echo "⚠️  Merge conflicts detected. Please resolve them manually."
    exit 1
fi