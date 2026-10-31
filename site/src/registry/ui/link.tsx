import NextLink from "next/link";

export interface LinkProps extends React.ComponentProps<typeof NextLink> {}

export function Link({ href: url, ...props }: LinkProps) {
  const href = typeof url === "string" ? url : (url.pathname ?? "");

  const isExternal = href.startsWith("http");
  const isProtocal = href.startsWith("mailto:") || href.startsWith("tel:");

  return (
    <NextLink
      href={href}
      {...((isProtocal || isExternal) && {
        rel: "noopener noreferrer",
        target: "_blank",
      })}
      {...props}
    />
  );
}
