# FBC Concord CMS — Design Spec

**Date:** 2026-04-27
**Status:** Draft for review
**Author:** Nick Hamilton (with Claude)

## Goal

Add a content management system to the FBC Concord static site so that:

1. **Sermons publish automatically** every Sunday with no human in the loop, by way of a Zapier-fired webhook that runs a YouTube → transcript → AI → static page pipeline.
2. **Blog posts** can be authored and published by non-technical staff (primarily Nick's dad) through a friendly web admin.
3. **Photos** can be uploaded to site galleries through the same admin.
4. The public site remains pure static HTML on Cloudflare Pages — the CMS is a *publisher*, not a runtime dependency. If the admin is down, the public site is unaffected.

## Non-goals

- Comments, user accounts for visitors, search, e-commerce.
- A general-purpose CMS competing with WordPress / Sanity. This is purpose-built for this site.
- Self-hosted video. YouTube is and remains the source of truth for sermon video.
- Approval workflows. Sermons publish immediately; admin is for post-publish edits.
- Building our own admin UI from scratch. We use an off-the-shelf git-backed CMS (Sveltia) and focus engineering effort on the custom sermon pipeline that no off-the-shelf tool provides.

## Architecture

### Source of truth: the git repository

All content — sermons, blog posts, photos, and the JSON/Markdown indexes that drive list pages — lives in the existing GitHub repo. Publishing = committing to `main`. Cloudflare Pages auto-deploys on push. Rollback = `git revert`.

This means:

- The public site has zero runtime dependency on the CMS or any database.
- Every change is auditable (git log shows who published what and when).
- The CMS can be down for days and the site keeps working perfectly.

### Two components

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  Zapier (YouTube    │────▶│  Sermon Pipeline     │────▶│  GitHub repo        │
│  new-video trigger) │     │  Worker              │     │  (commits HTML +    │
└─────────────────────┘     │  (Cloudflare Worker) │     │   JSON indexes)     │
                            │  /webhook/sermon     │     └──────────┬──────────┘
                            │  Calls Anthropic +   │                │
                            │  YouTube + GitHub    │                │
                            │  APIs                │                │
                            └──────────────────────┘                │
                                                                    │
┌─────────────────────┐     ┌──────────────────────┐                │
│  Admin user (dad,   │────▶│  Sveltia CMS         │────────────────┤
│  Nick, others) in   │     │  (static admin page  │                │
│  a web browser      │     │   served from /admin)│                │
└─────────────────────┘     │  Logs in with GitHub │                │
                            │  OAuth, commits      │                │
                            │  directly via API    │                │
                            └──────────────────────┘                │
                                                                    ▼
                                                       ┌─────────────────────┐
                                                       │  Cloudflare Pages   │
                                                       │  auto-deploys       │
                                                       │  (public site)      │
                                                       └─────────────────────┘
```

1. **Cloudflare Pages** — serves the public static site. Already exists. Unchanged.
2. **Sveltia CMS** — open-source, git-backed CMS. A single static `/admin/index.html` page on the site. Users log in with GitHub OAuth; Sveltia commits content (Markdown, JSON, images) directly to the repo via the GitHub API. Free, actively maintained, no server to run.
3. **Sermon Pipeline Worker** — a Cloudflare Worker that hosts the Zapier webhook and runs the YouTube → transcript → Claude → commit pipeline. The only custom server code we maintain.

### Why Sveltia (not Decap, TinaCMS, or building our own)

- **Free and open-source.** No vendor lock-in.
- **Git-native.** Reads and writes content directly to the repo. No separate database.
- **Active maintenance.** Decap (the predecessor) has slowed; Sveltia is the modern fork.
- **Fast and friendly UI.** Better than Decap, more polished than self-built equivalents.
- **GitHub OAuth login.** Your dad signs in with a GitHub account; permissions are managed via repo collaborators.
- **Self-hosted as a static file.** Lives in the repo as `/admin/index.html` + a config file. No server.
- **YAML-configurable content model.** We define each content type once; Sveltia generates the entire admin UI.

Building our own admin would be ~40–60 hours of work plus indefinite maintenance (sessions, password reset, security patches, mobile quirks, accessibility, etc.) for a feature set that Sveltia gives us in an afternoon. Not worth it for a 3-user church site.

## Content model

Each content type has both **rendered HTML/Markdown files** (for the public site) and an **index file** that drives list pages. Sveltia reads and writes both via its YAML config.

### Sermons

Sveltia stores each sermon as a JSON record in `data/sermons/YYYY-MM-DD-slug.json`:

```json
{
  "id": "2026-04-13-the-heart-of-worship",
  "slug": "the-heart-of-worship",
  "date": "2026-04-13",
  "title": "The Heart of Worship",
  "speaker": "Pastor Jim Collier",
  "scripture": "Romans 12:1–2",
  "youtubeId": "U8aLLQP9TcE",
  "thumbnail": "https://i.ytimg.com/vi/U8aLLQP9TcE/maxresdefault.jpg",
  "tags": ["Romans 12", "Worship", "Spiritual Growth"],
  "categories": ["growth"],
  "summary": "Two-paragraph AI-generated summary…",
  "publishedAt": "2026-04-13T17:42:00Z",
  "source": "auto"
}
```

A small **build step** (run on every push by a GitHub Action) reads all sermon JSON files and produces:

- Individual sermon pages: `sermons/YYYY-MM-DD-slug.html`, generated from `templates/sermon-page.html` (the existing `sermon.html` becomes this template).
- The library page `sermons.html`, regenerated from the JSON index (cards, filter tabs, "Load More").

This separation matters: Sveltia edits structured data (clean, reliable); the build step produces presentation HTML (consistent, no risk of breaking layout). Your dad never edits HTML.

### Blog posts

Sveltia stores each post as Markdown with frontmatter at `blog/_source/YYYY-MM-DD-slug.md`:

```markdown
---
title: Finding Peace in Anxious Times
author: Pastor Aaron Edwards
date: 2026-03-15
heroImage: /images/blog/finding-peace-hero.jpg
excerpt: One-sentence teaser shown on the blog index.
tags: [Faith, Anxiety]
---

Full post body in Markdown…
```

Same build step renders each `.md` to `blog/YYYY-MM-DD-slug.html` from `templates/blog-post.html`, and regenerates `blog/index.html` from the post list.

Sveltia provides a friendly Markdown rich-text editor out of the box, plus inline image upload.

### Photo galleries

Sveltia stores each gallery as a JSON record at `data/galleries/<slug>.json`:

```json
{
  "slug": "abc-preschool",
  "title": "ABC Preschool",
  "description": "Photos from our preschool ministry.",
  "coverImage": "/images/abc-preschool/cover.jpg",
  "images": [
    { "src": "/images/abc-preschool/01.jpg", "alt": "Children at chapel" }
  ]
}
```

Sveltia handles multi-image upload and reordering via its built-in repeatable-list field. The build step generates a `gallery/<slug>.html` page from `templates/gallery-page.html` for each gallery, plus a `gallery/index.html` listing all galleries.

## The sermon auto-publish pipeline

Triggered by Zapier. Zapier watches the FBC Concord YouTube channel (or a designated "Sermons" playlist — see open questions) and fires a webhook to `https://<pipeline-worker>/webhook/sermon` with the new video's ID and basic metadata.

### Pipeline steps

1. **Authenticate the webhook.** Zapier sends a shared-secret header (stored in both Zapier and the Worker's secrets). Reject anything else.
2. **Fetch video metadata** from YouTube Data API: title, description, publish date, duration, thumbnail URL.
3. **Filter** — duration < 20 minutes? Reject (probably an announcement/livestream cut). Title doesn't match a sermon pattern? Reject. Filter rules live in a config file; easy to tweak.
4. **Fetch transcript** from YouTube. Auto-generated captions are usually available within ~1 hour of upload; if not, retry up to 3 times with backoff.
5. **Call Claude** (Anthropic API) with the transcript and a carefully tuned prompt. Returns structured JSON:
   - `title` — clean sermon title
   - `summary` — 2-paragraph "About This Message"
   - `scripture` — main passage (e.g., "Romans 12:1–2")
   - `speaker` — pastor name (Claude detects from intro / from a known-speaker list in the prompt)
   - `tags` — 2–4 short tags
   - `categories` — 1–2 from the existing filter set (`series`, `bible`, `faith`, `family`, `growth`, `missions`)
6. **Build the sermon JSON record** with AI fields + YouTube embed ID + thumbnail.
7. **Commit to GitHub** — single commit creating `data/sermons/YYYY-MM-DD-slug.json`. Commit message: `Auto-publish sermon: <title>`. Author: a dedicated `fbc-cms-bot` GitHub identity.
8. **The site's GitHub Action runs the build step** — reads all sermon JSON, regenerates all sermon HTML pages and the `sermons.html` library page. Cloudflare Pages auto-deploys.
9. **Send notification** — email to dad + Nick with subject `New sermon published: <title>` and a body containing the public URL and a link to the sermon's edit page in Sveltia.

The pipeline only ever writes the JSON record. The build step (and Sveltia, when humans edit) does the same. One source of truth, one render path.

### Failure handling

- **Transcript not available after 3 retries:** publish a "skeleton" sermon record with title from YouTube + the embed + a placeholder summary. Notify admin: "Transcript unavailable; please add details in Sveltia." Don't block forever.
- **Claude API error:** same fallback. Skeleton record + notify.
- **GitHub commit fails:** retry with backoff (3 attempts). On final failure, log + notify Nick (not dad — this is a tech failure).
- **Duplicate detection:** before publishing, check if a sermon with the same `youtubeId` already exists in `data/sermons/`. If so, skip silently (Zapier sometimes double-fires).

## The build step

A small Node.js script at `scripts/build.js`. Run on every push by GitHub Actions before Cloudflare Pages deploys.

Reads:
- All `data/sermons/*.json` → renders all sermon HTML pages + `sermons.html`.
- All `blog/_source/*.md` → renders all blog HTML pages + `blog/index.html`.
- All `data/galleries/*.json` → renders all gallery HTML pages + `gallery/index.html`.

Templates live in `templates/`. Rendering uses simple string substitution or a tiny template library (e.g., Eta, Mustache) — no React, no build framework. The output is plain static HTML, identical in structure to the hand-written pages today.

This is the *only* code we own that touches presentation HTML. Sveltia and the pipeline never write HTML directly — they only write structured records.

## Sveltia configuration

A single file: `admin/config.yml`. Describes:

- **Backend:** GitHub OAuth, this repo, `main` branch.
- **Media folder:** `images/uploads/` (where Sveltia uploads images go).
- **Collections** (one per content type):
  - **Sermons** — folder collection on `data/sermons/`. Fields: title, date, speaker (select), scripture, youtubeId, tags (list), categories (multi-select), summary (long text), thumbnail (image).
  - **Blog Posts** — folder collection on `blog/_source/`. Fields: title, author (select), date, heroImage (image), excerpt, tags (list), body (Markdown rich-text).
  - **Galleries** — folder collection on `data/galleries/`. Fields: title, description, coverImage (image), images (list of {src, alt}).

The admin UI at `/admin/` consists of just two files: `index.html` (loads Sveltia from a CDN) and `config.yml`. That's the entire admin.

## Authentication

GitHub OAuth, handled by Sveltia.

- Each user (Nick, dad, +1 spare) needs a GitHub account and must be added as a **collaborator** on the repo.
- Sveltia handles the OAuth flow itself by way of an OAuth proxy (Sveltia provides a free hosted one, or we can self-host a tiny Worker — recommend the hosted one for v1).
- No passwords for us to store, no session management, no rate limiting to build. GitHub does it.
- For dad: one-time setup of a GitHub account (10 minutes, walk him through it). After that, he just clicks "Sign in with GitHub" once a month.

The pipeline Worker has its own auth (the Zapier shared secret) and its own GitHub commit credentials (a fine-scoped PAT or GitHub App).

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Public site hosting | Cloudflare Pages (existing) | Already in place, free, fast |
| Admin UI | Sveltia CMS (static, served from `/admin/`) | Free, git-backed, zero ongoing maintenance |
| Build step | Node.js script run by GitHub Actions | Free, deterministic, version-controlled |
| Sermon pipeline | Cloudflare Worker | Same platform as site, free tier, easy secrets |
| AI | Anthropic SDK (Claude Sonnet 4.6) | High-quality structured outputs, prompt caching |
| YouTube | YouTube Data API v3 + youtube-transcript library | Standard |
| Git operations (pipeline) | GitHub REST API (octokit) | No clone needed; direct API commits |
| Email notifications | Resend | Cheap, simple, good Worker support |

No database. No session store. No password hashing. No custom auth.

## Security

- Sveltia: GitHub OAuth handles auth. Repo write access controlled via GitHub collaborators.
- Pipeline webhook: shared secret in header. Reject anything else.
- All API keys (Anthropic, YouTube, GitHub PAT, Resend, Zapier shared secret) live in Cloudflare Worker secrets.
- The pipeline's GitHub PAT is scoped to `contents:write` on this one repo only.
- The site is publicly readable, so there is nothing sensitive in the repo to protect at the data layer.

## What we're explicitly NOT building (YAGNI)

- A custom admin UI (Sveltia provides it).
- A login system, password storage, sessions, password reset (Sveltia + GitHub provide it).
- A WYSIWYG sermon editor with theme/color choices. Sermons all use the same template.
- Drafts / scheduled publish. Publish = now.
- A media library with EXIF, search, tagging. Sveltia's built-in media browser is enough.
- Multi-tenancy. One church.
- Analytics in the admin. Use Cloudflare's built-in analytics for the public site.
- Email newsletters. Out of scope.
- An iOS/Android app.

## Rollout phases

This spec covers v1. Suggested implementation order:

**Phase 1 — Sveltia + build step (immediately useful):**
- Refactor existing sermons into `data/sermons/*.json` (one-time migration of the 6 hand-written cards).
- Refactor existing blog post into `blog/_source/*.md`.
- Refactor existing galleries into `data/galleries/*.json` if any.
- Write `scripts/build.js` that regenerates all HTML from the JSON/MD sources.
- Set up GitHub Actions to run the build on every push.
- Create `templates/sermon-page.html`, `templates/blog-post.html`, `templates/gallery-page.html`.
- Add `admin/index.html` + `admin/config.yml` for Sveltia.
- Set up GitHub OAuth, add Nick + Dad as repo collaborators.
- **Outcome:** dad can immediately edit any existing sermon/blog post and create new ones via Sveltia. The site is now CMS-managed.

**Phase 2 — Sermon auto-publish pipeline:**
- Cloudflare Worker skeleton, secrets, GitHub commit plumbing.
- `/webhook/sermon` endpoint + Zapier integration.
- Sermon pipeline (transcript → Claude → JSON record → commit).
- Notification email.
- **Outcome:** every new sermon on YouTube auto-publishes. Dad gets an email with the URL and an edit link if anything needs touching up.

Each phase is independently shippable. Phase 1 alone is a huge improvement; Phase 2 is the magic.

## Open questions for the reviewer (Nick)

1. **YouTube source filter:** Does FBC have a dedicated "Sermons" playlist on YouTube, or should the pipeline use a duration + title-pattern filter? (Playlist is more reliable; no playlist means we depend on filter heuristics.)
2. **Speaker dropdown — who's on the list?** I'll seed it with "Pastor Jim Collier" and "Pastor Aaron Edwards" from existing pages; add others?
3. **Email-from address for notifications:** `cms@fbcconcord.com`? Needs a verified sender in Resend (or whatever we pick).
4. **Does your dad already have a GitHub account?** If not, we'll spend 10 minutes setting one up during Phase 1 rollout.
5. **OAuth proxy:** Use Sveltia's free hosted OAuth proxy, or self-host a tiny Worker for it? (Hosted is simpler; self-hosted is one less third-party dependency.)

Resolve these during spec review or during plan-writing.
