import { cn } from "cn";

function Spinner({ className, style, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-label="Loading"
      className={cn("size-4", className)}
      data-slot="spinner"
      height="24"
      role="status"
      style={{ animation: "spin 0.8s steps(8, end) infinite", ...style }}
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      {Array.from({ length: 8 }, (_, i) => ({
        id: `spinner-bar-${i}`,
        opacity: +(1 - (i / 8) * 0.85).toFixed(2),
        rotation: i * 45,
      })).map(({ id, opacity, rotation }) => (
        <rect
          fill="currentColor"
          fillOpacity={opacity}
          height="5"
          key={id}
          rx="1"
          transform={`rotate(${rotation} 12 12)`}
          width="2"
          x="11"
          y="2.5"
        />
      ))}
    </svg>
  );
}

function SpinnerCircle({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      fill="none"
      height="24"
      role="status"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function SpinnerCircleFilled({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const r = 9;
  const c = +(2 * Math.PI * r).toFixed(2);

  return (
    <>
      <style>{`
        .spinner-circle-arc {
          transform-box: fill-box;
          transform-origin: center;
          animation: spinner-circle-spin 1s linear infinite;
        }
        @keyframes spinner-circle-spin {
          from { transform: rotate(-90deg); }
          to { transform: rotate(270deg); }
        }
      `}</style>
      <svg
        aria-label="Loading"
        className={cn("size-4", className)}
        data-slot="spinner"
        fill="none"
        height="24"
        role="status"
        viewBox="0 0 24 24"
        width="24"
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r={r}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="2.5"
        />
        <circle
          className="spinner-circle-arc"
          cx="12"
          cy="12"
          r={r}
          stroke="currentColor"
          strokeDasharray={`${+(c * 0.25).toFixed(2)} ${+(c * 0.75).toFixed(
            2
          )}`}
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    </>
  );
}

function SpinnerEllipsis({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <style>{`
        .spinner-ellipsis-dot {
          animation: spinner-ellipsis 1s ease-in-out infinite;
        }
        @keyframes spinner-ellipsis {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        aria-label="Loading"
        className={cn("flex items-center gap-1.5 text-foreground", className)}
        data-slot="spinner"
        role="status"
        {...props}
      >
        {[
          { delay: 0, id: "spinner-ellipsis-dot-1" },
          { delay: 0.2, id: "spinner-ellipsis-dot-2" },
          { delay: 0.4, id: "spinner-ellipsis-dot-3" },
        ].map(({ delay, id }) => (
          <span
            className="spinner-ellipsis-dot size-2 rounded-full bg-current"
            key={id}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </>
  );
}

export { Spinner, SpinnerCircle, SpinnerCircleFilled, SpinnerEllipsis };
