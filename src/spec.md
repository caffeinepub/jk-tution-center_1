# Specification

## Summary
**Goal:** Let admins manage site-wide branding and contact information at runtime (including uploading a logo stored in-canister), have the public site reflect those settings dynamically, and remove all Caffeine branding.

**Planned changes:**
- Add backend site settings state that persists across canister upgrades, including contact details and a stored logo (raw bytes + content type).
- Expose public backend query APIs to fetch current contact details and the current logo bytes/content type; add admin-only update APIs for contact details and logo upload/replace with authorization checks.
- Add an Admin Dashboard “Settings” area (admin-only) to upload/replace the logo and edit contact details, saving to the backend and refetching/invalidation so changes appear without redeploy.
- Update the landing page and shared header to render the backend-managed logo and contact details with sensible fallbacks when not configured.
- Remove all visible Caffeine/caffeine.ai branding from the frontend, including the landing page footer referral/link text.

**User-visible outcome:** Admins can update the site logo and contact details from a Settings page and see those changes immediately across the public landing page and dashboards; users no longer see any Caffeine branding.
