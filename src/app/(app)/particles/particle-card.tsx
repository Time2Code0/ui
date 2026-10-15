import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { CodeBlockCommand } from "@/components/code-block-command";
import { ComponentRenderer } from "@/components/component-renderer";
import { ComponentSource } from "@/components/component-source";
import { CopyRegistryButton } from "@/components/copy-registry-button";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { siteConfig } from "@/lib/config";
import { getRegistryItem } from "@/lib/registry";
import { Button } from "@/registry/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer";
import { Icon } from "@/registry/ui/icon";

import { ParticleCardContainer } from "./particle-card-container";

export async function ParticleCard({ name }: { name: string }) {
  const registryUrl = `${siteConfig.url}/r/${name}`;

  const particle = await getRegistryItem(name);

  const metaClassName =
    typeof particle.meta?.className === "string"
      ? particle.meta.className
      : undefined;

  return (
    <ParticleCardContainer
      className={cn(particle.meta?.colSpan === 2 && "lg:col-span-2")}
      footer={
        <>
          <p className="flex flex-1 gap-1 truncate ps-1 text-foreground-muted text-xs">
            <Icon
              className="h-lh shrink-0"
              icon={InformationCircleIcon}
              size={12}
            />
            <span className="truncate">{particle.description}</span>
          </p>

          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" ? (
              <Button
                className="font-mono text-xs"
                disabled
                size="sm"
                title="Particle name"
                variant="outline"
              >
                {name}
              </Button>
            ) : null}

            <CopyRegistryButton value={`${registryUrl}.json`} />

            <Drawer position="right">
              <DrawerTrigger
                render={
                  <Button size="sm" variant="outline">
                    View code
                  </Button>
                }
              />
              <DrawerPopup className="max-w-4xl" showBar variant="straight">
                <DrawerContent className="flex min-h-0 flex-1 flex-col p-6">
                  <DrawerTitle className="sr-only">
                    {particle.description ?? name}
                  </DrawerTitle>

                  <h2 className="mb-4 font-semibold text-xl">Installation</h2>

                  <CodeBlockCommand
                    className="my-0 overflow-hidden rounded-xl border"
                    command={`shadcn@latest add ${registryUrl}`}
                  />

                  <div className="mt-6 mb-4 flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-xl">Code</h2>
                    <OpenInV0Button name={name} />
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col">
                    <ComponentSource
                      className="min-h-0 flex-1 overflow-hidden rounded-xl border **:data-[slot=scroll-area-viewport]:max-h-none!"
                      codeblock={{
                        "data-line-numbers": true,
                      }}
                      name={name}
                    />
                  </div>
                </DrawerContent>
              </DrawerPopup>
            </Drawer>
          </div>
        </>
      }
    >
      <ComponentRenderer metaClassName={metaClassName} name={name} />
    </ParticleCardContainer>
  );
}
