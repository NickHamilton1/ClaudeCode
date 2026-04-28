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

## Architecture

### Source of truth: the git repository

All content — sermons, blog posts, photos, and the JSON indexes that drive list pages — lives in the existing GitHub repo. Publishing = committing to `main`. Cloudflare Pages auto-deploys on push. Rollback = `git revert`.

This means:

- The public site has zero runtime dependency on the CMS or any database.
- Every change is auditable (git log shows who published what and when).
- The CMS can be down for days and the site keeps working perfectly.

### Three components

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  Zapier (YouTube    │────▶│  CMS Worker          │────▶│  GitHub repo        │
│  new-video trigger) │     │  (Cloudflare Worker) │     │  (commits HTML +    │
└─────────────────────┘     │                      │     │   JSON indexes)     │
                            │  - /webhook/sermon   │     └──────────┬──────────┘
┌─────────────────────┐     │  - /admin (UI)       │                │
│  Admin user (dad,   │────▶│  - /api/...          │                ▼
│  Nick, others) in   │     │                      │     ┌─────────────────────┐
│  a web browser      │     │  Calls Anthropic +   │     │  Cloudflare Pages   │
└─────────────────────┘     │  YouTube + GitHub    │     │  auto-deploys       │
                            │  APIs                │     │  (public site)      │
                            └──────────────────────┘     └─────────────────────┘
```

1. **Cloudflare Pages** — serves the public static site. Already exists. Unchanged.
2. **CMS Worker** — single Cloudflare Worker hosting the admin UI, the API, and the Zapier webhook endpoint. Talks to GitHub API to commit content.
3. **External services** — Anthropic API (Claude, for sermon AI), YouTube Data API (for transcript + video metadata), Resend or similar (for publish notifications).

### Why a Cloudflare Worker for admin (not a separate service)

- Same platform as the site (one place to manage, one bill).
- Free tier covers all expected traffic.
- Native bindings to Cloudflare KV (for sessions) and Secrets (for API keys).
- Routes can be split: `/admin/*` and `/api/*` go to the Worker, everything else to Pages.

## Content model

Each content type has both a **rendered HTML file** (for the public site) and an **entry in a JSON index** (the source of structured data, used by the admin and by list pages).

### Sermons

**HTML file:** `sermons/YYYY-MM-DD-slug.html` — generated from `templates/sermon-page.html`.

**Index file:** `data/sermons.json` — array of records, newest first:

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
  "url": "/sermons/2026-04-13-the-heart-of-worship.html",
  "publishedAt": "2026-04-13T17:42:00Z",
  "source": "auto"
}
```

The existing `sermons.html` library page is regenerated from this JSON on every publish (cards, filters, "Load More" — all driven by the index).

### Blog posts

**HTML file:** `blog/YYYY-MM-DD-slug.html` — generated from `templates/blog-post.html`.

**Index file:** `data/blog.json` — array of records:

```json
{
  "id": "2026-03-15-finding-peace-in-anxious-times",
  "slug": "finding-peace-in-anxious-times",
  "date": "2026-03-15",
  "title": "Finding Peace in Anxious Times",
  "author": "Pastor Aaron Edwards",
  "heroImage": "/images/blog/finding-peace-hero.jpg",
  "excerpt": "One-sentence teaser shown on the blog index.",
  "tags": ["Faith", "Anxiety"],
  "bodyHtml": "<p>Full post HTML…</p>",
  "url": "/blog/2026-03-15-finding-peace-in-anxious-times.html",
  "publishedAt": "2026-03-15T09:00:00Z"
}
```

`blog/index.html` is regenerated from this JSON on every publish.

### Photos / galleries

**Files:** `images/<gallery-name>/<filename>.jpg` — uploaded as-is.

**Index file:** `data/galleries.json` — one record per gallery:

```json
{
  "slug": "abc-preschool",
  "title": "ABC Preschool",
  "description": "Photos from our preschool ministry.",
  "coverImage": "/images/abc-preschool/cover.jpg",
  "images": [
    { "src": "/images/abc-preschool/01.jpg", "alt": "Children at chapel", "uploadedAt": "2026-04-20T..." }
  ]
}
```

A single template `templates/gallery-page.html` renders any gallery from its slug. (Future-friendly: lets the admin create new galleries without new code.)

## The sermon auto-publish pipeline

Triggered by Zapier. Zapier watches the FBC Concord YouTube channel (or a designated "Sermons" playlist — see open questions) and fires a webhook to `https://<cms-worker>/webhook/sermon` with the new video's ID and basic metadata.

### Pipeline steps

1. **Authenticate the webhook.** Zapier sends a shared-secret header (stored in both Zapier and the Worker's secrets). Reject anything else.
2. **Fetch video metadata** from YouTube Data API: title, description, publish date, duration, thumbnail URL.
3. **Filter** — duration < 20 minutes? Reject (probably an announcement/livestream cut). Title doesn't match a sermon pattern? Reject. (Filter rules live in a config file; easy to tweak.)
4. **Fetch transcript** from YouTube. (Auto-generated captions are usually available within ~1 hour of upload; if not, retry up to 3 times with backoff.)
5. **Call Claude** (Anthropic API) with the transcript and a carefully tuned prompt. Returns structured JSON:
   - `title` — clean sermon title
   - `summary` — 2-paragraph "About This Message"
   - `scripture` — main passage (e.g., "Romans 12:1–2")
   - `speaker` — pastor name (Claude detects from intro / from a known-speaker list in the prompt)
   - `tags` — 2–4 short tags
   - `categories` — 1–2 from the existing filter set (`series`, `bible`, `faith`, `family`, `growth`, `missions`)
6. **Render** the sermon HTML by templating `templates/sermon-page.html` with the AI fields + YouTube embed ID + thumbnail.
7. **Update `data/sermons.json`** — prepend the new record.
8. **Regenerate `sermons.html`** — re-render the library page from the updated index (replaces the hand-written cards with a generated block delimited by `<!-- SERMON CARDS:START -->` / `END` markers so we don't disturb surrounding HTML).
9. **Commit to GitHub** — single commit containing the new sermon HTML, updated `data/sermons.json`, and updated `sermons.html`. Commit message: `Auto-publish sermon: <title>`. Author: a dedicated `fbc-cms-bot` GitHub identity.
10. **Send notification** — email to dad + Nick with subject `New sermon published: <title>` and a body containing the public URL and an "Edit in admin" link.

### Failure handling

- **Transcript not available after 3 retries:** publish a "skeleton" sermon page with title from YouTube + the embed + a placeholder summary. Notify admin: "Transcript unavailable; please add details." Don't block forever.
- **Claude API error:** same fallback. Skeleton page + notify.
- **GitHub commit fails:** retry with backoff (3 attempts). On final failure, log + notify Nick (not dad — this is a tech failure).
- **Duplicate detection:** before publishing, check if a sermon with the same `youtubeId` already exists in `data/sermons.json`. If so, skip silently (Zapier sometimes double-fires).

## The admin UI

A simple, mobile-friendly web app at `https://admin.fbcconcord.com` (or `/admin` on the main domain — TBD by DNS preference). Server-rendered HTML pages with minimal JavaScript (sprinkled-in for the rich-text editor and image upload). Same visual style as the public site (reuse `css/global.css`).

### Pages

- **`/admin/login`** — email + password.
- **`/admin`** — dashboard. Three cards: "Sermons" / "Blog Posts" / "Photo Galleries". Each shows a count and a "Recent activity" list.
- **`/admin/sermons`** — list of all sermons with search. Click any to edit.
- **`/admin/sermons/:id/edit`** — form pre-filled with all fields from `data/sermons.json`. Includes title, date, speaker (dropdown), scripture, tags (chip input), categories (checkboxes), summary (textarea), YouTube ID. "Save" commits an updated record. "Delete" removes the record + the HTML file (with confirm). No "create new" — sermons are auto-created by the pipeline only.
- **`/admin/blog`** — list, with a prominent "+ New Post" button.
- **`/admin/blog/new` and `/admin/blog/:id/edit`** — form: title, author (dropdown), date, hero image (upload), tags, body (rich-text editor — TipTap or similar). "Publish" commits.
- **`/admin/galleries`** — list of galleries.
- **`/admin/galleries/:slug`** — gallery editor: title, description, drag-drop multi-image upload, reorder, delete individual images. "+ New Gallery" creates a new one.

### Authentication

- 3 hardcoded users to start: Nick, Dad, +1 spare slot. Stored in a `data/users.json` (or Cloudflare KV) with bcrypt-hashed passwords. No self-signup, no password reset email flow at v1 — Nick can reset by editing the file.
- Login produces a signed session cookie (HttpOnly, Secure, SameSite=Lax). Stored server-side in Cloudflare KV with a 30-day expiry.
- All `/admin/*` and `/api/*` routes require a valid session. The `/webhook/sermon` route uses the shared secret instead.

### Image uploads (blog hero, galleries)

- Browser uploads directly to the Worker, which forwards to Cloudflare R2 (object storage, free tier covers expected volume).
- Worker also commits a copy into `images/...` in the repo, OR the public site serves images from R2 via a `images.fbcconcord.com` subdomain.
- **Recommendation: commit to repo for v1.** Keeps everything in git (one source of truth, one rollback mechanism). R2 is an option later if image volume grows beyond what's comfortable in git.
- Resize on upload: large images get a `-large.jpg` (max 1600px wide) and `-thumb.jpg` (400px). Original is kept too. Done with a Worker-compatible image library or Cloudflare Images.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Public site hosting | Cloudflare Pages (existing) | Already in place, free, fast |
| Admin app + webhook | Cloudflare Worker | Same platform, free tier, easy secrets |
| Admin framework | Hono (or plain fetch handlers) | Lightweight, Worker-native, server-rendered HTML |
| Sessions | Cloudflare KV + signed cookies | Built-in, no DB needed |
| Rich-text editor | TipTap | Good defaults, outputs clean HTML, mobile-friendly |
| AI | Anthropic SDK (Claude Sonnet 4.6) | High-quality structured outputs, prompt caching for the system prompt |
| YouTube | YouTube Data API v3 + youtube-transcript library | Standard |
| Git operations | GitHub REST API (octokit) | No need for a clone — direct API commits |
| Email | Resend | Cheap, simple, good Worker support |
| Image processing | Cloudflare Images (or sharp via a separate function) | TBD during implementation |

## Security

- All admin routes behind login. Webhook behind shared secret.
- All API keys in Cloudflare Worker secrets (never in code).
- GitHub access via a fine-scoped personal access token (contents:write on this one repo only) or a GitHub App. Prefer GitHub App for v2; PAT is fine for v1.
- Bcrypt for password hashing. Argon2id if the chosen library supports it on Workers.
- Rate-limit `/admin/login` to prevent brute force (5 attempts / 15 min per IP, in KV).
- CSRF tokens on admin forms.

## What we're explicitly NOT building (YAGNI)

- A WYSIWYG sermon editor with theme/color choices. Sermons all use the same template.
- A "draft" / "scheduled publish" feature. Publish = now.
- A media library with search, tags, EXIF data. Just folder-based galleries.
- Multi-tenancy. One church.
- Analytics in the admin. Use Cloudflare's built-in analytics for the public site.
- Email newsletters / mailing list integration. Out of scope.
- An iOS/Android app.

## Rollout phases

This spec covers v1. Suggested implementation order:

**Phase 1 — Sermon auto-publish only (the highest-value piece):**
- CMS Worker skeleton, secrets, GitHub commit plumbing
- `/webhook/sermon` endpoint + Zapier integration
- Sermon pipeline (transcript → Claude → HTML render → commit)
- `templates/sermon-page.html` and `data/sermons.json` schema
- Regenerate `sermons.html` from index
- Notification email

**Phase 2 — Admin login + sermon editing:**
- Auth (login page, sessions, user file)
- Sermon list + edit page
- Delete sermon

**Phase 3 — Blog posts:**
- Blog list, create, edit, publish
- Rich-text editor
- Hero image upload + repo commit
- Regenerate `blog/index.html` from index

**Phase 4 — Photo galleries:**
- Gallery list, create
- Multi-image upload with resize
- Generic gallery template
- Regenerate gallery list page

Each phase is independently shippable.

## Open questions for the reviewer (Nick)

1. **YouTube source filter:** Does FBC have a dedicated "Sermons" playlist on YouTube, or should the pipeline use a duration + title-pattern filter? (Playlist is more reliable; no playlist means we depend on filter heuristics.)
2. **Admin URL:** `admin.fbcconcord.com` (subdomain, cleaner) or `fbcconcord.com/admin` (no DNS work)?
3. **Speaker dropdown — who's on the list?** I'll seed it with "Pastor Jim Collier" and "Pastor Aaron Edwards" from existing pages; add others?
4. **Email-from address for notifications:** `cms@fbcconcord.com`? Needs a verified sender in Resend (or whatever we pick).
5. **Image processing:** Cloudflare Images is $5/month and handles resize/optimization automatically. Worth it, or roll our own with sharp-on-a-Worker?

Resolve these during spec review or during plan-writing.
