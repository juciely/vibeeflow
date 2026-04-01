import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { project_id, flow_ids } = await req.json();
    if (!project_id) {
      return new Response(JSON.stringify({ error: "project_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify project ownership
    const { data: project, error: projErr } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .eq("user_id", userId)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get flows to test
    let flowQuery = supabaseAdmin
      .from("test_flows")
      .select("*")
      .eq("project_id", project_id)
      .eq("is_active", true);

    if (flow_ids && flow_ids.length > 0) {
      flowQuery = flowQuery.in("id", flow_ids);
    }

    const { data: flows, error: flowErr } = await flowQuery;
    if (flowErr) {
      return new Response(JSON.stringify({ error: "Failed to fetch flows" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!flows || flows.length === 0) {
      return new Response(JSON.stringify({ error: "No active flows to test" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create test_run
    const { data: testRun, error: runErr } = await supabaseAdmin
      .from("test_runs")
      .insert({
        project_id,
        status: "queued",
        total_flows: flows.length,
        passed_flows: 0,
        failed_flows: 0,
      })
      .select()
      .single();

    if (runErr || !testRun) {
      return new Response(JSON.stringify({ error: "Failed to create test run" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create test_job
    const { data: job, error: jobErr } = await supabaseAdmin
      .from("test_jobs")
      .insert({
        project_id,
        test_run_id: testRun.id,
        status: "queued",
        flow_config: {
          repo_url: project.repo_url,
          flows: flows.map((f: any) => ({
            id: f.id,
            name: f.name,
            steps: f.steps,
          })),
        },
        priority: 0,
      })
      .select()
      .single();

    if (jobErr) {
      return new Response(JSON.stringify({ error: "Failed to create job" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update project status
    await supabaseAdmin
      .from("projects")
      .update({ status: "testing" })
      .eq("id", project_id);

    return new Response(
      JSON.stringify({
        job_id: job.id,
        test_run_id: testRun.id,
        flows_count: flows.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
