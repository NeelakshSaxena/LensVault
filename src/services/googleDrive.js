// src/services/googleDrive.js

/**
 * Fetches files from a public Google Drive Folder using an API Key.
 * Note: The VITE_GOOGLE_DRIVE_API_KEY must be specified in the environment variables.
 * For local testing, add it to `.env`. For production, add it to Netlify Environment panel.
 */
export const connectToGoogleDrive = async (folderId) => {
  if (!folderId) throw new Error("Folder ID is required");

  const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

  if (!API_KEY) {
    // If no API Key is provided, fallback to standard mock for seamless UI testing
    console.warn("No VITE_GOOGLE_DRIVE_API_KEY provided. Falling back to mock data.");
    return getMockData(folderId);
  }

  try {
    // We only fetch files that are images inside the given parent folder ID.
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const fields = "files(id, name, mimeType, webContentLink, createdTime, imageMediaMetadata)";
    
    // Important: Include `key` param for API key authentication on public folders
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the Google Drive files into the structure expected by our Gallery UI
    return {
      id: folderId,
      name: "ARCHIVES",
      files: data.files.map(file => ({
        id: file.id,
        name: file.name,
        // Since we don't want to enforce Google OAuth for VIEWING, we use webContentLink (direct download) 
        // to render. Note: this works for public files.
        url: file.webContentLink,
        createdTime: file.createdTime,
        metadata: {
          lens: file.imageMediaMetadata?.lens || "Unknown Lens",
          iso: file.imageMediaMetadata?.isoSpeed || "Auto",
          shutter: file.imageMediaMetadata?.exposureTime ? `1/${Math.round(1 / file.imageMediaMetadata.exposureTime)}` : "Unknown"
        }
      }))
    };
  } catch (error) {
    console.error("Failed to fetch from Google Drive:", error);
    throw error;
  }
};

// ==========================================
// MOCK DATA FALLBACK (Used when no API key available)
// ==========================================
const getMockData = async (folderId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: folderId,
    name: "RAW_ARCHIVES",
    files: [
      {
        id: "mock-1",
        name: "Silent Peaks",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq62LhLnsBhH4zFSOpfHIW6TFm1L6WKYBuLj1LU7w0BYOoPwD7on3XVpRhjp5DfVa2C2tRvNsowpFfQCxBHYC_0gmQXHSdUmsjE_3UQu5vnKSMLIkK2mj9txo2IU0SbW_H7uCbrExlxzB7DTAYVCQGjPFmXiZaNQkl2JsVkoCZXpAud3xJquTDFv2ysG2cICfIs7jEu5WB9b4or6eirHzXHxR9j_12x8ubIvYXNlnUrbnk5zcjUqVEbGJ8x-Tc5tyarixBz_LWgO_V",
        createdTime: "2024-05-12T14:30:00Z",
        metadata: { lens: "35mm f/1.4", iso: "400", shutter: "1/250" }
      },
      {
        id: "mock-2",
        name: "Concrete Geometry",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_roicC63lwUeer-Sk9sRe2YX6xxs9XVGtUYKpZdDpZ6Z-WBCJw3D5YbVYu0uwbUkFmBZryx74-xWfHXh9UUYek9nje9EEBEnjaHrEjKZJd0CZ2Pk2Z_TMmTyoJm8u3kGyEqXOQ0nNGtNuSuf3-UXkhGqlGARRGLkNRAoLXQclzC1jGwaB5Z3rT1ZPvVEwVhV9JZnp_ok5UTqOcwwsAP1TSuyN6GtCwcKGa9GTeRxvdbkhKzQnTqBGz5l7PIc2tgX-hPI9gms7B2j4",
        createdTime: "2024-05-08T10:15:00Z",
        metadata: { lens: "50mm f/2.0", iso: "100", shutter: "1/2000" }
      },
      {
        id: "mock-3",
        name: "Isolation",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvt-5FlAk1YWNU4sxaO11-lX-MlGi895SkvnfTrMGWKGO2v6CMt8RBWxldAoFw8BmilBpAZc20YCa18t9JWRIeW3x5VCzDDse288DR0TLQYud8A8SsMRXt7lgUlvyyPq95lAPds92BVcr6W6si-UdMBdyF_sbMUZ5hy3Rt7My7L7yfATX-5hXDcpBUnvmBIRqOIVCbpr_0AbvCvI3JuvFJE89yUu-o-DYDSBjnVuGwY6qpJ4ZRQOtQpkaF0HcvFrYP3c8cSShzBKAF",
        createdTime: "2024-05-02T16:45:00Z",
        metadata: { lens: "85mm f/1.8", iso: "200", shutter: "1/800" }
      },
      {
        id: "mock-4",
        name: "The Tides",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxH2sBrW4YTPWyqviw2KUBLB_YSXaIYX8bq4kCAfOlaRzC7Kao9znzT1mbNwqn7ZBHdB45fo3J7ULchQFN3_uXERFAFzC9pJswNfgIaBMs8h0HmtmPPtenlm858mOwOQAKV_0qux4YqLy-z9jfXQIdfhBmWpaQ-H8dHy_pzncvbssKIc9Un1z5GibPwbfhYAPM5QKdnYPkVSeH02YWXlZ9UvYsTw2QtpYQ7fLtMYOgMQeVWkPA5-z51TyaXVnMXUSubKJsFgtGX4DE",
        createdTime: "2024-04-24T08:20:00Z",
        metadata: { lens: "24mm f/2.8", iso: "640", shutter: "1/4000" }
      },
      {
        id: "mock-6",
        name: "Still Waters",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBB9z98y9BUCuGkZ1QR2bYZTQgsUeKrht_8-G7aLyqdW0nO_xuQLOx2ib-_z9Ccz_lWhA5ALTvptt-Ljhevi6CGi7AO8tHGfhbF2uox62Fc0SavRxPhJUmRbVORFi5mqZE3vvkgM5STk24dzZNDRlFEKkfjcq7_JhYNIRQiiEUw9O6-tssO44tO62z-QEY-LMdx18CvNWuwFdmerYg1VpkXXQ_trDZh0Y3U3H5tVW4OH9hZJACqGDykPIzFs_dWepxPrpM8OaP9ElT",
        createdTime: "2023-10-28T17:15:00Z",
        metadata: { lens: "35mm f/2.8", iso: "100", shutter: "1/60" }
      }
    ]
  };
}
