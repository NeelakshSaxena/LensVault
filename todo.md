

# 🎨 Phase 0 — UI IDEA (Google Stitch Prompt)

You want a UI that feels like a **premium photographer portfolio**, not a college project.

## 🧠 UI Concept: “Minimal Editorial Portfolio”

* Dark + light toggle
* Large edge-to-edge images
* Clean typography (Playfair / Inter combo)
* Pinterest-style grid
* Smooth hover zoom
* Timeline-based grouping

---

## 🧾 🎯 Google Stitch Prompt

Paste this:

Design a modern, minimal photographer portfolio web app.

Layout:

* Full-width hero section with photographer name and tagline
* Sticky transparent navbar (Home, Gallery, About)
* Masonry grid gallery with high-resolution images
* Images grouped by date (Year → Month sections)
* Hover effect: slight zoom + metadata overlay (date, camera info)
* Click image opens fullscreen modal with navigation

Style:

* Clean, editorial, premium feel (like Apple or Vogue)
* Use lots of whitespace
* Smooth animations and transitions
* Dark and light mode toggle

Components:

* Folder selection button (connect Google Drive)
* Loading skeletons while images load
* Empty state (no images selected)

Color:

* Neutral tones (black, white, beige)
* Accent: soft gold or muted blue

Responsive:

* Mobile-first, grid adapts to screen size

Goal:
Make it look like a professional photography portfolio platform, not a student project.

---

# ⚙️ SYSTEM PROMPT (FOR AGENT CONTROL)

Use this for Claude Code / Codex:

You are a senior full-stack developer building a structured academic project.

Rules:

* Follow phase-by-phase execution strictly
* Do NOT skip phases
* Do NOT refactor previous phases unless asked
* Keep code modular and clean
* Prefer simplicity over overengineering
* Use comments explaining logic for academic evaluation
* Avoid unnecessary dependencies
* Ensure each phase is runnable before moving forward

Output format:

* Always provide full working files
* Maintain folder structure
* Clearly label files

STOP CONDITION:

* After completing each phase, STOP and wait for user input before proceeding
* Do not auto-continue to next phase

---

# 🧠 AGENTIC LOOP STOP (CRUCIAL)

Use this after every phase:

Phase complete.

Do not proceed further.

Ask:
"Do you want to continue to the next phase or modify this phase?"

Wait for explicit user confirmation before continuing.

---

# 🧩 PHASE BREAKDOWN (MAX 5 PHASES)

---

# 🥇 Phase 1 — HTML (Structure Only)

## 🎯 Goal:

Static layout (NO styling, NO JS)

## Includes:

* Semantic structure:

  * header
  * nav
  * main
  * sections (gallery, about)
  * footer
* Placeholder images
* Folder connect button

## Prompt (Agent)

Build Phase 1: HTML structure only.

Requirements:

* Use semantic HTML5 tags
* Create:

  * Header with navbar
  * Hero section
  * Gallery section (static placeholder images)
  * About section
  * Footer
* Include a "Connect Google Drive" button (no functionality yet)
* Add proper class names for styling later

Constraints:

* No CSS
* No JavaScript
* Clean indentation

Output:

* index.html only

---

# 🥈 Phase 2 — CSS (Styling)

## 🎯 Goal:

Make it look like a real product

## Includes:

* Grid gallery
* Hover effects
* Responsive design
* Dark/light mode toggle (UI only)

## Prompt:

Build Phase 2: CSS styling.

Requirements:

* Style the existing HTML
* Implement:

  * Responsive masonry/grid gallery
  * Navbar styling (sticky)
  * Hero section typography
  * Hover zoom effect on images
  * Clean spacing (margin/padding)
* Add dark and light theme styles (toggle not functional yet)

Constraints:

* Use external CSS file
* No JavaScript yet

Output:

* styles.css
* Updated index.html (linked CSS)

---

# 🥉 Phase 3 — JavaScript + API Setup

## 🎯 Goal:

Make it dynamic + connect Google Drive

---

## 🔌 Google Drive API Setup (Explain in Viva)

1. Go to:
   👉 Google Cloud Console
2. Create project
3. Enable:

   * Google Drive API
4. Create credentials:

   * OAuth 2.0 Client ID
5. Add:

   * Authorized origins (localhost)

---

## Prompt:

Build Phase 3: JavaScript functionality + Google Drive API integration.

Requirements:

* Add JavaScript file
* Implement:

  * Button click → trigger Google login (mock or real)
  * Fetch images from a selected Google Drive folder
  * Filter only image files
  * Extract metadata:

    * createdTime
* Dynamically render images into gallery
* Sort images by date

UI behavior:

* Show loading state
* Handle empty folder

Constraints:

* Use vanilla JavaScript
* Keep API logic in separate file (services/googleDrive.js)
* Add comments explaining API usage

Output:

* script.js
* googleDrive.js
* Updated index.html

---

# 🏆 Phase 4 — React Migration

## 🎯 Goal:

Convert everything into React

---

## Prompt:

Build Phase 4: Convert project into React.

Requirements:

* Use Vite React setup
* Convert UI into components:

  * Navbar
  * Gallery
  * ImageCard
  * FolderPicker
* Use hooks:

  * useState
  * useEffect
* Move API logic into services
* Dynamically render images from state

Constraints:

* Functional components only
* Clean folder structure
* No unnecessary libraries

Output:

* Full React project structure
* All components

---

# 🚀 Phase 5 — Deployment

## 🎯 Goal:

Make it live

---

## Prompt:

Build Phase 5: Deployment.

Requirements:

* Prepare project for production
* Optimize images loading
* Add basic SEO tags
* Deploy using Vercel or Netlify
* Provide deployment steps

Output:

* Deployment guide
* Final build-ready code adjustments

---

# 🧠 Bonus Prompt (For Better UI Polish)

Improve UI polish:

* Add smooth transitions
* Add modal for image preview
* Add loading skeletons
* Improve typography and spacing
* Ensure mobile responsiveness is perfect

Do not break existing functionality.

---

# ⚡ Final Thought

This setup does **3 very powerful things**:

1. Keeps your agent from going rogue (huge problem usually)
2. Makes your project look structured and “engineered”
3. Covers *every module* cleanly


