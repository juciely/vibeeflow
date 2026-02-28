import { useI18n } from "@/contexts/I18nContext";
import { GitBranch, Brain, FileCheck } from "lucide-react";

const HowItWorksSection = () => {
  const { t } = useI18n();

  const steps = [
    { icon: GitBranch, titleKey: "step1_title", descKey: "step1_desc", num: 1 },
    { icon: Brain, titleKey: "step2_title", descKey: "step2_desc", num: 2 },
    { icon: FileCheck, titleKey: "step3_title", descKey: "step3_desc", num: 3 },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-16">
          {t("how_it_works", "title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border mx-auto mb-5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-2">{step.num}</div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t("how_it_works", step.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("how_it_works", step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
