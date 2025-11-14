# Admin QA Checklist

## 1. Bundle Analyzer & Size Tracking
- Run `ANALYZE=true npm run build`. This enables `@next/bundle-analyzer` (configured in `next.config.js`) and emits interactive reports under `./.next/analyze/client.html` and `server.html`.
- From the latest analyzer run (2025-11-14), the `First Load JS` for `/[locale]/admin/users` measured **196 kB**; keep future changes under this number or document the reason.
- The standard `npm run build` output should stay free of hydration warnings. Current runs only show the known `/[locale]/collections` dynamic-fetch warning.

## 2. Data Layer & Cache Guardrails
- Admin list queries live in `src/app/[locale]/admin/users/page.jsx` and use TanStack Query with `staleTime: 30_000`, `keepPreviousData: true`, and `refetchOnWindowFocus: false`. Verify these options when touching the file.
- To confirm caching works: switch between roles/pages; data should reuse the previous page for ≤30 s without a network refetch (check the Network tab). After 30 s or a manual `invalidateQueries`, a new call should fire.

## 3. Prefetching & Navigation
- Sidebar links prefetch their routes on hover via `router.prefetch` (see `renderNavLinks` in `AdminLayout`). QA: hover each nav item and confirm you see the request in DevTools; subsequent clicks should be instant.
- Command palette (`⌘K`) uses the same routing targets; ensure new entries are added to both NAV_ITEMS and palette lists.

## 4. Notifications & Auth
- All admin queries/mutations must route errors through `useNotify().handleError`. QA: simulate 401/403/network failures (e.g., throttle or mock responses) and confirm you see “Session expired” + auto logout, “Not authorized…”, or “Network problem…” respectively, with no backend strings leaking.

## 5. Hydration & Smoke Build
- Run `npm run build` before releases. Expect: no hydration mismatch warnings in the log. (As of the latest build there are none; only the API dynamic-fetch message remains.)
- Optional: `npm start` + `NODE_ENV=production` to spot runtime hydration issues in the browser console.

Document any deviations from this checklist directly in this file so future reviewers understand intentional changes.
