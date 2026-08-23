# Git commit conventions

- Commit author/committer must be the repo owner, never Claude:
  `zxc742695138-pixel <319435357+zxc742695138-pixel@users.noreply.github.com>`.
  Set this per-commit via `git commit --author "..."` plus
  `GIT_COMMITTER_NAME` / `GIT_COMMITTER_EMAIL` env vars for that command —
  never edit `git config`.
- Never add a `Co-Authored-By: Claude ...` or `Claude-Session:` trailer, or
  any other AI/model attribution, to commit messages. Commit messages should
  read as if the owner wrote them.
