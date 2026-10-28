import { remarkSteps } from "fumadocs-core/mdx-plugins/remark-steps";
import { defineConfig } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import {
  createFileSystemGeneratorCache,
  createGenerator,
  remarkAutoTypeTable,
} from "fumadocs-typescript";

const generator = createGenerator({
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkSteps, { step: "step", steps: "steps" }],
      [remarkAutoTypeTable, { generator }],
    ],
  },
  plugins: [lastModified()],
});
