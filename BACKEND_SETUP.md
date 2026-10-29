# Backend setup notes

## Current state
The deployed prototype uses browser `localStorage` for leads, properties, and simulated-call history. This means data stays in the current browser profile and does not sync across devices or users. Clearing browser storage can remove it. The app does not currently place real calls or connect to Supabase.

## Before connecting Supabase
1. Confirm the correct Supabase project and owner access.
2. Create database tables for leads, properties, call activity, consent/opt-out records, and user/team membership.
3. Enable Row Level Security on every table and write policies so each authenticated builder/team can only access its own data.
4. Use Supabase Auth for team accounts. Do not expose service-role or other secret keys in browser JavaScript.
5. Add the project's publishable key and URL only to frontend configuration after reviewing RLS policies.
6. Test signup/login, row isolation between two test users, CSV export, and deletion/retention before entering real prospect data.
7. Store telecom/voice-provider credentials only in server-side secrets. Place call initiation behind a secured server-side function with consent checks, opt-out checks, rate limiting, and audit logging.

## Public repository caution
This repository is public. Never commit real lead lists, phone numbers, passwords, service-role keys, provider API tokens, production exports, or other confidential information.

## GitHub Pages
GitHub Pages can host this static demo. It cannot safely run secret server-side code. For a real calling agent, host the backend/API and voice integration separately on a suitable serverless or backend platform, then connect the static frontend to that API.