# EstateVoice AI

A static real-estate sales workspace prototype for organising prospects, property inventory, and simulated call flows.

## Included
- `index.html` — dashboard and workspace UI
- `styles.css` — responsive desktop/mobile styling
- `app.js` — lead and property forms, local demo storage, CSV export, and simulated call activity
- `AI_AGENT_PROMPT.md` — starting conversation and safety specification for a future voice agent
- `BACKEND_SETUP.md` — backend/security integration notes
- `LEAD_IMPORT_TEMPLATE.csv` — blank CSV template for lead fields
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment workflow

## Deploy to GitHub Pages
1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and check **Deploy EstateVoice AI to GitHub Pages**.
4. Once successful, find the public URL in the workflow run or Settings → Pages.

Every push to `main` triggers deployment. Changes made in ChatGPT do not reach GitHub unless they are committed to this repository.

## Important current limitations
- **Demo only:** the app does not place real phone calls. “Simulate a call” only records a sample flow.
- **Browser-only storage:** leads, properties, and simulated-call activity are stored in the current browser's `localStorage`. They do not sync across devices or team members and may be lost if browser data is cleared.
- **No Supabase connection yet:** the current build has not been connected to a verified database. See `BACKEND_SETUP.md` before adding a backend.
- **No production calling integration:** a real voice agent needs a secured backend, a voice/telephony provider, consent and opt-out handling, and applicable compliance checks.

## Security
This is a public repository. Never commit real customer data, lead exports, passwords, API tokens, or Supabase service-role keys. Do not store real prospect information in this demo.
