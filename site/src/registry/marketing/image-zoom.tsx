"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import { useEventListener } from "@/registry/hooks/use-event-listener";
import { Portal } from "@/registry/ui/portal";

interface ImageZoomProps extends React.ComponentPropsWithRef<"button"> {
  gutter?: number;
  onOpenChange?: (open: boolean) => void;
}

export function ImageZoom({
  children,
  gutter = 24,
  className,
  onOpenChange,
  ...props
}: ImageZoomProps) {
  const imgRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useControllableState({
    defaultProp: false,
    onChange: (nextOpen) => {
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        setAnimatingClose(true);
        setTimeout(() => {
          setAnimatingClose(false);
        }, 300);
      }
    },
  });
  const [animatingClose, setAnimatingClose] = useState(false);
  const [rect, setRect] = useState({
    height: 0,
    left: 0,
    top: 0,
    transform: "scale(1)",
    width: 0,
  });

  const computeTransform = useCallback(() => {
    if (!imgRef.current) {
      return;
    }

    const elementRect = imgRef.current.getBoundingClientRect();
    const viewport = { height: window.innerHeight, width: window.innerWidth };

    const scale = Math.min(
      (viewport.width - 2 * gutter) / elementRect.width,
      (viewport.height - 2 * gutter) / elementRect.height
    );

    const viewportCenterX = viewport.width / 2;
    const viewportCenterY = viewport.height / 2;
    const itemCenterX = elementRect.left + elementRect.width / 2;
    const itemCenterY = elementRect.top + elementRect.height / 2;

    const translateX = (viewportCenterX - itemCenterX) / scale;
    const translateY = (viewportCenterY - itemCenterY) / scale;

    setRect({
      height: elementRect.height,
      left: elementRect.left,
      top: elementRect.top,
      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      width: elementRect.width,
    });
  }, [gutter]);

  // Resize Image in Modal if screen resizes
  useEffect(() => {
    if (!open) {
      return;
    }

    computeTransform();

    window.addEventListener("resize", computeTransform, { passive: true });

    return () => {
      window.removeEventListener("resize", computeTransform);
    };
  }, [open, computeTransform]);

  // After the modal is closed we have a 300ms time window in which we listen to scroll event.
  // This is nessasary in order to animate to the correct poition of the original image (since the top position still changes).
  useEffect(() => {
    if (!animatingClose) {
      return;
    }

    window.addEventListener("scroll", computeTransform, { passive: true });

    return () => {
      window.removeEventListener("scroll", computeTransform);
    };
  }, [animatingClose, computeTransform]);

  // Close modal if user scrolls
  useEventListener(
    "scroll",
    () => {
      if (open) {
        setOpen(false);
      }
    },
    undefined,
    { passive: true }
  );

  // Close modal if user presses esc key (or arrow up/down)
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "ArrowDown" || e.key === "ArrowUp") {
      setOpen(false);
    }
  });

  return (
    <>
      <button
        className={cn(
          "relative block w-full cursor-zoom-in text-left",
          className
        )}
        data-hidden={animatingClose || open}
        onClick={(e) => {
          // Important: clicks inside the portal bubble through the React tree.
          // Guarding here prevents a "close" click from immediately reopening.
          if (open || animatingClose) {
            return;
          }
          e.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (open || animatingClose) {
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
        ref={imgRef}
        type="button"
        {...props}
      >
        {children}
      </button>

      <AnimatePresence custom={rect}>
        {open ? (
          <Portal>
            <motion.div
              animate={{ opacity: 1 }}
              className="pointer-events-none fixed inset-0 z-50 bg-background/80"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            />

            <button
              className="fixed inset-0 z-50 cursor-zoom-out [transition:width_.4s_ease-out,height_.4s_ease-out]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                }
              }}
              type="button"
            >
              <motion.div
                animate="visible"
                className="absolute"
                exit="invisible"
                initial="invisible"
                transition={{ bounce: 0, duration: 0.4, type: "spring" }}
                variants={{
                  invisible: (c) => {
                    const custom = c as {
                      top: number;
                      left: number;
                      width: number;
                      height: number;
                    } | null;

                    return {
                      ...(custom ?? rect),
                      transform: "scale(1) translate(0px, 0px)",
                      transition: {
                        top: {
                          duration: 0,
                        },
                      },
                    };
                  },
                  visible: () => ({ ...rect }),
                }}
              >
                {children}
              </motion.div>
            </button>
          </Portal>
        ) : null}
      </AnimatePresence>
    </>
  );
}
