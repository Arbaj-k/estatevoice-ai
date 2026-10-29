# Exotel + Sarvam integration plan

## Verified progress (29 October 2026)
- Sarvam Voice Agents shows one active Exotel connection and one active imported phone number in the user's dashboard.
- The Exotel account region was confirmed by the user as Singapore. The correct Sarvam Base URL for that region is `api.exotel.com` (not `api.in.exotel.com`).
- The connection and number are present in Sarvam. This alone does **not** prove the Exotel App Bazaar Voicebot flow or an agent deployment is configured.
- The public GitHub repository remains a prototype/readiness scaffold. No real outbound campaign has been launched or verified.
- Builder identity and approved commercial project data are not yet known; `Demo Commercial Realty` is fictional and must not be used for real calls.

## Current next step in Sarvam
1. Open **Deploy → Outbound campaigns**.
2. Start creating a draft campaign only; do not launch it.
3. Select the intended commercial-property agent and a committed/saved version.
4. Select the existing Exotel connection and imported number as caller ID.
5. Do not upload real leads. Use only a consenting internal test number, and only after the Exotel App Bazaar call flow is configured and the agent prompt is reviewed.
6. Review the schedule and set the lowest available dialing rate, a short permitted test window, and retries off for the first test.
7. On the final review page, use the internal Test dial only if the account supports it and the person explicitly consents. Do not click Launch for a campaign.
8. If the agent, number, or test-dial option is missing, stop and capture a screenshot; do not guess or bypass the UI.

## Exotel setup facts
Sarvam's official guide says to configure the call flow on Exotel as well:
1. In Exotel App Bazaar, create an App.
2. Add the **Voicebot** applet to the Call Start flow.
3. Set the endpoint to the exact documented endpoint: `https://apps.sarvam.ai/api/app-runtime/channels/exotel`.
4. Save the App and assign it to the intended ExoPhone under **My Numbers**.
5. Confirm recording and disclosure requirements before enabling recording; recording is not assumed to be enabled by this plan.
6. Then test with a consenting internal number.

Official guide: https://docs.sarvam.ai/voice-agents/deploy/telephony/exotel
Campaign guide: https://docs.sarvam.ai/voice-agents/deploy/campaigns/create-campaign

## Costs and safety
- Sarvam Voice Agents usage is paid; the official docs list pay-as-you-go voice-agent pricing starting at ₹3.50/minute, with telephony billed separately. Do not assume real calls are free.
- Never put Exotel API tokens, provider credentials, or other secrets in GitHub, browser JavaScript, screenshots, or this chat.
- Do not use real customer data until authentication, consent provenance, opt-out enforcement, calling windows, audit logs, and access control are implemented and tested.
- The assistant must identify itself as AI, respect a no-call request, and not invent project prices, availability, RERA details, possession dates, or returns.
- No campaign should be launched until the builder's actual identity and verified project knowledge are approved.

## Custom backend still required
Sarvam-managed telephony avoids building a custom audio bridge for the initial pilot, but EstateVoice's backend is still needed for secure lead permissions, builder-specific access, spend/rate limits, CRM synchronization, and audit records if calls are initiated from the dashboard.

## Required test matrix
- Missing secrets -> fail closed
- Unauthenticated operator -> 401/403
- Lead permission unknown/no -> blocked
- Opted-out lead -> blocked
- Duplicate request -> no second call
- Provider rejected request -> safe failure recorded
- Callback signature invalid -> reject callback
- Customer asks to stop -> opt-out event saved and future attempts blocked
- Internal test call -> status and duration recorded without exposing secrets
