# Comprehensive Audit Inventory

## Audit scope

This audit covers the uploaded source files, project-shared inventories, generated evidence, application source, database/schema configuration, managed-storage references, tests, build output, public routes, meeting and literature journeys, deployment behavior, and known maintenance or approval gates.

## Initial inventory findings

The project root contains the React/Vite frontend, Express/tRPC server, Drizzle schema and migrations, public-page components, meeting finder and map components, literature manifest/detail implementation, audit evidence, source inventories, link-audit script, and generated documentation. The project is a React 19, Vite, TypeScript, Express, tRPC, Drizzle ORM, and MySQL application.

The uploaded workspace contains the supplied audit specification, meeting workbook, WordPress exports, regional source files, media archives, screenshots, literature PDFs, literature-folder evidence, and prior audit records. The project-shared directory contains the national literature inventory, pamphlet URL list, source archive, supplied logo, hero assets, and master rebuild audit specification. The webdev static-assets directory currently contains 2,496 managed project asset files; this requires a duplicate/orphan/path-integrity review during the asset phase.

The project package exposes scripts for tests, TypeScript checking, production build, development, Drizzle generation/migration, formatting, and the existing Shopify probe. The package includes MySQL/Drizzle, S3 storage helpers, Google Maps, React, tRPC, and the generated UI dependencies. The working tree currently has the intentional TODO-ledger change made for this comprehensive audit; no unrelated source change was detected by the initial status check.

## Initial risks and observations

The development logs contain an old Vite parse-error entry for `client/src/pages/LiteraturePage.tsx` reporting an expected JSX closing tag, although the latest TypeScript watcher reports zero errors and the current literature route has since been rebuilt. This historical log entry must be distinguished from current runtime health and should be checked against fresh tests/build output.

The audit must preserve the distinction between completed technical work and organisation-owned blockers: staged regional-page publication decisions, historical meeting QA decisions, transactional email credentials, authorised administrator acceptance, and native-device keyboard acceptance cannot be marked complete without the required inputs.

The exact underlying object-storage bucket name is not present in the application configuration. Literature files are referenced through managed-storage object paths and must be audited through their manifest URLs/keys rather than assumed to be in MySQL.

## Next audit actions

1. Run fresh tests, TypeScript, production build, and repository checks.
2. Inspect schema, migrations, route registration, storage helpers, security headers, and dependency health.
3. Audit source manifests, meeting counts, literature counts, link targets, and asset references.
4. Verify representative and high-risk live public routes and download responses.
5. Repair only confirmed technical findings, add regression coverage, and produce the final audit report.

## Status

Inventory phase started. No findings have yet been classified as newly confirmed defects until fresh checks are complete.
