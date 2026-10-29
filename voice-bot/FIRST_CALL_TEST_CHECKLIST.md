# EstateVoice AI — first outbound test checklist

This checklist is for the current single-builder commercial-property pilot. Do not use a bulk campaign until a single internal test succeeds.

## Current known state
- Sarvam campaign name shown by the owner: `sayam`
- Campaign dashboard screenshot: status Active, audience size 1, completion 0%, pickup 0%, one failed call.
- Sarvam phone-number page: one imported Exotel number shown as Active.
- Exotel account region: Singapore; Sarvam connection Base URL should be `api.exotel.com`.
- No successful call has been confirmed.
- Do not treat "Active" as proof that the end-to-end call route is functional.

## A. Capture the failed call reason
1. Open Sarvam Voice Agents → Deploy → Outbound campaigns → `sayam`.
2. Select **View Full Analytics**. If the chart doesn't expose a row, open **Call logs** from the left navigation.
3. Open the failed attempt and record only non-secret details:
   - failure/status text
   - timestamp and timezone
   - provider call ID (mask most characters if sharing externally)
   - whether the call reached Exotel / rang / was rejected
4. Never expose API key, API token, password, auth cookie, or full customer number in screenshots.

## B. Verify the route before retry
In Exotel App Bazaar:
1. Confirm an App exists for this phone number.
2. Confirm **Voicebot** is on the Call Start flow.
3. Confirm endpoint exactly matches the current Sarvam guide:
   `https://apps.sarvam.ai/api/app-runtime/channels/exotel`
4. Save the App and assign it to the intended ExoPhone in **My Numbers**.
5. Confirm the Sarvam connection is the Singapore region connection and Base URL is `api.exotel.com`.
6. Confirm the campaign's selected agent is saved/published and the imported number/caller ID is the intended one.
7. Check Exotel account has outbound calling enabled and sufficient balance/credit; check Sarvam pricing/credits too.

## C. Single controlled test
Only after the failed reason is understood and corrected:
1. Use a test number owned by the operator or an explicitly consenting colleague.
2. Confirm the recipient expects the call and agrees to an AI voice test.
3. Use one test dial only; no bulk launch, no retries.
4. Confirm the AI identifies itself as an AI assistant and uses only verified demo information.
5. Record the result: connected, duration, audio/turn-taking, summary, and provider error if any.
6. Stop immediately if the wrong number is called or the recipient asks to stop.

## D. Commercial agent acceptance checklist
- Opens in natural Hindi/Hinglish; asks whether it is a good time to speak.
- Says it is an AI assistant calling on behalf of the named business (use the real builder name only after approval).
- Qualifies commercial need: shop/office/showroom/commercial plot/other.
- Asks preferred locality, approximate area, budget range, purchase/rent intent, and timeline.
- Never invents price, availability, RERA registration, possession, returns, or financing.
- Asks permission before scheduling a callback or site visit; repeats back date/time for confirmation.
- Handles “don't call me again” immediately and marks the lead as Do Not Call.
- Ends politely and doesn't claim a human has been booked unless the booking is confirmed.

## E. No-go conditions
Do not launch a live lead cohort if:
- failed call reason is unknown;
- Exotel Voicebot applet is not verified;
- agent deployment/version is not confirmed;
- lead consent is missing/unknown;
- Do Not Call suppression is not enforced;
- no secure server-side call initiation and callback processing exist;
- spend limit/calling window is not set;
- builder identity and property facts have not been approved.

## Official documentation
- Sarvam Exotel deployment: https://docs.sarvam.ai/voice-agents/deploy/telephony/exotel
- Sarvam campaign creation: https://docs.sarvam.ai/voice-agents/deploy/campaigns/create-campaign
- Exotel AgentStream: https://developer.exotel.com/docs/agentstream/connect-voice-ai

This document is a checklist only; it does not execute calls or validate the provider configuration.
