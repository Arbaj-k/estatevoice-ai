# Exotel + Sarvam integration plan

## Current state
- Sarvam agent is being configured in its dashboard by the project owner.
- Exotel ExoPhone and API credentials reportedly exist.
- Repository includes a readiness-only Supabase Edge Function scaffold.
- No live calling integration is deployed or verified.
- Builder identity and actual commercial project data are not yet known.

## Recommended integration route (verified from current Sarvam documentation)
Sarvam Voice Agents supports connecting an existing Exotel account through **Deploy → Phone Numbers → Add Connection → Exotel**. Prefer this managed route for the single-builder pilot instead of writing a custom audio bridge first.

1. In Sarvam Voice Agents, open **Deploy → Phone Numbers → Add Connection → Exotel**.
2. Enter Account SID, API Key, API Token, and Base URL. For India, Sarvam docs list `api.in.exotel.com`; verify region from the Exotel dashboard. Never paste secrets into GitHub or this chat.
3. Save the connection. Then follow Sarvam's current Exotel guide to configure the Exotel App Bazaar voicebot call flow and assign it to the ExoPhone. Use the exact endpoint shown in Sarvam docs; do not improvise a WebSocket URL.
4. Add the ExoPhone under the Sarvam connection, then route it to the agent using an inbound deployment or an outbound campaign as appropriate.
5. Before an outbound campaign, confirm pricing, permissions, opt-out handling, and any test-number limits in the account.
6. Test in Sarvam's Test Agent first (browser voice); then use the Phone test only with an explicitly consenting internal number and if the account permits it.

Official guide: https://docs.sarvam.ai/voice-agents/deploy/telephony/exotel

## Custom backend still required for CRM governance
Sarvam's managed telephony avoids building a custom bidirectional audio bridge for the initial pilot. EstateVoice's own backend is still needed for secure lead permissions, builder-specific access, spend/rate limits, CRM synchronization, and audit records if calls are initiated from the dashboard.

Never put Exotel tokens or voice-model API keys in public GitHub or browser JavaScript. Keep dashboard-triggered live calling disabled until consent checks and the end-to-end path are verified.

## Required test matrix
- Missing secrets -> fail closed
- Unauthenticated operator -> 401/403
- Lead permission unknown/no -> blocked
- Opted-out lead -> blocked
- Duplicate request -> no second call
- Provider rejected request -> safe failure recorded
- WebSocket disconnect/audio format error -> call fails safely and status is recorded
- Customer asks to stop -> opt-out event saved and future attempts blocked
- Callback signature invalid -> reject callback
- Internal test call -> status and duration recorded without exposing secrets
