const { verifyManagerPassword } = require('../../server/auth')
const { getCommitToggle, updateCommitToggle } = require('../../server/githubVariables')

const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, X-Manager-Password',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Origin': process.env.CLIENT_ORIGIN || '*',
  'Content-Type': 'application/json'
}

function json(statusCode, body) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  }
}

function handleError(error) {
  return json(error.status || 500, {
    error: error.message || 'Unexpected server error',
    details: error.details || null
  })
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    }
  }

  try {
    verifyManagerPassword(event.headers)

    if (event.httpMethod === 'GET') {
      return json(200, await getCommitToggle())
    }

    if (event.httpMethod === 'PUT') {
      const body = event.body ? JSON.parse(event.body) : {}

      if (typeof body.enabled !== 'boolean') {
        return json(400, { error: 'Request body must include a boolean enabled value.' })
      }

      return json(200, await updateCommitToggle(body.enabled))
    }

    return json(405, { error: 'Method not allowed' })
  } catch (error) {
    return handleError(error)
  }
}
