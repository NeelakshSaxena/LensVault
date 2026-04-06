# LensVault

LensVault is a secure, serverless photography portfolio platform that transforms scattered Google Drive folders into a beautiful, chronological online gallery. It acts as an elegant public-facing archive for photographers.

## Features

- **Google Sign-In Authentication**: Strict 1-to-1 account mapping between unique, permanent usernames and Gmail ID's.
- **Serverless Google API Proxy**: Protects developers' Google API keys by routing all Google Drive image-fetching queries securely via Netlify Serverless Edge Functions.
- **Decoupled Headless Database**: Employs Netlify Blobs key-value pair database to permanently store and link User Profiles to their corresponding Google Drive IDs.
- **Automated Metadata Extraction**: Harvests existing Exif/Image properties directly from Google Drive natively including Lens, ISO, and Shutter data.
- **Lightbox Masonry Galleries**: High-resolution gallery arrays mapped sequentially by Year & Month featuring an immersive, full-screen lightbox.

## Technologies Used

- **Frontend**: React (Vite), React Router DOM, Tailwind CSS V4
- **Backend**: Netlify Serverless Functions, Netlify Blobs (KV Store)
- **APIs**: `@react-oauth/google` for authentication, Native Google Drive `v3` API 
- **Icons**: Google Material Symbols

## Installation & Setup

1. Clone this repository locally.
2. Ensure you have the `netlify-cli` installed system-wide:
   ```bash
   npm i -g netlify-cli
   ```
3. Initialize the application:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory based on `.env.example`.
5. Run the Local Development Environment featuring edge-function support:
   ```bash
   npx netlify dev
   ```

## Environment Variables

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Client | Your Google Cloud OAuth Consumer ID to render the Google Login Pop-Up securely. |
| `GOOGLE_DRIVE_API_KEY` | Server | A Developer API Key required to query Google Drive files remotely. *Never exposed to the web.* |

## Deployment Configurations

LensVault implements proactive build security settings leveraging `netlify.toml`. The `SECRETS_SCAN_OMIT_KEYS` parameter explicitly allows safe variables such as OAuth Client IDs to be compiled into the static React bundle without triggering automatic deployment halting from external scanning filters.
