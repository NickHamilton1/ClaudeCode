# Deep-Research Prompt — ABC Preschool Parent Research

**Purpose:** This is the prompt that produced [`2026-04-27-abc-preschool-research.md`](./2026-04-27-abc-preschool-research.md). Saved here so the methodology is reproducible — if the school's situation, audience, or location changes, the research can be re-run with adjustments.

**How to use:** Paste this into a fresh chat with a model that has web search / deep research enabled (Claude with web search, ChatGPT with browsing, Perplexity, or a deep-research tool). The output goes into the research doc above.

**Adjustments worth considering before re-running:**
- Update the date references (school year, "2024–2026 data preferred")
- Swap the location-specific bits if the school relocates or you want to broaden to a region
- If a waitlist actually exists, add it to the constraints so the research speaks to that reality
- If new competitors appear in the local market, mention them so they're accounted for

---

## The prompt

```
You are doing original research to inform the design of a Christian preschool's
website (ABC Preschool — "All Because of Christ" — a ministry of First Baptist
Church of Concord, NC). I am the designer/developer building the site. Your job
is NOT to design the site. Your job is to surface what real prospective parents
of preschool-age children (roughly ages 1–5) actually search for, worry about,
and need to find quickly when they're evaluating a preschool online.

The school: small, faith-based, half-day program (8:45 am – 12:30 pm M–F),
serves 1-year-olds through Transitional Kindergarten, located in Concord, NC.
Uses ABeka curriculum. Largely full at the moment but still accepting
applications. The audience is mostly young families in the Concord / Cabarrus
County / greater Charlotte NC area, many of whom may already attend the church
and many of whom won't.

I need you to do EXPLICIT, SOURCED research — not generalities. Use web search.
Cite real sources (parenting forums, Reddit threads, blog posts, Google Trends,
"People Also Ask" results, Quora threads, daycare/preschool review sites,
Christian parenting communities, NC-local moms groups if you can find them).
For each finding, include a short quote or paraphrase and a link.

Deliver the following in this exact order, with clear section headers:

1. TOP SEARCH QUERIES
   The 20–30 actual queries parents type into Google when researching
   preschools. Cluster them by intent (e.g., "Cost & logistics", "Curriculum
   & readiness", "Safety & care", "Faith-based fit", "Reviews & reputation",
   "Local discovery"). Note which ones are highest intent (parent is close to
   choosing) vs. early-stage research.

2. WHAT PARENTS WANT TO KNOW IN THE FIRST 30 SECONDS
   Based on UX studies, parenting forum threads, and preschool review behavior,
   list the 8–12 pieces of information a parent needs to find ABOVE THE FOLD or
   within the first scroll for the page to feel trustworthy. Rank them by
   importance.

3. UNSPOKEN ANXIETIES & OBJECTIONS
   The fears parents have but don't always articulate (separation anxiety,
   safety/abuse fears, "is my kid behind?", religious-fit worries from secular
   parents, secular-curriculum worries from devout parents, hidden costs,
   teacher turnover, "will my kid be happy?", etc.). Pull real quotes from
   forums where possible.

4. FAITH-BASED PRESCHOOL SPECIFIC CONCERNS
   Parents researching Christian preschools have a particular set of questions
   beyond a general daycare/preschool. What are they? (e.g., "How much Bible
   teaching?", "Is it pushy?", "Do I have to be a member?", "What
   denomination?", "Are non-Christian families welcome?", etc.) Surface real
   forum / Reddit quotes from r/Parenting, r/Mommit, faith-based parenting
   blogs, etc.

5. WHAT MAKES PARENTS BOUNCE FROM A PRESCHOOL WEBSITE
   Friction patterns: missing info, dated design, hidden pricing, no photos of
   real kids/teachers, no clear "next step", confusing navigation, no
   accreditation visible, etc. Pull from any UX / nonprofit-web / school-web
   research you can find.

6. WHAT MAKES PARENTS TRUST A PRESCHOOL WEBSITE
   The opposite: signals that build trust quickly. Real teacher photos & names,
   accreditation badges, parent testimonials, clear daily schedule, transparent
   pricing or "request info" path, video of the director, address with a map,
   licensing info, NAEYC or state license numbers, etc.

7. NAVIGATION & WAYFINDING PATTERNS
   How preschool/daycare websites typically organize subpages so parents can
   self-serve. What's the canonical sitemap (Home, About, Programs, Curriculum,
   Calendar, Tuition, Enrollment, FAQ, Contact)? What's commonly *missing* that
   parents wish was there? Where do parents most often get stuck and have to
   call the school?

8. ABEKA-SPECIFIC PARENT QUESTIONS
   Specifically, parents researching ABeka curriculum: what do they ask, what
   reservations do they raise, what reassures them? (Strong opinions exist on
   both sides — surface them honestly.)

9. NORTH CAROLINA / CABARRUS COUNTY LOCAL CONTEXT (if findable)
   Anything specific to the local market — common alternative preschools in
   the area, what local moms groups discuss, school-choice culture, daycare
   waitlist norms, Cabarrus County School System calendar dependencies.

10. RECOMMENDED CONTENT INVENTORY
    Based on everything above, list what content/pages/sections this preschool
    website MUST have, SHOULD have, and could optionally have. Be specific:
    instead of "FAQ", say "FAQ that addresses [these 8 specific questions]."

11. TOP 10 SPECIFIC THINGS TO LIFT
    Pull 10 specific, copy-pasteable ideas — phrases, layout patterns,
    sections, visual elements — from real preschool websites or research that
    we should consider stealing. Include URLs.

Constraints:
- Cite sources for every nontrivial claim. Forum quotes, study links, blog
  posts. No "in my experience" without a source.
- Don't pad. If a section has 5 strong items, give 5 — not 12 weak ones.
- US context, English-speaking suburban families, 2024–2026 data preferred.
- Faith-friendly tone — neutral toward Christian content, not dismissive.
- The output is for a designer/developer (me) so I can prioritize features
  and copy. Make it actionable.
- Length: as long as it needs to be to be useful. Don't summarize early.

Begin with section 1.
```

---

## Why this prompt is shaped this way

- **Front-loaded context** so the research model knows the school, audience, and constraints before searching
- **Explicit sourcing requirement** so you don't get vague generalities
- **Sectioned output** so it's easy to scan and pull from when updating the design
- **Both sides of ABeka** because curriculum is a flashpoint — honest input matters
- **Faith-specific section** because this is the differentiator most generic preschool research will skip
- **Last section asks for "lift-able" patterns** so the result is actionable, not just analytical
