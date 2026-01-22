
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Maps the environment variables to the browser's process.env
    'process.env': process.env
  }
});
