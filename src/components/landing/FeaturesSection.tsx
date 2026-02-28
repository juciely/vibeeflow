import { useI18n } from "@/contexts/I18nContext";
import { Play, Brain, Wand2, Code2 } from "lucide-react";

const FeaturesSection = () => {
  const { t } = useI18n();

  const features = [
    { icon: Play, titleKey: "feat1_title", descKey: "feat1_desc" },
    { icon: Brain, titleKey: "feat2_title", descKey: "feat2_desc" },
    { icon: Wand2, titleKey: "feat3_title", descKey: "feat3_desc" },
    { icon: Code2, titleKey: "feat4_title", descKey: "feat4_desc" },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-16">
          {t("features", "title")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feat) => (
            <div
              key={feat.titleKey}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t("features", feat.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("features", feat.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
