import { getComponentThumbnail } from "@/components/thumbnails";
import { source } from "@/lib/source";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@/registry/ui/card";
import { Link } from "@/registry/ui/link";

export function ThumbnailCard({ slug }: { slug: string[] }) {
  const page = source.getPage(slug);

  if (!page) {
    return null;
  }

  return (
    <CardFrame className="group/card w-full min-w-0 after:pointer-events-none after:absolute after:-inset-[5px] after:rounded-[calc(var(--radius-2xl)+5px)] after:border after:border-foreground/5 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-foreground has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background">
      <Card className="pointer-events-none h-60 flex-none overflow-hidden bg-[color-mix(in_oklab,var(--color-background-muted),var(--color-accent)_30%)] dark:bg-background">
        <CardPanel
          aria-hidden="true"
          className="flex flex-1 items-center justify-center p-6 transition-transform duration-200 ease-out motion-safe:translate-y-0.5 motion-safe:group-hover/card:translate-y-0"
          inert
        >
          {getComponentThumbnail(page.slugs.at(-1) ?? "")}
        </CardPanel>
      </Card>

      <CardFrameFooter className="z-10 flex flex-col gap-0.5 px-4 py-3">
        <h2 className="font-medium text-[0.9375rem]">
          <Link
            className="outline-none before:absolute before:inset-0 before:rounded-2xl"
            href={page.url}
          >
            {page.data.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-pretty text-foreground-muted text-sm">
          {page.data.description}
        </p>
      </CardFrameFooter>
    </CardFrame>
  );
}
