import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Zap, LogOut, FileText, Globe, Settings, Save, Plus, Trash2, Loader2, Menu, X,
} from "lucide-react";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";

interface ContentItem {
  id?: string;
  section: string;
  content_key: string;
  lang: string;
  value: string;
  sort_order: number;
  is_active: boolean;
  metadata: Record<string, any>;
}

const SECTIONS = [
  "hero", "how_it_works", "features", "pricing", "footer", "nav",
];

const AdminPanel = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeLang, setActiveLang] = useState<string>("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchContent();
  }, [activeLang]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("site_content")
        .select("*")
        .eq("lang", activeLang)
        .order("section")
        .order("sort_order");
      if (data) setContent(data);
      if (error) console.error(error);
    } catch {
      // Table might not exist yet
      setContent([]);
    }
    setLoading(false);
  };

  const saveItem = async (item: ContentItem) => {
    setSaving(true);
    try {
      if (item.id) {
        await (supabase as any)
          .from("site_content")
          .update({ value: item.value, is_active: item.is_active, sort_order: item.sort_order })
          .eq("id", item.id);
      } else {
        await (supabase as any)
          .from("site_content")
          .insert({
            section: item.section,
            content_key: item.content_key,
            lang: item.lang,
            value: item.value,
            sort_order: item.sort_order,
            is_active: item.is_active,
            metadata: item.metadata,
          });
      }
      toast.success("Saved!");
      fetchContent();
      setEditItem(null);
    } catch (err: any) {
      toast.error(err.message || "Error saving");
    }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    await (supabase as any).from("site_content").delete().eq("id", id);
    toast.success("Deleted");
    fetchContent();
  };

  const filteredContent = content.filter((c) => c.section === activeSection);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2">Content</p>
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => { setActiveSection(sec); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize ${
                activeSection === sec
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {sec.replace("_", " ")}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-2">
          <button
            onClick={() => navigate("/prd")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <FileText className="w-4 h-4" /> PRD
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <Globe className="w-4 h-4" /> View Site
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-sm font-bold text-foreground capitalize">{activeSection.replace("_", " ")} Content</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              {["en", "pt", "es"].map((l) => (
                <button
                  key={l}
                  onClick={() => setActiveLang(l)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-all uppercase ${
                    activeLang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditItem({
                section: activeSection,
                content_key: "",
                lang: activeLang,
                value: "",
                sort_order: filteredContent.length,
                is_active: true,
                metadata: {},
              })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </header>

        <div className="p-6 max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">No content for this section yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Add" to create your first entry.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContent.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-primary font-mono">
                          {item.content_key}
                        </code>
                        {!item.is_active && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 mt-1 break-words">{item.value}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditItem(item)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => item.id && deleteItem(item.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-foreground">
              {editItem.id ? "Edit Content" : "New Content"}
            </h2>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Key</label>
              <input
                value={editItem.content_key}
                onChange={(e) => setEditItem({ ...editItem, content_key: e.target.value })}
                disabled={!!editItem.id}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                placeholder="hero_title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Value</label>
              <textarea
                value={editItem.value}
                onChange={(e) => setEditItem({ ...editItem, value: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={editItem.is_active}
                  onChange={(e) => setEditItem({ ...editItem, is_active: e.target.checked })}
                  className="rounded"
                />
                Active
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  value={editItem.sort_order}
                  onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 rounded-lg bg-secondary border border-border text-foreground text-xs"
                  placeholder="Order"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveItem(editItem)}
                disabled={saving || !editItem.content_key}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
