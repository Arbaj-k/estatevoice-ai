# EstateVoice AI — Voice Bot backend foundation

This folder contains the first server-side voice-bot scaffold for the single-builder pilot.

## Status
- This is a foundation, not a production-ready voice agent.
- It does not place outbound calls.
- It does not connect to OpenAI or another speech model yet.
- Do not configure Exotel to call this endpoint until the WebSocket audio protocol and AI audio pipeline are implemented and tested.

## Intended flow
1. A secure backend validates the authenticated operator, lead permission/consent, opt-out status, and calling window.
2. The backend initiates an Exotel Connect Voice AI request with secrets stored server-side.
3. Exotel opens a bidirectional WebSocket to the bot.
4. The bot converts inbound audio to speech input, gets the AI response, and sends audio frames back in the format Exotel expects.
5. Status callbacks record final call outcomes and audit events.

## Required future environment variables
- EXOTEL_ACCOUNT_SID
- EXOTEL_API_KEY
- EXOTEL_API_TOKEN
- EXOTEL_EXOPHONE
- VOICE_MODEL_API_KEY (provider secret; choose provider before configuring)
- PUBLIC_BASE_URL

Never place any of these secrets in browser JavaScript or public GitHub. This repository is public; use deployment-platform secrets only.

## Exotel requirements
- Exotel Connect Voice AI API enabled for the account
- ExoPhone configured as caller ID
- HTTPS callback endpoint and WSS bot endpoint
- Bidirectional audio streaming protocol implemented and verified
- Trial/billing limitations and India calling/consent rules reviewed

Official API docs: https://developer.exotel.com/docs/agentstream/connect-voice-ai
WebSocket protocol: https://developer.exotel.com/docs/agentstream/websocket-protocol
