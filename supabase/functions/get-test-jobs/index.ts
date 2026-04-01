import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const workerKey = req.headers.get("X-Worker-Key");
    const expectedKey = Deno.env.get("WORKER_API_KEY");

    if (!expectedKey || workerKey !== expectedKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const workerId = url.searchParams.get("worker_id") || "default";

    // Get queued jobs ordered by priority
    const { data: jobs, error } = await supabase
      .from("test_jobs")
      .select("*, projects(name, repo_url)")
      .eq("status", "queued")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ jobs: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lock jobs by marking them as running
    const jobIds = jobs.map((j: any) => j.id);
    await supabase
      .from("test_jobs")
      .update({
        status: "running",
        worker_id: workerId,
        started_at: new Date().toISOString(),
      })
      .in("id", jobIds);

    // Update corresponding test_runs
    const runIds = jobs.map((j: any) => j.test_run_id).filter(Boolean);
    if (runIds.length > 0) {
      await supabase
        .from("test_runs")
        .update({ status: "running" })
        .in("id", runIds);
    }

    return new Response(JSON.stringify({ jobs }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
