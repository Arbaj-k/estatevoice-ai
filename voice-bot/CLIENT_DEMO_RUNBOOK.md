# EstateVoice AI — client demo runbook (commercial property)

Purpose: demonstrate the intended workflow to a prospective builder without implying that unverified live calling or CRM features are production-ready.

## Honest demo modes
**Mode A — dashboard walkthrough (always available):** Open the EstateVoice AI GitHub Pages dashboard, use fictional sample leads, and run the simulated call. Tell the client clearly that this is a browser simulation and does not dial a phone.

**Mode B — live AI phone demo (only after successful internal test):** Use the saved Sarvam agent and Exotel number. Before the meeting, place one real test call to the operator's own number or a colleague who explicitly agrees to the test. Confirm the Exotel Voicebot applet, the campaign agent/version, caller ID, and failure status first. Do not use a client's number as the first test. Check charges before dialing.

## Before the client meeting
- [ ] Replace fictional builder name only after permission and use approved company name.
- [ ] Add only verified commercial project facts (property types, location, area, prices, availability, RERA, possession). If unknown, leave blank.
- [ ] Open the dashboard and verify the sample leads are clearly marked fictional.
- [ ] Confirm the Sarvam agent prompt is actually saved/published; GitHub prompt files do not auto-sync to Sarvam.
- [ ] Diagnose the previous failed campaign attempt. Current known screenshot: campaign sayam, audience 1, 0 connected, 1 failed, 0% pickup and completion.
- [ ] Verify Exotel App Bazaar Voicebot applet is assigned to the intended ExoPhone.
- [ ] Complete one internal test call and inspect call logs before scheduling a client demo.
- [ ] Have a fallback: show Mode A if live call fails. Do not repeatedly dial the client to debug.

## Suggested client presentation (5–7 minutes)
1. **Problem:** sales teams spend time qualifying commercial property leads and chasing callbacks.
2. **Lead intake:** add/import a fictional lead; show commercial property type, area, budget, purpose, location and consent status.
3. **AI conversation:** run a simulated Hinglish conversation and show the qualification summary.
4. **Follow-up:** show callback/site-visit requests in the queue. Explain that they are requests until the sales team confirms them.
5. **Calling status:** show the provider integration separately and be transparent that live calling is demonstrated only if the internal test succeeded.
6. **Builder-specific setup:** explain that the builder's approved facts, CRM fields, calling permission, and handoff contact must be configured before production use.

## Sample live-call dialogue (for an explicitly consenting internal test)
AI: “Namaste, main [approved company] ki AI assistant hoon. Kya abhi do minute baat karna convenient hai?”
Person: “Haan, bataiye.”
AI: “Thank you. Aap shop, office, showroom ya kisi aur commercial property mein interest rakhte hain?”
Person: “Office space.”
AI: “Aap kis area mein dekh rahe hain aur approximate kitna area chahiye?”
Person: “Mujhe details sales team se chahiye.”
AI: “Zaroor. Kya aap chahenge ki sales team aapse callback kare? Main request note kar sakti hoon; confirmation sales team karegi.”
Person: “Haan.”
AI: “Theek hai. Main callback request note kar rahi hoon. Dhanyavaad.”

This dialogue is an example only. Do not claim a WhatsApp message or CRM task was sent unless the connected system confirms it.

## Live-demo pass criteria
- Call reaches the consenting test phone.
- Agent identifies itself as AI and the approved company.
- Speech is understandable and language choice is natural.
- Agent asks one question at a time and does not invent property facts.
- It handles refusal and Do Not Call correctly.
- Call status/result is visible in Sarvam logs.
- No secret credentials are shown during screen sharing.

## Current blocker
A prior campaign screenshot showed one failed call and no connected calls. The live demo is **not ready to promise** until that failure reason is resolved and one internal test passes. Keep the dashboard simulation as the reliable fallback.

## Secret handling
Never add Exotel API keys/tokens, Sarvam secrets, Supabase service-role keys, passwords, or session cookies to this repo, screenshots, or client presentation.
