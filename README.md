# EstateVoice AI

Static MVP dashboard for a real-estate sales assistant. Live calling is not enabled; call flows are simulated only.

## Automatic deployment
This repository is configured to publish the contents of the repository root to GitHub Pages whenever a commit is pushed to `main`.

After the application files have been uploaded:
1. Open **Settings → Pages** and confirm **Build and deployment → Source: GitHub Actions**.
2. Open the **Actions** tab and check the **Deploy EstateVoice AI to GitHub Pages** workflow.
3. The deployed URL will be shown in the successful workflow run and under **Settings → Pages**.

## Required app files
Upload the application files from the latest EstateVoice AI project ZIP into the repository root, keeping these files together:
- `index.html`
- `styles.css`
- `app.js`
- `cloud-sync.js`
- `supabase-config.js`
- `supabase-schema.sql`
- `BACKEND_SETUP.md`
- `AI_AGENT_PROMPT.md`
- `LEAD_IMPORT_TEMPLATE.csv`

## Supabase setup
Run `supabase-schema.sql` in the SQL Editor of the Supabase project before using cloud sync. The browser publishable key is public by design; never place a Supabase secret/service-role key in frontend code. Use Row Level Security and verify the policies before storing real customer data.

## Limitations
- The current prototype does not place real phone calls.
- Do not upload real customer lead data or credentials to this public repository.
- Pushes to `main` trigger deployment automatically, but changes made in ChatGPT do not reach GitHub unless committed/pushed.
