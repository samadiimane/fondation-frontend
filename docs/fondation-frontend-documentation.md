# Fondation Frontend Documentation

Last analyzed: 2026-05-13

## 1. Executive Summary

`fondation-frontend` is a multilingual Next.js 15 application for the Abdelaziz Khallouk Temsamani research foundation. It combines a public foundation website, a digital library, category and journal browsing, events, publishing guidance, a mock research assistant, authentication, and an admin back office for users, authors, categories, journals, issues, and documents.

The codebase is partly a themed React/SCSS site based on the Charifund nonprofit template and partly a newer app layer using App Router, `next-intl`, TanStack Query, Radix/shadcn-style components, and typed TypeScript API modules.

## 2. Technology Stack

- Framework: Next.js `15.3.2`, App Router under `src/app`.
- React: React 18.
- Language mix: JSX and TypeScript. `allowJs` is enabled and `strict` TypeScript is disabled.
- Internationalization: `next-intl` with locale-prefixed routing.
- Data fetching/cache: browser `fetch`, custom `apiFetch`, and TanStack Query.
- Forms/validation: `react-hook-form`, `@hookform/resolvers`, `zod`.
- UI: Bootstrap, Tailwind CSS, Radix UI primitives, lucide-react, Font Awesome assets, NiceSelect, AOS, Slick carousel.
- Styling: Tailwind plus SCSS from `public/assets/scss/main.scss`.
- Build tooling: Sass, PostCSS, Tailwind, Next bundle analyzer.

## 3. Project Scripts

From `package.json`:

- `npm run dev`: starts Next dev server.
- `npm run dev:clean`: removes `.next-dev` then starts dev server.
- `npm run build`: runs `prebuild` then `next build`.
- `npm run start`: starts production Next server.
- `npm run lint`: configured as `next lint`.
- `npm run clean:next:*`: runs `scripts/clean-next.cjs` to remove `.next`, `.next-dev`, or both.

Production builds use `.next`; development uses `.next-dev` through `next.config.js`.

## 4. Runtime Configuration

The app expects one of these public API base variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_BASE`
- `NEXT_PUBLIC_API_BASEPATH`

`src/lib/api.js` requires this base URL for frontend API calls. The upload presign route also falls back to `http://127.0.0.1:8000` if no base is configured.

The README documents:

```bash
NEXT_PUBLIC_API_BASE=http://192.168.1.5:8000
```

## 5. Repository Shape

Important top-level files and folders:

- `src/app`: Next App Router pages, layouts, loading states, not-found pages, and API route.
- `src/components`: public, admin, UI, assistant, search, events, journals, category, and document components.
- `src/hooks`: reusable client hooks for auth, search, journals, events, categories, and admin capabilities.
- `src/lib`: API clients, normalization helpers, query client, document type helpers, mock AI client.
- `src/content`: local static content used by public pages and service/support sections.
- `src/i18n`: locale routing, request config, and localized navigation wrappers.
- `src/messages`: modular translation JSON by locale and namespace.
- `messages`: older top-level locale JSON files.
- `public/assets`: images, fonts, compiled CSS, SCSS source, Bootstrap JS, and one PDF.
- `docs/qa/admin.md`: existing admin QA checklist.
- `scripts/clean-next.cjs`: cleanup script for Next output directories.
- `doc_tmp.jsx` and `tmp.txt`: temporary files; `doc_tmp.jsx` contains only `hello/world`, and `tmp.txt` is effectively empty.

At analysis time, `src` contained 359 files and about 53,815 lines. `src` extensions included 230 `.jsx`, 25 `.ts`, 13 `.tsx`, 23 `.js`, and 60 `.json` files. `public/assets` included 541 SVGs, 223 PNGs, 57 SCSS files, 24 CSS files, 9 JPGs, fonts, one JS bundle, and one PDF.

## 6. App and Layout Flow

`src/app/page.jsx` redirects `/` to the default locale, currently `/en`.

`src/app/layout.jsx`:

- Sets metadata for "AKT research foundation".
- Resolves the locale through `next-intl`.
- Sets `<html lang>` and RTL/LTR direction.
- Loads Google fonts, Font Awesome, flag icons, Charifund icon font, AOS CSS, NiceSelect CSS, theme CSS, dark mode CSS, and Bootstrap JS.

`src/app/[locale]/layout.jsx`:

- Generates static params for `en`, `fr`, `es`, `ar`.
- Loads Slick, modal video SCSS, Bootstrap CSS, and global SCSS.
- Wraps pages with `NextIntlClientProvider`, `QueryProvider`, and `AuthProvider`.
- Initializes AOS and route scroll behavior.

`middleware.js` uses `next-intl` middleware and applies locale routing to all non-API, non-static routes.

## 7. Internationalization

Supported locales are:

- `en`: English, default.
- `fr`: French.
- `es`: Spanish.
- `ar`: Arabic, RTL.

Configuration lives in:

- `src/i18n/config.js`
- `src/i18n/routing.js`
- `src/i18n/request.js`
- `src/i18n/navigation.js`

Translations are modularized under `src/messages/{locale}` with namespaces including:

- `common`, `auth`, `admin`, `assistant`, `publishing`
- `library`, `library-research-themes`, `library-publications`, `library-historical-sites`
- `events`, `support`, `services`, `shared`, `foundation-intro`, `counter`

`src/messages/index.ts` dynamically imports and deep-merges namespace files per locale and caches messages in production.

## 8. Public Route Inventory

Main public routes:

- `/{locale}`: home page.
- `/{locale}/foundation`: foundation overview page.
- `/{locale}/dr-temsamani`: doctor/person page.
- `/{locale}/structure`: team/organization page.
- `/{locale}/les-tangerois`: uses `DifferenceTwo` content section.
- `/{locale}/dar-al-niaba`: currently only layout shell with header/footer; no main content component.
- `/{locale}/services/[slug]`: static localized service detail page.
- `/{locale}/library`: digital library search.
- `/{locale}/documents`: redirects to `/{locale}/library`.
- `/{locale}/documents/[id]`: document detail.
- `/{locale}/library/[id]`: re-exports document detail.
- `/{locale}/collections`: collection list.
- `/{locale}/collections/[id]`: collection documents.
- `/{locale}/categories/archives`: archive collections hub.
- `/{locale}/categories/archives/[slug]`: archive collection documents.
- `/{locale}/categories/research-themes`: research themes hub.
- `/{locale}/categories/research-themes/[slug]`: research theme documents.
- `/{locale}/categories/historical-sites`: historical sites documents.
- `/{locale}/categories/publications`: publication documents.
- `/{locale}/journals`: journal search/list.
- `/{locale}/journals/[slug]`: journal detail with issues.
- `/{locale}/journals/[slug]/issues/[issueId]`: articles in one issue.
- `/{locale}/library/journals`: redirects to `/{locale}/journals`.
- `/{locale}/library/journals/[slug]`: redirects to `/{locale}/journals/[slug]`.
- `/{locale}/events`: events hub.
- `/{locale}/events/[slug]`: event detail.
- `/{locale}/advanced-search`: mock AI research assistant.
- `/{locale}/publishing`: publishing/submission guide.
- `/{locale}/support/faq`: FAQ.
- `/{locale}/support/contact`: contact/support desk.
- `/{locale}/support/terms`: terms and policies.
- `/{locale}/auth/login`: login page.

Test route:

- `/test/admin-journals`: a small test page that logs admin journal payloads.

API route:

- `/api/uploads/presign`: proxies upload presign requests to the backend.

## 9. Navigation and Shell Components

`HeaderFour.jsx` is the main public navigation header. It builds menus from:

- Static about/support/event links.
- Service slugs from `src/content/services.js`.
- Backend categories through `useNavigationTaxonomy`.
- Backend journals through `getJournals`.
- Auth state through `useAuth`.

Top bar:

- `TopBarTwo.jsx` shows email, phone, social links, dark/light body class toggle, and a NiceSelect language switcher.

Footer:

- `Footer.jsx` renders logo, foundation description, quick links, service links, contact links, social links, and support links.

Shared public wrappers:

- Most public pages use `AOSWrap`, `Preloader`, `CustomCursor`, `TopBarTwo`, `HeaderFour`, and `Footer`.

## 10. Content Model

Static/local content:

- `src/content/services.js`: three service pages:
  - `academic-consultations`
  - `researcher-support`
  - `personal-platform`
- `src/content/support.js`: FAQ, contact, and terms content with fallback locale merging.
- `src/content/librarySearch.ts`: localized labels for the library search UI.
- `src/content/aboutFoundation.ts`, `aboutDoctor.ts`, `foundationIntro.ts`, `teamInner.ts`: content for foundation and team sections.

Dynamic/backend content:

- Documents
- Categories
- Collections
- Journals and issues
- Events
- Admin users/authors/categories/journals/documents

## 11. API Client Layer

The main client is `src/lib/api.js`.

It provides:

- API base URL resolution.
- JWT token storage in `localStorage` under `akt.auth.token`.
- Auth change events under `akt:auth-change`.
- JWT payload decoding.
- Query string builder.
- 30-second in-memory GET response cache.
- `apiFetch` wrapper with JSON parsing, bearer auth header, retry for GET requests, and 401 token clearing.
- Normalizers for documents, categories, events, journals, issues, and paginated responses.

Public endpoints used:

- `GET /v1/search/documents`
- `GET /v1/documents`
- `GET /v1/documents/{id}`
- `GET /v1/events`
- `GET /v1/events/{slug}`
- `GET /v1/collections`
- `GET /v1/collections/{id}/documents`
- `GET /v1/journals`
- `GET /v1/journals/{slug}`
- `GET /v1/journals/{slug}/issues`
- `GET /v1/journals/{slug}/issues/{issueId}/articles`
- `GET /v1/categories`
- `GET /v1/categories/{slug}`
- `GET /v1/categories/{slug}/children`
- `POST /v1/auth/login`
- `POST /v1/auth/google`
- `POST /v1/auth/signup`

`src/lib/api/publicDocuments.ts` fetches latest documents for the home carousel using `/v1/search/documents`, falling back to `/v1/documents`.

## 12. Authentication

`src/hooks/useAuth.js` owns authentication state.

It:

- Reads/writes the JWT token via `src/lib/api.js`.
- Decodes token payload.
- Checks expiration.
- Derives `user` and normalized lowercase `roles`.
- Exposes `login`, `signup`, `loginWithGoogle`, `logout`, and `refreshFromStorage`.
- Synchronizes auth state across browser tabs with storage and custom auth events.

`src/app/[locale]/auth/login/page.jsx`:

- Uses email/password login.
- Redirects admins to `/admin`.
- Redirects non-admin authenticated users to `/`.
- Displays API validation errors where possible.

## 13. Public Library and Search

`src/components/LibrarySearch.jsx` and `src/hooks/useDocumentsSearch.js` implement the main e-library interface.

Features:

- Search query with debounce.
- Facets for type, language, category, and year.
- Advanced filters for author and year range.
- Category enrichment using backend journal categories.
- URL synchronization with query parameters.
- Detailed/compact result view modes.
- Pagination.
- Backend fallback when author filter is not supported by older API endpoints.

Document cards use:

- `src/components/search/DocumentCard.jsx`
- `src/lib/authors.js`
- `src/lib/documentTypes.js`

Document detail:

- `src/app/[locale]/documents/[id]/page.jsx`
- Fetches `getDocument(id)`.
- Displays metadata, authors, journal/issue context, DOI/ISBN/ISSN, category, keywords, preview, and download action.
- Uses `DocumentPreview`, `DocumentDownloadButton`, and `ExpandableText`.

Potential bug to check: `getDocumentFileLink(id)` calls `/v1/{id}/file`, which looks inconsistent with the rest of the document API paths and may need to be `/v1/documents/{id}/file`.

## 14. Categories and Collections

Category pages load backend category metadata by slug and render document explorers.

Main components:

- `CategoryHeader`
- `TopicsGrid`
- `CollectionsGrid`
- `CategoryDocumentsExplorer`
- `CategoryToolbar`

`useCategoryDocuments`:

- Builds `/v1/search/documents` queries using `src/lib/categoryQuery.ts`.
- Supports category, text query, sort, author, document type, descendants, page, page size, and locale.
- Syncs filters to URL.
- Falls back if backend does not support author filtering.

Collections:

- `/collections` lists curated collections from `/v1/collections`.
- `/collections/[id]` loads `/v1/collections/{id}/documents` and hands off to `CollectionDocumentsSection`.

## 15. Journals and Issues

Journal list:

- Route: `/{locale}/journals`
- Component: `JournalsExplorer`
- Hook: `useJournalsSearch`
- Backend: `GET /v1/journals`
- Filters: query, ISSN, sort, pagination.
- ISSN filtering and sort are done client-side after fetching one page.

Journal detail:

- Route: `/{locale}/journals/[slug]`
- Loads journal metadata and issues.
- Displays header stats, coverage/holdings if present, and issue table/cards.

Issues:

- `useJournalIssues` fetches all pages of issues, then applies year/volume/number filters and sorting client-side.
- `/{locale}/journals/[slug]/issues/[issueId]` finds the issue by paging through issues, then loads articles with `/v1/journals/{slug}/issues/{issueId}/articles`.

Admin journal management includes creating/updating journals, soft delete/restore, cover uploads, and issue management in a side sheet.

## 16. Events

Routes:

- `/{locale}/events`
- `/{locale}/events/[slug]`

Supported event types:

- `seminar`
- `award`
- `exhibition`

Public components:

- `EventsHub`
- `EventCard`
- `EventDetailView`
- `EventListSkeleton`
- `EventDetailSkeleton`

`useEvents` fetches paginated events from `/v1/events` with optional type filtering. Event detail uses `/v1/events/{slug}` and normalizes type-specific detail blocks such as speakers, agenda, winners, gallery, venue, curator, and award metadata.

Potential issue: navigation uses `?type=exhibitions`, while the event hook accepts `exhibition` singular.

## 17. Publishing Guide

Route:

- `/{locale}/publishing`

Component:

- `PublishingClient`

Features:

- Localized guide page from `publishing` translations.
- Sticky table of contents on desktop and select dropdown on mobile.
- Sections for overview, eligibility, guidelines, policies, templates, submission CTA, timeline, FAQ, and contact.
- Download links are generated as `/publishing/templates/...`; actual files were not found in the inspected asset list.

## 18. Advanced Search / Assistant

Route:

- `/{locale}/advanced-search`

Components:

- `AssistantClient`
- `ChatMessages`
- `SourcesPanel`
- `PreviewModal`
- `AssistantToolbar`

Current behavior:

- Uses `src/lib/ai/mockClient.ts`, not a real backend or AI API.
- Streams fake localized responses token-by-token.
- Uses sample static citations.
- Provides localized example prompts.
- Shows sources and citation preview.
- Can copy assistant messages to clipboard.

This is a UI prototype rather than a production retrieval/AI integration.

## 19. Admin Back Office

Admin route group:

- `/{locale}/admin`
- `/{locale}/admin/users`
- `/{locale}/admin/authors`
- `/{locale}/admin/categories`
- `/{locale}/admin/documents`
- `/{locale}/admin/journals`

Admin shell:

- `src/components/admin/AdminLayout.jsx`
- Wrapped by `src/components/auth/AdminGuard.jsx`.
- Requires authenticated user with `admin` role.
- Provides sidebar navigation, mobile sheet nav, command menu, profile/logout actions, capability prefetching, route prefetching, and toaster.

Admin capabilities:

- `src/lib/api/adminCapabilities.ts`
- Backend: `GET /v1/admin/capabilities`
- Controls visibility/enabling for users, documents, categories, authors, journals, collections, events, and uploads.

### Admin Users

Route:

- `/{locale}/admin/users`

Files:

- `src/app/[locale]/admin/users/page.jsx`
- `src/lib/api/admin.ts`
- `src/components/admin/users/*`

Features:

- List users with query, role filter, pagination.
- Create user.
- Activate/deactivate user.
- Replace/manage roles.
- Optimistic UI updates.
- Fallback to legacy auth endpoints if admin endpoints are missing.

Admin user endpoints:

- `GET /v1/admin/users`
- `POST /v1/admin/users`
- `GET /v1/admin/users/{id}`
- `PATCH /v1/admin/users/{id}/active`
- `PATCH /v1/admin/users/{id}/roles`
- legacy fallback: `/v1/auth/users`, `/v1/auth/signup`, `/v1/auth/users/{id}/roles`

### Admin Authors

Route:

- `/{locale}/admin/authors`

Features:

- Search authors.
- Sort by name or created date.
- Filter active/deleted/all.
- Create author.
- Soft delete and restore.

Endpoints:

- `GET /v1/admin/authors`
- `POST /v1/admin/authors`
- `PATCH /v1/admin/authors/{id}/soft-delete`
- `PATCH /v1/admin/authors/{id}/restore`

### Admin Categories

Route:

- `/{locale}/admin/categories`

Features:

- Tree view with lazy child loading.
- Kind filter: section, journal, archive collection, topic.
- Search/list view.
- Create/update/delete categories.
- Move categories.
- Reorder siblings.
- Optimistic tree and child-cache updates.
- Delete is disabled if category has documents or children.

Endpoints:

- `GET /v1/admin/categories/tree`
- `GET /v1/admin/categories/children/{parentId}`
- `GET /v1/admin/categories/list`
- `POST /v1/admin/categories`
- `PATCH /v1/admin/categories/{id}`
- `PATCH /v1/admin/categories/reorder`
- `PATCH /v1/admin/categories/{id}/move`
- `DELETE /v1/admin/categories/{id}`

### Admin Journals and Issues

Route:

- `/{locale}/admin/journals`

Features:

- Search journals.
- Active/deleted/all status filter.
- Create/edit journals.
- Upload cover images through presigned uploads.
- Soft delete and restore journals.
- Manage issues in a side sheet.
- Create/update/delete issues.

Endpoints:

- `GET /v1/admin/journals`
- `POST /v1/admin/journals`
- `PATCH /v1/admin/journals/{id}`
- `PATCH /v1/admin/journals/{id}/soft-delete`
- `PATCH /v1/admin/journals/{id}/restore`
- `GET /v1/admin/journals/{journalId}/issues`
- `POST /v1/admin/journals/{journalId}/issues`
- `PATCH /v1/admin/issues/{issueId}`
- `DELETE /v1/admin/issues/{issueId}`
- `POST /api/uploads/presign`

### Admin Documents

Route:

- `/{locale}/admin/documents`

Features:

- Search documents.
- Filter by type, language, status, year range, section, and sub-category.
- Create/edit documents with form validation.
- Soft delete and restore.
- Assign authors.
- Assign category, journal, and issue.
- Auto-lock document type based on selection:
  - issue selected: `article`
  - linked journal category: `article`
  - archive collection: `archive_item`
  - historical sites section: `site_record`
- Upload PDFs through presigned upload flow.
- Derive pages from start/end pages.

Endpoints:

- `GET /v1/admin/documents`
- `GET /v1/admin/documents/{id}`
- `POST /v1/admin/documents`
- `PATCH /v1/admin/documents/{id}`
- `PATCH /v1/admin/documents/{id}/delete`
- `PATCH /v1/admin/documents/{id}/restore`

Validation:

- `DocumentFormSchema` requires title.
- Language can be `ar`, `fr`, or `en`.
- Year range is 1800 to 2100.
- Cover URL must be a valid URL if provided.
- Issue-linked documents must be type `article`.

## 20. Upload Flow

The frontend upload flow is used by journal covers and document PDFs.

Flow:

1. Client calls `POST /api/uploads/presign`.
2. Next route proxies to backend `POST /v1/uploads/presign`.
3. Client uploads file directly to returned `uploadUrl` using `PUT`.
4. Client stores returned `publicUrl` or `key`.

Auth forwarding:

- The proxy forwards Authorization header if present.
- It also forwards cookies.
- If no Authorization header exists, it tries to extract `access_token`, `token`, or `auth` from cookies.
- It forwards XSRF token headers if present.

Document PDF limits:

- PDF only.
- 100MB maximum.

## 21. UI Component System

`src/components/ui` contains shadcn/Radix-style primitives:

- alert, alert-dialog, avatar, badge, button, card, checkbox, command, dialog, dropdown-menu, form, input, label, navigation-menu, popover, radio-group, scroll-area, select, separator, sheet, skeleton, table, textarea, toast, toaster, tooltip.

`components.json` is configured for:

- style: `new-york`
- TSX: false
- Tailwind config: `tailwind.config.js`
- CSS: `src/app/globals.scss`
- icon library: `lucide`

## 22. Styling and Assets

Global styling starts in `src/app/globals.scss`:

- Imports Tailwind base/components/utilities.
- Imports `/public/assets/scss/main.scss`.
- Defines shadcn-style HSL CSS variables.

`public/assets/scss/main.scss` imports:

- abstracts, base, components, layout, and many section styles.
- custom newer sections: about foundation, about doctor, library search, journals, issue articles, article detail, category, assistant, publishing.
- responsive, extra, and RTL styles.

The public asset library includes:

- Template images for banners, blogs, events, shop, team, donations, awards, galleries, community, support, etc.
- Flag icons under `public/assets/fonts/flags`.
- Font Awesome and Charifund icon fonts.
- Compiled CSS copies under `public/assets/css`.
- One PDF: `public/assets/docs/biographie-temsamani.pdf`.

## 23. Query and Cache Behavior

Global TanStack Query config in `src/lib/queryClient.ts`:

- query stale time: 30 seconds.
- garbage collection: 120 seconds.
- query retry: 1.
- mutation retry: 0.
- refetch on window focus: false.
- refetch on reconnect: true.

`apiFetch` also has a 30-second in-memory GET cache, independent of TanStack Query.

## 24. Error Handling and Notifications

`src/hooks/useNotify.js` centralizes admin notifications:

- Detects session expiration.
- Detects forbidden errors.
- Detects network errors.
- Can trigger logout on session expiration.
- Uses toast UI under `src/components/ui`.

Admin API modules define feature-specific error classes:

- `AdminApiError`
- `AdminAuthorApiError`
- `AdminCategoryApiError`
- `AdminDocumentApiError`
- `AdminJournalApiError`

## 25. Build and QA Notes

Existing QA doc: `docs/qa/admin.md`.

It recommends:

- `ANALYZE=true npm run build` for bundle analysis.
- Keeping `/[locale]/admin/users` first-load JS under the documented previous size.
- Running `npm run build` before release.
- Watching for hydration warnings.
- Validating admin cache, navigation prefetch, command palette, and error notifications.

I did not run a build or tests during this analysis.

## 26. Current Gaps and Risks Observed

- There is no dedicated test suite visible in the inspected files.
- `README.md` is still mostly the default create-next-app README with a short eLibrary note.
- `doc_tmp.jsx` and `tmp.txt` look like leftover temporary files.
- The worktree already has many uncommitted changes, including admin, assistant, publishing, styles, messages, configs, and cleanup script changes.
- Some pages are shells or thin wrappers, especially `dar-al-niaba`.
- Assistant is a mock prototype, not connected to real retrieval or AI services.
- Publishing template download links are generated, but matching files were not visible.
- `getDocumentFileLink` may call the wrong backend path.
- Events nav uses `exhibitions` plural while event filtering expects `exhibition`.
- There are development logs in `src/app/test/admin-journals/page.tsx`, `useJournalsSearch`, and `useNotify`.
- Several older public components from the original template remain in `src/components` and may be unused.
- TypeScript strictness is disabled, and many core files are JSX.

## 27. Suggested Next Documentation Improvements

- Replace the root README with project-specific setup, backend contract, and route map.
- Add a backend API contract document matching the endpoints above.
- Add an admin operations guide with roles/capabilities and upload workflow.
- Add a content editing guide for translation files and `src/content`.
- Add a cleanup task for temporary files and unused template components/assets.
- Add smoke tests for public library search, login/admin guard, admin documents, journals/issues, and upload presign.
