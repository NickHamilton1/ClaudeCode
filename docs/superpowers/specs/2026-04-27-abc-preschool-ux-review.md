# ABC Preschool — Sub-agent UX/Layout Review

**Date:** 2026-04-27
**Reviewer:** General-purpose Claude sub-agent, dispatched mid-brainstorm
**Subject:** v4 of the ABC Preschool home page mockup
**Why preserved:** The takeaways from this review drove v5/v6/v7/v8 changes — kill the top photo gallery, swap the "Find the right fit" subhead, merge director + video, demote the Cabarrus County calendar note, soften the final CTA, etc. The decisions are captured in the design spec, but the raw critique itself is worth keeping for two reasons: (1) the **parent quotes** are useful when iterating future versions, and (2) future reviewers may want to see *why* the changes were made.

---

## Context given to the sub-agent

Subject: a self-contained HTML mockup of the home page for ABC Preschool, kid-friendly visual direction, sitting inside the more formal FBC Concord church website.

Current section order at the time of review (v4): Nav → Hero (logo + "All Because of Christ" tagline + Apply / Meet Director buttons) → Top photo gallery (4 tiles) → Color stripe → Mission statement → Programs (5 color-coded age cards: 1, 2, 3, 4, TK) → "Explore" header with 3 link cards (A Day at ABC / Curriculum / Calendar & Specials) → Hours & Schedule (blue band with 8:45–12:30 + Cabarrus County calendar note) → Meet the Director (photo, bio, phone, email, "Read Korighan's Story" button) → Video embed → Bottom photo gallery → Application CTA banner with address → Footer.

The reviewer was asked to evaluate the page as **two evaluators back-to-back**: a senior web/UX designer, and a parent of a 2- or 3-year-old looking at the page for the first time.

Specific notes flagged: (a) the school is fairly full and doesn't want to come across as desperate, (b) pricing is intentionally NOT on the home page, (c) the page is built for "kid energy" but sits inside a more formal site, (d) the client said the top photo gallery may not be adding much, (e) the "Find the right fit for your child" subhead inside Programs feels like it should belong over the Explore section, (f) the client said "the layout is just kind of confusing."

---

## 1. Designer's punch list

1. **Kill the top photo gallery.** Four flat color tiles between Hero and Mission break the read before any meaning lands. Client's instinct is right — it's decoration, not a hook. Move all photo energy into the bottom gallery (or scatter one shot into the Director block).
2. **Move "Find the right fit for your child" out of Programs and into the Explore header** — exactly as the client said. Programs gets a flatter label like "Our Five Classrooms" or just "Programs Offered." "Find the right fit" reads as the navigational invitation to the deep-dive cards (Day / Curriculum / Calendar), which is what those cards actually do.
3. **Merge Explore + Hours into a single "How it works" band.** Right now Explore (white) → Hours (blue slab) feels like two intros stacked. Put the 3 link cards on the white background and tuck "8:45–12:30, M–F, school year" as a small inline strip directly under them. The giant 42px italic "8:45 am – 12:30 pm" hour read is overweight for a detail.
4. **Demote the Cabarrus County calendar note.** It's an FAQ answer, not a homepage moment. One line of body copy under hours, or push it to the enrollment page.
5. **Cut OR move the Bottom photo gallery.** Two galleries on one page is the core "why does this feel confusing" problem. If you keep one, keep this one and put real captions on it (kid energy needs human moments, not gradient swatches).
6. **Move the Video up next to the Director.** "Hear from Korighan" + Korighan's bio + Korighan's photo belong in one block. Currently Director → Video reads as two separate Korighan moments back-to-back.
7. **Retitle the final CTA.** "Interested in Joining? / We'd love to meet your family." plus a red-to-gold gradient reads as hard-sell — at odds with "we're nearly full." Try: "Ready to apply? / Applications are open year-round" with a calmer single-color band.
8. **Color stripe is doing nothing.** It separates Photo Gallery from Mission, two sections that shouldn't be adjacent anyway. Delete it; let the age-card colors carry the rainbow.
9. **Hero tagline tension.** "All Because of Christ" (Caveat script) + "A Weekday Early Education Ministry" (Fredoka caps) + Georgia italic subhead = three voices in one hero. Keep the script tagline, drop the all-caps Fredoka eyebrow, lead straight with the Georgia italic.
10. **Address belongs in the Director card,** not buried under the CTA banner. A parent searching "where is this place" shouldn't have to scroll past a video and a gallery.

## 2. Parent's reactions

- "Okay, cute logo… are these stock photos? I can't actually see any kids." (The gradient placeholders read as empty even when real photos go in if they're tiny squares with no captions.)
- "How old does my kid have to be to start? Is the '1 year olds' room walking-required, potty-trained, what?" Nothing on the page tells me.
- "Do they have spots? It says 'Begin Application' twice but never tells me whether you're enrolling, waitlisted, or full." That ambiguity makes me hesitate more than a price would.
- "Where is this — like, is it at the church or a separate building?" Address shows up only at the very bottom, after I've decided whether to bounce.
- "Is this half-day only? 8:45–12:30 — do they offer extended care or lunch bunch?" Big italic hours but no mention of before/after.
- The Director block + her phone number + "Read Korighan's Story" is the most trust-building thing on the page. That's what makes me click. The red/gold "We'd love to meet your family" banner actually feels a little salesy after that warm moment.

## 3. Layout proposals (the reviewer offered three alternative section orderings)

- **A — "Trust ladder":** Nav → Hero → Mission → Programs (5 cards) → Director + Video (merged) → Explore cards under "Find the right fit" → Hours/logistics strip → Photo gallery → CTA + address. Reasoning: builds why → who → what → how → proof → ask.
- **B — "Confidence first":** Nav → Hero → Programs → Hours strip → Director + Video → Explore cards → Photo gallery → CTA. Reasoning: answers the parent's top-three scanning questions (ages, hours, who runs it) above the fold-and-a-half before any deep dives.
- **C — "Minimal cut":** Keep current order, just kill top gallery, kill color stripe, swap the two subheads as the client requested, merge video into Director. Smallest change, fixes ~70% of the confusion.

## 4. Top 3 to do first

1. Swap the two subheads (client's call) and kill the top photo gallery + color stripe.
2. Merge Video into the Director section so Korighan is one unified trust block.
3. Add a one-line enrollment-status sentence near the hero ("Now accepting applications for [year]" or "Limited openings — apply to join the list") so parents know what "Begin Application" actually means.

---

## What we did with this review

- ✅ Killed top photo gallery (v5)
- ✅ Killed color stripe (v5)
- ✅ Swapped "Find the right fit" subhead from Programs to Explore (v5/v6)
- ✅ Demoted the Cabarrus County calendar note off the home page entirely (v6 — went further than the reviewer suggested per Nick's call)
- ✅ Softened the final CTA (v5+ — single-color navy band, "Applications are open year-round")
- ✅ Dropped the all-caps Fredoka eyebrow in the hero (v5)
- ✅ Adopted the "Trust ladder" ordering as the basis for v5; later revisions (v7, v8) refined it further per Nick's directions
- ⚠️ Director-photo-and-video merge: implemented in v5, then **reversed in v6** when Nick said the video should live on Korighan's subpage so people read her story before contacting her
- ❌ Reviewer's "enrollment status sentence" suggestion: deferred — Nick said the school doesn't have a confirmed waitlist status to communicate
- ⚠️ "Are these stock photos?" parent reaction: addressed in v5+ by adding caption labels to the gallery (real photos still TBD)
- ⚠️ "Where is this?" parent reaction: addressed in v8 by adding a Hours+Location strip mid-page so the address is visible early
- ⚠️ "Do they have spots?" parent reaction: still partially open. v8 doesn't display capacity; if Korighan can confirm a status, it can be added to the hero supporting line
- ⚠️ "Extended care / lunch bunch?" parent reaction: deferred to FAQ subpage (phase 2)
