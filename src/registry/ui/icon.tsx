import { HugeiconsIcon } from "@hugeicons/react";

export function Icon({
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: React.ComponentProps<typeof HugeiconsIcon>) {
  return (
    <HugeiconsIcon
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
