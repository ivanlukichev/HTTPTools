# Public Repo Notes

## Goal

Keep `httptools.net` ready for use as a real public source repository, not just a showcase link.

## Safe publication scope

- `deploy/static/**`
- `deploy/worker/index.js`
- `src/worker/index.js`
- `scripts/build-deploy.mjs`
- `package.json`
- `package-lock.json`
- `wrangler.jsonc`
- `README.md`
- `docs/repository-audit.md`

## Excluded from publication concerns

These may exist locally but are intentionally not tracked or are not meant to be published as secrets:

- `.env*`
- `.wrangler/`
- `node_modules/`
- logs
- temp files
- local machine metadata

## Why this repo works publicly

- The Worker source is small and readable.
- The static site is already organized into a production-only deploy tree.
- No tracked secrets were found during the audit and follow-up scans.
- The README now explains how the live site maps to the repository.
