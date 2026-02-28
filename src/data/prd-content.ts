export interface PRDSection {
  id: string;
  number: number;
  title: string;
  content: string;
}

export const prdSections: PRDSection[] = [
  {
    id: "problema",
    number: 1,
    title: "Problema",
    content: `### Contexto

Em 2026, **41% de todo o código global é gerado por IA** (Gartner). Ferramentas como Lovable, Bolt e v0 permitem que fundadores não-técnicos construam SaaS completos em horas.

### A Dor

Esses produtos são lançados com **fluxos quebrados** que nenhum servidor detecta. Erros invisíveis para logs:

- Botão que não avança
- Form que não salva
- Onboarding que trava na tela 3
- Integração que não conecta

O fundador só descobre quando o primeiro cliente reclama.

### Dados que Sustentam

| Dado | Fonte |
|------|-------|
| Vulnerabilidades **2.74x mais frequentes** em código gerado por IA | CodeRabbit, 2025 |
| **170 de 1.645** apps Lovable tinham acesso não autorizado a dados pessoais | Pesquisa independente |
| Devs são **19% mais lentos** com IA mas acreditam ser 20% mais rápidos | METR Study, 2025 |

### O que Existe Hoje

**Checkly, Playwright Cloud, BrowserStack** — testam código, não experiência. Nenhum é especializado em vibe coding + não-desenvolvedores + prompts corretivos.`,
  },
  {
    id: "solucao",
    number: 2,
    title: "Solução",
    content: `Vibeeflow age como o **usuário final** do seu SaaS:

1. Lê o código do repositório GitHub
2. Identifica automaticamente os fluxos principais do produto
3. Gera um plano de testes estratégico baseado na categoria do SaaS
4. Executa os testes simulando comportamento humano real (Playwright)
5. Entrega relatório com: **status por fluxo + insight da IA + prompt corretivo**

### Diferencial Único

> Não reporta erro técnico. Reporta **experiência quebrada**.
> E entrega o prompt que conserta — pronto para colar no Lovable.`,
  },
  {
    id: "usuario-alvo",
    number: 3,
    title: "Usuário-Alvo",
    content: `### Persona Primária
- Fundador não-técnico construindo com Lovable, Bolt ou v0
- Tem produto pronto mas **inseguro para lançar**
- Não sabe testar, não tem equipe de QA
- Já teve experiência de lançar algo quebrado ou tem medo de ter

### Persona Secundária
- Dev solo ou freelancer que entrega projetos vibe-coded para clientes
- Precisa garantir qualidade antes da entrega
- Quer relatório profissional para mostrar ao cliente

### Persona Terciária
- Agência de desenvolvimento com Lovable/Bolt como stack principal
- Volume de projetos que torna QA manual inviável`,
  },
  {
    id: "proposta-valor",
    number: 4,
    title: "Proposta de Valor por Persona",
    content: `| Persona | Dor Principal | Como Vibeeflow Resolve |
|---------|--------------|----------------------|
| Fundador solo | Medo de lançar com bug | Certeza antes do launch |
| Dev freelancer | Retrabalho pós-entrega | Relatório profissional de QA |
| Agência | QA manual não escala | Automação por projeto |`,
  },
  {
    id: "fluxo-principal",
    number: 5,
    title: "Fluxo Principal (Happy Path)",
    content: `1. Usuário cria conta → verifica email
2. Conecta GitHub via OAuth → seleciona repositório
3. IA analisa código → detecta categoria do SaaS + fluxos principais
4. Gera briefing automático (editável pelo usuário)
5. Usuário confirma briefing → teste é enfileirado
6. Sandbox Docker sobe com Supabase local efêmero
7. Playwright executa fluxos simulando usuário real
8. Container é destruído após execução
9. Resultado salvo: status por fluxo + screenshots + insights + prompts
10. Dashboard exibe relatório completo`,
  },
  {
    id: "mvp",
    number: 6,
    title: "MVP — Lista Tripla",
    content: `### ✅ TEM QUE TER (v1)

- GitHub OAuth para conectar repositório
- IA analisa código → gera briefing automático por categoria
- Usuário revisa briefing antes de rodar
- Sandbox Docker + Supabase local efêmero por execução
- Playwright simulando usuário real nos fluxos detectados
- Dashboard: resultado por fluxo + status + insight IA + prompt corretivo copiável
- Planos Starter/Pro/Agency com Stripe
- Multitenancy (RLS por organização)
- Multilingual: EN / PT / ES
- PPP Pricing (preço por país)

### 🔶 BOM TER (pós-lançamento)

- Comparação antes/depois da correção
- Teste mobile vs desktop (viewports)
- Histórico de versões testadas
- Notificação por email quando teste termina
- Relatório em PDF exportável

### ❌ NÃO CONSTRÓI AGORA

- White label
- Integração Jira/Linear
- API pública
- Suporte a frameworks além de React/Next
- Chrome extension
- Marketplace de templates de teste`,
  },
  {
    id: "arquitetura",
    number: 7,
    title: "Arquitetura Técnica",
    content: `### Frontend (Lovable)
- React + TypeScript
- Supabase externo (nunca banco interno Lovable)
- i18n: react-i18next (EN/PT/ES)
- Stripe para pagamentos
- GitHub OAuth via Supabase Auth

### Backend Motor de Testes (VPS/Coolify)
- Node.js + Playwright
- Docker para sandbox isolada por execução
- Supabase local efêmero por container
- Fila de jobs: BullMQ + Redis
- Claude API para análise de código e geração de relatório

### Banco de Dados (Supabase)

| Tabela | Descrição |
|--------|-----------|
| \`organizations\` | Multitenancy raiz |
| \`organization_members\` | Membros por org |
| \`projects\` | Projetos conectados |
| \`test_runs\` | Execuções de teste |
| \`test_results\` | Resultados por fluxo |
| \`briefings\` | Briefings gerados/editados |
| \`user_profiles\` | Perfis de usuário |
| \`pricing_by_country\` | PPP pricing |

**RLS:** ativo em todas as tabelas desde criação.`,
  },
  {
    id: "modelo-negocio",
    number: 8,
    title: "Modelo de Negócio",
    content: `### Precificação Base (USD)

| Plano | Testes/mês | Preço | Target |
|-------|-----------|-------|--------|
| Starter | 5 | $29 | Fundador solo validando |
| Pro | 20 | $79 | Dev ativo ou pequena agência |
| Agency | 60 | $199 | Agência com múltiplos projetos |

### PPP Multipliers

| Região | Multiplier | Starter | Pro | Agency |
|--------|-----------|---------|-----|--------|
| US/EU/AU/SG | 1.0x | $29 | $79 | $199 |
| Brasil | 0.4x | $12 | $32 | $80 |
| LATAM | 0.5x | $15 | $40 | $100 |
| Índia/SE Ásia | 0.35x | $10 | $28 | $70 |

### Unit Economics
- **Custo por teste estimado:** ~$0.30-0.60 (IA + sandbox)
- **Margem:** 85%+ em todos os planos`,
  },
  {
    id: "metricas",
    number: 9,
    title: "Métricas de Sucesso",
    content: `### Semana 1-4 (Validação)
- 10 signups orgânicos sem paid
- 3 usuários completam primeiro teste
- NPS > 40 nos primeiros testers

### Mês 3
- MRR $500+
- Churn < 15%
- 1 depoimento público

### Mês 6
- MRR $3.000+
- 50 projetos ativos testados
- Pelo menos 1 caso de uso Agency`,
  },
  {
    id: "roadmap",
    number: 10,
    title: "Roadmap",
    content: `| Fase | Período | Entregáveis |
|------|---------|------------|
| **Fase 1 — MVP** | Semanas 1-4 | Skeleton visual + auth + GitHub OAuth + briefing automático |
| **Fase 2 — Motor** | Semanas 5-8 | Sandbox Docker + Playwright + fila de jobs + relatório básico |
| **Fase 3 — Monetização** | Semanas 9-10 | Stripe + PPP pricing + planos |
| **Fase 4 — Polish** | Semanas 11-12 | Multilingual completo + mobile + performance |
| **Fase 5 — Launch** | Semana 13+ | Product Hunt + comunidades Lovable/Bolt + LinkedIn |`,
  },
  {
    id: "riscos",
    number: 11,
    title: "Riscos e Mitigações",
    content: `| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Apps com CAPTCHA bloqueiam Playwright | Média | Sandbox isolada evita detecção |
| Custo de IA sobe com escala | Média | Cache de briefings + modelo menor para análise inicial |
| Concorrente grande copia o nicho | Baixa | Velocidade de execução + comunidade vibe coding |
| RAM da VPS não suporta testes paralelos | Alta | Máximo 2 testes simultâneos no início |`,
  },
  {
    id: "criterios-lancamento",
    number: 12,
    title: "Critérios de Lançamento",
    content: `O Vibeeflow está pronto para lançar quando todos os critérios abaixo forem cumpridos:`,
  },
];

export interface LaunchCriterion {
  id: string;
  label: string;
  defaultChecked: boolean;
}

export const launchCriteria: LaunchCriterion[] = [
  { id: "e2e", label: "Fluxo completo funciona end-to-end (GitHub → teste → relatório)", defaultChecked: false },
  { id: "stripe", label: "Stripe processando pagamento real", defaultChecked: false },
  { id: "beta", label: "3 beta testers validaram o produto", defaultChecked: false },
  { id: "status", label: "Página de status funcionando", defaultChecked: false },
  { id: "legal", label: "GDPR/Terms of Service publicados", defaultChecked: false },
  { id: "parallel", label: "Motor de testes suporta mínimo 2 execuções simultâneas", defaultChecked: false },
];
