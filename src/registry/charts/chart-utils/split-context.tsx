"use client";

import { createContext, type ReactNode, use, useState } from "react";

function shallowEqual(a: object, b: object): boolean {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }
  return aKeys.every((key) =>
    Object.is(a[key as keyof typeof a], b[key as keyof typeof b])
  );
}

/**
 * Returns the previously rendered object while all of its fields are
 * identical, so a context value only changes identity when a field changes.
 * Stored in state ("store previous props in state") rather than a ref so
 * nothing reads a ref during render.
 */
function useShallowStable<T extends object>(value: T): T {
  const [cached, setCached] = useState(value);
  if (cached !== value && !shallowEqual(cached, value)) {
    setCached(value);
    return value;
  }
  return cached;
}

interface SplitContextOptions<Hover extends object> {
  /** Lists every hover field; the remaining fields form the stable slice. */
  hoverKeys: { [K in keyof Required<Hover>]: true };
  /** Context name used in hook / provider names, e.g. `"Pie"`. */
  name: string;
  /** Chart components that render the provider, for the missing-provider error. */
  wrappers: string;
}

/**
 * Creates a chart context split into two providers: a stable slice (data,
 * scales, layout, animation state) and a hover slice that changes on pointer
 * movement. Consumers that only read the stable slice skip re-rendering on
 * every hover.
 */
export function createSplitContext<
  Stable extends object,
  Hover extends object,
>({ hoverKeys, name, wrappers }: SplitContextOptions<Hover>) {
  const StableContext = createContext<Stable | null>(null);
  const HoverContext = createContext<Hover | null>(null);

  function Provider({
    children,
    value,
  }: {
    children: ReactNode;
    value: Stable & Hover;
  }) {
    const stableSlice: Record<string, unknown> = {};
    const hoverSlice: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(value)) {
      if (Object.hasOwn(hoverKeys, key)) {
        hoverSlice[key] = field;
      } else {
        stableSlice[key] = field;
      }
    }
    const stable = useShallowStable(stableSlice) as Stable;
    const hover = useShallowStable(hoverSlice) as Hover;

    return (
      <StableContext.Provider value={stable}>
        <HoverContext.Provider value={hover}>{children}</HoverContext.Provider>
      </StableContext.Provider>
    );
  }

  Provider.displayName = `${name}Provider`;

  function useRequired<T>(context: React.Context<T | null>, hook: string): T {
    const value = use(context);
    if (!value) {
      throw new Error(
        `${hook} must be used within a ${name}Provider. ` +
          `Make sure your component is wrapped in ${wrappers}.`
      );
    }
    return value;
  }

  /** Stable slice — subscribers skip re-renders on hover. */
  function useStable(): Stable {
    return useRequired(StableContext, `use${name}Stable`);
  }

  /** Hover slice — subscribers re-render on every pointer move. */
  function useHover(): Hover {
    return useRequired(HoverContext, `use${name}Hover`);
  }

  return { Provider, useHover, useStable };
}
