import { describe, expect, it } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import { createProgram } from "../src/program";

describe("createProgram", () => {
  it("registers add, create and mcp", () => {
    const program = createProgram();

    expect(program.commands.map((command) => command.name())).toEqual([
      "add",
      "create",
      "mcp",
    ]);
    expect(
      program.commands
        .find((command) => command.name() === "mcp")
        ?.commands.map((command) => command.name())
    ).toEqual(["init"]);
  });

  it("prints the version", async () => {
    let output = "";
    const program = createProgram()
      .exitOverride()
      .configureOutput({
        writeOut: (text) => {
          output += text;
        },
      });

    await expect(
      program.parseAsync(["node", "time2code", "--version"])
    ).rejects.toMatchObject({ code: "commander.version" });
    expect(output.trim()).toBe(packageJson.version);
  });

  it("parses add options", () => {
    const [add] = createProgram().commands;

    const { operands } = add.parseOptions([
      "button",
      "card",
      "--overwrite",
      "-c",
      "apps/web",
    ]);

    expect(add.opts()).toMatchObject({ cwd: "apps/web", overwrite: true });
    expect(operands).toEqual(["button", "card"]);
  });
});
