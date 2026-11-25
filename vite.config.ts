import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  // VITE_THEME=fun builds the fun & quirky version into /test/new-site/fun/
  base: process.env.VITE_THEME === 'fun' ? '/test/new-site/fun/' : '/test/new-site/',
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false, // single page; links to the app (/test/*.html) live outside this build
      },
    }),
    viteReact(),
  ],
})

export default config
