# Working in this repo with Claude

## Branching and commits

- When starting a new feature, create a new branch named `claude/<topic>`.
- Commit work-in-progress (specs, research docs, drafts, mocks) to that branch **immediately** rather than leaving files untracked.
- Never leave a session with uncommitted work. Either commit it or stash it explicitly with a descriptive message (`git stash push -m "..."`). Untracked files do not survive `git clean -fd`, which other sessions or workflows may run during branch hops.
- Prefer many small WIP commits over one big polished commit. They can always be squashed later, and they protect against accidental loss.
- Before switching branches mid-session, confirm the working tree is either clean or stashed.

## Brainstorm artifacts

- `.superpowers/` is in `.gitignore` because the visual companion server stores transient mocks there. If a mock or design artifact is important enough to keep, copy it into the repo (e.g., `docs/superpowers/specs/`) and commit it.
