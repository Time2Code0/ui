"use client";

import { useLayoutEffect, useState } from "react";

import { cn } from "cn";

/** Box a demo is laid out in before it is scaled down to the card. */
const STAGE = { height: 320, width: 512 };
/** Gap kept between a scaled demo and the card's media edge. */
const MEDIA_PADDING = 16;

/**
 * Lays a demo out in a docs-sized stage, then scales it down (never up) until it fits the card,
 * so a lone button stays crisp while a table or chart shrinks to a miniature. The scaled stage is
 * also the containing block for fixed-position demo parts, keeping them inside the card.
 */
export function DemoFit({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  // Elements in state (not refs), so measuring re-runs once both are attached.
  const [media, setMedia] = useState<HTMLDivElement | null>(null);
  const [content, setContent] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!(media && content)) {
      return;
    }

    // Layout sizes ignore the transform, so this measures the demo unscaled.
    const measure = () => {
      if (content.offsetWidth === 0 || content.offsetHeight === 0) {
        return;
      }

      setScale(
        Math.min(
          1,
          (media.clientWidth - MEDIA_PADDING * 2) / content.offsetWidth,
          (media.clientHeight - MEDIA_PADDING * 2) / content.offsetHeight
        )
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);

    return () => observer.disconnect();
  }, [media, content]);

  return (
    <div className="absolute inset-0" ref={setMedia}>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 flex items-center justify-center",
          scale === null && "invisible"
        )}
        style={{
          height: STAGE.height,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          width: STAGE.width,
        }}
      >
        <div className={className} ref={setContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
