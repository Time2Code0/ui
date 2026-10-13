"use client";

import { useRef } from "react";

import {
  DiscordIcon,
  FigmaIcon,
  GithubIcon,
  GoogleDriveIcon,
  NotionIcon,
  SlackIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Beam } from "@/registry/marketing/beam";
import { Icon } from "@/registry/ui/icon";

function Node({
  className,
  icon,
  ref,
}: {
  className?: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
  ref: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border bg-background shadow-sm",
        className
      )}
      ref={ref}
    >
      <Icon icon={icon} />
    </div>
  );
}

export function Particle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const driveRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  const figmaRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-md flex-col gap-10 p-6"
      ref={containerRef}
    >
      <div className="flex items-center justify-between">
        <Node icon={GithubIcon} ref={githubRef} />
        <Node icon={SlackIcon} ref={slackRef} />
      </div>
      <div className="flex items-center justify-between">
        <Node icon={NotionIcon} ref={notionRef} />
        <Node className="size-16" icon={SparklesIcon} ref={hubRef} />
        <Node icon={FigmaIcon} ref={figmaRef} />
      </div>
      <div className="flex items-center justify-between">
        <Node icon={GoogleDriveIcon} ref={driveRef} />
        <Node icon={DiscordIcon} ref={discordRef} />
      </div>

      <Beam
        containerRef={containerRef}
        curvature={-75}
        endYOffset={-10}
        fromRef={githubRef}
        toRef={hubRef}
      />
      <Beam containerRef={containerRef} fromRef={notionRef} toRef={hubRef} />
      <Beam
        containerRef={containerRef}
        curvature={75}
        endYOffset={10}
        fromRef={driveRef}
        toRef={hubRef}
      />
      <Beam
        containerRef={containerRef}
        curvature={-75}
        endYOffset={-10}
        fromRef={slackRef}
        reverse
        toRef={hubRef}
      />
      <Beam
        containerRef={containerRef}
        fromRef={figmaRef}
        reverse
        toRef={hubRef}
      />
      <Beam
        containerRef={containerRef}
        curvature={75}
        endYOffset={10}
        fromRef={discordRef}
        reverse
        toRef={hubRef}
      />
    </div>
  );
}
