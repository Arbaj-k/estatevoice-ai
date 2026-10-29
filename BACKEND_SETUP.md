# Step 2 — Supabase backend foundation

This bundle prepares the database layer for a single-builder pilot. It does **not** connect the current static dashboard to Supabase yet, and it does not enable real calls.

## Before you start
- Create/use a **separate Supabase project for EstateVoice AI**. Do not reuse a production project such as Hapn or Student Brain.
- The SQL adds tables and security policies; still review it before running.
- Do not upload real lead data until login, policies, privacy handling, and backups are tested.

## 1. Create the project
1. Open the official Supabase dashboard: https://supabase.com/dashboard
2. Create a project in a region appropriate for your users. Check current free-plan limits and availability first.
3. Open **SQL Editor → New query**.
4. Open `supabase-schema.sql`, copy all contents, paste into the SQL Editor, and run it.
5. In **Table Editor**, verify these tables exist: `builder_accounts`, `builder_members`, `leads`, `properties`, `call_logs`.

## 2. Create the first owner login
1. In **Authentication → Users**, create the owner's account (or sign up using the intended login flow).
2. Copy that user's UUID.
3. In SQL Editor, run the following after replacing the two placeholders with a builder name and that Auth user's UUID. Run only once for the first owner:

```sql
with new_builder as (
  insert into public.builder_accounts (name)
  values ('REPLACE WITH BUILDER NAME')
  returning id
)
insert into public.builder_members (user_id, builder_id, role)
select 'REPLACE-WITH-AUTH-USER-UUID'::uuid, id, 'owner'
from new_builder;
```

Do not share the owner UUID or any private credentials publicly. The SQL editor is privileged; use it only as the project owner/admin.

## 3. Security notes
- Browser apps may use only the project's **publishable key** (or legacy anon key); never put a `service_role` or secret key in HTML/JavaScript.
- RLS is enabled for the tables and limits rows to the signed-in user's builder membership. The initial membership must be created by an admin workflow.
- Run the project's Supabase security advisors after setup. Test with two different accounts to ensure one builder cannot read another builder's leads.
- Do not enable outbound calls yet. Calling eligibility/consent and opt-out rules must be reviewed first.

## 4. Current prototype vs backend
The existing `index.html` still stores records in browser `localStorage`. Running the SQL alone will not move existing data into the cloud. The next coding step is to add Supabase Auth, connection settings, and CRUD calls to the dashboard, then test RLS.

## Files in this bundle
- `index.html`, `styles.css`, `app.js` — local prototype
- `supabase-schema.sql` — tables and RLS policies
- `LEAD_IMPORT_TEMPLATE.csv` — lead import column template
- `AI_AGENT_PROMPT.md` — draft behaviour contract for the future voice agent
- `BACKEND_SETUP.md` — setup instructions

Official docs: https://supabase.com/docs/guides/database/postgres/row-level-security and https://supabase.com/docs/guides/auth


## Connect the supplied Supabase project
1. The app's `supabase-config.js` is already filled with the project URL and the publishable key supplied by the owner. Publishable keys are intended for browser clients; never place a secret/service-role key in this file.
2. Open the Supabase dashboard for project `vuhvkzehuafsjapbcmxb` and go to SQL Editor. Run the full `supabase-schema.sql` file from this folder. It creates the app tables and the private per-user `estatevoice_workspace_state` sync table with RLS. It does not delete existing data.
3. Open the app using a local web server (recommended) rather than `file://`; for example in this folder run `python -m http.server 8000` and visit `http://localhost:8000`.
4. Click **Connect cloud**, create an account or sign in, and complete email verification if Supabase requires it.
5. Click **Sync this browser workspace to cloud** to save the current browser state. This sync action writes the current browser data over the signed-in user's cloud record.
6. If the app says the table is missing, the SQL setup has not been run in the same project, or the project Data API is not exposing the table.

### Scope and limitations
This MVP stores the current dashboard state as one JSON record per authenticated user. It is suitable for a first private pilot, not yet a multi-user builder CRM with normalized records. The supplied `builder_accounts`, `leads`, `properties`, and `call_logs` schema remains the next step for a proper tenant-aware data model. Real phone calling and AI voice are still not enabled.
