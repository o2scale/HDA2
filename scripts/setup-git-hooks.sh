#!/bin/bash
echo "Setting up Git hooks..."
cp .githooks/* .git/hooks/
chmod +x .git/hooks/*
echo "✅ Git hooks installed!"