import { GalleryVerticalEndIcon } from "@hugeicons/core-free-icons";

import { LoginForm } from "@/registry/blocks/login-01/components/login-form";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link className="flex items-center gap-2 font-medium" href="#">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon className="size-4" icon={GalleryVerticalEndIcon} />
            </div>
            Acme Inc.
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 size-full bg-background-muted" />
      </div>
    </div>
  );
}
