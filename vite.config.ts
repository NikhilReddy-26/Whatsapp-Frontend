import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Dev only: forward /api/* to the Go backend so the browser never hits CORS
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_PROXY_TARGET || 'https://func-leads-dev-4rdgi.azurewebsites.net',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
