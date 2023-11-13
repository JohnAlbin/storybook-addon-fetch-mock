import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts', 'src/preset/preview.ts'],
  splitting: true,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  dts: {
    // Setting resolve to true throws:
    // RollupError: "NextHandleFunction" is not exported
    resolve: false,
  },
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: 'browser',
  esbuildOptions(options) {
    options.conditions = ['module'];
  },
}));
