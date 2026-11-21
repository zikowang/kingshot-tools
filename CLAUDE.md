# Project instructions

## Node version

Always use the Node version in `.nvmrc`. The shell default may be older, and Astro will refuse to run on it.

- Prefix every node, npm or npx command: `source ~/.nvm/nvm.sh && nvm use >/dev/null && <command>`
- Run `node -v` and check it matches `.nvmrc` before you install, build or test.
- If `.nvmrc` changes, update the `runtimeExecutable` path in `.claude/launch.json` to match.

## Deployment

Pushing or merging into `main` deploys to production on Cloudflare automatically. There is no manual deploy step.

- Treat every push to `main` as a production release.
- Before pushing to `main`, run `npm run lint`, `npm run check`, `npm test` and `npm run build`. All must pass.
- For work that is not ready to ship, use a branch and open a PR instead of pushing to `main`.
