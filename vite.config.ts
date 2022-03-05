import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import { typescript } from 'svelte-preprocess-esbuild';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [typescript({ target: 'es2020' }), preprocess({ typescript: false })],
    }),
  ],
  build: {
    lib: {
      entry: 'src/components/index.ts',
      name: 'SvelteBootstrapTagInput',
    },
    rollupOptions: {
      external: ['svelte', 'bootstrap'],
      output: {
        globals: {
          svelte: 'svelte',
        },
      },
    },
  },
});
