# Project instructions

## Node version

Always use the Node version in `.nvmrc`. The shell default may be older, and Astro will refuse to run on it.

- Prefix every node, npm or npx command: `source ~/.nvm/nvm.sh && nvm use >/dev/null && <command>`
- Run `node -v` and check it matches `.nvmrc` before you install, build or test.
- If `.nvmrc` changes, update the `runtimeExecutable` path in `.claude/launch.json` to match.
