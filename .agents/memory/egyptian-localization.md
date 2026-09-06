---
name: Egypt-first bilingual content
description: The food app's Egyptian recipe library and UI localization must remain source-backed, bilingual, and idempotently synchronized.
---

Egyptian recipe seed records are the source of truth for the app's Egypt-first content. Seed initialization may add and update those known records, but must never delete unrelated recipes. Arabic recipe fields should travel with the persistent recipe records and the UI should fall back to English only when an Arabic value is genuinely unavailable.

**Why:** The app needs reliable English/Arabic switching, repeatable development startup, and honest recipe content without a second frontend-only dataset.

**How to apply:** When adding or editing recipes, update the persistent bilingual seed and API shape together, keep image mappings explicit, and verify both RTL and LTR previews.