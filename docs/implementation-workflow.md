# Implementation and GitHub Actions

Use one branch for the complete phase or feature. Commit and push incremental work to that branch. Merge only after implementation, local verification and required human acceptance are complete. Do not merge subphases individually.

Before release run pnpm run verify, the full Playwright suite, strict A11Y_ENFORCE=1 accessibility checks, and production performance sampling. Preserve review artifacts outside the repository.

Feature pushes and pull requests trigger no automatic workflows. A push to main after merge runs deployment verification and the reusable browser-quality suite. Deployment waits for both. Browser and performance checks reuse the browser suite’s production build. Site quality and README screenshots remain available by manual dispatch; screenshots upload artifacts without committing to the branch.

After merge inspect the Pages deployment separately and check published deep links. A failed deployment does not revert the merge.
