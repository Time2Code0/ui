"use client";

import {
  MouseContainer,
  MouseFollower,
  MouseSmoothing,
  MouseTarget,
  useMouse,
} from "@/registry/marketing/mouse";

function Cursor() {
  const { activeTarget } = useMouse();

  return (
    <MouseFollower className="absolute">
      {activeTarget ? (
        <span className="whitespace-nowrap rounded-full bg-foreground px-3 py-1 font-medium text-background text-xs">
          {String(activeTarget.data)}
        </span>
      ) : (
        <span className="block size-4 rounded-full bg-foreground" />
      )}
    </MouseFollower>
  );
}

export function Particle() {
  return (
    <MouseContainer
      className="relative grid h-72 w-full cursor-none grid-cols-2 gap-4 overflow-hidden rounded-xl border p-4"
      resetPositionOnLeave
    >
      <MouseTarget
        className="flex items-center justify-center rounded-lg bg-background-muted text-sm"
        data="View project"
      >
        Project
      </MouseTarget>
      <MouseTarget
        className="flex items-center justify-center rounded-lg bg-background-muted text-sm"
        data="Read article"
      >
        Article
      </MouseTarget>
      <MouseSmoothing position={{ damping: 30, stiffness: 300 }}>
        <Cursor />
      </MouseSmoothing>
    </MouseContainer>
  );
}
