import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  
  if (!id) return new Response("Missing id", { status: 400 });

  const store = getStore("images");
  const data = await store.get(id, { type: "arrayBuffer" });
  if (!data) return new Response("Not found", { status: 404 });

  const metadata = await store.getMetadata(id);
  const type = metadata?.metadata?.type || "image/jpeg";

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};

export const config = {
  path: "/api/image"
};
