"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

const showcaseActionEase = [0.23, 1, 0.32, 1] as const;
const showcaseActionEnterDuration = 0.2;
const showcaseActionExitDuration = 0.16;
const showcaseActionStagger = 0.04;

/** Icon-only "Replay animation" button. Fades in when `visible` flips true. */
export function ShowcaseReplayAction({
  index,
  visible,
  reducedMotion,
  onReplay,
}: {
  index: number;
  visible: boolean;
  reducedMotion: boolean | null;
  onReplay: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={
            reducedMotion
              ? { opacity: 1, y: 0 }
              : {
                  opacity: 1,
                  transition: {
                    delay: index * showcaseActionStagger,
                    duration: showcaseActionEnterDuration,
                    ease: showcaseActionEase,
                  },
                  y: 0,
                }
          }
          exit={
            reducedMotion
              ? undefined
              : {
                  opacity: 0,
                  transition: {
                    duration: showcaseActionExitDuration,
                    ease: showcaseActionEase,
                  },
                  y: 4,
                }
          }
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        >
          <Button
            aria-label="Replay animation"
            onClick={onReplay}
            size="icon-sm"
            title="Replay animation"
            type="button"
            variant="outline"
          >
            <Icon icon={RefreshIcon} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
