import { useI18n, Lang } from "@/contexts/I18nContext";
import { Globe } from "lucide-react";

const langLabels: Record<Lang, string> = { en: "EN", pt: "PT", es: "ES" };

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
      {(Object.keys(langLabels) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {langLabels[l]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
