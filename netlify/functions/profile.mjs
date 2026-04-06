import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const store = getStore("profiles");

  if (req.method === "POST") {
    try {
      const data = await req.json();
      const { username, folderId } = data;

      if (!username || !folderId) {
        return new Response(JSON.stringify({ error: "username and folderId are required" }), { status: 400 });
      }

      const safeUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, "");

      // Save to blob storage
      await store.set(safeUsername, JSON.stringify({ folderId, created: new Date().toISOString() }));

      return new Response(JSON.stringify({ success: true, username: safeUsername }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
    }
  }

  if (req.method === "GET") {
    const username = url.searchParams.get("username");
    if (!username) {
      return new Response(JSON.stringify({ error: "username is required" }), { status: 400 });
    }

    const safeUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, "");
    
    // We used set() with JSON.stringify instead of setJSON to be safe, so we should parse it.
    let profileData = await store.get(safeUsername);
    let folderId = profileData;

    try {
       // if we stored it as json
       const parsed = JSON.parse(profileData);
       if (parsed && parsed.folderId) folderId = parsed.folderId;
    } catch (e) {
       // Ignore, it was just a string
    }

    if (!folderId) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ folderId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
};

export const config = {
  path: "/api/profile"
};
