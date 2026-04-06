import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = new URL(req.url);
  const usernameQuery = url.searchParams.get("username");

  if (!usernameQuery) {
    return new Response(JSON.stringify({ error: "username query param required" }), { status: 400 });
  }

  const safeUsername = usernameQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const store = getStore("profiles");
  const profileData = await store.get(safeUsername);

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

  // Completely invisible to the web browser!
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY || process.env.VITE_GOOGLE_DRIVE_API_KEY; 
  
  if (!API_KEY) {
    // Return mock data for testing locally if no key exists
    return new Response(JSON.stringify({
        id: folderId, name: "RAW_ARCHIVES", files: [
          {
            id: "mock-bg-1",
            name: "Server Driven Mock",
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxH2sBrW4YTPWyqviw2KUBLB_YSXaIYX8bq4kCAfOlaRzC7Kao9znzT1mbNwqn7ZBHdB45fo3J7ULchQFN3_uXERFAFzC9pJswNfgIaBMs8h0HmtmPPtenlm858mOwOQAKV_0qux4YqLy-z9jfXQIdfhBmWpaQ-H8dHy_pzncvbssKIc9Un1z5GibPwbfhYAPM5QKdnYPkVSeH02YWXlZ9UvYsTw2QtpYQ7fLtMYOgMQeVWkPA5-z51TyaXVnMXUSubKJsFgtGX4DE",
            createdTime: "2024-04-24T08:20:00Z",
            metadata: { lens: "24mm f/2.8", iso: "640", shutter: "1/4000" }
          }
        ]
    }), { status: 200, headers: { "Content-Type": "application/json" }});
  }

  try {
      const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
      const fields = "files(id, name, mimeType, webContentLink, thumbnailLink, createdTime, imageMediaMetadata)";
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const transformed = {
        id: folderId,
        name: "ARCHIVES",
        files: data.files.map(file => {
          // Use the thumbnailLink but upgrade the resolution parameter to 2000px
          // This bypasses CORS and auth prompts normally placed on webContentLink
          const imageUrl = file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, "=s2000") : file.webContentLink;

          return {
            id: file.id,
            name: file.name,
            url: imageUrl,
            createdTime: file.createdTime,
            metadata: {
              lens: file.imageMediaMetadata?.lens || "Unknown Lens",
              iso: file.imageMediaMetadata?.isoSpeed || "Auto",
              shutter: file.imageMediaMetadata?.exposureTime ? `1/${Math.round(1 / file.imageMediaMetadata.exposureTime)}` : "Unknown"
            }
          };
        })
      };

      return new Response(JSON.stringify(transformed), {
          status: 200,
          headers: { "Content-Type": "application/json" }
      });
  } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const config = {
  path: "/api/portfolio"
};
