import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@theruntimehq/js"],
  minify: false,
  sourcemap: true,
  treeshake: true,
  splitting: false,
});
