# EstateVoice AI — no-Lovable MVP

A static, browser-based prototype for a single-builder real-estate sales pilot.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Prototype data is stored in that browser using `localStorage`.

If needed, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Prototype features
- Responsive dashboard and lead pipeline
- Add/edit leads and CSV import/template
- Duplicate phone-number check
- Consent/permission status and Do Not Call safeguards for demo flows
- Property knowledge base
- Hinglish simulated text-call workflow
- Call history and summaries
- Builder settings

## Important limitations
This is not yet a production multi-user application. Data remains in one browser; demo calls are simulated text only and do not dial numbers, create audio, or contact customers. The sample leads/property facts are fictional. Do not use real customer data until authentication, cloud storage, access controls, privacy and backup behaviour have been tested.

## Step 2 files
See `BACKEND_SETUP.md` and `supabase-schema.sql` for the database foundation. Running the SQL does not connect the dashboard automatically. Real calls require a secure server-side integration, a telephony provider, webhooks, and review of applicable Indian calling, consent, opt-out and privacy requirements.


## Supabase connection
The browser Supabase URL and publishable key are configured in `supabase-config.js`. Run `supabase-schema.sql` in the matching project's SQL Editor, serve this folder over localhost, then use **Connect cloud** to sign up/sign in and explicitly sync the current workspace. Do not add secret/service-role keys to browser files. This build syncs the whole local dashboard state into one private JSON record per user; normalized CRM tables and live calling remain future work.
