import { Group, GroupSeparator, GroupText } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { Label } from "@/registry/ui/label";

export function Particle() {
  return (
    <Group aria-label="Domain input">
      <Input
        aria-label="Domain"
        defaultValue="time2code"
        id="domain-suffix"
        type="text"
      />
      <GroupSeparator />
      <GroupText
        render={<Label aria-label="Domain suffix" htmlFor="domain-suffix" />}
      >
        .com
      </GroupText>
    </Group>
  );
}
