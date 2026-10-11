import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";
import { cn } from "cn";

export const typographyVariants = cva("text-foreground", {
  defaultVariants: {
    muted: false,
    size: "base",
  },
  variants: {
    muted: {
      true: "text-foreground-muted",
    },
    size: {
      1: "font-bold text-5xl lg:text-6xl",
      2: "text-4xl",
      3: "text-3xl",
      4: "text-2xl",
      5: "text-xl",
      6: "text-lg",
      base: "text-base",
    },
  },
});

type TextProps<T extends React.ElementType> = {
  as?: T;
} & VariantProps<typeof typographyVariants> &
  React.ComponentPropsWithRef<"p">;

function Text(props: TextProps<React.ElementType>) {
  const {
    ref,
    size = "base",
    muted = false,
    as: Component = "p",
    className,
    ...rest
  } = props as TextProps<"p">;

  return (
    <Component
      className={cn(typographyVariants({ muted, size }), className)}
      ref={ref as React.Ref<HTMLParagraphElement>}
      {...rest}
    />
  );
}

function Heading({
  className,
  size = 1,
  as = "h1",
  ...rest
}: TextProps<React.ElementType>) {
  return (
    <Text
      as={as}
      className={cn("scroll-m-20 font-semibold tracking-tight", className)}
      size={size}
      {...rest}
    />
  );
}

function H1({ size = 1, as = "h1", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

function H2({ size = 2, as = "h2", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

function H3({ size = 3, as = "h3", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

function H4({ size = 4, as = "h4", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

function H5({ size = 5, as = "h5", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

function H6({ size = 6, as = "h6", ...props }: TextProps<React.ElementType>) {
  return <Heading as={as} size={size} {...props} />;
}

export const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Heading,
  Text,
};
