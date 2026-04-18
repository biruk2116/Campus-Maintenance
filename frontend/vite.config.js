import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  // Ensure relative pathing for sub-folder hosting (XAMPP compatibility)
=======
  // Ensure relative pathing for all built assets and module lookups
>>>>>>> 8ff3b9ea8355a0bf1f7d1ac749850604cef201c0
  base: './',
})
