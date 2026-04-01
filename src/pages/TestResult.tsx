import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/app/AppNavbar";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Loader2, CheckCircle2, XCircle, Copy, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface FlowResult {
  id: string;
  flow_name: string;
  status: string;
  ai_insight: string | null;
  corrective_prompt: string | null;
  screenshot_url: string | null;
  duration_ms: number | null;
}

const TestResult = () => {
  const { id: projectId, runId } = useParams<{ id: string; runId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [run, setRun] = useState<any>(null);
  const [results, setResults] = useState<FlowResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !runId) return;
    const load = async () => {
      const [runRes, resultsRes] = await Promise.all([
        (supabase as any).from("test_runs").select("*").eq("id", runId).single(),
        (supabase as any).from("test_results").select("*").eq("test_run_id", runId).order("created_at", { ascending: true }),
      ]);
      if (runRes.data) setRun(runRes.data);
      if (resultsRes.data) setResults(resultsRes.data);
      setLoading(false);
    };
    load();
  }, [user, runId]);

  // Realtime for test_run updates
  useEffect(() => {
    if (!runId) return;
    const channel = supabase
      .channel(`test-run-${runId}`)
      .on(
        "postgres_changes" as any,
        { event: "UPDATE", schema: "public", table: "test_runs", filter: `id=eq.${runId}` },
        (payload: any) => {
          setRun(payload.new);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [runId]);

  // Realtime for new test_results
  useEffect(() => {
    if (!runId) return;
    const channel = supabase
      .channel(`test-results-${runId}`)
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "test_results", filter: `test_run_id=eq.${runId}` },
        (payload: any) => {
          setResults((prev) => [...prev, payload.new as FlowResult]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [runId]);

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const overallStatus = run?.status || "unknown";
  const isRunning = overallStatus === "running" || overallStatus === "queued";
  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const totalFlows = run?.total_flows || results.length || 0;
  const progressPercent = totalFlows > 0 ? Math.round((results.length / totalFlows) * 100) : 0;

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Corrective prompt copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-20 pb-12 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/projects/${projectId}`)} className="p-1 rounded hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-widest ${
                isRunning
                  ? "bg-warning/20 text-warning border border-warning/30"
                  : overallStatus === "passed"
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              }`}>
                {isRunning && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
                {overallStatus}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.length}/{totalFlows} flows tested,{" "}
              <span className="text-success font-semibold">{passed} passed</span>,{" "}
              <span className="text-destructive font-semibold">{failed} failed</span>
            </p>
          </div>
        </div>

        {/* Progress bar when running */}
        {isRunning && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Testing in progress...</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Flow Results */}
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  {result.status === "passed" ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-semibold text-foreground">{result.flow_name}</span>
                  {result.duration_ms && (
                    <span className="text-xs text-muted-foreground">
                      {(result.duration_ms / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  result.status === "passed"
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                }`}>
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
                <div className="p-5">
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Screenshot</p>
                  {result.screenshot_url ? (
                    <img src={result.screenshot_url} alt={result.flow_name} className="rounded-lg border border-border w-full" />
                  ) : (
                    <div className="rounded-lg bg-muted/30 border border-border/50 h-40 flex items-center justify-center text-xs text-muted-foreground">
                      No screenshot available
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {result.ai_insight && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="w-3.5 h-3.5 text-primary" />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Insight</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{result.ai_insight}</p>
                    </div>
                  )}

                  {result.corrective_prompt && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Corrective Prompt</p>
                      <div className="relative">
                        <pre className="rounded-lg bg-muted/40 border border-border/50 p-3 text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                          {result.corrective_prompt}
                        </pre>
                        <button
                          onClick={() => copyPrompt(result.corrective_prompt!)}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                          title="Copy Prompt"
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!result.ai_insight && !result.corrective_prompt && (
                    <p className="text-sm text-muted-foreground italic">No AI insights for this flow.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && !isRunning && (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No flow results available for this test run.
            </div>
          )}

          {results.length === 0 && isRunning && (
            <div className="text-center py-20 text-muted-foreground text-sm flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              Waiting for results from the test worker...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TestResult;
