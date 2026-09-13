# DailyChirp/GreenStreak
A Vue.js project designed to practice about CI/CD principles, GitHub Actions and Webhook

## Description
- A GitHub Actions workflow that reflects the continuous streak of contributions to Vue.js project.
- This helps maintain a green GitHub contributions calendar by ensuring there is at least one commit every day. Ideal for practicing CI/CD workflows and learning about GitHub Actions.

## Daily Commit Manager

The Vue app now includes a Daily Commit Manager UI that can turn scheduled commits on or off by updating the repository Actions variable named `COMMIT_ENABLED`.

The manager uses a small local Node.js backend so the GitHub token stays out of the browser.

### Current GitHub API prerequisite

Use a fine-grained personal access token for the backend with access to this repository and these repository permissions:

- `Variables`: read and write
- `Metadata`: read

The old approach of updating `COMMIT_ENABLED` as a GitHub Actions secret still works, but it is no longer the best fit for this toggle. `COMMIT_ENABLED` is not sensitive, so the workflow reads it from repository Variables first and falls back to the old secret only for compatibility.

### Run the manager locally

1. Copy the example environment file:

```sh
cp .env.example .env
```

2. Edit `.env` and replace `GITHUB_TOKEN` with your fine-grained GitHub PAT.

3. Start the backend:

```sh
npm run server
```

4. In another terminal, start the Vue app:

```sh
npm run serve
```

5. Open the local Vue URL and use the toggle to enable or disable scheduled commits.

Do not commit `.env`. It contains your GitHub token and is ignored by git.

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

## How to restart automated commits after a long pause

If automated commits stopped for a long time, GitHub may have disabled the scheduled workflow because the public repository had no recent activity. GitHub can disable scheduled workflows after 60 days of repository inactivity.

Follow these steps to make the auto commit work again:

1. Confirm you are in the correct GitHub repository.
   - Repository: `archejk/daily-chirp`
   - Branch: `main`
   - Workflow file: `.github/workflows/daily-commit.yml`

2. Commit and push the latest workflow file changes.
   - The workflow should include `workflow_dispatch` so it can be run manually.
   - The workflow should include `permissions: contents: write` so GitHub Actions can push commits.
   - The workflow should use `actions/checkout@v4`.

3. Open the repository on GitHub.
   - Go to `https://github.com/archejk/daily-chirp`
   - Click the `Actions` tab.
   - Click `Dynamic Daily Commits` in the left sidebar.

4. Re-enable the workflow if GitHub shows it as disabled.
   - Click the `...` menu near the workflow title.
   - Click `Enable workflow`.
   - If there is a large warning banner, use the button in the banner to enable the workflow.

5. Set the commit toggle.
   - Go to `Settings`.
   - Go to `Secrets and variables`.
   - Click `Actions`.
   - Open the `Variables` tab.
   - Add or update a repository variable:
     - Name: `COMMIT_ENABLED`
     - Value: `true`

6. Keep the Discord webhook as a secret if Discord alerts are still needed.
   - Go to `Settings`.
   - Go to `Secrets and variables`.
   - Click `Actions`.
   - Open the `Secrets` tab.
   - Add or update:
     - Name: `DISCORD_WEBHOOK_URL`
     - Value: your Discord webhook URL
   - GitHub does not show existing secret values after they are saved. A blank value field while editing a secret is normal.

7. Check GitHub Actions workflow permissions.
   - Go to `Settings`.
   - Go to `Actions`.
   - Click `General`.
   - Under `Workflow permissions`, select `Read and write permissions`.
   - Click `Save`.

8. Test the workflow manually.
   - Go to `Actions`.
   - Click `Dynamic Daily Commits`.
   - Click `Run workflow`.
   - Choose branch `main`.
   - Set `force_commit` to `true` for the first test run.
   - Click the green `Run workflow` button.

9. Read the workflow logs.
   - If the log says `Commits are disabled via COMMIT_ENABLED secret`, set `COMMIT_ENABLED` to `true`.
   - If the log says `Skipping commit for this run as threshold not met`, the workflow is working but the random 25% commit chance skipped that run.
   - If the log fails at `git push`, check that `permissions: contents: write` is in the workflow and repository workflow permissions are set to `Read and write permissions`.

10. Wait for the scheduled run.
   - The current schedule runs once per hour.
   - The workflow commits only when the random threshold is met.
   - With the current threshold, it should average about 6 commits per day, but some hours will intentionally skip.
