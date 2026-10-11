import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { source } from "@/lib/source";
import { getPageImageUrl } from "@/lib/utils";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const { title, description } = page.data;

  return new ImageResponse(
    <div
      // style={{ fontFamily: "Geist Sans" }}
      className="flex h-full w-full bg-black text-white"
    >
      <div className="absolute inset-y-0 left-16 flex w-px border border-stone-700 border-dashed" />
      <div className="absolute inset-y-0 right-16 flex w-px border border-stone-700 border-dashed" />
      <div className="absolute inset-x-0 top-16 flex h-px border border-stone-700" />
      <div className="absolute inset-x-0 bottom-16 flex h-px border border-stone-700" />
      <div className="absolute right-24 bottom-24 flex flex-row text-white">
        <svg
          aria-hidden="true"
          height={48}
          viewBox="0 0 256 256"
          width={48}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="none" height="256" width="256" />
          <line
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            x1="208"
            x2="128"
            y1="128"
            y2="208"
          />
          <line
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            x1="192"
            x2="40"
            y1="40"
            y2="192"
          />
        </svg>
      </div>
      <div className="absolute inset-32 flex w-4xl flex-col justify-center">
        <div
          className="flex grow flex-col justify-center leading-[1.1] tracking-tight"
          style={{
            fontSize: title && title.length > 20 ? 64 : 80,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          className="grow text-[40px] text-stone-400 leading-normal"
          style={{
            fontWeight: 500,
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      height: 630,
      width: 1200,
    }
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
