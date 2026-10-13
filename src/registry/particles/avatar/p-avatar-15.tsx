import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/ui/avatar";

const users = [
  {
    fallback: "LT",
    id: "1",
    src: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
  },
  {
    fallback: "MS",
    id: "2",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&dpr=2&q=80",
  },
  {
    fallback: "JD",
    id: "3",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&dpr=2&q=80",
  },
];

export function Particle() {
  return (
    <AvatarGroup>
      {users.map((user) => (
        <Avatar key={user.id}>
          <AvatarImage alt={user.fallback} src={user.src} />
          <AvatarFallback>{user.fallback}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  );
}
