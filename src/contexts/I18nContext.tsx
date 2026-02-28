import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Lang = "en" | "pt" | "es";

interface SiteContent {
  [key: string]: string;
}

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (section: string, key: string) => string;
  content: Record<string, SiteContent>;
  loading: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Static fallback content
const fallbackContent: Record<Lang, Record<string, SiteContent>> = {
  en: {
    hero: {
      title: "Your vibe-coded SaaS, tested like a real user would",
      subtitle: "Vibeeflow simulates real user behavior across every flow — so you launch with confidence, not fear.",
      cta_primary: "Connect GitHub — It's Free",
      cta_secondary: "See how it works",
      trusted: "Trusted by founders building on Lovable, Bolt, v0 and more",
    },
    how_it_works: {
      title: "How it works",
      step1_title: "Connect your GitHub repo",
      step1_desc: "Link your repository and Vibeeflow reads your codebase automatically.",
      step2_title: "AI reads your code and builds a smart test plan",
      step2_desc: "Our AI identifies key user flows and generates a strategic test briefing.",
      step3_title: "Get a full report with fixes ready to paste",
      step3_desc: "Receive detailed results with corrective prompts you can paste directly.",
    },
    features: {
      title: "Features",
      feat1_title: "User Flow Simulation",
      feat1_desc: "Simulates real user interactions to find broken flows before your customers do.",
      feat2_title: "AI-Generated Briefing",
      feat2_desc: "Automatically identifies the most critical user flows to test based on your codebase.",
      feat3_title: "Corrective Prompts",
      feat3_desc: "Get ready-to-paste prompts that fix issues directly in your vibe coding tool.",
      feat4_title: "Multi-Framework",
      feat4_desc: "Works seamlessly with Lovable, Bolt, v0, Replit and other vibe coding platforms.",
    },
    pricing: {
      title: "Pricing",
      subtitle: "Simple, transparent pricing that scales with you.",
      starter_name: "Starter",
      starter_price: "29",
      starter_tests: "5 tests/month",
      starter_feat1: "1 project",
      starter_feat2: "Basic reports",
      starter_feat3: "Email support",
      pro_name: "Pro",
      pro_price: "79",
      pro_tests: "20 tests/month",
      pro_feat1: "5 projects",
      pro_feat2: "Full reports + AI insights",
      pro_feat3: "Priority support",
      pro_badge: "Most Popular",
      agency_name: "Agency",
      agency_price: "199",
      agency_tests: "60 tests/month",
      agency_feat1: "Unlimited projects",
      agency_feat2: "Custom briefings",
      agency_feat3: "Dedicated support",
      ppp_note: "Prices adapt to your country automatically",
    },
    footer: {
      copyright: "© 2026 Vibeeflow. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      github: "GitHub",
    },
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      start_free: "Start Free",
      login: "Login",
    },
  },
  pt: {
    hero: {
      title: "Seu SaaS vibe-coded, testado como um usuário real faria",
      subtitle: "Vibeeflow simula o comportamento real de usuários em cada fluxo — para você lançar com confiança, não medo.",
      cta_primary: "Conectar GitHub — É Grátis",
      cta_secondary: "Veja como funciona",
      trusted: "Confiado por fundadores construindo no Lovable, Bolt, v0 e mais",
    },
    how_it_works: {
      title: "Como funciona",
      step1_title: "Conecte seu repositório GitHub",
      step1_desc: "Vincule seu repositório e o Vibeeflow lê seu código automaticamente.",
      step2_title: "IA lê seu código e cria um plano de testes inteligente",
      step2_desc: "Nossa IA identifica os fluxos principais e gera um briefing estratégico.",
      step3_title: "Receba um relatório completo com correções prontas para colar",
      step3_desc: "Resultados detalhados com prompts corretivos prontos para colar.",
    },
    features: {
      title: "Funcionalidades",
      feat1_title: "Simulação de Fluxo",
      feat1_desc: "Simula interações reais de usuários para encontrar fluxos quebrados antes dos seus clientes.",
      feat2_title: "Briefing Gerado por IA",
      feat2_desc: "Identifica automaticamente os fluxos mais críticos para testar baseado no código.",
      feat3_title: "Prompts Corretivos",
      feat3_desc: "Prompts prontos para colar que corrigem problemas na sua ferramenta de vibe coding.",
      feat4_title: "Multi-Framework",
      feat4_desc: "Funciona com Lovable, Bolt, v0, Replit e outras plataformas de vibe coding.",
    },
    pricing: {
      title: "Preços",
      subtitle: "Simples, transparente e escala com você.",
      starter_name: "Starter",
      starter_price: "12",
      starter_tests: "5 testes/mês",
      starter_feat1: "1 projeto",
      starter_feat2: "Relatórios básicos",
      starter_feat3: "Suporte por email",
      pro_name: "Pro",
      pro_price: "32",
      pro_tests: "20 testes/mês",
      pro_feat1: "5 projetos",
      pro_feat2: "Relatórios completos + IA",
      pro_feat3: "Suporte prioritário",
      pro_badge: "Mais Popular",
      agency_name: "Agency",
      agency_price: "80",
      agency_tests: "60 testes/mês",
      agency_feat1: "Projetos ilimitados",
      agency_feat2: "Briefings customizados",
      agency_feat3: "Suporte dedicado",
      ppp_note: "Preços adaptados ao seu país automaticamente",
    },
    footer: {
      copyright: "© 2026 Vibeeflow. Todos os direitos reservados.",
      privacy: "Privacidade",
      terms: "Termos",
      github: "GitHub",
    },
    nav: {
      features: "Funcionalidades",
      pricing: "Preços",
      docs: "Docs",
      start_free: "Começar Grátis",
      login: "Entrar",
    },
  },
  es: {
    hero: {
      title: "Tu SaaS vibe-coded, probado como lo haría un usuario real",
      subtitle: "Vibeeflow simula el comportamiento real de usuarios en cada flujo — para que lances con confianza, no miedo.",
      cta_primary: "Conectar GitHub — Es Gratis",
      cta_secondary: "Ver cómo funciona",
      trusted: "Confiado por fundadores construyendo en Lovable, Bolt, v0 y más",
    },
    how_it_works: {
      title: "Cómo funciona",
      step1_title: "Conecta tu repositorio GitHub",
      step1_desc: "Vincula tu repositorio y Vibeeflow lee tu código automáticamente.",
      step2_title: "La IA lee tu código y crea un plan de pruebas inteligente",
      step2_desc: "Nuestra IA identifica los flujos principales y genera un briefing estratégico.",
      step3_title: "Recibe un informe completo con correcciones listas para pegar",
      step3_desc: "Resultados detallados con prompts correctivos listos para pegar.",
    },
    features: {
      title: "Características",
      feat1_title: "Simulación de Flujo",
      feat1_desc: "Simula interacciones reales de usuarios para encontrar flujos rotos antes que tus clientes.",
      feat2_title: "Briefing Generado por IA",
      feat2_desc: "Identifica automáticamente los flujos más críticos para probar basado en el código.",
      feat3_title: "Prompts Correctivos",
      feat3_desc: "Prompts listos para pegar que corrigen problemas en tu herramienta de vibe coding.",
      feat4_title: "Multi-Framework",
      feat4_desc: "Funciona con Lovable, Bolt, v0, Replit y otras plataformas de vibe coding.",
    },
    pricing: {
      title: "Precios",
      subtitle: "Simple, transparente y escala contigo.",
      starter_name: "Starter",
      starter_price: "15",
      starter_tests: "5 pruebas/mes",
      starter_feat1: "1 proyecto",
      starter_feat2: "Informes básicos",
      starter_feat3: "Soporte por email",
      pro_name: "Pro",
      pro_price: "40",
      pro_tests: "20 pruebas/mes",
      pro_feat1: "5 proyectos",
      pro_feat2: "Informes completos + IA",
      pro_feat3: "Soporte prioritario",
      pro_badge: "Más Popular",
      agency_name: "Agency",
      agency_price: "100",
      agency_tests: "60 pruebas/mes",
      agency_feat1: "Proyectos ilimitados",
      agency_feat2: "Briefings personalizados",
      agency_feat3: "Soporte dedicado",
      ppp_note: "Los precios se adaptan a tu país automáticamente",
    },
    footer: {
      copyright: "© 2026 Vibeeflow. Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
      github: "GitHub",
    },
    nav: {
      features: "Características",
      pricing: "Precios",
      docs: "Docs",
      start_free: "Empezar Gratis",
      login: "Iniciar sesión",
    },
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("vibeeflow_lang");
    return (saved as Lang) || "en";
  });
  const [dbContent, setDbContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(false);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("vibeeflow_lang", newLang);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data } = await (supabase as any)
          .from("site_content")
          .select("*")
          .eq("lang", lang)
          .eq("is_active", true);

        if (data && data.length > 0) {
          const grouped: Record<string, SiteContent> = {};
          data.forEach((item: any) => {
            if (!grouped[item.section]) grouped[item.section] = {};
            grouped[item.section][item.content_key] = item.value;
          });
          setDbContent(grouped);
        }
      } catch {
        // Fall back to static content
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [lang]);

  const content = { ...fallbackContent[lang], ...dbContent };

  const t = useCallback(
    (section: string, key: string) => {
      return content[section]?.[key] || fallbackContent.en[section]?.[key] || key;
    },
    [content]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, content, loading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
