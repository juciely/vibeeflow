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

    const { job_id, results } = await req.json();

    if (!job_id || !results || !Array.isArray(results)) {
      return new Response(JSON.stringify({ error: "job_id and results array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get job info
    const { data: job, error: jobErr } = await supabase
      .from("test_jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert test results
    const testResults = results.map((r: any) => ({
      test_run_id: job.test_run_id,
      flow_name: r.flow_name,
      status: r.status || "failed",
      ai_insight: r.ai_insight || null,
      corrective_prompt: r.corrective_prompt || null,
      screenshot_url: r.screenshot_url || null,
      duration_ms: r.duration_ms || null,
    }));

    const { error: insertErr } = await supabase
      .from("test_results")
      .insert(testResults);

    if (insertErr) {
      return new Response(JSON.stringify({ error: "Failed to insert results" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate passed/failed
    const passed = results.filter((r: any) => r.status === "passed").length;
    const failed = results.filter((r: any) => r.status === "failed").length;
    const overallStatus = failed > 0 ? "failed" : "passed";

    // Update test_run
    await supabase
      .from("test_runs")
      .update({
        status: overallStatus,
        passed_flows: passed,
        failed_flows: failed,
        total_flows: results.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.test_run_id);

    // Update job
    await supabase
      .from("test_jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", job_id);

    // Update project
    await supabase
      .from("projects")
      .update({
        status: overallStatus === "passed" ? "active" : "failed",
        last_test_at: new Date().toISOString(),
      })
      .eq("id", job.project_id);

    return new Response(
      JSON.stringify({
        success: true,
        test_run_id: job.test_run_id,
        passed,
        failed,
        status: overallStatus,
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
