import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // <- Importante para acceder desde fuera (como ngrok o red local)
    port: 5173,      // <- O el puerto que uses
    strictPort: true,
    allowedHosts: ['all'], // <- Permitir todos los hosts (o puedes poner manualmente el subdominio de ngrok)
    origin: 'https://e963-95-62-80-190.ngrok-free.app', // <- A veces Vite también valida esto
  },
})
