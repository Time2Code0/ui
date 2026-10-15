import type { NextConfig } from "next";

import "./src/env";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default withMDX(nextConfig);
