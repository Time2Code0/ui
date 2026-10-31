import { cn } from "cn";

import { Button } from "../ui/button";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  containerClassName?: string;
  duration?: number;
}

export function MagicButton({
  children,
  className,
  containerClassName,
  duration = 2,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "relative isolate inline-block overflow-hidden rounded-full",
        containerClassName
      )}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2",
          "before:float-left before:pt-[100%]",
          "after:clear-both after:block"
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 size-full animate-magic-button-border-turn opacity-15 blur-md",
            "bg-[conic-gradient(from_0_at_50%_50%,rgba(255,255,255,.5)_0deg,rgba(255,255,255,0)_60deg,rgba(255,255,255,0)_310deg,rgba(255,255,255,.5)_360deg)] bg-no-repeat [background-position:center_center] [background-size:cover]"
          )}
        />

        <div
          className={cn(
            "absolute top-0 left-0 size-full",
            "[mask-repeat:repeat] [mask-size:auto] [mask:var(--background-stars)]"
          )}
          style={
            {
              "--background-stars": `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 28 24" fill="none"><path d="M14.0534 15.732C13.8444 15.283 14.2848 14.8489 14.7326 15.051C14.8296 15.0959 14.9043 15.1707 14.949 15.268C15.1506 15.717 14.7177 16.1511 14.2698 15.949C14.1728 15.9041 14.0982 15.8293 14.0534 15.732Z" fill="black"/><path d="M18.8001 13.5093C19.0016 13.0603 18.5687 12.6263 18.1209 12.8283C18.0239 12.8732 17.9492 12.9481 17.9045 13.0453C17.6955 13.4944 18.1358 13.9284 18.5837 13.7264C18.6807 13.6815 18.7553 13.6066 18.8001 13.5093Z" fill="black"/><path d="M0.949043 2.732C1.15057 2.28297 0.717663 1.84891 0.269836 2.05097C0.172806 2.09587 0.098162 2.17071 0.0533793 2.268C-0.155607 2.71703 0.284759 3.15109 0.732587 2.94903C0.829616 2.90413 0.90426 2.82929 0.949043 2.732Z" fill="black"/><path d="M26.9489 7.732C27.151 7.28297 26.7169 6.84891 26.2679 7.05097C26.1706 7.09587 26.0958 7.17071 26.0508 7.268C25.8488 7.71703 26.2828 8.15109 26.7319 7.94903C26.8292 7.90413 26.904 7.82929 26.9489 7.732Z" fill="black"/><path d="M13.0534 5.732C12.8444 5.28297 13.2848 4.84891 13.7326 5.05097C13.8296 5.09587 13.9043 5.17071 13.949 5.268C14.1506 5.71703 13.7177 6.15109 13.2698 5.94903C13.1728 5.90413 13.0982 5.82929 13.0534 5.732Z" fill="black"/><path d="M10.0534 17.732C9.84439 17.283 10.2848 16.8489 10.7326 17.051C10.8296 17.0959 10.9043 17.1707 10.949 17.268C11.1506 17.717 10.7177 18.1511 10.2698 17.949C10.1728 17.9041 10.0982 17.8293 10.0534 17.732Z" fill="black"/><path d="M15.0534 21.732C14.8444 21.283 15.2848 20.8489 15.7326 21.051C15.8296 21.0959 15.9043 21.1707 15.949 21.268C16.1506 21.717 15.7177 22.1511 15.2698 21.949C15.1728 21.9041 15.0982 21.8293 15.0534 21.732Z" fill="black"/></svg>')`,
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              "absolute top-0 left-0 size-full animate-magic-button-border-turn",
              "bg-[conic-gradient(from_0_at_50%_50%,rgba(255,255,255,.5)_0deg,rgba(255,255,255,0)_60deg,rgba(255,255,255,0)_310deg,rgba(255,255,255,.5)_360deg)] bg-no-repeat [background-position:center_center] [background-size:cover]"
            )}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 size-full rounded-full p-px [-webkit-mask-composite:xor]! [mask-composite:exclude]! [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]">
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-full",
            "animate-magic-button-border-turn-with-translate bg-[conic-gradient(from_0_at_50%_50%,rgba(255,255,255,.5)_0deg,rgba(255,255,255,0)_60deg,rgba(255,255,255,0)_310deg,rgba(255,255,255,.5)_360deg)] bg-no-repeat [background-position:center_center] [background-size:cover]",
            "before:float-left before:pt-[100%]",
            "after:clear-both after:block"
          )}
        />
      </div>

      <Button
        className={cn(
          "px-6 py-2 [background:radial-gradient(107.5%_107.5%_at_50%_215%,rgba(255,255,255,.24)_0%,rgba(255,255,255,0)_100%),rgba(255,255,255,.04)] hover:[background:radial-gradient(107.5%_107.5%_at_50%_215%,rgba(255,255,255,.24)_0%,rgba(255,255,255,0)_100%),rgba(255,255,255,.04)]",
          "after:absolute after:-top-0.5 after:-left-0.5 after:size-[calc(100%_+_4px)] after:rounded-full after:opacity-0 after:transition-opacity after:duration-1000 hover:after:opacity-70 after:[background:radial-gradient(85%_120%_at_50%_120%,rgba(255,255,255,.24)_0%,rgba(255,255,255,0)_100%)]",
          className
        )}
        shape="full"
        size="lg"
        variant="outline"
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
