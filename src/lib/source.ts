import { loader } from "fumadocs-core/source";
import { metaSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";

const docs = defineDocs({
  docs: {
    async: true,
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: {
        output: "function",
      },
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
