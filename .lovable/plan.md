

# Plano: Orquestração de Testes, UI de Fluxos e Webhook Receiver

## Resumo

Construir o sistema completo de orquestração de testes do Vibeeflow: fila de jobs no banco, Edge Functions para enfileirar/receber resultados, UI para configurar fluxos de teste e visualizar resultados em tempo real.

## Arquitetura

```text
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Dashboard   │────▶│  queue-test      │────▶│  test_jobs table │
│  (Run Test)  │     │  (Edge Function) │     │  (fila no banco) │
└─────────────┘     └──────────────────┘     └──────────────────┘
                                                       │
                                              Worker externo lê
                                              jobs pendentes e
                                              executa Playwright
                                                       │
                                                       ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  TestResult  │◀────│  test_results    │◀────│  webhook-results │
│  (UI)        │     │  test_runs       │     │  (Edge Function) │
└─────────────┘     └──────────────────┘     └──────────────────┘
```

## 1. Banco de Dados (Migration)

### Nova tabela `test_jobs` (fila de testes)
- `id` uuid PK
- `project_id` FK → projects
- `test_run_id` FK → test_runs (nullable, preenchido quando run é criado)
- `status` text: `queued` | `running` | `completed` | `failed`
- `flow_config` jsonb (URLs, fluxos a testar, credenciais de teste)
- `priority` int default 0
- `worker_id` text nullable (ID do worker que pegou o job)
- `started_at`, `completed_at` timestamps
- `error_message` text nullable
- `created_at` default now()
- RLS: owner do projeto pode SELECT; service_role para INSERT/UPDATE

### Nova tabela `test_flows` (configuração de fluxos)
- `id` uuid PK
- `project_id` FK → projects
- `name` text (ex: "Login Flow", "Checkout Flow")
- `description` text
- `steps` jsonb (array de passos: url, action, selector, expected)
- `is_active` boolean default true
- `created_at`, `updated_at`
- RLS: owner do projeto pode CRUD

### Adicionar campo `webhook_secret` na tabela `projects`
- Para validar que os resultados vêm do worker autorizado

## 2. Edge Functions

### `queue-test` (POST) — Enfileira teste
- Recebe `{ project_id, flow_ids?: string[] }` (se vazio, testa todos os fluxos ativos)
- Valida JWT do usuário, verifica ownership do projeto
- Cria um `test_run` com status `queued`
- Cria um `test_job` com a configuração dos fluxos
- Atualiza `projects.status` para `testing`
- Retorna `{ job_id, test_run_id }`

### `webhook-results` (POST) — Recebe resultados do worker
- Valida `webhook_secret` no header `X-Webhook-Secret`
- Recebe `{ job_id, results: [{ flow_name, status, ai_insight, corrective_prompt, screenshot_url, duration_ms }] }`
- Atualiza `test_run` com contagem passed/failed e status
- Insere cada resultado em `test_results`
- Atualiza `test_job.status` para `completed`
- Atualiza `projects.status` e `last_test_at`

### `get-test-jobs` (GET) — Worker consulta jobs pendentes
- Autenticação via `X-Worker-Key` (secret)
- Retorna jobs com status `queued` ordenados por prioridade
- Marca job como `running` ao retornar (lock otimista)

## 3. UI — Novas Páginas e Componentes

### A. Flow Configuration (nova aba em ProjectDetail)
- Aba "Flows" ao lado de "Test Runs" e "Briefing"
- Lista de fluxos configurados com nome, descrição, status ativo/inativo
- Botão "Add Flow" abre modal com:
  - Nome do fluxo
  - URL inicial
  - Editor de steps (array visual): cada step tem `action` (navigate, click, type, wait, assert), `selector`, `value`, `expected`
- Editar/deletar fluxos existentes

### B. Run Test (funcional)
- Botão "Run Test" no Dashboard e ProjectDetail agora chama `queue-test`
- Mostra toast "Test queued!" com link para acompanhar
- Polling ou realtime para atualizar status do run

### C. Dashboard melhorado
- Badge de status atualiza em tempo real via realtime subscription
- Indicador de jobs na fila

### D. Test Results (melhorado)
- Progress bar durante execução
- Realtime updates conforme resultados chegam via webhook

## 4. Configuração necessária

- `supabase/config.toml`: adicionar `webhook-results`, `queue-test`, `get-test-jobs` com `verify_jwt = false`
- Secret `WORKER_API_KEY`: para autenticar o worker externo no `get-test-jobs` e `webhook-results`
- Enable realtime na tabela `test_runs` para updates em tempo real

## Detalhes Técnicos

- Edge Functions usam `createClient` com `SUPABASE_SERVICE_ROLE_KEY` para operações admin
- `webhook-results` valida via header secret, não JWT (chamado por worker externo)
- `queue-test` valida JWT do usuário autenticado
- Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE test_runs, test_jobs`
- Flow steps são armazenados como JSONB para flexibilidade

## Arquivos a criar/editar

| Arquivo | Ação |
|---------|------|
| Migration SQL | Criar tabelas `test_jobs`, `test_flows` + campo `webhook_secret` |
| `supabase/functions/queue-test/index.ts` | Nova Edge Function |
| `supabase/functions/webhook-results/index.ts` | Nova Edge Function |
| `supabase/functions/get-test-jobs/index.ts` | Nova Edge Function |
| `supabase/config.toml` | Registrar 3 novas functions |
| `src/components/project/FlowEditor.tsx` | UI configuração de fluxos |
| `src/components/project/FlowStepEditor.tsx` | Editor visual de steps |
| `src/pages/ProjectDetail.tsx` | Adicionar aba Flows + Run Test funcional |
| `src/pages/Dashboard.tsx` | Run Test funcional + realtime |
| `src/pages/TestResult.tsx` | Realtime updates + progress |

