import { remarkSteps } from "fumadocs-core/mdx-plugins/remark-steps";
import { defineConfig } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkSteps, { step: "step", steps: "steps" }]],
  },
  plugins: [lastModified()],
});
