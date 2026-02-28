import { useI18n } from "@/contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const PricingSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const plans = [
    {
      nameKey: "starter_name",
      priceKey: "starter_price",
      testsKey: "starter_tests",
      features: ["starter_feat1", "starter_feat2", "starter_feat3"],
      highlighted: false,
    },
    {
      nameKey: "pro_name",
      priceKey: "pro_price",
      testsKey: "pro_tests",
      features: ["pro_feat1", "pro_feat2", "pro_feat3"],
      highlighted: true,
      badgeKey: "pro_badge",
    },
    {
      nameKey: "agency_name",
      priceKey: "agency_price",
      testsKey: "agency_tests",
      features: ["agency_feat1", "agency_feat2", "agency_feat3"],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-3">
          {t("pricing", "title")}
        </h2>
        <p className="text-center text-muted-foreground mb-16">
          {t("pricing", "subtitle")}
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`relative p-6 rounded-2xl border transition-all ${
                plan.highlighted
                  ? "border-primary bg-card shadow-xl shadow-primary/10 scale-105"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {plan.badgeKey && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                  {t("pricing", plan.badgeKey)}
                </div>
              )}
              <h3 className="text-lg font-bold text-foreground mb-1">
                {t("pricing", plan.nameKey)}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ${t("pricing", plan.priceKey)}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                {t("pricing", plan.testsKey)}
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {t("pricing", feat)}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          {t("pricing", "ppp_note")}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
