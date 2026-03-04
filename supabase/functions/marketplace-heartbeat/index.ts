import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get current connection
    const { data: connection } = await supabaseAdmin
      .from("marketplace_connection")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!connection || connection.status !== "connected") {
      return new Response(
        JSON.stringify({ status: "not_connected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update heartbeat timestamp
    await supabaseAdmin
      .from("marketplace_connection")
      .update({ last_heartbeat_at: new Date().toISOString() })
      .eq("id", connection.id);

    return new Response(
      JSON.stringify({
        status: "ok",
        app_name: connection.app_name,
        app_slug: connection.app_slug,
        last_heartbeat_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
