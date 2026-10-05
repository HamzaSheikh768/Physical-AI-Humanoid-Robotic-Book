---
id: 0002
title: Vercel Production Branch Diagnosis
stage: general
date: 2026-10-04
surface: agent
model: GPT-5
feature: 010-ui-system-upgrade
branch: 012-auth-ux-redesign
user: user
command: Diagnose why the Vercel production site remained unresolved after the GitHub update.
labels: [vercel, deployment, github, production]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - vercel.json
 - docusaurus-textbook/vercel.json
 - history/prompts/010-ui-system-upgrade/0002-vercel-production-branch-diagnosis.general.prompt.md
tests:
 - curl.exe -I https://docusaurus-textbook.vercel.app/
 - npm.cmd --prefix docusaurus-textbook run build
 - git ls-remote --symref origin HEAD
---

## Prompt

issue not resolved what happened

## Response snapshot

Rechecked the live domain, corrected and pushed the Vercel output-directory configuration, and verified the local build. The live domain remained a platform-level 404 because the updated commits are on `012-auth-ux-redesign`, while the GitHub remote’s production/default branch is `main`.

## Outcome

- ✅ Impact: Identified the remaining release-blocking condition: production branch/alias mismatch, not a local build failure.
- 🧪 Tests: Live root still returned HTTP 404 with `X-Vercel-Error: NOT_FOUND`; local Docusaurus build passed for English and Urdu; remote HEAD resolved to `main`.
- 📁 Files: Updated both Vercel configuration files to explicit `buildCommand`, `installCommand`, and `outputDirectory` settings; pushed commit `2c60407` to the feature branch.
- 🔁 Next prompts: Merge the feature branch into `main` or set `012-auth-ux-redesign` as Vercel’s Production Branch, then redeploy.
- 🧠 Reflection: A successful GitHub push to a preview branch does not update a production domain unless that branch is configured as production or merged into the configured production branch.

## Evaluation notes (flywheel)

- Failure modes observed: The earlier diagnosis corrected repository config but assumed the feature branch would update the production alias.
- Graders run and results (PASS/FAIL): Local build PASS; live production check FAIL until production branch alignment; remote branch inspection PASS.
- Prompt variant (if applicable): production-branch-follow-up
- Next experiment (smallest change to try): Merge the verified feature branch into the configured production branch and recheck the live alias.
