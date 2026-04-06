import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const profilesStore = getStore("profiles");
  const emailsStore = getStore("emails");

  if (req.method === "POST") {
    try {
      const data = await req.json();
      const { email, username, folderId } = data;

      if (!email || !username || !folderId) {
        return new Response(JSON.stringify({ error: "email, username, and folderId are required" }), { status: 400 });
      }

      const safeUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, "");

      // 1. Check if email already has an account
      const existingUsernameForEmail = await emailsStore.get(email);
      if (existingUsernameForEmail && existingUsernameForEmail !== safeUsername) {
        return new Response(JSON.stringify({ error: "This email is already linked to the username: " + existingUsernameForEmail }), { status: 400 });
      }

      // 2. Check if username is already taken by someone else
      const existingProfileData = await profilesStore.get(safeUsername);
      if (existingProfileData) {
        const parsed = JSON.parse(existingProfileData);
        if (parsed.email !== email) {
          return new Response(JSON.stringify({ error: "Username is already taken" }), { status: 400 });
        }
      }

      // Save email -> username mapping
      await emailsStore.set(email, safeUsername);

      // Save username -> profile data
      await profilesStore.set(safeUsername, JSON.stringify({ email, folderId, created: new Date().toISOString() }));

      return new Response(JSON.stringify({ success: true, username: safeUsername }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Internal error", details: e.message }), { status: 500 });
    }
  }

  if (req.method === "GET") {
    const emailQuery = url.searchParams.get("email");
    if (emailQuery) {
      const existingUsername = await emailsStore.get(emailQuery);
      if (!existingUsername) {
        return new Response(JSON.stringify({ exists: false }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ exists: true, username: existingUsername }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    const usernameQuery = url.searchParams.get("username");
    if (usernameQuery) {
      const safeUsername = usernameQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
      let profileData = await profilesStore.get(safeUsername);

      if (!profileData) {
        return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
      }

      let folderId = null;
      try {
         const parsed = JSON.parse(profileData);
         folderId = parsed.folderId;
      } catch(e) {
         folderId = profileData;
      }
      
      return new Response(JSON.stringify({ folderId }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "email or username query param required" }), { status: 400 });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
};

export const config = {
  path: "/api/profile"
};
