import { type NextRequest, NextResponse } from "next/server";

import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const { rewrite: rewriteLLM } = rewritePath("/docs/*path", "/llms.mdx/*path");
const { rewrite: rewriteMd } = rewritePath(
  "/docs{/*path}.md{x}",
  "/llms.mdx{/*path}"
);

export default function proxy(request: NextRequest) {
  const resultMd = rewriteMd(request.nextUrl.pathname);
  if (resultMd) {
    return NextResponse.rewrite(new URL(resultMd, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const resultLlm = rewriteLLM(request.nextUrl.pathname);
    if (resultLlm) {
      return NextResponse.rewrite(new URL(resultLlm, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: "Accept" },
      });
    }
  }

  return NextResponse.next();
}
