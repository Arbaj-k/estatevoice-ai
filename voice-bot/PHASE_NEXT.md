# EstateVoice AI — next implementation phase

## Verified progress (29 October 2026)
- The Sarvam dashboard shows an Exotel connection and one imported phone number with Active status.
- The user created an outbound campaign named `sayam`. The campaign dashboard showed audience size 1, completion rate 0%, pickup rate 0%, and one failed call. No successful call has been verified yet.
- A connection/number marked Active does not prove the complete voice route works.
- The campaign should not be relaunched until the failure reason is inspected and fixed.
- The GitHub dashboard is still a browser-based prototype. It does not initiate real calls; simulated calls in the UI must not be confused with Sarvam calls.
- Builder identity and verified commercial project facts are still unknown. `Demo Commercial Realty` is fictional and must not be used for customer-facing calls.

## Immediate next actions
1. In Sarvam, open the failed call details through View Full Analytics or Call logs and capture the provider error/status.
2. In Exotel App Bazaar, verify that an App exists, the Voicebot applet is in the Call Start flow, the official Sarvam endpoint is set, and the App is assigned to the intended ExoPhone.
3. Verify the agent selected in the campaign is the intended saved agent/version and that the imported number is the intended caller ID.
4. Run only a single test to an explicitly consenting internal number after the failure reason is resolved. Check the actual cost first; provider usage is not assumed free.
5. Do not upload real leads or launch a bulk campaign until authentication, consent evidence, opt-out suppression, allowed calling windows, and spend limits are enforced server-side.
6. Once the call path works, implement secure CRM synchronization and call-result callbacks. Do not treat a browser's localStorage as authoritative for permissions or DNC status.

## Exotel + Sarvam managed route
Sarvam's managed Exotel connection avoids building a custom audio bridge for the initial pilot. It still requires the Exotel call flow:
1. In Exotel App Bazaar, create an App.
2. Add the Voicebot applet to the Call Start flow.
3. Use the exact endpoint from the official Sarvam guide: `https://apps.sarvam.ai/api/app-runtime/channels/exotel`.
4. Save the App and assign it to the intended ExoPhone under My Numbers.
5. Ensure the correct region Base URL is used in the Sarvam connection. The user confirmed Singapore region, for which the configured base URL should be `api.exotel.com`.
6. Test with an explicitly consenting internal number only.

Official guide: https://docs.sarvam.ai/voice-agents/deploy/telephony/exotel
Campaign guide: https://docs.sarvam.ai/voice-agents/deploy/campaigns/create-campaign

## Cost and safety gates
- Sarvam Voice Agents and Exotel telephony may both incur charges. Check current account pricing before a test.
- Never put Exotel API tokens, provider credentials, or secret keys in GitHub, browser JavaScript, screenshots, or chat.
- The agent must identify itself as AI, respect no-call requests, and never invent prices, availability, RERA details, possession dates, payment terms, or investment returns.
- No campaign should be launched until the builder's actual identity and verified project knowledge are approved.
- Do not use real customer data until authentication, consent provenance, opt-out enforcement, calling windows, audit logs, and access control are implemented and tested.

## Backend work still required
EstateVoice needs a secure server-side call-initiation endpoint, provider callbacks with authenticity checks, idempotent call status updates, builder-scoped CRM sync, audit logs, spend/rate limits, and server-side consent/DNC enforcement. The current static dashboard and readiness scaffold do not provide verified production calling.

## Required test matrix
- Missing secrets -> fail closed
- Unauthenticated operator -> 401/403
- Lead permission unknown/no -> blocked
- Opted-out lead -> blocked
- Duplicate request -> no second call
- Provider rejected request -> safe failure recorded
- Callback authenticity invalid -> reject callback
- Customer asks to stop -> opt-out event saved and future attempts blocked
- Internal test call -> status and duration recorded without exposing secrets
