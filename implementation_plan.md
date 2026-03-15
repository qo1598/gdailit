# AI Literacy Platform Implementation Plan

This plan outlines the next steps to polish the existing AI Literacy Platform prototype (specifically focusing on missions E-1 and M-1) based on the current codebase. The focus will be on improving the UX/UI (animations, design), ensuring perfect responsive design across devices, and integrating Supabase for real data persistence.

## User Review Required

> [!CAUTION]
> Please review the plan below. If the direction looks good, I will proceed to EXECUTION to implement these changes.
> *Note: We will need your Supabase Project URL and Anon Key during the execution phase. I will ask for these when we are ready.*

## Proposed Changes

We will enhance the existing React application, focusing on the following areas:

### 1. Silhouette Badge implementation & Design Enhancements

#### [MODIFY] [index.css](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/index.css)
- **Silhouette Effect:** Improve `.silhouette` class to better handle images with backgrounds. Use a combination of `filter` (grayscale, brightness, contrast) and `mix-blend-mode: multiply` to isolate silhouettes.
- **Outline/Ghost Style:** Create a "locked" badge style that shows the shape but obscures the detail using `opacity` and a specific background color.
- **Animations:** Add confetti animations (e.g., using `canvas-confetti` or CSS) for when a user completes a mission.
- **Interactions:** Enhance hover states for mission cards (e.g., 3D lift effect, slight glow).

#### [MODIFY] [Dashboard.jsx](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/components/Dashboard.jsx)
- **Badge Rendering:** Update the logic for locked badges to use the improved silhouette styling. Add a semi-transparent overlay if needed to match the "locked" feel.
- **Progress Animation:** Add an animated entrance for the badge cards when the dashboard loads.

### 2. Responsive Design

#### [MODIFY] [index.css](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/index.css)
- Remove the fixed `max-width: 480px` constraint to allow the app to adapt to tablets and larger screens while maintaining a mobile-first app feel (e.g., center the main view on desktop but allow it to stretch slightly on tablet).
- Ensure the badge grid (`.badge-grid`) adapts from 2 columns on mobile to 3 or 4 columns on larger screens using CSS Grid `repeat(auto-fit, ...)`.
- Ensure forms in `Mission.jsx` and `MiniGame.jsx` scale comfortably on all devices.

### 3. Supabase Integration (Backend Data)

#### [NEW] [supabaseClient.js](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/supabaseClient.js)
- Initialize the Supabase client using `@supabase/supabase-js`.

#### [MODIFY] [Dashboard.jsx](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/components/Dashboard.jsx) & [Mission.jsx](file:///h:/다른 컴퓨터/내 컴퓨터 (1)/allit/ai-literacy-platform/src/components/Mission.jsx)
- **State Management:** Replace the hardcoded `MOCK_MISSIONS` status.
- **Data Fetching:** Fetch the user's completed mission status from a Supabase table (e.g., `user_progress`) on load.
- **Data Submission:** Update `Mission.jsx` `handleSubmit` to save the user's photo/text or rules directly to Supabase storage/database instead of just showing an `alert()`.

## Verification Plan

### Manual Verification
1.  **UX Check:** Complete a mission and observe the new success animations. Hover over cards to see new effects.
2.  **Responsive Check:** Open Chrome DevTools and resize the window from mobile (375px) to tablet (768px) to desktop (1024px+). The layout should remain beautiful and usable.
3.  **Supabase Auth/Data Flow:** Submit a mission (E-1 or M-1) and verify the data appears in the Supabase database/storage console. Reload the page and verify the badge stays "unlocked".
