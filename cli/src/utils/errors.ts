interface CliErrorOptions extends ErrorOptions {
  /** how to fix the problem */
  hint?: string;
}

/**
 * An expected failure with a message meant for the user, printed without a
 * stack trace.
 */
export class CliError extends Error {
  readonly hint?: string;

  constructor(message: string, { hint, ...options }: CliErrorOptions = {}) {
    super(message, options);
    this.name = "CliError";
    this.hint = hint;
  }
}
