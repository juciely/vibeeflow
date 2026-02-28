import { useI18n } from "@/contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { Zap } from "lucide-react";

const Navbar = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_1px_12px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">
              Vibee<span className="text-gradient">flow</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav", "features")}
            </button>
            <button onClick={() => scrollTo("pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav", "pricing")}
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav", "docs")}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            {t("nav", "login")}
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("nav", "start_free")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
