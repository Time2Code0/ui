import { cn } from "cn";

interface Props {
  angle?: number;
  className?: string;
  colors?: string[];
  duration?: number;
  height?: number;
}

export function NorthernLights({
  angle = 110,
  height = 512,
  colors = ["#006354", "#006efe", "#9440d5", "#f12b82", "#ffae00"],
  duration = 25,
  className,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div
        className="absolute top-0 left-1/2 w-full -translate-x-1/2"
        style={{
          height: `${height}px`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse at 50% 18%, black 27%, transparent 70%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="fade-in-0 pointer-events-none absolute inset-[-10px] animate-in overflow-hidden text-white blur-[46px] invert transition-opacity duration-500 dark:text-black dark:opacity-70 dark:invert-0"
              style={
                {
                  "--background-color": "var(--background)",
                  "--duration": `${duration}s`,
                  "--gaps": `repeating-linear-gradient(${angle}deg, var(--background-color) 0%, var(--background-color) 7%, transparent 10%,transparent 12%, var(--background-color) 19%)`,
                  "--lights": `repeating-linear-gradient(${angle}deg, ${colors.map((color, index) => `${color} ${(index + 1) * 5 + 5}%`).join(", ")})`,
                  backgroundImage: "var(--gaps), var(--lights)",
                  backgroundPosition: "50% 50%, 50% 50%",
                  backgroundSize: "120%, 200%",
                  transform: "translate3d(0, 0, 0)",
                } as React.CSSProperties
              }
            >
              <div
                className="absolute h-full w-[300%] mix-blend-difference"
                style={{
                  animation:
                    "northern-lights var(--duration) cubic-bezier(.15,0,.85,1) infinite alternate",
                  backgroundImage: "var(--gaps), var(--lights)",
                  backgroundPosition: "50% 50%",
                  backgroundSize: "100%, 100%",
                }}
              />
              <style>
                {`@keyframes northern-lights {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }`}
              </style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
