# ABC Preschool — Next-Session Handoff Prompt

**What this is:** A self-contained briefing you can paste into a fresh Claude Code session to pick up the ABC Preschool work where we left off. It assumes the next session has zero context from the chat that produced this prompt.

**How to use it:**
1. Open a new Claude Code session in the `~/Documents/GitHub/ClaudeCode` repo
2. Make sure you're on branch `claude/abc-preschool-page-creation` (or tell Claude to switch to it)
3. Paste the prompt below verbatim
4. Reply to whatever Claude asks for; the prompt is structured so Claude will work through one phase at a time

---

## The prompt

```
We're picking up work on the ABC Preschool home page for First Baptist Church
of Concord, NC. The brainstorm and design work is already done and committed
to this branch. Your job in this session is to (1) get the project oriented,
(2) handle a few cleanup items I owe you, then (3) drive the implementation
plan and start writing the actual page.

## Step 1 — Orient yourself

Before doing anything else, read these files in this exact order. They are the
ground truth. Do NOT rely on memory or assumptions; the files supersede
anything you "remember" about preschool websites.

1. CLAUDE.md (repo conventions and branching/commit discipline)
2. docs/superpowers/specs/2026-04-27-abc-preschool-design.md (THE spec — read
   the whole thing, not just the section headings)
3. docs/superpowers/specs/2026-04-27-abc-preschool-research.md (parent
   research — skim sections 2, 5, 6, 7, 10 closely; the rest you can
   reference as needed)
4. docs/superpowers/specs/2026-04-27-abc-preschool-ux-review.md (sub-agent
   review and what we did/didn't do with each finding)
5. docs/superpowers/specs/mockups/2026-04-27-abc-preschool-home-v8.html
   (the current visual reference — open it in a browser if helpful)
6. images/abc-preschool/README.md (asset inventory and what's still missing)
7. The existing site for visual continuity: read giving.html top to bottom
   (especially the nav, mobile menu, footer, and overall structure), then
   skim css/global.css and css/giving.css to understand the design tokens
   and patterns. The ABC home page must feel like part of the same site.

After reading, give me a 6–10 line summary of what you understand the project
to be, what's already decided, what's blocked on me, and what you think the
next concrete action is. Don't propose code yet. Wait for me to confirm or
correct your understanding.

## Step 2 — Address known cleanup items

There are a few items I owe you or that need confirming before you write the
page. For EACH of these, ask me one at a time (don't batch the questions),
wait for my answer, and update the design spec inline as we resolve them.

a) **Asset re-supply.** The original images/abc-preschool/ folder was wiped
   in a `git clean` event. Check whether I've added back the logo files
   (ABC_Preschool_Logo.png and ABC_Preschool_Logo_Transparent.png) and any
   photos. If they're missing, ask me where I am with recovery and either
   wait or proceed with placeholder swap-in points.

b) **Trust strip claims.** The hero "trust strip" promises "✓ NC Licensed",
   "✓ Background-Checked Staff", "✓ ABeka Curriculum", "✓ A Ministry of FBC
   Concord". Ask me which of these are actually true and verifiable. The
   spec is clear that we never claim accreditation/licensure that doesn't
   exist. Anything I can't confirm, we drop or replace with something we can.

c) **Subpage stub strategy.** The home page links to 6 subpages that don't
   exist yet (curriculum, calendar, summer-camp, enrollment, a-day-at-abc,
   meet-the-director). Ask me whether you should:
     (i)  let those links 404 for now (acceptable per the spec), or
     (ii) create minimal "Coming soon — call Korighan at 704-786-9167" stubs
          so families don't hit raw 404s.
   I'll pick one.

d) **Schedule-a-Tour button target.** The hero CTA says "Schedule a Tour".
   Until we have a Calendly-style widget on the enrollment page, ask me
   whether that button should:
     (i)   open `mailto:abcpreschool@fbcconcord.org` with a subject prefilled
           ("Tour request — [child age]"),
     (ii)  link to the enrollment page (which would just have a phone+email),
     (iii) link to `tel:7047869167` for direct call.

e) **Director photo + bio.** The Meet the Director section needs a real photo
   of Korighan Gabriel and her bio copy. Ask whether I have those, or whether
   you should use a placeholder in the build with a clearly marked TODO.

f) **Enrollment status sentence.** The sub-agent UX review flagged that
   parents want to know "do they have spots?" near the hero. We deferred this
   because there's no confirmed waitlist status. Ask me one more time
   whether anything has changed; if not, leave it out.

If I tell you to skip any of these, skip them. Don't push.

## Step 3 — Write the implementation plan

Once cleanup is settled, invoke the `superpowers:writing-plans` skill (or its
equivalent on whatever platform you're running on) to turn the design spec
into a step-by-step implementation plan. The plan should cover, at minimum:

- File creation order: css/abc-preschool.css → abc-preschool.html → nav
  injection across all existing pages → subpage stubs (if we decided yes)
- For each section of the home page (per spec sections 1–14): a checklist
  item with what to build, what HTML structure, what CSS class names, and
  what assets it depends on
- A "verification" step at the end: open the page in a real browser, check
  every CTA links somewhere, check responsive behavior at 320 / 768 / 1280
  viewport widths, check `prefers-reduced-motion` disables animations,
  and check keyboard tab order through all interactive elements
- Explicit "commit after this step" markers — at minimum, commit after
  the CSS file is written, after the home page is written, and after the
  nav is injected site-wide. Per CLAUDE.md, never leave the session with
  uncommitted work.

Save the plan to `docs/superpowers/specs/2026-04-27-abc-preschool-plan.md`
and commit it before writing any code.

## Step 4 — Build the home page

Follow the plan you wrote. As you go:

- Match existing site conventions: study giving.html and use its nav/footer
  structure verbatim. The ABC home page lives at `abc-preschool.html` (repo
  root). Use the same `<head>` patterns, same JS includes, same hamburger
  pattern.
- The body of the ABC home page should have `class="abc-page"` so the new
  CSS file's color tokens cascade correctly without leaking to the rest of
  the site.
- New CSS file: `css/abc-preschool.css`. Define `--abc-*` color tokens
  scoped to `.abc-page`. All ABC-specific styles (age cards, nav tiles,
  hero, hover animations) live here. Do NOT modify css/global.css.
- New fonts: add the Fredoka + Caveat Google Fonts link to the ABC page's
  head. Existing site already loads Playfair Display + DM Sans.
- Update the nav on EVERY existing page that has the main nav (about.html,
  staff.html, ministries.html, calendar.html, sermons.html, blog/index.html,
  giving.html, visit.html, contact.html, index.html, kids.html,
  Discipleship.html, Music.html, missions.html, sermon.html,
  student-ministries.html, MINISTRIES.html — be exhaustive). Add an
  ABC Preschool link in both the desktop and mobile menus, in the order
  About · Staff · Ministries · ABC Preschool · Events · Sermons · Blog · Give.
- Use the v8 mockup at docs/superpowers/specs/mockups/2026-04-27-abc-preschool-home-v8.html
  as your reference for layout, copy, colors, and animations — but the
  production page should be cleaner (semantic HTML, separated CSS, no inline
  styles, proper headings, proper alt text, accessible focus states).

Commit incrementally. Per CLAUDE.md, prefer many small WIP commits.

## Step 5 — Verify in a browser

Before you tell me you're done:

- Start a simple local server (`python3 -m http.server 8000` in the repo
  root works) and open `http://localhost:8000/abc-preschool.html`
- Test every CTA — does each one go where it should?
- Resize the browser to 320px, 768px, and 1280px width — does the layout hold?
- Use the browser dev tools to enable `prefers-reduced-motion: reduce` —
  do animations disappear?
- Tab through the page with the keyboard — is every CTA reachable, and is
  there a visible focus indicator?
- Open one of the existing pages (e.g., visit.html) and confirm the new
  ABC Preschool nav link works from there too.

Per the user's note in CLAUDE.md and the broader Claude Code guidance, do
NOT claim the work is complete until you've actually verified it in a
browser. Type checking and the absence of console errors do not equal
feature correctness.

## Constraints (non-negotiable)

- **Christian identity is bold, not hedged.** The "Faith at ABC" section
  reads "We are unapologetically Christian." That is exactly the headline.
  Do not soften it. Do not propose alternatives that say "welcoming of all
  beliefs" as a substitute. The spec covers tone in the goals/non-goals
  sections — read them.
- **Branch and commits.** Stay on `claude/abc-preschool-page-creation`.
  Never run `git reset --hard`, `git clean -fd`, or `git checkout -- .` —
  those operations destroyed the original brainstorm artifacts and we are
  not making that mistake twice. If you think one of those is needed, ASK
  me first and explain why.
- **No new files outside scope.** Don't create README files, summaries, or
  documentation files unless I ask. The spec docs that exist are the only
  "docs" we want.
- **Match existing site quality.** The rest of the site is hand-written
  HTML/CSS with care. The ABC pages should match that bar — semantic,
  accessible, responsive, polished. No frameworks, no build tools, no JS
  bundlers. Plain HTML/CSS with the existing site's vanilla JS for the
  nav/hamburger.

## What "done" looks like for this session

A working `abc-preschool.html` at the repo root that:
- Renders correctly at desktop, tablet, and mobile widths
- Has every CTA wired to a real target (subpage, mailto, or tel)
- Loads the right fonts, the right logo, and includes all sections from the
  spec in the correct order
- Has hover animations on the age cards and link tiles, with reduced-motion
  support
- Is linked from the main nav and mobile menu of every other page on the site
- Is committed to `claude/abc-preschool-page-creation` with a clean history

Subpages can stay as 404s or simple stubs based on what I told you in Step 2.

## When in doubt

- The spec is the source of truth. If something in this prompt and the spec
  disagree, follow the spec, then tell me.
- If you're not sure about visual judgment, build the simplest version that
  matches the spec and the v8 mockup, and ask for review.
- If you discover something missing or contradictory in the spec, surface it,
  pick a sensible default, and add a decision-log entry to the spec
  documenting what you chose and why. Don't silently invent.

Begin with Step 1.
```

---

## Why this prompt is shaped this way

- **Read-files-first** — every spec doc and the existing site code, in a specific order, before any work. Prevents fabrication and missed context.
- **One question at a time on cleanup** — keeps the session disciplined and avoids the user having to answer 6 things in one breath.
- **Plan before code** — invokes the `writing-plans` skill explicitly because the project is large enough that an implementation plan is genuinely useful (not boilerplate).
- **Commit incrementally + branch protection** — explicit per CLAUDE.md, with a callout that the original brainstorm files were destroyed by `git clean` and we're not repeating that.
- **Verify in a browser** — calls out the Claude Code system-prompt rule that "type checking is not feature correctness."
- **Christian identity callout in constraints** — protects the bold "We are unapologetically Christian" framing from being softened by a fresh model that defaults to inclusive-language hedging.
- **Match existing site quality** — names the bar explicitly so a fresh session doesn't reach for React or Tailwind on a vanilla-HTML/CSS project.

## What I (Nick) need to do before pasting this

Nothing strictly required, but ideally:

1. **Re-add the binary assets** to `images/abc-preschool/`:
   - `ABC_Preschool_Logo.png`
   - `ABC_Preschool_Logo_Transparent.png`
   - 5 site screenshots (re-screenshot from `fbcconcord.org` if needed)
   - `Preschool-Media-Release-Form-Copy.pdf`
   - Optional: AI-generated photos for the gallery, photo of Korighan
2. **Decide on the cleanup answers** (Section 2 a–f) so the new session can move fast
3. **Confirm Korighan's available** for any factual questions the new session might raise (NC license status, ABeka cadence in the actual classroom, daily schedule times)

If you skip step 1, the new session will still work — it'll just use placeholders and clearly mark TODOs. The page can be built and the assets dropped in after.
