import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/app/AppNavbar";
import { FolderGit2, Play, Loader2, ExternalLink, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface TestRun {
  id: string;
  created_at: string;
  status: string;
  total_flows: number;
  passed_flows: number;
  failed_flows: number;
}

interface Briefing {
  id: string;
  content: string;
  created_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [activeTab, setActiveTab] = useState<"runs" | "briefing">("runs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const [projRes, runsRes, briefRes] = await Promise.all([
        (supabase as any).from("projects").select("*").eq("id", id).single(),
        (supabase as any).from("test_runs").select("*").eq("project_id", id).order("created_at", { ascending: false }),
        (supabase as any).from("briefings").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (projRes.data) setProject(projRes.data);
      if (runsRes.data) setTestRuns(runsRes.data);
      if (briefRes.data) setBriefing(briefRes.data);
      setLoading(false);
    };
    load();
  }, [user, id]);

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="pt-20 pb-12 px-6 max-w-5xl mx-auto text-center py-32">
          <p className="text-muted-foreground">Project not found.</p>
        </main>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      passed: "bg-success/20 text-success",
      failed: "bg-destructive/20 text-destructive",
      running: "bg-warning/20 text-warning",
      queued: "bg-muted text-muted-foreground",
    };
    return map[status] || map.queued;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-20 pb-12 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate("/dashboard")} className="p-1 rounded hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <FolderGit2 className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground font-heading">{project.name}</h1>
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="flex items-center justify-between mb-8 ml-10">
          <div />
          <button
            onClick={() => toast.info("Test queued! (coming soon)")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" />
            Run New Test
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {(["runs", "briefing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "runs" ? "Test Runs" : "Briefing"}
            </button>
          ))}
        </div>

        {activeTab === "runs" ? (
          testRuns.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No test runs yet. Click "Run New Test" to start.
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Passed/Failed</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {testRuns.map((run) => (
                    <tr key={run.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-foreground">
                        {new Date(run.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusBadge(run.status)}`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {run.passed_flows}/{run.total_flows}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/projects/${id}/test-runs/${run.id}`)}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground font-heading">Key User Flows</h3>
            {briefing ? (
              <div className="prose prose-invert max-w-none text-sm text-muted-foreground whitespace-pre-wrap">
                {briefing.content}
              </div>
            ) : (
              <div className="space-y-4">
                {["Key User Flows", "Critical Paths", "Data Privacy Concerns"].map((section) => (
                  <div key={section} className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">{section}</h4>
                    <div className="h-3 rounded bg-muted/50 w-full" />
                    <div className="h-3 rounded bg-muted/50 w-4/5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
