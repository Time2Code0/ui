import { docsLlms } from "@/lib/llms";

export async function GET() {
  return new Response(await docsLlms.index());
}
