import { cn } from "cn";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  animate?: boolean;
}

export function GradientText({ className, animate = false, ...props }: Props) {
  return (
    <span
      className={cn(
        "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent",
        animate &&
          "animate-gradient-text from-primary via-secondary to-primary [background-size:300%_100%]",
        className
      )}
      {...props}
    />
  );
}
