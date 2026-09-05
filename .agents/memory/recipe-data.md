---
name: Recipe data integrity
description: Recipe presentation depends on persistent structured records and explicit image mappings.
---

Recipes should be stored as persistent structured records, not frontend seed arrays. Each recipe owns its explicit image URL; presentation must use that relationship directly and fall back to a neutral placeholder on missing or failed images rather than choosing an image from a keyword.

**Why:** A food image that is merely visually similar can mislead someone cooking, and frontend-only recipe data disappears across reloads or sessions.

**How to apply:** Keep ingredients, substitutions, and step cues in the database-backed recipe record, calculate serving changes from the original record in view state, and keep image fallback behavior neutral.