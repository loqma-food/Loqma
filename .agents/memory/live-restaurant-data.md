---
name: Live restaurant data
description: Savorly's restaurant discovery must preserve source truth and tolerate public-source outages.
---

Live restaurant discovery uses source-backed listings and must leave unsupported fields null rather than infer ratings, menus, photos, hours, or recommendations. Public map sources can be intermittently unavailable, so the adapter should use resilient endpoints and surface a truthful unavailable state instead of cached or invented data.

**Why:** The product explicitly forbids fabricated restaurant information, and the primary public endpoint was unavailable during the first live verification.

**How to apply:** Keep source URLs and verified field metadata with each listing, fail over between approved public endpoints, and render “Information unavailable” when a value is not present.