import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/brighter-shores-routefinder/', // Replace 'repository-name' with your GitHub repo name
  plugins: [react()],
});
