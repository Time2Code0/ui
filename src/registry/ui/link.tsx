import type { LinkProps as NextLinkProps } from "next/link";

import NextLink from "next/link";

export interface LinkProps
  extends Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof NextLinkProps
    >,
    NextLinkProps {}

export function Link({ href: url, ...props }: LinkProps) {
  const href = typeof url === "string" ? url : (url.pathname ?? "");

  const isProtocal = href.startsWith("mailto:") || href.startsWith("tel:");

  // NellCommerce domains that should open in same tab
  const nellCommerceDomains = [
    "web.nellcommerce.com",
    "dashboard.nellcommerce.com",
    "platform.nellcommerce.com",
  ];

  // Check if link is to a NellCommerce domain
  const isNellCommerceDomain = nellCommerceDomains.some((domain) =>
    href.includes(domain)
  );

  // Check if link is external (not localhost, not same domain, not NellCommerce)
  const isExternal =
    href.startsWith("http") &&
    !href.includes("localhost") &&
    !href.includes("127.0.0.1") &&
    !isNellCommerceDomain;

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
