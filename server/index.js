const http = require('http')
const fs = require('fs')
const path = require('path')
const { getCommitToggle, updateCommitToggle } = require('./githubVariables')

loadEnv()

const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3001

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env')

  if (!fs.existsSync(envPath)) {
    return
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      return
    }

    const [key, ...valueParts] = trimmed.split('=')
    const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  })
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Origin': process.env.CLIENT_ORIGIN || 'http://localhost:8080',
    'Content-Type': 'application/json'
  })
  response.end(JSON.stringify(body))
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
    })

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
  })
}

function handleError(response, error) {
  const status = error.status || 500

  sendJson(response, status, {
    error: error.message || 'Unexpected server error',
    details: error.details || null
  })
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  try {
    if (request.url === '/api/commit-toggle' && request.method === 'GET') {
      sendJson(response, 200, await getCommitToggle())
      return
    }

    if (request.url === '/api/commit-toggle' && request.method === 'PUT') {
      const body = await readJson(request)

      if (typeof body.enabled !== 'boolean') {
        sendJson(response, 400, { error: 'Request body must include a boolean enabled value.' })
        return
      }

      sendJson(response, 200, await updateCommitToggle(body.enabled))
      return
    }

    sendJson(response, 404, { error: 'Not found' })
  } catch (error) {
    handleError(response, error)
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Daily Commit Manager API running on http://${HOST}:${PORT}`)
})
