const crypto = require('crypto')

function getManagerPassword() {
  return process.env.MANAGER_PASSWORD
}

function readHeader(headers, name) {
  const normalizedName = name.toLowerCase()
  const headerName = Object.keys(headers || {}).find((key) => key.toLowerCase() === normalizedName)

  return headerName ? headers[headerName] : ''
}

function verifyManagerPassword(headers) {
  const managerPassword = getManagerPassword()
  const suppliedPassword = readHeader(headers, 'x-manager-password')

  if (!managerPassword) {
    const error = new Error('Missing MANAGER_PASSWORD. Add it to your environment variables.')
    error.status = 500
    throw error
  }

  if (!safeEqual(suppliedPassword, managerPassword)) {
    const error = new Error('Invalid manager password.')
    error.status = 401
    throw error
  }
}

function safeEqual(value, expectedValue) {
  const valueBuffer = Buffer.from(value || '')
  const expectedBuffer = Buffer.from(expectedValue || '')

  if (valueBuffer.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer)
}

module.exports = {
  verifyManagerPassword
}
