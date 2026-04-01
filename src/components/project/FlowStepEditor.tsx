import { Plus, Trash2, GripVertical } from "lucide-react";

export interface FlowStep {
  action: "navigate" | "click" | "type" | "wait" | "assert";
  selector?: string;
  value?: string;
  expected?: string;
  url?: string;
}

interface FlowStepEditorProps {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
}

const ACTION_OPTIONS = [
  { value: "navigate", label: "Navigate", fields: ["url"] },
  { value: "click", label: "Click", fields: ["selector"] },
  { value: "type", label: "Type", fields: ["selector", "value"] },
  { value: "wait", label: "Wait", fields: ["selector", "value"] },
  { value: "assert", label: "Assert", fields: ["selector", "expected"] },
];

const FlowStepEditor = ({ steps, onChange }: FlowStepEditorProps) => {
  const addStep = () => {
    onChange([...steps, { action: "navigate", url: "" }]);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, updates: Partial<FlowStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    onChange(newSteps);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Steps ({steps.length})
        </p>
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Step
        </button>
      </div>

      {steps.length === 0 && (
        <p className="text-xs text-muted-foreground italic py-4 text-center">
          No steps yet. Click "Add Step" to begin.
        </p>
      )}

      {steps.map((step, index) => {
        const actionConfig = ACTION_OPTIONS.find((a) => a.value === step.action);
        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/20 p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase w-5">
                {index + 1}
              </span>
              <select
                value={step.action}
                onChange={(e) =>
                  updateStep(index, { action: e.target.value as FlowStep["action"] })
                }
                className="flex-1 px-2 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="p-1 rounded hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-9">
              {actionConfig?.fields.includes("url") && (
                <input
                  placeholder="https://example.com/page"
                  value={step.url || ""}
                  onChange={(e) => updateStep(index, { url: e.target.value })}
                  className="col-span-2 px-2 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground"
                />
              )}
              {actionConfig?.fields.includes("selector") && (
                <input
                  placeholder='Selector (e.g. #login-btn, .submit)'
                  value={step.selector || ""}
                  onChange={(e) => updateStep(index, { selector: e.target.value })}
                  className="px-2 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground"
                />
              )}
              {actionConfig?.fields.includes("value") && (
                <input
                  placeholder={step.action === "wait" ? "Timeout (ms)" : "Value to type"}
                  value={step.value || ""}
                  onChange={(e) => updateStep(index, { value: e.target.value })}
                  className="px-2 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground"
                />
              )}
              {actionConfig?.fields.includes("expected") && (
                <input
                  placeholder="Expected text or value"
                  value={step.expected || ""}
                  onChange={(e) => updateStep(index, { expected: e.target.value })}
                  className="px-2 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs placeholder:text-muted-foreground"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlowStepEditor;
