import { useI18n } from "@/contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HexagonPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07]"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern
        id="honeycomb"
        width="56"
        height="100"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(1.2)"
      >
        <path
          d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66ZM28 100L0 84L0 50L28 34L56 50L56 84L28 100Z"
          fill="none"
          stroke="hsl(45, 95%, 55%)"
          strokeWidth="0.8"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#honeycomb)" />
  </svg>
);

const HeroSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Honeycomb texture */}
      <HexagonPattern />

      {/* Radial glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
      </div>

      {/* Animated floating hexagons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x: "10%", y: "20%", size: 60, delay: "0s", duration: "12s" },
          { x: "80%", y: "15%", size: 45, delay: "2s", duration: "15s" },
          { x: "70%", y: "70%", size: 55, delay: "4s", duration: "10s" },
          { x: "20%", y: "75%", size: 40, delay: "1s", duration: "14s" },
          { x: "50%", y: "10%", size: 35, delay: "3s", duration: "11s" },
          { x: "90%", y: "50%", size: 50, delay: "5s", duration: "13s" },
        ].map((hex, i) => (
          <svg
            key={i}
            className="absolute animate-pulse"
            style={{
              left: hex.x,
              top: hex.y,
              width: hex.size,
              height: hex.size,
              animationDelay: hex.delay,
              animationDuration: hex.duration,
              opacity: 0.08,
            }}
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,3 93,25 93,75 50,97 7,75 7,25"
              fill="none"
              stroke="hsl(45, 95%, 55%)"
              strokeWidth="2"
            />
          </svg>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto text-center w-full">
        {/* Beta badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Now in beta — join 200+ founders testing smarter
        </div>

        {/* Main heading with Plus Jakarta Sans */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-8 max-w-4xl mx-auto tracking-tight">
          {t("hero", "title").split("tested").length > 1 ? (
            <>
              {t("hero", "title").split("tested")[0]}
              <span className="text-gradient">tested</span>
              {t("hero", "title").split("tested")[1]}
            </>
          ) : (
            <>
              {t("hero", "title").split("testado").length > 1 ? (
                <>
                  {t("hero", "title").split("testado")[0]}
                  <span className="text-gradient">testado</span>
                  {t("hero", "title").split("testado")[1]}
                </>
              ) : (
                <>
                  {t("hero", "title").split("probado").length > 1 ? (
                    <>
                      {t("hero", "title").split("probado")[0]}
                      <span className="text-gradient">probado</span>
                      {t("hero", "title").split("probado")[1]}
                    </>
                  ) : (
                    t("hero", "title")
                  )}
                </>
              )}
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          {t("hero", "subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all shadow-[0_0_40px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.5)]"
          >
            {t("hero", "cta_primary")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="flex items-center gap-2.5 px-8 py-4 rounded-xl border border-border bg-card/50 text-foreground font-semibold text-base hover:bg-secondary transition-colors backdrop-blur-sm">
            <Play className="w-4 h-4 text-primary" />
            {t("hero", "cta_secondary")}
          </button>
        </div>

        {/* Mock browser window */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_25px_80px_-15px_hsl(var(--primary)/0.15)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground font-medium">
                  app.vibeeflow.com/test-result
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground font-heading">Test Result</span>
                <span className="px-3 py-1 rounded-md bg-success/20 text-success text-xs font-bold uppercase tracking-wider">Passed</span>
              </div>
              <div className="text-xs text-muted-foreground">
                12 flows tested, <span className="text-success font-semibold">10 passed</span>, <span className="text-destructive font-semibold">2 failed</span>
              </div>
              <div className="space-y-2">
                {["User Signup Flow", "Checkout Flow", "Dashboard Load"].map((flow, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm text-foreground font-medium">{flow}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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

        {/* Trusted by */}
        <p className="text-xs text-muted-foreground mt-12 font-medium tracking-wide uppercase">
          {t("hero", "trusted")}
        </p>
        <div className="flex items-center justify-center gap-10 mt-4 opacity-30">
          {["Lovable", "Bolt", "v0"].map((name) => (
            <span key={name} className="text-base font-bold text-muted-foreground font-heading tracking-wide">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
