import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  fixedExtension: false,
  format: "esm",
  platform: "node",
  target: "node20",
});
