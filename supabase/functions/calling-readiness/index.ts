// Readiness-only function for the EstateVoice AI single-builder pilot.
// Does not place calls and never returns secret values.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

  // Deploy with JWT verification enabled. The gateway validates the Supabase access token.
  if (!req.headers.get("authorization")?.startsWith("Bearer ")) {
    return json({ ok: false, error: "Sign in is required." }, 401);
  }

  const required = [
    ["EXOTEL_ACCOUNT_SID", "Exotel Account SID"],
    ["EXOTEL_API_KEY", "Exotel API key"],
    ["EXOTEL_API_TOKEN", "Exotel API token"],
    ["EXOTEL_EXOPHONE", "Exotel ExoPhone / caller ID"],
    ["VOICE_BOT_WS_URL", "AI voice bot secure WebSocket URL"],
  ] as const;
  const missing = required.filter(([key]) => !Deno.env.get(key)).map(([, label]) => label);

  return json({
    ok: true,
    mode: "readiness_only",
    liveCallingEnabled: false,
    provider: "exotel",
    configured: missing.length === 0,
    missing,
    message: missing.length
      ? "Server-side configuration is incomplete. No calls can be placed."
      : "Secrets are present, but live calls remain disabled until the bot protocol, permission checks, account setup, and call-status callbacks are tested.",
  });
});