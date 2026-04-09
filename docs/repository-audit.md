# Repository Audit

Date: 2026-04-03

## Production Files

- `deploy/static/**`
- `deploy/worker/index.js`

## Source Files

- `src/worker/index.js`
- `scripts/build-deploy.mjs`
- `package.json`
- `package-lock.json`
- `wrangler.jsonc`

## Documentation

- `README.md`
- `docs/repository-audit.md`

## Temporary / Junk Files Removed

- `Archive.zip`
- `.DS_Store`
- obsolete `.assetsignore`

## Sensitive Data

No committed secrets were found during the audit. Ignore rules now explicitly cover `.env*`, `.dev.vars`, logs, archives, temp directories, and local cache directories.

## Dead / Unused Files Removed

- Root-level production pages and assets were removed from the repository root and relocated into `deploy/static`.
- The old root-asset deployment pattern in Wrangler config was removed.
- `.assetsignore` became unnecessary after switching Wrangler to `deploy/static`.

## Deployment Standard

- Deployments must use `deploy/static` for site assets.
- Deployments must use `deploy/worker/index.js` for the Worker entrypoint.
- `src/worker/index.js` is the editable source and is synced into `deploy/worker` by `npm run build:deploy`.
