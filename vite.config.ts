import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import typescript from '@rollup/plugin-typescript';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [svelte()],
    };
  } else {
    return {
      plugins: [typescript({ tsconfig: './tsconfig.json' }), svelte()],
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es', 'umd'],
          fileName: (format) => `index.${format}.js`,
          name: 'SvelteBootstrapTagInput',
        },
        rollupOptions: {
          external: ['svelte'],
          output: {
            globals: {
              svelte: 'svelte',
            },
            sourcemapExcludeSources: true,
          },
        },
        sourcemap: true,
        target: 'esnext',
        // minify: false,
      },
    };
  }
});
