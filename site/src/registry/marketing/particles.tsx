"use client";

import type { Container, SingleOrMultiple } from "@tsparticles/engine";

import { useEffect, useState } from "react";

import TSParticles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "cn";

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  background?: string;
  maxSize?: number;
  minSize?: number;
  particleColor?: string;
  particleDensity?: number;
  particleSize?: number;
  speed?: number;
}

export function Particles({
  id = "tsparticles",
  className,
  background = "transparent",
  minSize = 1,
  maxSize = 3,
  speed = 4,
  particleColor = "#fff",
  particleDensity = 120,
  ...props
}: Props) {
  const [init, setInit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container | undefined) => {
    if (container) {
      setLoaded(true);
    }

    await Promise.resolve();
  };

  return (
    <div
      className={cn(
        "transition-opacity duration-1000",
        !loaded && "opacity-0",
        className
      )}
      {...props}
    >
      {init ? (
        <TSParticles
          className={cn("size-full")}
          id={id}
          options={{
            background: {
              color: {
                value: background,
              },
            },
            detectRetina: true,

            fpsLimit: 120,
            fullScreen: {
              enable: false,
              zIndex: 1,
            },
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: false,
                  mode: "repulse",
                },
                // @ts-expect-error: i have no idea how to fix this
                resize: true as unknown,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              bounce: {
                horizontal: {
                  value: 1,
                },
                vertical: {
                  value: 1,
                },
              },
              collisions: {
                absorb: {
                  speed: 2,
                },
                bounce: {
                  horizontal: {
                    value: 1,
                  },
                  vertical: {
                    value: 1,
                  },
                },
                enable: false,
                maxSpeed: 50,
                mode: "bounce",
                overlap: {
                  enable: true,
                  retries: 0,
                },
              },
              color: {
                animation: {
                  h: {
                    count: 0,
                    decay: 0,
                    delay: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  l: {
                    count: 0,
                    decay: 0,
                    delay: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  s: {
                    count: 0,
                    decay: 0,
                    delay: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                },
                value: particleColor,
              },
              destroy: {
                bounds: {},
                mode: "none",
                split: {
                  count: 1,
                  factor: {
                    value: 3,
                  },
                  rate: {
                    value: {
                      max: 9,
                      min: 4,
                    },
                  },
                  sizeOffset: true,
                },
              },
              effect: {
                close: true,
                fill: true,
                options: {},
                type: {} as SingleOrMultiple<string> | undefined,
              },
              groups: {},
              life: {
                count: 0,
                delay: {
                  sync: false,
                  value: 0,
                },
                duration: {
                  sync: false,
                  value: 0,
                },
              },
              links: {
                blink: false,
                color: {
                  value: "#fff",
                },
                consent: false,
                distance: 100,
                enable: false,
                frequency: 1,
                opacity: 1,
                shadow: {
                  blur: 5,
                  color: {
                    value: "#000",
                  },
                  enable: false,
                },
                triangles: {
                  enable: false,
                  frequency: 1,
                },
                warp: false,
                width: 1,
              },
              move: {
                angle: {
                  offset: 0,
                  value: 90,
                },
                attract: {
                  distance: 200,
                  enable: false,
                  rotate: {
                    x: 3000,
                    y: 3000,
                  },
                },
                center: {
                  mode: "percent",
                  radius: 0,
                  x: 50,
                  y: 50,
                },
                decay: 0,
                direction: "none",
                distance: {},
                drift: 0,
                enable: true,
                gravity: {
                  acceleration: 9.81,
                  enable: false,
                  inverse: false,
                  maxSpeed: 50,
                },
                outModes: {
                  default: "out",
                },
                path: {
                  clamp: true,
                  delay: {
                    value: 0,
                  },
                  enable: false,
                  options: {},
                },
                random: false,
                size: false,
                speed: {
                  max: 1,
                  min: 0.1,
                },
                spin: {
                  acceleration: 0,
                  enable: false,
                },
                straight: false,
                trail: {
                  enable: false,
                  fill: {},
                  length: 10,
                },
                vibrate: false,
                warp: false,
              },
              number: {
                density: {
                  enable: true,
                  height: 400,
                  width: 400,
                },
                limit: {
                  mode: "delete",
                  value: 0,
                },
                value: particleDensity,
              },
              opacity: {
                animation: {
                  count: 0,
                  decay: 0,
                  delay: 0,
                  destroy: "none",
                  enable: true,
                  mode: "auto",
                  speed,
                  startValue: "random",
                  sync: false,
                },
                value: {
                  max: 1,
                  min: 0.1,
                },
              },
              orbit: {
                animation: {
                  count: 0,
                  decay: 0,
                  delay: 0,
                  enable: false,
                  speed: 1,
                  sync: false,
                },
                enable: false,
                opacity: 1,
                rotation: {
                  value: 45,
                },
                width: 1,
              },
              reduceDuplicates: false,
              repulse: {
                distance: 1,
                duration: 1,
                enabled: false,
                factor: 1,
                speed: 1,
                value: 0,
              },
              roll: {
                darken: {
                  enable: false,
                  value: 0,
                },
                enable: false,
                enlighten: {
                  enable: false,
                  value: 0,
                },
                mode: "vertical",
                speed: 25,
              },
              rotate: {
                animation: {
                  decay: 0,
                  enable: false,
                  speed: 0,
                  sync: false,
                },
                direction: "clockwise",
                path: false,
                value: 0,
              },
              shadow: {
                blur: 0,
                color: {
                  value: "#000",
                },
                enable: false,
                offset: {
                  x: 0,
                  y: 0,
                },
              },
              shape: {
                close: true,
                fill: true,
                options: {},
                type: "circle",
              },
              size: {
                animation: {
                  count: 0,
                  decay: 0,
                  delay: 0,
                  destroy: "none",
                  enable: false,
                  mode: "auto",
                  speed: 5,
                  startValue: "random",
                  sync: false,
                },
                value: {
                  max: maxSize,
                  min: minSize,
                },
              },
              stroke: {
                width: 0,
              },
              tilt: {
                animation: {
                  decay: 0,
                  enable: false,
                  speed: 0,
                  sync: false,
                },
                direction: "clockwise",
                enable: false,
                value: 0,
              },
              twinkle: {
                lines: {
                  enable: false,
                  frequency: 0.05,
                  opacity: 1,
                },
                particles: {
                  enable: false,
                  frequency: 0.05,
                  opacity: 1,
                },
              },
              wobble: {
                distance: 5,
                enable: false,
                speed: {
                  angle: 50,
                  move: 10,
                },
              },
              zIndex: {
                opacityRate: 1,
                sizeRate: 1,
                value: 0,
                velocityRate: 1,
              },
            },
          }}
          particlesLoaded={particlesLoaded}
        />
      ) : null}
    </div>
  );
}
