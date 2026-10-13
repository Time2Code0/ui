"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

import { useMousePosition } from "@/registry/hooks/use-mouse-position";
import { useNormalizeMotionValue } from "@/registry/hooks/use-normalize-motion-value";

type ContainerProps = useRender.ComponentProps<"div">;

export function SpotlightContainer({
  render,
  ...props
}: ContainerProps): React.ReactElement {
  const containerRef = useRef<HTMLElement | null>(null);
  const mousePosition = useMousePosition({});
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = useRef<{ w: number; h: number }>({ h: 0, w: 0 });
  const [boxes, setBoxes] = useState<HTMLElement[]>([]);

  const mouseX = useNormalizeMotionValue(mousePosition.x);
  const mouseY = useNormalizeMotionValue(mousePosition.y);

  useEffect(() => {
    if (containerRef.current) {
      const boxesResult: HTMLElement[] = [];

      const searchChildren = (children: HTMLCollection) => {
        for (const element of children) {
          if (element.hasAttribute("data-spotlight-card")) {
            boxesResult.push(element as HTMLElement);
          } else {
            searchChildren(element.children);
          }
        }
      };

      searchChildren(containerRef.current.children);

      setBoxes(boxesResult);
    }
  }, []);

  useEffect(() => {
    const initContainer = () => {
      if (containerRef.current) {
        containerSize.current.w = containerRef.current.offsetWidth;
        containerSize.current.h = containerRef.current.offsetHeight;
      }
    };

    initContainer();
    window.addEventListener("resize", initContainer);

    return () => {
      window.removeEventListener("resize", initContainer);
    };
  }, []);

  const onMouseMove = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      mouse.current.x = mouseX - rect.left;
      mouse.current.y = mouseY - rect.top;

      for (const box of boxes) {
        box.style.setProperty(
          "--mouse-x",
          `${
            -(box.getBoundingClientRect().left - rect.left) + mouse.current.x
          }px`
        );
        box.style.setProperty(
          "--mouse-y",
          `${-(box.getBoundingClientRect().top - rect.top) + mouse.current.y}px`
        );
      }
    }
  }, [boxes, mouseX, mouseY]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to execute onMouseMove when mouseposition hcnages
  useEffect(() => {
    onMouseMove();
  }, [mousePosition, onMouseMove]);

  return useRender({
    defaultTagName: "div",
    props,
    ref: containerRef,
    render,
  });
}

interface CardProps extends useRender.ComponentProps<"div"> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  maskSize?: number;
}

export function SpotlightCard({
  children,
  className,
  maskSize = 200,
  gradient = true,
  render,
  ...props
}: CardProps): React.ReactElement {
  const defaultProps = {
    children: (
      <>
        {children}
        <div className="pointer-events-none absolute inset-px -z-20 rounded-xl bg-background/95" />
      </>
    ),
    className: cn(
      "relative z-0 overflow-hidden rounded-xl bg-foreground/10",
      gradient
        ? "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--color-secondary)_0,var(--color-primary)_50%,transparent_100%)]"
        : "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--color-foreground)_0,transparent_100%)]",
      className
    ),
    "data-spotlight-card": "",
    style: {
      "--mask-size": `${maskSize}px`,
    } as React.CSSProperties,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
