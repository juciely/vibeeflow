import { useI18n } from "@/contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-xs text-muted-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Now in beta — join 200+ founders testing smarter
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 max-w-4xl mx-auto">
          {t("hero", "title")}
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero", "subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
          >
            {t("hero", "cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors">
            <Play className="w-4 h-4" />
            {t("hero", "cta_secondary")}
          </button>
        </div>

        {/* Mock browser window */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                  app.vibeeflow.com/test-result
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Test Result</span>
                </div>
                <span className="px-3 py-1 rounded-md bg-success/20 text-success text-xs font-bold uppercase">Passed</span>
              </div>
              <div className="text-xs text-muted-foreground">
                12 flows tested, <span className="text-success font-medium">10 passed</span>, <span className="text-destructive font-medium">2 failed</span>
              </div>
              <div className="space-y-2">
                {["User Signup Flow", "Checkout Flow", "Dashboard Load"].map((flow, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm text-foreground">{flow}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      i < 2 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    }`}>
                      {i < 2 ? "passed" : "failed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          {t("hero", "trusted")}
        </p>
        <div className="flex items-center justify-center gap-8 mt-4 opacity-40">
          {["Lovable", "Bolt", "v0"].map((name) => (
            <span key={name} className="text-sm font-semibold text-muted-foreground">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
