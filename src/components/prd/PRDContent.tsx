import { useCallback, useState } from "react";
import { prdSections, launchCriteria } from "@/data/prd-content";
import { Check, FileDown, Menu } from "lucide-react";
import PRDSidebar from "./PRDSidebar";

const MarkdownRenderer = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-foreground mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="text-foreground/90 italic">
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.includes("---")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableLines, `table-${i}`));
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-foreground/85 text-sm leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-4 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 text-foreground/85 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-foreground/80 text-sm leading-relaxed my-2">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
};

function renderInline(text: string): JSX.Element {
  // Bold + code inline
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function renderTable(lines: string[], key: string): JSX.Element {
  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);
  const rows = lines.slice(2).map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  return (
    <div key={key} className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider"
              >
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-border hover:bg-muted/30 transition-colors"
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-foreground/80">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const LaunchChecklist = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = launchCriteria.length;
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {done}/{total}
        </span>
      </div>
      <ul className="space-y-2">
        {launchCriteria.map((criterion) => (
          <li key={criterion.id}>
            <button
              onClick={() => toggle(criterion.id)}
              className="flex items-center gap-3 w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 transition-all group"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  checked[criterion.id]
                    ? "bg-success border-success"
                    : "border-muted-foreground/40 group-hover:border-primary"
                }`}
              >
                {checked[criterion.id] && (
                  <Check className="w-3 h-3 text-success-foreground" />
                )}
              </div>
              <span
                className={`text-sm transition-all ${
                  checked[criterion.id]
                    ? "text-muted-foreground line-through"
                    : "text-foreground/85"
                }`}
              >
                {criterion.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PRDContent = () => {
  const [activeSection, setActiveSection] = useState(prdSections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <PRDSidebar activeSection={activeSection} onSectionClick={scrollToSection} />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 h-full [&_aside]:block">
            <PRDSidebar activeSection={activeSection} onSectionClick={scrollToSection} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-3 max-w-4xl">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-foreground">
                  PRD — <span className="text-gradient">Vibeeflow</span>
                </h1>
                <p className="text-xs text-muted-foreground">Documento interno de produto</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors">
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </header>

        {/* Hero */}
        <div className="px-6 py-10 max-w-4xl border-b border-border">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            DOCUMENTO INTERNO
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Product Requirements Document
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            "Vibeeflow tests your SaaS the way your users would — so you launch with confidence."
          </p>
        </div>

        {/* Sections */}
        <div className="px-6 py-8 max-w-4xl">
          {prdSections.map((section) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {section.number}
                </span>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="pl-11">
                <MarkdownRenderer content={section.content} />
                {section.id === "criterios-lancamento" && <LaunchChecklist />}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PRDContent;
