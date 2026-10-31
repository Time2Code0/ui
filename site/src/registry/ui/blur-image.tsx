"use client";

import type { ImageProps } from "next/image";

import { useState } from "react";
import NextImage from "next/image";

import { cn } from "cn";

export function BlurImage(props: ImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <NextImage
      {...props}
      alt={props.alt}
      className={cn(
        "transition-all duration-500 ease-in",
        loading ? "blur-xl grayscale" : "blur-0 grayscale-0",
        props.className
      )}
      onLoad={() => {
        setLoading(false);
      }}
      src={props.src}
    />
  );
}
