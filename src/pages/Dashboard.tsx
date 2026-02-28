import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppNavbar from "@/components/app/AppNavbar";
import { FolderGit2, Plus, Play, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  repo_url: string;
  status: string;
  last_test_at: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  active: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-success/20 text-success", label: "Active" },
  testing: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "bg-warning/20 text-warning", label: "Testing" },
  failed: { icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-destructive/20 text-destructive", label: "Failed" },
  pending: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: "bg-muted text-muted-foreground", label: "Pending" },
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  if (authLoading || !user) return null;

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `Last run ${hours} hours ago`;
    return `Last run ${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-20 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground font-heading">Projects</h1>
          <button
            onClick={() => toast.info("GitHub OAuth integration coming soon!")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Connect Repo
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <FolderGit2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-heading">
              Connect your first repo to start testing
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              Link your GitHub repository and Vibeeflow will automatically analyze your code, identify user flows, and run tests.
            </p>
            <button
              onClick={() => toast.info("GitHub OAuth integration coming soon!")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <FolderGit2 className="w-4 h-4" />
              Connect Repo
            </button>
          </div>
        ) : (
          /* Project Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const status = statusConfig[project.status] || statusConfig.pending;
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-left p-5 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground text-sm">{project.name}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(project.last_test_at)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Test queued! (coming soon)");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Run Test
                  </button>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
