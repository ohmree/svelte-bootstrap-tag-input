import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import { typescript } from 'svelte-preprocess-esbuild';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [typescript(), preprocess({ typescript: false })],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      // name: 'SvelteBootstrapTagInput',
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        // globals: {
        //   svelte: 'svelte',
        // },
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
    target: 'esnext',
    minify: false,
  },
});
