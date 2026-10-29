# EstateVoice AI — no-Lovable MVP

A browser-based prototype for a single-builder commercial real-estate sales pilot.

## Run locally
1. Extract the repository ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Prototype data is stored in that browser using `localStorage`.

If needed, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Prototype features
- Responsive dashboard and commercial-property lead pipeline
- Add/edit leads and CSV import/template
- Duplicate phone-number check
- Consent/permission status and Do Not Call safeguards for demo flows
- Commercial property types and qualification fields
- Property knowledge base
- Hinglish simulated text-call workflow (no phone call is placed)
- Call history and summaries
- Follow-up queue for callback/site-visit requests
- Builder settings

## Important limitations
This is **not yet a production multi-user application**. Browser data remains local unless the user explicitly connects and syncs Supabase. Demo calls are simulated text only and do not dial numbers, create audio, or contact customers. The sample builder name and property facts are fictional. Do not use real customer data until authentication, cloud storage, access controls, privacy, consent and backup behaviour have been tested.

## Voice calling status
The owner reports that Sarvam has one active Exotel connection and one imported phone number. The Sarvam outbound campaign named `sayam` showed one failed attempt, zero connected calls, 0% completion and 0% pickup in the shared dashboard screenshot. A successful end-to-end call has **not** been verified. Do not launch a bulk campaign until the failure is diagnosed and a single explicitly consented internal test succeeds.

- [Commercial voice-agent prompt](AI_AGENT_PROMPT.md)
- [Client demo one-pager](voice-bot/CLIENT_DEMO_ONE_PAGER.md)
- [Client demo runbook](voice-bot/CLIENT_DEMO_RUNBOOK.md)
- [First outbound call test checklist](voice-bot/FIRST_CALL_TEST_CHECKLIST.md)
- [Exotel + Sarvam integration plan](voice-bot/EXOTEL_SARVAM_INTEGRATION_PLAN.md)
- [Current implementation phase](voice-bot/PHASE_NEXT.md)
- [Call initiation API contract (documentation only)](voice-bot/call-initiation-contract.md)

The prompt and checklists in GitHub do not automatically update the live Sarvam agent or configure Exotel. Real calling requires the provider call flow, a secure server-side integration, authenticated operators, server-side consent/opt-out checks, provider callbacks, spend limits and review of applicable Indian telecom/privacy requirements.

## Supabase connection
The browser Supabase URL and publishable key are configured in `supabase-config.js`. Run `supabase-schema.sql` in the matching project's SQL Editor, serve this folder over localhost, then use **Connect cloud** to sign up/sign in and explicitly sync the current workspace. Do not add secret/service-role keys to browser files. The current cloud sync stores the whole local dashboard state as one private JSON record per user; it does not yet make this a normalized, verified multi-user CRM.

## Backend foundation
See `BACKEND_SETUP.md` and `supabase-schema.sql` for the database foundation. The SQL must be reviewed and run in the correct Supabase project before its tables exist. The schema and call-result schema are proposed assets; they have not been executed by this repository update. No real call is initiated by the static dashboard.
