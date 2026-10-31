import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fetchRegistryIndex,
  getItemKind,
  getItemUrl,
  getRegistryTemplate,
  resolveItem,
  searchItems,
} from "../src/utils/registry";
import {
  type RegistryServer,
  startRegistryServer,
} from "./helpers/registry-server";

let registry: RegistryServer;

beforeAll(async () => {
  registry = await startRegistryServer();
});

afterAll(async () => {
  await registry.close();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveItem", () => {
  it("puts names into the @time2code namespace", () => {
    expect(resolveItem("button")).toBe("@time2code/button");
  });

  it("passes namespaced items, URLs and local files through", () => {
    for (const item of [
      "@acme/card",
      "https://ui.shadcn.com/r/styles/new-york-v4/card.json",
      "./item.json",
      "/abs/item.json",
      "item.json",
    ]) {
      expect(resolveItem(item)).toBe(item);
    }
  });
});

describe("getRegistryTemplate", () => {
  it("defaults to the production registry", () => {
    vi.stubEnv("REGISTRY_URL", undefined);

    expect(getRegistryTemplate()).toBe(
      "https://design.time2code.dev/r/{name}.json"
    );
  });

  it("reads REGISTRY_URL as a base URL or a template", () => {
    for (const url of [
      "http://localhost:3000/r",
      "http://localhost:3000/r/",
      "http://localhost:3000/r/*",
      "http://localhost:3000/r/{name}.json",
    ]) {
      vi.stubEnv("REGISTRY_URL", url);
      expect(getRegistryTemplate()).toBe("http://localhost:3000/r/{name}.json");
    }
  });

  it("prefers the --registry option", () => {
    vi.stubEnv("REGISTRY_URL", "http://localhost:3000/r");

    expect(
      getItemUrl("button", getRegistryTemplate("https://example.com/r"))
    ).toBe("https://example.com/r/button.json");
  });
});

describe("searchItems", () => {
  it("matches every word and ranks name matches first", async () => {
    const index = await fetchRegistryIndex(getRegistryTemplate(registry.url));

    expect(
      searchItems(index, { query: "button" }).map((item) => item.name)
    ).toEqual(["button", "p-button-1"]);
    expect(searchItems(index, { query: "button variants" })).toHaveLength(1);
  });

  it("filters by kind", async () => {
    const index = await fetchRegistryIndex(getRegistryTemplate(registry.url));

    expect(
      searchItems(index, { kinds: ["example"] }).map((item) => item.name)
    ).toEqual(["p-button-1"]);
    expect(index.map(getItemKind)).toEqual([
      "ui",
      "ui",
      "component",
      "hook",
      "block",
      "example",
    ]);
  });
});
