# DailyChirp/GreenStreak
A Vue.js project designed to practice about CI/CD principles, GitHub Actions and Webhook

## Description
- A GitHub Actions workflow that reflects the continuous streak of contributions to Vue.js project.
- This helps maintain a green GitHub contributions calendar by ensuring there is at least one commit every day. Ideal for practicing CI/CD workflows and learning about GitHub Actions.

## Added features/changes
- Implement a Discord notification to alert you whenever a successful commit is made by integrating a Discord webhook into your GitHub Actions workflow.
   - Ticket: [[daily-chirp] implement a discord alert](https://github.com/archejk/daily-chirp/issues/10)
- Added a mechanism to control whether the workflow should run based on a configurable schedule, and whether it should be turned on or off. This can be achieved by using environment variables or repository secrets to control the workflow's behavior.
   - Ticket: [[daily-chirp] add a schedule control mechanism](https://github.com/archejk/daily-chirp/issues/8)
- Cron Schedule
   - Ticket: https://github.com/archejk/daily-chirp/issues/1 

# Summary
## Repository Settings
- Ensured that Read and Write permissions were selected for workflow permissions in the repository settings.

## GitHub Actions Workflow
- Used the `GITHUB_TOKEN` provided by GitHub Actions to authenticate and push commits.

## Final workflow file for reference:

### Set Up GitHub Actions Workflow
1. Create the .github/workflows Directory:
```
mkdir -p .github/workflows
```

2. Create the Workflow File. Create a file named `daily-commit.yml` in the `.github/workflows` directory:

```yml
name: Daily Commit

on:
  schedule:
    - cron: '0 0 * * *'  # runs at midnight every day
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2
      with:
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Make a commit
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        git config --global user.name 'archejk'
        git config --global user.email 'jkarche13@gmail.com'
        echo "Daily update $(date)" >> daily_commit.txt
        git add daily_commit.txt
        git commit -m "Daily commit $(date)"
        git push https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/archejk/daily-chirp.git HEAD:main
```

## What's Next?
Now that your workflow is working, you should see daily commits in your repository, which will keep your GitHub contributions calendar green. 

## How often this daily commits do a commit?
- The daily commits are scheduled to run once a day at midnight UTC. This is specified in the workflow file using the cron schedule:

```yml
on:
  schedule:
    - cron: '0 0 * * *'  # runs at midnight every day
```

## Status
[![Daily Commit](https://github.com/archejk/daily-chirp/actions/workflows/daily-commit.yml/badge.svg)](https://github.com/archejk/daily-chirp/actions/workflows/daily-commit.yml)
