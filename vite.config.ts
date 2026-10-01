import { defineConfig } from 'vitest/config'
import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

const cartProxy: ProxyOptions = {
  // Solo el proceso servidor conoce el destino. Las pruebas usan un upstream local.
  target: process.env.CART_PROXY_TARGET || 'https://itx-frontend-test.onrender.com',
  changeOrigin: true,
  cookieDomainRewrite: '',
  cookiePathRewrite: '/api/cart',
  configure(proxy) {
    proxy.on('proxyReq', (proxyRequest, request) => {
      // Reenviar exclusivamente la sesión de este navegador, sin cookie jar global.
      const session = request.headers.cookie?.split(';').map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith('session_id='))
      if (session) proxyRequest.setHeader('cookie', session)
      else proxyRequest.removeHeader('cookie')
    })
  },
}
const proxy = { '^/api/cart(?:\\?.*)?$': cartProxy }

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  test: { include: ['src/**/*.test.{ts,tsx}'], environment: 'jsdom', setupFiles: './src/test/setup.ts', clearMocks: true },
})
