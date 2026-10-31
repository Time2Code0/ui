"use client";

import { Fragment, useRef, useState } from "react";

import { cn } from "cn";
import { useMotionValueEvent, useScroll } from "motion/react";

export function TextScrollReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const tokenOccurrences = new Map<string, number>();
  const tokens = text.split(" ").map((value) => {
    const occurrence = tokenOccurrences.get(value) ?? 0;
    tokenOccurrences.set(value, occurrence + 1);

    return {
      key: JSON.stringify([value, occurrence]),
      value,
    };
  });

  const ref = useRef<React.ComponentRef<"div">>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: ref,
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <div className="sticky top-0 left-0 flex h-1/2 items-center">
        <div>
          {tokens.map((token, index) => (
            <Fragment key={token.key}>
              <Token
                isActive={progress > index / tokens.length}
                token={token.value}
              />

              {index + 1 < tokens.length && (
                <Token isActive={false} token={"\u00A0"} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function Token({ token, isActive }: { token: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-block opacity-10 transition-opacity duration-150",
        isActive && "opacity-100"
      )}
    >
      {token}
    </span>
  );
}
