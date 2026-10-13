import { cn } from "cn";

import { Field, FieldDescription, FieldLabel } from "@/registry/ui/field";
import { OTPField, OTPFieldInput } from "@/registry/ui/otp-field";

const OTP_LENGTH = 6;

const OTP_SLOT_KEYS = Array.from(
  { length: OTP_LENGTH },
  (_, i) => `otp-slot-${i}`
);

export function Particle() {
  return (
    <Field className="items-center">
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={OTP_LENGTH}>
        {OTP_SLOT_KEYS.map((slotKey, index) => (
          <OTPFieldInput
            aria-label={`Character ${index + 1} of ${OTP_LENGTH}`}
            className={cn(
              "placeholder:text-foreground-muted focus-visible:placeholder:text-transparent"
            )}
            key={slotKey}
            placeholder="•"
          />
        ))}
      </OTPField>
      <FieldDescription>
        Placeholder hints stay visible until the focused slot is active.
      </FieldDescription>
    </Field>
  );
}
