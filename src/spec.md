# Specification

## Summary
**Goal:** Remove the “Built with … using caffeine.ai” branding line from the landing page footer.

**Planned changes:**
- Delete the second paragraph element in the landing page footer (XPath: /html[1]/body[1]/div[1]/div[1]/footer[1]/div[1]/div[1]/p[2]) that renders the Caffeine branding line, including its heart icon and outbound link.
- Ensure no other footer or page content is modified.

**User-visible outcome:** The public landing page footer shows only the copyright line and no longer displays the “Built with … using caffeine.ai” line or any link to https://caffeine.ai/.
