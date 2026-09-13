const GITHUB_API_VERSION = '2026-03-10'
const GITHUB_ACCEPT = 'application/vnd.github+json'

function getConfig() {
  return {
    owner: process.env.GITHUB_OWNER || 'archejk',
    repo: process.env.GITHUB_REPO || 'daily-chirp',
    token: process.env.GITHUB_TOKEN || process.env.ACTIONS_PAT,
    variableName: process.env.COMMIT_TOGGLE_VARIABLE || 'COMMIT_ENABLED'
  }
}

function requireToken(token) {
  if (!token) {
    const error = new Error('Missing GITHUB_TOKEN. Add a fine-grained GitHub PAT to your local .env file.')
    error.status = 500
    throw error
  }
}

async function githubRequest(path, options = {}) {
  const { token } = getConfig()
  requireToken(token)

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: GITHUB_ACCEPT,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
      ...options.headers
    }
  })

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    const error = new Error(body && body.message ? body.message : 'GitHub API request failed')
    error.status = response.status
    error.details = body
    throw error
  }

  return body
}

function variablePath() {
  const { owner, repo, variableName } = getConfig()
  return `/repos/${owner}/${repo}/actions/variables/${encodeURIComponent(variableName)}`
}

async function getCommitToggle() {
  const { owner, repo, variableName } = getConfig()

  try {
    const variable = await githubRequest(variablePath())
    return {
      owner,
      repo,
      name: variable.name,
      enabled: variable.value === 'true',
      value: variable.value,
      updatedAt: variable.updated_at
    }
  } catch (error) {
    if (error.status === 404) {
      return {
        owner,
        repo,
        name: variableName,
        enabled: false,
        value: null,
        updatedAt: null,
        missing: true
      }
    }

    throw error
  }
}

async function updateCommitToggle(enabled) {
  const { owner, repo, variableName } = getConfig()
  const value = enabled ? 'true' : 'false'

  try {
    await githubRequest(variablePath(), {
      method: 'PATCH',
      body: JSON.stringify({ name: variableName, value })
    })
  } catch (error) {
    if (error.status !== 404) {
      throw error
    }

    await githubRequest(`/repos/${owner}/${repo}/actions/variables`, {
      method: 'POST',
      body: JSON.stringify({ name: variableName, value })
    })
  }

  return getCommitToggle()
}

module.exports = {
  getCommitToggle,
  updateCommitToggle
}
