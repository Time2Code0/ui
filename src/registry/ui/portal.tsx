"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps extends React.ComponentPropsWithRef<"div"> {
  container?: Element | DocumentFragment | null;
}

export function Portal({ container: containerProp, ...props }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);

  const container = containerProp || (mounted && globalThis?.document?.body);

  return container ? createPortal(<div {...props} />, container) : null;
}
