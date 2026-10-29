# EstateVoice AI — next implementation phase

Current state: GitHub contains planning templates and a readiness-only backend scaffold. The Sarvam agent is being configured manually in the Sarvam dashboard. No live calls are enabled.

## Next sequence
1. Fill and approve `BUILDER_KNOWLEDGE_TEMPLATE.md` with the actual builder's verified facts.
2. Apply `SARVAM_AGENT_SETUP.md` in Sarvam and test in-browser with a consenting internal tester.
3. Confirm the exact Sarvam Voice Agent integration/API options available to this account and whether Exotel AgentStream is supported for the desired outbound flow.
4. Implement the actual server-side WebSocket audio bridge for the documented protocol and chosen AI voice API.
5. Implement an authenticated call-initiation endpoint with server-side lead consent/opt-out checks and approved calling windows.
6. Implement provider callbacks, idempotent call status updates, error handling and audit logs.
7. Test with a consenting internal number; only then consider a small builder-approved pilot.

Do not claim any step is live until it has been deployed and tested. Never put secrets in this public repository.
