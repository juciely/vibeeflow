import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Store, Loader2, CheckCircle2, XCircle, RefreshCw, Plug, Unplug, Clock,
} from "lucide-react";

interface MarketplaceConnection {
  id: string;
  status: string;
  app_slug: string | null;
  app_name: string | null;
  registered_at: string | null;
  last_heartbeat_at: string | null;
  metadata: Record<string, any>;
}

const AdminMarketplace = () => {
  const [connection, setConnection] = useState<MarketplaceConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const fetchConnection = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("marketplace_connection")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (!error && data) setConnection(data);
    else setConnection(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const { data, error } = await supabase.functions.invoke("marketplace-register", {
        method: "POST",
      });
      if (error) throw error;
      toast.success("Registrado no marketplace com sucesso!");
      fetchConnection();
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar no marketplace");
    }
    setRegistering(false);
  };

  const handleHeartbeat = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("marketplace-heartbeat", {
        method: "POST",
      });
      if (error) throw error;
      toast.success("Heartbeat enviado!");
      fetchConnection();
    } catch (err: any) {
      toast.error(err.message || "Erro no heartbeat");
    }
  };

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isConnected = connection?.status === "connected";

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Marketplace Connection</h2>
            <p className="text-xs text-muted-foreground">
              Conecte o Vibeeflow ao marketplace externo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              Disconnected
            </span>
          )}
        </div>

        {isConnected && connection && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">App Slug</p>
              <p className="text-sm font-medium text-foreground">{connection.app_slug || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Registered</p>
              <p className="text-sm font-medium text-foreground">{timeAgo(connection.registered_at)}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Last Heartbeat</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(connection.last_heartbeat_at)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isConnected ? (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {registering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plug className="w-4 h-4" />
              )}
              Register in Marketplace
            </button>
          ) : (
            <>
              <button
                onClick={handleHeartbeat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Send Heartbeat
              </button>
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {registering ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Unplug className="w-4 h-4" />
                )}
                Re-register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> As variáveis <code className="text-primary">MARKETPLACE_URL</code> e <code className="text-primary">APP_URL</code> devem 
          ser configuradas nos secrets das Edge Functions no painel do Lovable Cloud.
        </p>
      </div>
    </div>
  );
};

export default AdminMarketplace;
