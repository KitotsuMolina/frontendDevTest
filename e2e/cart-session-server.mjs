// Upstream exclusivo de pruebas: preview debe reenviar la cookie real del navegador.
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

const sessions = new Map()
createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json')
  if (request.url === '/health') return response.end('{"ok":true}')
  if (request.url !== '/api/cart' || request.method !== 'POST') {
    response.statusCode = 404
    return response.end('{}')
  }
  try {
    let raw = ''
    for await (const chunk of request) raw += chunk
    const body = JSON.parse(raw)
    if (Object.keys(body).sort().join(',') !== 'colorCode,id,storageCode' || typeof body.id !== 'string' ||
        typeof body.colorCode !== 'number' || typeof body.storageCode !== 'number') {
      response.statusCode = 400
      return response.end('{"message":"Invalid parameters"}')
    }
    // El proxy no debe filtrar cookies ajenas hacia el servicio remoto.
    const cookie = request.headers.cookie || ''
    if (cookie && !/^session_id=[\w-]+$/.test(cookie)) throw new Error('Cookies inesperadas')
    let session = cookie.slice('session_id='.length)
    if (!sessions.has(session)) {
      session = randomUUID()
      sessions.set(session, 0)
      response.setHeader('Set-Cookie', `session_id=${session}; Path=/; HttpOnly; SameSite=Lax`)
    }
    const count = sessions.get(session) + 1
    sessions.set(session, count)
    response.end(JSON.stringify({ count }))
  } catch {
    response.statusCode = 400
    response.end('{"message":"Invalid request"}')
  }
}).listen(4181, '127.0.0.1')
