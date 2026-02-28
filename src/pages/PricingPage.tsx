import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import AppNavbar from "@/components/app/AppNavbar";
import Navbar from "@/components/landing/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X, ChevronDown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 29, annual: 24 },
    tests: 5,
    target: "Solo founder validating",
    features: ["5 tests/month", "1 project", "Basic reports", "Email support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 79, annual: 66 },
    tests: 20,
    target: "Active dev or small agency",
    features: ["20 tests/month", "5 projects", "AI insights", "Corrective prompts", "Priority support"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Agency",
    price: { monthly: 199, annual: 166 },
    tests: 60,
    target: "Agency with multiple projects",
    features: ["60 tests/month", "Unlimited projects", "Custom briefings", "Advanced analytics", "Dedicated support", "Team members"],
    highlighted: false,
  },
];

const comparisonFeatures = [
  { name: "User Flow Simulation", starter: true, pro: true, agency: true },
  { name: "AI-Generated Briefing", starter: true, pro: true, agency: true },
  { name: "Screenshots & Evidence", starter: true, pro: true, agency: true },
  { name: "Corrective Prompts", starter: false, pro: true, agency: true },
  { name: "Multi-Framework", starter: false, pro: true, agency: true },
  { name: "Mobile Viewport", starter: false, pro: "5", agency: "Unlimited" },
  { name: "Team Members", starter: false, pro: false, agency: true },
  { name: "Advanced Analytics", starter: false, pro: false, agency: true },
];

const faqs = [
  { q: "Frequently asked questions?", a: "Vibeeflow tests your SaaS like a real user would. We analyze your code, identify user flows, and run automated tests using Playwright in sandboxed environments." },
  { q: "How many tests can I run per month?", a: "Depends on your plan: Starter (5), Pro (20), Agency (60). Each test runs all detected user flows in your application." },
  { q: "What frameworks are supported?", a: "Currently React and Next.js applications built with tools like Lovable, Bolt, and v0. More frameworks coming soon." },
  { q: "Can I customize what gets tested?", a: "Yes! After AI generates the initial briefing, you can edit it before running the test. Pro and Agency plans get more customization options." },
  { q: "How does Vibeeflow detect user flows?", a: "Our AI reads your codebase through GitHub integration, identifies the SaaS category, and maps out the critical user flows that need testing." },
];

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Nav = user ? AppNavbar : Navbar;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className={`${user ? "pt-20" : "pt-24"} pb-20 px-6 max-w-6xl mx-auto`}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground font-heading mb-4">Pricing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your testing needs. All plans include our core testing engine.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-secondary"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>Annual</span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary bg-card shadow-[0_0_40px_hsl(var(--primary)/0.1)]"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-foreground font-heading">{plan.name}</h3>
                {plan.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-extrabold text-foreground">${annual ? plan.price.annual : plan.price.monthly}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{plan.target}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground font-heading text-center mb-8">Features</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Starter</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Pro</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feat, i) => (
                  <tr key={feat.name} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-3 text-foreground">{feat.name}</td>
                    {(["starter", "pro", "agency"] as const).map((plan) => (
                      <td key={plan} className="px-4 py-3 text-center">
                        {feat[plan] === true ? (
                          <Check className="w-4 h-4 text-success mx-auto" />
                        ) : feat[plan] === false ? (
                          <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className="text-foreground text-xs font-medium">{feat[plan]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground font-heading text-center mb-8">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-12">
          Prices adapt to your country automatically
        </p>
      </main>
    </div>
  );
};

export default PricingPage;
