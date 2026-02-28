import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavbar from "@/components/app/AppNavbar";
import { User, Mail, Shield, Loader2 } from "lucide-react";

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-20 pb-12 px-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground font-heading mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" /> Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Email</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" /> Plan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">You are currently on the <span className="text-primary font-semibold">Free</span> plan.</p>
            <button
              onClick={() => navigate("/pricing")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
