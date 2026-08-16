# Page-by-Page Migration Register

This register contains **1,177 unique legacy URLs** extracted from the supplied audit dataset. It is the source-of-truth working inventory for page migration, redirect planning, and acceptance tracking.

## How to use the register

Each row records the legacy source route, the audited owning area, observed audit categories and severity, a sample of reported issues, the proposed rebuild destination, migration state, and redirect decision. Meeting and location records are routed into the structured meeting and area models rather than copied as individual unmaintainable pages. National administrators must update `migration_status` and `redirect_required` only after content, location, spelling, contact, and map checks are complete.

## Current migration rule

The current public meeting-detail pages and uploaded CSV were reconciled record-by-record. The rebuilt finder now publishes **307** records that passed the recorded source-QA checks: **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**. The remaining source records are inactive and remain archived; they are not displayed in the public finder.

Legacy meeting and location URLs are routed into the structured finder rather than reproduced as individual maintenance pages. Core national information routes have matching rebuilt pages or content routes. The remaining legacy commerce and account routes require an explicit national decision before implementation because the new platform does not recreate the former WooCommerce checkout without an approved commerce integration.
