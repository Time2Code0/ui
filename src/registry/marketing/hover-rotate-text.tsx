import { cn } from "cn";

interface Props
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  delay?: number;
  splitBy?: "none" | "char" | "word";
  text: string;
}

export function HoverRotateText({
  text,
  delay = 20,
  splitBy = "char",
  className,
  ...props
}: Props) {
  let tokens = [text];

  if (splitBy === "char") {
    tokens = text.split("");
  } else if (splitBy === "word") {
    // biome-ignore lint/performance/useTopLevelRegex: whitespace regex
    tokens = text.split(/(\s+)/).filter((entry) => entry !== " ");
  }

  return (
    <div className={cn("group relative overflow-hidden", className)} {...props}>
      <span className="flex">
        {tokens.map((token, index) => (
          <span
            className="transition-transform duration-500 ease-in-out hover:duration-300 group-hover:-translate-y-full"
            key={`source-${token}`}
            style={{
              transitionDelay: `calc((${index} + 1) * ${delay}ms)`,
            }}
          >
            <DisplayToken token={token} />
          </span>
        ))}
      </span>

      <span className="absolute top-0 left-0 flex">
        {tokens.map((token, index) => (
          <span
            className="flex translate-y-full transition-transform duration-500 ease-in-out hover:duration-300 group-hover:translate-y-0"
            key={`copy-${token}`}
            style={{
              transitionDelay: `calc((${index} + 1) * ${delay}ms)`,
            }}
          >
            <DisplayToken token={token} />
          </span>
        ))}
      </span>
    </div>
  );
}

function DisplayToken({
  token,
  splitBy,
}: {
  token: string;
  splitBy?: "none" | "char" | "word";
}) {
  if (splitBy === "word") {
    return (
      <>
        {token}
        <span>&nbsp;</span>
      </>
    );
  }

  if (splitBy === "char" && token === " ") {
    return <span>&nbsp;</span>;
  }

  return <>{token}</>;
}
