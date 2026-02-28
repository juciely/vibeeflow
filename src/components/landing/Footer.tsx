import { useI18n } from "@/contexts/I18nContext";
import { Zap } from "lucide-react";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">{t("footer", "copyright")}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("footer", "privacy")}
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("footer", "terms")}
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("footer", "github")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
