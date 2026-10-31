"use client";

import { Button } from "@/registry/ui/button";
import { Field } from "@/registry/ui/field";
import { Form } from "@/registry/ui/form-baseui";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover";
import { Textarea } from "@/registry/ui/textarea";

export function Particle() {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Open Popover</Button>}
      />
      <PopoverPopup className="w-80">
        <div className="mb-4">
          <PopoverTitle className="text-base">Send us feedback</PopoverTitle>
          <PopoverDescription>
            Let us know how we can improve.
          </PopoverDescription>
        </div>
        <Form className="flex w-full flex-col gap-4">
          <Field>
            <Textarea
              aria-label="Send feedback"
              id="feedback"
              placeholder="How can we improve?"
            />
          </Field>
          <Button type="submit">Send feedback</Button>
        </Form>
      </PopoverPopup>
    </Popover>
  );
}
