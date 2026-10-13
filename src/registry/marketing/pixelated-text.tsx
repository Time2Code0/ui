import { cn } from "cn";

interface Props extends React.ComponentPropsWithoutRef<"span"> {
  pixelSize?: number;
}

export function PixelatedText({ pixelSize = 5, className, ...props }: Props) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent [background-image:radial-gradient(circle_at_.4px_.2px,var(--color-foreground)_1px,transparent_0)] [background-size:var(--pixel-size)]",
        className
      )}
      style={
        {
          "--pixel-size": `${pixelSize}px ${pixelSize}px`,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
