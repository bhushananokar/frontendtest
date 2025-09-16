import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Debug logging
  console.log('🔧 [VITE-CONFIG] Environment variables:', {
    VITE_JOURNAL_CRUD_ENDPOINT: env.VITE_JOURNAL_CRUD_ENDPOINT,
    VITE_JOURNAL_ML_ENDPOINT: env.VITE_JOURNAL_ML_ENDPOINT,
    mode
  })
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_JOURNAL_CRUD_ENDPOINT,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        '/api/ml': {
          target: env.VITE_JOURNAL_ML_ENDPOINT,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/ml/, '')
            console.log('🔄 [VITE-PROXY] ML request:', { originalPath: path, newPath, target: env.VITE_JOURNAL_ML_ENDPOINT })
            return newPath
          }
        }
      }
    }
  }
})