// src/services/googleDrive.js

/**
 * Proxies the Google Drive fetch securely to our Netlify backend.
 * Uses the custom username to locate the assigned folder securely in the backend.
 */
export const connectToGoogleDrive = async (username) => {
  if (!username) throw new Error("Username is required");

  try {
    const response = await fetch(`/api/portfolio?username=${encodeURIComponent(username)}`);

    if (!response.ok) {
      let error = "Failed to load portfolio.";
      try {
         const data = await response.json();
         if (data.error) error = data.error;
      } catch (e) {}
      throw new Error(error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to proxy portfolio from backend:", error);
    throw error;
  }
};
