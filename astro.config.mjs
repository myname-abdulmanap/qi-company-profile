// // @ts-check
// import { defineConfig } from 'astro/config';
// import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap';
// import tailwindcss from "@tailwindcss/vite";



// import vercel from '@astrojs/vercel';

// // https://astro.build/config
// export default defineConfig({
//   site: 'https://qualita-indonesia.com',
//   integrations: [mdx(), sitemap()], 
//   adapter: vercel(),
//   vite: {
//     plugins: [tailwindcss()],
//   },

  
  
  
// });
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://qualita-indonesia.com', // pastikan ini domain kanonik yang kamu pakai
  adapter: vercel(),
  integrations: [mdx(), sitemap()],
  trailingSlash: 'never',           // opsional: URL tanpa slash di akhir
  prefetch: true,                   // opsional: prefetch link internal di viewport
  compressHTML: true,               // opsional: minify HTML output
  vite: { plugins: [tailwindcss()] }
});

