"use client";

import { Form as FormPrimitive } from "@base-ui/react/form";

export function Form(props: FormPrimitive.Props): React.ReactElement {
  return <FormPrimitive data-slot="form" {...props} />;
}
