import { Group, GroupSeparator, GroupText } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { Label } from "@/registry/ui/label";

export function Particle() {
  return (
    <Group aria-label="Domain input">
      <GroupText render={<Label aria-label="Domain" htmlFor="domain" />}>
        https://
      </GroupText>
      <GroupSeparator />
      <Input
        aria-label="Domain"
        defaultValue="time2code.dev"
        id="domain"
        type="text"
      />
    </Group>
  );
}
