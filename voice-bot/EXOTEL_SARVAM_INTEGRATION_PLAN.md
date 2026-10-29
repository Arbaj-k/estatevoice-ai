# Exotel + Sarvam integration plan

## Current state
- Sarvam agent is being configured in its dashboard by the project owner.
- Exotel ExoPhone and API credentials reportedly exist.
- Repository includes a readiness-only Supabase Edge Function scaffold.
- No live calling integration is deployed or verified.
- Builder identity and actual commercial project data are not yet known.

## Integration decisions to verify before coding the provider bridge
1. In Sarvam Voice Agents, open the agent integration / telephony section and record the exact supported telephony providers and webhook/API options. Do not infer that Exotel is directly supported just because both products have voice APIs.
2. In Exotel, confirm AgentStream / Connect Voice AI access is enabled for this account and read the account-specific WebSocket protocol and audio codec/sample-rate requirements.
3. Choose the server deployment target only after confirming it supports persistent WebSockets. Supabase Edge Functions may not be suitable for a long-running bidirectional audio bridge; use a WebSocket-capable service if needed.
4. Use only server-side secrets. Never put Exotel tokens or voice-model API keys in public GitHub or browser JavaScript.
5. Implement the documented audio protocol end-to-end: session start, inbound audio frames, turn handling, outbound audio frames, disconnect, timeouts and provider error events.
6. Add a secure authenticated call-initiation endpoint, consent/opt-out/calling-window checks, idempotency, rate/spend limits and verified status callbacks.
7. Test only with an explicitly consenting internal test number. Keep live-calling feature flag off until the full loop passes.

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
