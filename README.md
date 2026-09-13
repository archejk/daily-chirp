# Daily Chirp

[![Daily Commit](https://github.com/archejk/daily-chirp/actions/workflows/daily-commit.yml/badge.svg)](https://github.com/archejk/daily-chirp/actions/workflows/daily-commit.yml)

Daily Chirp is a small Vue.js project for experimenting with GitHub Actions, scheduled automation, and Discord webhook alerts.

It started as a CI/CD practice project in 2024 and now includes a simple manager UI for turning automated commits on or off without digging through GitHub repository settings.

## Features

- Hourly GitHub Actions workflow for scheduled commit streak
- Manual workflow runs with an optional forced commit test
- Discord webhook alert after successful automated commits
- Password-protected Daily Chirp Manager UI
- Light and dark theme toggle with saved preference
- GitHub Actions repository variable toggle through `COMMIT_ENABLED`
- Netlify Function support for a hosted API
- Minimal Daily Chirp interface with a bird-inspired app mark

## Project History

- Created: [June 22, 2024](https://github.com/archejk/daily-chirp/commit/ce399f269b2e642a8f1a4faa585bdb1d356d3f79)
- Author: [JK](https://jkdevfolio.netlify.app/)
- GitHub: [archejk](https://github.com/archejk/daily-chirp/commits?author=archejk)
- Daily Chirp Manager improvement: ongoing

## How It Works

Daily Chirp has two pieces:

- A GitHub Actions workflow in `.github/workflows/daily-commit.yml`
- A Vue manager app that talks to a protected API endpoint at `/api/commit-toggle`

The manager updates the GitHub Actions repository variable named `COMMIT_ENABLED`.

When `COMMIT_ENABLED=true`, the scheduled workflow can create commits. When it is `false`, the workflow exits safely without committing.

The browser never receives the GitHub token. Local development uses a small Node.js API server, while deployed builds can use the included Netlify Function.

## Getting Started

Install dependencies:

```sh
npm install
```

Set the required local values in `.env`:

```text
GITHUB_OWNER=github_username_or_org
GITHUB_REPO=repository_name
GITHUB_TOKEN=fine_grained_github_pat
COMMIT_TOGGLE_VARIABLE=COMMIT_ENABLED
MANAGER_PASSWORD=private_manager_password
```

Start the API server:

```sh
npm run server
```

Start the Vue app in another terminal:

```sh
npm run serve
```

Open the local app URL, enter `MANAGER_PASSWORD`, and use the toggle.

## GitHub Token Permissions

For the manager API, use a fine-grained GitHub personal access token scoped to the repository you want to manage.

Required repository permissions:

- `Metadata`: read-only
- `Variables`: read and write

`COMMIT_ENABLED` is intentionally stored as a GitHub Actions repository variable instead of a secret because it is only a non-sensitive on/off toggle.

## Scripts

```sh
npm run serve
npm run server
npm run build
npm run lint
```

## Notes

GitHub can disable scheduled workflows in inactive public repositories. If automation appears to stop after a long pause, re-enable the workflow in GitHub Actions, confirm `COMMIT_ENABLED=true`, and run the workflow manually with `force_commit=true` to verify the full path
- Source: [GitHub Docs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows)
- Related issue: https://github.com/archejk/daily-chirp/issues/13
