# EstateVoice AI — Call initiation contract (implementation gate)

This is the API contract for a future server-side endpoint. It is documentation only; no calls are placed by this file.

## Proposed endpoint
POST /api/calls

Require authenticated builder sales operator. Verify the access token server-side; never trust a browser-supplied user ID or permission flag.

## Request
```json
{
  "leadId": "L-123",
  "purpose": "qualification"
}
```
The endpoint must load the lead and builder-approved campaign from a trusted database. It must NOT accept an arbitrary destination phone number, caller ID, script, or provider URL from the browser.

## Server-side gates — all required
1. Authenticated user belongs to the configured builder workspace and has call permission.
2. Lead exists in that workspace.
3. Permission/consent evidence is recorded, current, and valid for this outreach purpose.
4. Lead is not opted out / Do Not Call / Not Interested and is not on the builder suppression list.
5. Calling time is permitted for the recipient's locale and the builder's approved policy.
6. Exotel account has the required outbound / AgentStream capability enabled.
7. Voice bot endpoint and provider credentials exist as server-side secrets.
8. Idempotency key prevents accidental duplicate call creation.
9. Per-user and per-builder rate limits, spend cap, and max call duration are enforced.
10. Call is logged as pending before the provider request; provider result is recorded safely.

## Response
Return a safe call ID and status only. Never return API keys, tokens, full provider credentials, or internal secrets.

## Callbacks
Verify callback authenticity/signature per Exotel documentation. Make status updates idempotent. Store event timestamps, provider call ID, outcome, duration, and a concise summary. Redact secrets and unnecessary personal data from logs.

## Safety / rollout
- Default feature flag: disabled.
- Start with one explicitly consenting internal test number.
- Never call leads with unknown permission.
- Provide an immediate opt-out path.
- Get builder/legal review for applicable Indian telecom, privacy, consent, and commercial calling rules.
- Do not use the demo localStorage lead list as an authority for live call permissions.
