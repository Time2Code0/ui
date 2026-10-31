import { createFileTree, getFileTarget } from "@/lib/blocks";
import { getRegistryItem } from "@/lib/registry";

import { BlockViewer } from "./block-viewer";
import { ComponentSource } from "./component-source";

export async function BlockDisplay({ name }: { name: string }) {
  const item = await getRegistryItem(name);
  const files = item.files ?? [];

  const height =
    typeof item.meta?.previewHeight === "string"
      ? item.meta.previewHeight
      : "800px";

  return (
    <section className="scroll-mt-16 border-b" id={name}>
      <div className="px-4 py-6 sm:px-6">
        <h2 className="font-semibold text-xl">
          <a className="hover:underline" href={`#${name}`}>
            {item.title ?? name}
          </a>
        </h2>

        {item.description ? (
          <p className="mt-1 text-foreground-muted">{item.description}</p>
        ) : null}
      </div>

      <BlockViewer
        files={files.map((file) => ({
          code: (
            <ComponentSource
              className="my-0 flex h-full flex-col border-y-0 *:last:min-h-0 *:last:flex-1 **:data-[slot=scroll-area-viewport]:max-h-none"
              codeblock={{
                "data-line-numbers": true,
              }}
              file={file.path}
              name={name}
              title={getFileTarget(file)}
            />
          ),
          path: file.path,
        }))}
        height={height}
        name={name}
        title={item.title ?? name}
        tree={createFileTree(files)}
      />
    </section>
  );
}
