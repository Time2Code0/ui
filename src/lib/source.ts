import type { LoaderPlugin } from "fumadocs-core/source";

import { loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
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
    schema: pageSchema.extend({
      links: z
        .object({
          api: z.string().optional(),
        })
        .optional(),
      overview: z.string().optional(),
      /**
       * Marks the page in the sidebar. Set `status: new` on pages added since
       * the last release, and remove it again once the release is out.
       */
      status: z.enum(["new"]).optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

/**
 * Copies the frontmatter `status` onto page tree items, so the sidebar can
 * render a badge without touching `name` (used as plain text in search).
 */
const statusPlugin: LoaderPlugin = {
  name: "status",
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) {
        return node;
      }

      const file = this.storage.read(filePath);

      if (
        file?.format === "page" &&
        "status" in file.data &&
        typeof file.data.status === "string"
      ) {
        return { ...node, status: file.data.status };
      }

      return node;
    },
  },
};

export const source = loader({
  baseUrl: "/docs",
  plugins: [statusPlugin],
  source: docs.toFumadocsSource(),
});
