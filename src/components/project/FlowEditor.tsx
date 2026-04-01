import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Loader2, Trash2, ToggleLeft, ToggleRight, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";
import FlowStepEditor, { type FlowStep } from "./FlowStepEditor";

interface TestFlow {
  id: string;
  project_id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  is_active: boolean;
  created_at: string;
}

interface FlowEditorProps {
  projectId: string;
}

const FlowEditor = ({ projectId }: FlowEditorProps) => {
  const [flows, setFlows] = useState<TestFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFlow, setEditingFlow] = useState<TestFlow | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<FlowStep[]>([]);

  useEffect(() => {
    fetchFlows();
  }, [projectId]);

  const fetchFlows = async () => {
    const { data, error } = await (supabase as any)
      .from("test_flows")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (!error && data) setFlows(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setSteps([]);
    setEditingFlow(null);
    setShowForm(false);
  };

  const openEdit = (flow: TestFlow) => {
    setEditingFlow(flow);
    setName(flow.name);
    setDescription(flow.description || "");
    setSteps(flow.steps || []);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Flow name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingFlow) {
        await (supabase as any)
          .from("test_flows")
          .update({ name, description, steps })
          .eq("id", editingFlow.id);
        toast.success("Flow updated!");
      } else {
        await (supabase as any)
          .from("test_flows")
          .insert({
            project_id: projectId,
            name,
            description,
            steps,
            is_active: true,
          });
        toast.success("Flow created!");
      }
      resetForm();
      fetchFlows();
    } catch (err: any) {
      toast.error(err.message || "Error saving flow");
    }
    setSaving(false);
  };

  const toggleActive = async (flow: TestFlow) => {
    await (supabase as any)
      .from("test_flows")
      .update({ is_active: !flow.is_active })
      .eq("id", flow.id);
    fetchFlows();
  };

  const deleteFlow = async (id: string) => {
    await (supabase as any)
      .from("test_flows")
      .delete()
      .eq("id", id);
    toast.success("Flow deleted");
    fetchFlows();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground font-heading">Test Flows</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Add Flow
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">
              {editingFlow ? "Edit Flow" : "New Flow"}
            </h4>
            <button onClick={resetForm} className="p-1 rounded hover:bg-secondary">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Login Flow"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this flow test?"
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <FlowStepEditor steps={steps} onChange={setSteps} />

            <div className="flex gap-2 pt-2">
              <button
                onClick={resetForm}
                className="flex-1 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                <Save className="w-3 h-3" />
                {editingFlow ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flow List */}
      {flows.length === 0 && !showForm ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No test flows configured yet. Click "Add Flow" to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className={`rounded-xl border bg-card p-4 transition-all ${
                flow.is_active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">{flow.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      flow.is_active
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {flow.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {flow.description && (
                    <p className="text-xs text-muted-foreground mb-1">{flow.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {(flow.steps || []).length} steps
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(flow)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    title={flow.is_active ? "Deactivate" : "Activate"}
                  >
                    {flow.is_active ? (
                      <ToggleRight className="w-4 h-4 text-success" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(flow)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => deleteFlow(flow.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
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
  );
};

export default FlowEditor;
