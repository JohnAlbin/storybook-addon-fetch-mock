import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/preview.ts"],
  splitting: false,
  minify: !options.watch,
  format: "esm",
  dts: { resolve: true },
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: "browser",
}));
