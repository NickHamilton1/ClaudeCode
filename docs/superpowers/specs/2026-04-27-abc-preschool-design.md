# ABC Preschool Section — Design Spec

**Date:** 2026-04-27
**Status:** Draft (home page layout v8 — research-informed)
**Author:** Brainstorm session with Nick + Claude
**Companion research:** [`2026-04-27-abc-preschool-research.md`](./2026-04-27-abc-preschool-research.md)

---

## Overview

ABC Preschool ("All Because of Christ") is a weekday early-education ministry of First Baptist Church of Concord, NC. This spec defines a multi-page section within the existing church website (`fbcconcord.org`) that replaces the legacy ABC Preschool pages with a refreshed, kid-friendly, but informationally clear experience.

The home page is the **first deliverable**. Subpages are scoped, planned, and will be built in subsequent passes.

---

## Goals

- **Inform interested families fast** about ABC Preschool's program, ages, curriculum, schedule, faith identity, and director. Research shows parents make a stay/bounce decision within ~30 seconds.
- **Pre-qualify the family** in the first sentence: who we are, where, hours, ages. A parent should know within one read whether ABC is for them.
- **State the Christian identity boldly and clearly.** ABC is a Christian preschool and does not soften that. Faith-seeking families should find ABC fast; families looking for secular options can self-select out.
- **Give a clear, low-pressure path to apply or schedule a tour.** Schedule-a-tour is the primary CTA (lower commitment, higher conversion for early-stage browsers); apply is secondary.
- **Match the look and feel of the rest of the FBC Concord site** (same nav, footer, foundational design tokens), while introducing a distinct kid-energy palette and personality inside the ABC pages.
- **Make ABC Preschool discoverable from anywhere on the site** via the main nav.

## Non-goals

- Online application form / payment processing (the enrollment subpage will link out to existing forms or a contact-the-director flow; no in-page form work in this scope).
- Heavy sales / urgency tone. The school is largely full; the page is informational with a confident-but-not-pushy CTA.
- Waitlist mechanics. May be added later if the director confirms a waitlist exists.
- Apologetic or hedged language about the Christian identity. The page does not say "if you're comfortable with religion…"; it says what kids will hear, and welcomes any family who chooses to apply with that understanding.

---

## Site integration

### Navigation

`ABC Preschool` is added as a top-level item in the main site nav, **on every page of the site** (about, staff, ministries, calendar, sermons, blog, giving, visit, contact, index, etc., and the mobile menu mirror). It uses the same active-state styling as the other nav links.

Suggested nav order (from existing site): `About · Staff · Ministries · ABC Preschool · Events · Sermons · Blog · Give`

### Folder structure

```
abc-preschool.html                     ← home (this deliverable)
abc-preschool/
  curriculum.html                      ← later
  calendar.html                        ← later
  summer-camp.html                     ← later
  enrollment.html                      ← later
  a-day-at-abc.html                    ← later (new)
  meet-the-director.html               ← later (new)
images/abc-preschool/                  ← all ABC photo + logo assets
css/abc-preschool.css                  ← scoped styles for the ABC section
```

The home page lives at the repo root (matching `giving.html`, `kids.html`, etc. patterns). Subpages live in an `abc-preschool/` folder for cleanliness.

---

## Visual language

### Color palette (sampled from logo)

| Token | Hex | Use |
|---|---|---|
| `--abc-red` | `#a81818` | Primary CTAs, section accents, age-1 card |
| `--abc-yellow` | `#d8a818` | Age-2 card, highlights, secondary accents |
| `--abc-green` | `#187830` | Age-3 card, "A Day at ABC" link card border |
| `--abc-blue` | `#0060a8` | Age-4 card, "Curriculum" link card border, secondary buttons |
| `--abc-navy` | `#001848` | Headings, TK card, dark CTA bands, body text |
| `--abc-cream` | `#fffaf0` | Section backgrounds (alternating with white) |
| `--abc-cream-warm` | `#ffeec2` | Hero gradient endpoint |

These colors are **scoped to ABC pages**. The rest of the site continues to use the existing navy/gold/cream palette from `css/global.css`.

### Typography

- **Body + display italic:** Georgia / Playfair Display (existing site fonts — continuity with the church site)
- **Playful accents:** `Fredoka` (Google Font, 500/600/700 weights) — used on labels, eyebrows, age-card numbers, button text, captions
- **Tagline only:** `Caveat` (Google Font) — used **once**, for "All Because of Christ" under the logo in the hero

Three fonts, each with a clear job. Body text remains Georgia/DM Sans for readability and continuity with the rest of the site.

### Hover & motion

- **Age cards** (1/2/3/4/TK): on hover, lift `translateY(-8px)`, rotate `-1.5deg`, scale `1.04`, drop a darker shadow. The numeral inside bounces (`@keyframes bounce`, 0.5s).
- **Link cards / nav tiles** (A Day at ABC, Curriculum, etc.): lift `translateY(-4px)` with shadow; the arrow `→` slides right `6px`.
- **Pill buttons:** lift `translateY(-2px)` with shadow.
- **Photo tiles:** subtle `scale(1.03)` on hover.

All transitions use 0.3–0.35s easing. No animation should feel chaotic — playful, not jittery.

### Reduced motion

Wrap all animations in `@media (prefers-reduced-motion: reduce)` to disable transforms and animations for users who opt out.

---

## Home page (`abc-preschool.html`)

### Section order (top to bottom)

1. **Site nav** — the exact existing church nav from `giving.html`, byte-for-byte. Add `<li><a href="abc-preschool.html" class="active">ABC Preschool</a></li>` to both desktop and mobile menus.
2. **Hero** — warm cream gradient background (`#fffaf0 → #ffeec2`).
   - Logo (`images/abc-preschool/ABC_Preschool_Logo_Transparent.png`), max-width ~280px, centered
   - "All Because of Christ" in Caveat script (~38px, abc-red)
   - **Pre-qualifying italic Georgia headline (~30px, navy):** *"A Christ-centered half-day preschool in Concord, NC."*
   - Plain-text supporting line: *"Serving 1-year-olds through Transitional Kindergarten · Monday–Friday, 8:45 am – 12:30 pm"*
   - Two pill buttons: **`Schedule a Tour →`** (red, **primary**, links to `abc-preschool/enrollment.html` or contact form) and **`Apply Now`** (white with blue outline, secondary, links to `abc-preschool/enrollment.html`)
   - Below the buttons: a small line — *"Or call 704-786-9167 · families of any background welcome to apply"*
3. **Trust strip** — white, slim band with hairline top/bottom borders.
   - Centered row of 4 brief trust signals in Fredoka uppercase: `✓ NC Licensed · ✓ Background-Checked Staff · ✓ ABeka Curriculum · ✓ A Ministry of FBC Concord`
   - Disable any line that isn't actually true; never claim accreditation/licensure that doesn't exist. Director to confirm before launch.
4. **Mission + Who We Are** — white background, centered.
   - Eyebrow `Our Mission` in red
   - Lead Georgia statement: *"ABC Preschool is a ministry of First Baptist Church of Concord — a safe, loving, Christian environment where young children grow spiritually, intellectually, and socially."*
   - Supporting paragraph (smaller): *"We partner with families to nurture the whole child in spirit, mind, and friendship — built on Scripture and grounded in academic excellence."*
5. **Programs Offered** — cream background.
   - Eyebrow `Programs Offered` in blue; subhead "Five age groups, one community"
   - 5 color-coded age cards in a row: **1 (red), 2 (yellow), 3 (green), 4 (blue), TK (navy)**. Each card shows the age, label, and "3 or 5 days/wk" or "5 days/wk".
   - Hover animations as described above.
6. **Hours + Location strip** — white, slim band with hairline top/bottom borders.
   - Two centered columns separated by a vertical divider:
     - Left: `Hours · 8:45 am – 12:30 pm · Monday–Friday, school year`
     - Right: `Location · 200 Branchview Dr SE · Concord, NC 28025`
   - Cabarrus County calendar / inclement weather note intentionally **not** here; it lives on the calendar subpage.
7. **A Day at ABC (preview)** — cream background.
   - Eyebrow `A Day at ABC` in green; subhead italic *"A predictable, joyful rhythm"*
   - 4 horizontal time-step cards: `8:45 am – Arrival & Welcome` · `9:15 am – Bible & Circle Time` · `10:00 am – Learning Centers` · `11:00 am – Outdoor Play & Snack`
   - Each card has a colored top border (rotating through the palette) and shows the time in Georgia italic + activity in Fredoka semi-bold
   - Below the cards: a centered green button **`See a Full Day →`** linking to `abc-preschool/a-day-at-abc.html`
   - **Why this section exists:** parent research showed minute-by-minute daily schedules are the single most-missing element on church preschool websites and a primary trust signal.
8. **Faith at ABC** — navy background (`#001848`), white text.
   - Eyebrow `Faith at ABC` in `--abc-yellow`
   - Bold italic Georgia headline: *"We are unapologetically Christian."*
   - Body paragraph stating the cadence plainly: *"Children at ABC begin each day with a Bible story at circle time, pray together at meals and chapel, and learn through songs, scripture, and play. Christ is the center of who we are — not a layer added on. Families of any background are welcome to apply, and we honestly share what your child will hear and learn so you can choose what's right for your family."*
   - **No hedging.** This is the differentiator and we lead into it.
9. **Get to Know Our Program / Find the right fit for your child** — white background.
   - Eyebrow `Get to Know Our Program` in green; subhead italic *"Find the right fit for your child"*
   - **6 navigation tiles in a 3×2 grid** (cream background, colored top border, hover lift + arrow slide):
     - **Programs by Age** (red border) → `abc-preschool/programs.html` *(planned, currently maps to anchor on home or curriculum page until built)*
     - **A Day at ABC** (yellow border) → `abc-preschool/a-day-at-abc.html`
     - **Curriculum** (blue border) → `abc-preschool/curriculum.html`
     - **Calendar** (green border) → `abc-preschool/calendar.html`
     - **Tuition & Apply** (red border) → `abc-preschool/enrollment.html`
     - **Meet the Director** (blue border) → `abc-preschool/meet-the-director.html`
   - Each tile has a colored eyebrow label, Georgia headline, 1-sentence body, and a CTA with arrow.
10. **Tuition tease** — cream background, centered.
    - Eyebrow `Tuition` in red
    - Italic Georgia headline: *"Half-day Christian education for less than half the cost of full-day daycare."* *(NEW framing; sourced from Care.com Concord market data showing local full-day at $600–$1,500/mo vs. ABC at $290–$385.)*
    - 3 outlined pricing cards: `$290 / mo · 3 days` · `$385 / mo · 5 days` · `$100 reg fee · one-time`
    - Reassurance line: "No hidden fees. Visit the Tuition page for what's included."
    - CTA button: **`Tuition & Apply →`** to `abc-preschool/enrollment.html`
    - **Why pricing is on the home page** (reversal from prior decision): research is unambiguous that hidden pricing is the #1 reason parents bounce from preschool sites; transparency builds trust.
11. **Meet Our Director (teaser)** — white background.
    - Photo on the left (4:5 aspect, rounded ~20px)
    - Right side: eyebrow `Meet Our Director`, italic Georgia "Korighan Gabriel", short bio paragraph, single button: **`Read Korighan's Story →`** linking to `abc-preschool/meet-the-director.html`.
    - **No phone, no email, no video on the home page** — those live on her subpage. Goal is to drive a meaningful click into her story before contact.
12. **Photo gallery** — cream background, single row of 4 square tiles with rounded corners. Each tile has a Fredoka caption at the bottom-left ("Chapel time", "Learning centers", "Music & movement", "Outdoor play"). Real photos to be supplied by the client; AI-generated stand-ins acceptable for launch.
13. **Final CTA** — navy background (`#001848`).
    - Eyebrow `Ready to Visit?`
    - Italic Georgia: *"Come see what a day at ABC feels like."*
    - Body: *"Schedule a tour, start an application, or call Korighan with any questions. Applications are open year-round."*
    - Primary button: **`Schedule a Tour →`** (yellow). Secondary: **`Apply Now`** (transparent with white outline).
    - Below: address line + click-to-call phone in muted text.
14. **Site footer** — the existing church footer, byte-for-byte from `giving.html`.

### Responsive behavior

- **Desktop (≥900px):** all grids as designed (5-col program row, 3-col explore row, 4-col gallery, 2-col director split, 4-col day-preview row, 3×2 nav-tile grid)
- **Tablet (600–899px):** programs and gallery collapse to 2 cols; nav tiles to 2 cols; day preview to 2 cols; director becomes single-column stack (photo above text)
- **Mobile (<600px):** everything stacks vertically; pill buttons full-width; hero logo scales to ~75% width; trust strip wraps to multiple rows

### Accessibility

- All interactive elements (`pill-btn`, `link-card`, `age-card`, `nav-tile`) keyboard-focusable with visible `:focus-visible` outlines (use `--abc-blue` 3px outline)
- Color contrast: yellow card (`#d8a818`) uses navy text (`#001848`) for AA contrast; all other colored cards use white text and pass AA against their backgrounds
- Hover-only effects must not hide critical info; all CTA labels are visible without hover
- `alt` text for the logo: "ABC Preschool — All Because of Christ, a ministry of FBC Concord"
- `prefers-reduced-motion` respected for all transforms/animations

---

## Subpages (outlined for later builds)

These are **not** in scope for the first build, but documented here so the home page links out correctly and so the spec captures the full vision.

### `abc-preschool/meet-the-director.html`
- Hero with Korighan's photo and name
- Full bio: heart for children's discipleship, years leading FBC Concord's Children's Ministry, qualifications, family-first / Christ-centered approach
- Embedded "From The Hip — Practice & a Plan" video
- Direct contact: phone (704-786-9167), email (abcpreschool@fbcconcord.org)
- Address line: 200 Branchview Dr SE, Concord, NC 28025
- "Begin Application →" CTA at the bottom

### `abc-preschool/a-day-at-abc.html` *(new content needed)*
- A timeline-style walkthrough of a typical day: arrival, chapel, learning centers, snack, music/movement, outdoor play, story time, pick-up
- AI-generated illustrations or photos at each station (client to supply)
- Tone: warm, descriptive, parent-reassuring

### `abc-preschool/curriculum.html`
- ABeka curriculum overview
- Scope and sequence by age group (Two-, Three-, Four-Year-Olds): Language Arts, Numbers, Bible, Music & Crafts, etc.
- Pulled from existing screenshot content; reformatted with the ABC visual language
- Honest framing of "what ABeka looks like at preschool age" — songs, Bible stories, letter recognition, hands-on play, NOT 3rd-grade worksheets — directly addressing common Google-induced concerns

### `abc-preschool/calendar.html`
- 2025–2026 and 2026–2027 school year calendars
- Key dates list
- **Cabarrus County calendar / inclement weather note lives here** (since it was removed from the home page)

### `abc-preschool/summer-camp.html`
- Themed weekly camps (Olympics, Armor Up, Oceans of Grace, Treasure Hunt, Glow With Jesus, Fruit of the Spirit)
- Ages 1 – Rising 3rd Grade
- $100/week pricing
- Registration info / link to forms

### `abc-preschool/enrollment.html`
- Application overview and process
- **Pricing details:** $290/mo (3 days), $385/mo (5 days), $100 non-refundable registration fee, what's included
- Links to existing application PDFs and Preschool Media Release Form (`images/abc-preschool/Preschool-Media-Release-Form-Copy.pdf`)
- Schedule-a-tour booking widget (phase 2)
- Contact info for the director

---

## Implementation notes

### CSS organization

- New file: `css/abc-preschool.css`
  - Defines `--abc-*` color tokens scoped to a body class on ABC pages
  - All ABC-specific styles (age cards, nav tiles, link cards, hover animations, hero, sections) live here
- `css/global.css` is **not modified** beyond what's needed for the nav addition (which may be a no-op if the nav is built the same way on every page already)
- Body classname pattern: add `class="abc-page"` to the `<body>` of `abc-preschool.html` and all subpages so ABC styles cascade correctly without leaking to the rest of the site

### Fonts

Add to `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Caveat:wght@500;600&display=swap" rel="stylesheet">
```
Existing site already loads Playfair Display + DM Sans, which we keep.

### JS

- The nav and mobile-menu hamburger should reuse existing site JS (whatever lives in `js/` and currently powers nav on `giving.html`)
- No new JS needed for the home page itself — animations are pure CSS

### Assets to drop in

- ⏳ `images/abc-preschool/ABC_Preschool_Logo.png` — full-color logo on white
- ⏳ `images/abc-preschool/ABC_Preschool_Logo_Transparent.png` — full-color logo on transparent (used in hero)
- ⏳ AI-generated photos for the gallery (Chapel time, Learning centers, Music & movement, Outdoor play) — client to provide
- ⏳ Photo of Korighan Gabriel for the director section — client to provide
- ⏳ `images/abc-preschool/Preschool-Media-Release-Form-Copy.pdf` (for the enrollment subpage later)

(Originals lost to a `git clean` event on 2026-04-28; see [`images/abc-preschool/README.md`](../../../images/abc-preschool/README.md) for the recovery checklist.)

### Placeholder strategy for unbuilt subpages

The home page links to 6 subpages that don't exist yet. For the first build:
- All `<a>` tags on the home page will point to the final URLs (e.g., `abc-preschool/meet-the-director.html`)
- Until those subpages exist, clicks will 404. Acceptable for now; subpages will follow shortly. (Alternative: stub each subpage with a "Coming soon" placeholder. Decision deferred to implementation plan.)

---

## Open questions

- **Logo + photos:** awaiting recovered/re-supplied logo files, AI-generated gallery photos, and a real photo of Korighan
- **Trust strip claims:** "NC Licensed", "Background-Checked Staff" — Korighan to confirm before launch. Remove any line that isn't accurate
- **Subpage stub strategy:** real 404s vs. "Coming soon" placeholders for the unbuilt subpages — to be decided when the implementation plan is written
- **Waitlist messaging:** if Korighan confirms a waitlist exists, we'll add a small note near the application CTA. Not blocking the first build.
- **`Schedule a Tour` button target:** for now, defaulting to `abc-preschool/enrollment.html` (or `mailto:` until that page exists). May change to a Calendly-style booking widget in phase 2.

---

## Decision log

| Decision | Rationale |
|---|---|
| Multi-page section, not a single page | Old site had multiple pages (curriculum, calendar, summer camp, enrollment); families need depth |
| Subpages in `abc-preschool/` folder | Cleaner than 6 root-level files, especially as content grows |
| Nav added site-wide | Discoverability from any page; matches old site's top-level placement |
| Option C "kid energy" visual direction | Client preference; preschool warrants warmer/brighter feel inside its own section |
| No hard-sell tone | School is at/near capacity; soft CTA serves both current families and prospective ones |
| No phone/email/video in home director block | Drives the meaningful click into Korighan's story before contact |
| Cabarrus County calendar note off the home page | Detail-level info; belongs on calendar/enrollment subpages |
| Logo-derived palette (red/yellow/green/blue/navy) | Sampled from `ABC_Preschool_Logo_Transparent.png` directly so brand is faithful |
| Hours strip placed directly under Programs Offered | Answers "when is school?" right after families see the age groups — logistics belong with the program offer |
| Hours strip combined with Location | Research showed parents need address visible early; bundling with hours saves a section |
| Director section placed near the bottom (before final CTA) | Acts as the human-trust closer once families have seen mission, programs, hours, faith stance, and explore tiles |
| Subhead "Find the right fit for your child" placed over Explore cards | That phrase invites navigation; the Programs section now reads simply "Programs Offered / Five age groups, one community" |
| **Pre-qualifying headline added to hero** ("A Christ-centered half-day preschool in Concord, NC.") | Research: parents decide stay/bounce in 30s. One sentence covers faith identity, schedule, and location. |
| **Trust strip added under hero** (NC Licensed, Background-Checked Staff, ABeka, FBC ministry) | Research consistently identified license/safety/curriculum signals as primary trust builders |
| **"A Day at ABC" preview block added** | Research: minute-by-minute daily schedules were the single most-missing element on church preschool sites surveyed |
| **"Faith at ABC" navy band added with bold "We are unapologetically Christian." headline** | Per Nick's direction: ABC does not soften its Christian identity. Research supports this — faith-seeking parents search for clarity, not hedging |
| **Tuition restored to home page** (3 outlined cards: $290/$385/$100) | Reversed prior decision after research showed hidden pricing is the #1 bounce trigger on preschool sites |
| **Tuition framed as "less than half the cost of full-day daycare"** | Research data: Concord secular full-day $600–$1,500/mo vs. ABC half-day $290–$385/mo. Honest market context, not sales pressure |
| **Schedule-a-Tour promoted to primary CTA** (Apply Now demoted to secondary) | Research: tour booking is lower-commitment and higher-converting for early-stage browsers |
| **6 nav tiles instead of 3 link cards** | Direct response to user complaint that subpages were hard to find. Adds Programs by Age, Calendar, Tuition & Apply, Meet the Director as visible doors |
| Phone number visible in hero supporting line + final CTA | Research: mobile parents will tap-to-call before reading; phone needs to be visible in multiple places |

---

## Approval status

- [x] Scope (home page first, subpages later)
- [x] Nav integration (site-wide)
- [x] Visual direction (Option C / logo-derived palette)
- [x] Section order, v6 → v7 (hours moved up, director moved down)
- [x] Director block (slim teaser, no contact info on home)
- [x] Hours block (no Cabarrus County note on home)
- [x] Research synthesis applied (v8 — pre-qualifying headline, trust strip, A Day at ABC preview, Faith at ABC band, tuition tease, 6 nav tiles, schedule-a-tour as primary CTA)
- [ ] User review of v8 mockup (mockup HTML lost in `git clean` event; can be regenerated from this spec)
- [ ] User review of this spec doc
- [ ] Director (Korighan) review of factual claims (NC license status, ABeka cadence, "background-checked staff", actual daily schedule times)
- [ ] Implementation plan (next step — `writing-plans` skill)

---

## Post-launch / phase 2 candidates (from research, not in scope now)

These items came up in the research as high-value additions but are deferred to keep the first build focused:

- **FAQ subpage** addressing: member-required? non-Christian families welcome? how much Bible? extended care? teacher-to-child ratio? NC star rating? discipline philosophy? what to bring? does ABC follow CCS calendar? waitlist mechanics?
- **Meet the Teachers** subpage — research's #1 trust signal beyond the director. Photos + names + tenure.
- **Embedded tour-booking widget** (Calendly or similar) on the enrollment page
- **Map embed** in the location strip (currently text-only)
- **Parent testimonials with names + photos** somewhere on home or about
- **NC star rating badge** if/when applicable
- **Annual events page** (chapel performance, Christmas program, end-of-year)
- **Spanish-language version** of the home page (Cabarrus has growing Hispanic population)
