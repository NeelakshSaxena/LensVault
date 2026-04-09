import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("public_feed");

  if (req.method === "GET") {
    try {
      const feed = await store.get("feed", { type: "json" }) || [];
      return new Response(JSON.stringify(feed), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch(err) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = await req.json();
      
      if (!payload.url || !payload.username) {
         return new Response(JSON.stringify({ error: "Missing metadata" }), { status: 400 });
      }

      const feed = await store.get("feed", { type: "json" }) || [];
      
      // Prevent duplicates based on file ID
      const isDuplicate = feed.some(img => img.id === payload.id);
      if (!isDuplicate) {
        
        // Cache the image into a BLOB store
        try {
           const imgRes = await fetch(payload.url);
           if (imgRes.ok) {
              const buffer = await imgRes.arrayBuffer();
              const cType = imgRes.headers.get("content-type") || "image/jpeg";
              const imageStore = getStore("images");
              await imageStore.set(payload.id, buffer, { metadata: { type: cType } });
           }
        } catch(e) {
           console.error("Failed to cache image for global feed", e);
        }

        feed.unshift({
          ...payload,
          url: `/api/image?id=${payload.id}`,
          pinnedAt: new Date().toISOString()
        });
        
        // Keep feed under 200 items for performance
        if (feed.length > 200) feed.length = 200;
        
        await store.setJSON("feed", feed);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch(err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const payload = await req.json();
      
      if (!payload.id) {
         return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
      }

      const feed = await store.get("feed", { type: "json" }) || [];
      const newFeed = feed.filter(img => img.id !== payload.id);
      
      await store.setJSON("feed", newFeed);

      // Clean up the image blob
      try {
          const imageStore = getStore("images");
          await imageStore.delete(payload.id);
      } catch(e) { console.error("Failed to delete cached image", e); }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch(err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/feed"
};
