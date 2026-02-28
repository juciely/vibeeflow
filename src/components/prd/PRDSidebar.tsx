import { prdSections } from "@/data/prd-content";
import { FileText } from "lucide-react";

interface PRDSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

const PRDSidebar = ({ activeSection, onSectionClick }: PRDSidebarProps) => {
  return (
    <aside className="w-72 shrink-0 border-r border-border bg-sidebar sticky top-0 h-screen overflow-y-auto hidden lg:block">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">Vibeeflow</h2>
            <p className="text-xs text-muted-foreground">Product Requirements</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Índice
        </p>
        <ul className="space-y-0.5">
          {prdSections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
                  }`}
                >
                  {section.number}
                </span>
                <span className="truncate">{section.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default PRDSidebar;
