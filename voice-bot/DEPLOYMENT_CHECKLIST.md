# Voice bot deployment checklist

- [ ] Choose AI voice provider and confirm its streaming audio API / price.
- [ ] Deploy backend to a platform that supports persistent WebSockets.
- [ ] Store all credentials as deployment secrets, not in GitHub.
- [ ] Implement Exotel AgentStream connected/start/media/stop handling.
- [ ] Implement AI speech input/output with correct audio codec and sample rate.
- [ ] Validate logged-in operator and lead permission before initiating each call.
- [ ] Enforce opt-out and approved calling window server-side.
- [ ] Add idempotent Exotel status callbacks and audit logs.
- [ ] Test with a consenting internal number and short call limit.
- [ ] Confirm account has Connect Voice AI API enabled and trial charges/limits.
- [ ] Keep live calling disabled until all checks pass.
