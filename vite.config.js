import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ✅ Fixes the 404 JS asset error on Vercel
  plugins: [react()],
})