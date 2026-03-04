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

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const marketplaceUrl = Deno.env.get("MARKETPLACE_URL");
    const appUrl = Deno.env.get("APP_URL");

    if (!marketplaceUrl || !appUrl) {
      return new Response(
        JSON.stringify({ error: "MARKETPLACE_URL or APP_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Register with marketplace
    const registerResponse = await fetch(`${marketplaceUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_url: appUrl,
        app_name: "Vibeeflow",
        app_description: "AI-powered testing for vibe-coded SaaS",
        heartbeat_endpoint: `${Deno.env.get("SUPABASE_URL")}/functions/v1/marketplace-heartbeat`,
      }),
    });

    if (!registerResponse.ok) {
      const errText = await registerResponse.text();
      return new Response(
        JSON.stringify({ error: "Marketplace registration failed", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await registerResponse.json();

    // Save connection status
    // Upsert - only one marketplace connection row
    const { data: existing } = await supabaseAdmin
      .from("marketplace_connection")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("marketplace_connection")
        .update({
          status: "connected",
          app_slug: result.slug || result.app_slug || null,
          app_name: "Vibeeflow",
          registered_at: new Date().toISOString(),
          last_heartbeat_at: new Date().toISOString(),
          metadata: result,
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin
        .from("marketplace_connection")
        .insert({
          status: "connected",
          app_slug: result.slug || result.app_slug || null,
          app_name: "Vibeeflow",
          registered_at: new Date().toISOString(),
          last_heartbeat_at: new Date().toISOString(),
          metadata: result,
        });
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
