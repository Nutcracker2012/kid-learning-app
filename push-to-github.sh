#!/bin/bash

# Script to push this project to GitHub
# Usage: ./push-to-github.sh <your-github-username> <repository-name>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <your-github-username> <repository-name>"
    echo "Example: $0 myusername kid-learning-app"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "Adding remote origin: ${REMOTE_URL}"
git remote add origin ${REMOTE_URL}

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "Done! Your repository is now at: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
