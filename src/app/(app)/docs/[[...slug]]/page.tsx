import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GithubIcon,
  Text,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { findNeighbour } from "fumadocs-core/page-tree";

import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { TableOfContents } from "@/components/toc";
import { createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";
import { baseUrl, getPageImageUrl } from "@/lib/utils";
import { mdxComponents } from "@/mdx-components";
import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";
import { Skeleton } from "@/registry/ui/skeleton";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const image = {
    height: 630,
    url: getPageImageUrl(page).url,
    width: 1200,
  };

  return createMetadata({
    description: page.data.description,
    openGraph: {
      images: [image],
      url: `/docs/${page.slugs.join("/")}`,
    },
    title: page.data.title,
    twitter: {
      images: [image],
    },
  });
}

export default function Page({ params }: PageProps<"/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<DocsPageSkeleton />}>
      <DocsPage params={params} />
    </Suspense>
  );
}

function DocsPageSkeleton() {
  return (
    <div aria-busy="true" className="flex size-full items-stretch">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-167 px-4 pt-12 sm:px-6">
          <Skeleton className="h-9 w-1/2 xl:h-10" />

          <div className="mt-2 flex h-7 items-center">
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="mt-4 flex w-full gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="ms-auto h-8 w-44" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-167 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
          {[
            ["100%", "96%", "92%", "60%"],
            ["100%", "94%", "98%", "88%", "40%"],
            ["100%", "90%", "72%"],
          ].map((lines) => (
            <div className="flex flex-col gap-3" key={lines.join()}>
              {lines.map((width) => (
                <Skeleton className="h-4" key={width} style={{ width }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <aside className="sticky top-[65px] hidden h-[calc(100vh-64px)] w-72 border-l xl:flex">
        <div className="flex w-full flex-col gap-3 p-4">
          <h3 className="inline-flex items-center gap-1.5 text-foreground-muted text-sm">
            <Icon icon={Text} />
            <span>On this page</span>
          </h3>

          <div className="relative flex flex-col">
            <div className="absolute inset-y-0 start-0 w-px bg-foreground/10" />
            {[
              { depth: 2, width: "45%" },
              { depth: 3, width: "85%" },
              { depth: 3, width: "70%" },
              { depth: 3, width: "80%" },
              { depth: 2, width: "30%" },
              { depth: 2, width: "50%" },
              { depth: 3, width: "55%" },
              { depth: 3, width: "65%" },
              { depth: 3, width: "60%" },
              { depth: 2, width: "40%" },
              { depth: 3, width: "75%" },
            ].map((item) => (
              <div
                className="not-first:mt-3 flex h-5 items-center"
                key={item.width}
                style={{ paddingInlineStart: item.depth <= 2 ? 14 : 26 }}
              >
                <Skeleton className="h-3.5" style={{ width: item.width }} />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

async function DocsPage(props: Pick<PageProps<"/docs/[[...slug]]">, "params">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const { body: MDX, toc, lastModified } = await page.data.load();
  const neighbours = findNeighbour(source.pageTree, page.url);

  return (
    <div className="flex size-full items-stretch">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-167 px-4 pt-12 sm:px-6">
          <h1 className="font-semibold text-3xl xl:text-4xl">
            {page.data.title}
          </h1>

          <p className="mt-2 text-foreground-muted text-lg">
            {page.data.description}
          </p>

          <Group className="mt-4 w-full">
            <Group>
              <Button
                aria-label="API Reference"
                nativeButton={false}
                render={<Link href={""} />}
                variant="secondary"
              >
                <Icon icon={ExternalLinkIcon} />
                <span>API Reference</span>
              </Button>
            </Group>

            <Group className="ms-auto">
              <CopyMarkdownButton markdownUrl={`${baseUrl}/${page.url}.mdx`} />

              <GroupSeparator />

              <Menu>
                <MenuTrigger
                  render={
                    <Button size="icon" variant="secondary">
                      <Icon icon={ChevronDownIcon} />
                    </Button>
                  }
                />
                <MenuPopup align="end">
                  <MenuItem
                    render={
                      <Link
                        href={`https://github.com/time2code0/design-system/blob/main/content/docs/${page.path}`}
                      />
                    }
                  >
                    <Icon icon={GithubIcon} />
                    <span>Open in GitHub</span>
                    <Icon
                      className="ml-auto size-3.5"
                      icon={ExternalLinkIcon}
                    />
                  </MenuItem>
                  <MenuItem render={<Link href={`${page.url}.mdx`} />}>
                    <Icon icon={FileTextIcon} />
                    <span>View as Markdown</span>
                  </MenuItem>
                </MenuPopup>
              </Menu>
            </Group>

            <Group>
              <Button
                aria-label="Previous"
                disabled={!neighbours.previous}
                nativeButton={false}
                render={<Link href={neighbours.previous?.url ?? ""} />}
                size="icon"
                variant="secondary"
              >
                <Icon icon={ArrowLeftIcon} />
              </Button>

              <GroupSeparator />

              <Button
                aria-label="Next"
                disabled={!neighbours.next}
                nativeButton={false}
                render={<Link href={neighbours.next?.url ?? ""} />}
                size="icon"
                variant="secondary"
              >
                <Icon icon={ArrowRightIcon} />
              </Button>
            </Group>
          </Group>
        </div>

        <article
          className={cn(
            "typeset typeset-docs @container flex-1 py-6 sm:py-8",
            "[&>*:not(.full-width)]:mx-auto [&>*:not(.full-width)]:max-w-167 [&>*:not(.full-width)]:px-4 sm:[&>*:not(.full-width)]:px-6"
          )}
        >
          <MDX components={mdxComponents} />
        </article>

        {lastModified ? (
          <div className="mx-auto w-full max-w-167 px-4 pb-6 sm:px-6 sm:pb-8">
            <p className="text-foreground-muted text-sm">
              Last updated on{" "}
              <time dateTime={lastModified.toISOString()}>
                {lastModified.toLocaleDateString()}
              </time>
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            "grid border-t",
            neighbours.previous && neighbours.next
              ? "grid-cols-2 divide-x"
              : "grid-cols-1"
          )}
        >
          {neighbours.previous ? (
            <Link
              className="flex flex-col gap-2 p-4 text-sm hover:bg-accent"
              href={neighbours.previous.url}
            >
              <div className="inline-flex items-center gap-1.5 font-medium">
                <Icon icon={ChevronLeftIcon} />
                <span>{neighbours.previous.name}</span>
              </div>
              <p className="truncate text-foreground-muted">
                {neighbours.previous.description}
              </p>
            </Link>
          ) : null}

          {neighbours.next ? (
            <Link
              className="flex flex-col gap-2 p-4 text-end text-sm hover:bg-accent"
              href={neighbours.next.url}
            >
              <div className="inline-flex flex-row-reverse items-center gap-1.5 font-medium">
                <Icon icon={ChevronRightIcon} />
                <span>{neighbours.next.name}</span>
              </div>
              <p className="truncate text-foreground-muted">
                {neighbours.next.description}
              </p>
            </Link>
          ) : null}
        </div>
      </div>

      <aside className="sticky top-[65px] hidden h-[calc(100vh-64px)] w-72 border-l xl:flex">
        {toc.length ? <TableOfContents toc={toc} /> : null}
      </aside>
    </div>
  );
}
