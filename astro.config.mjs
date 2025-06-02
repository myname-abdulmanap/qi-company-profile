// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";



import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://qualita-indonesia.com',
  integrations: [mdx(), sitemap()], 
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },

  
  
  
});

