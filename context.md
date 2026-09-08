# Kairos — Contexto do Desenvolvimento

## Última atualização (03/09/2026)

O Kairos é um monorepo em **pnpm** para gestão de igrejas, com backend Fastify/TypeScript/Prisma e frontend Next.js 14 + App Router. O banco configurado é SQLite (`backend/prisma/dev.db`), adequado para desenvolvimento e MVP local. O contrato OpenAPI é a fonte do cliente React Query gerado em `frontend/src/lib/api/generated`.

## Estado atual

### Backend

- Autenticação JWT, membros e grupos com CRUD, paginação e filtros.
- Eventos habilitados no servidor (`/events`) com CRUD, participantes e atualização de status.
- Configurações da igreja em `/system/church`.
- Upload de imagens via multipart/Cloudinary com limite de 5 MB.
- Swagger gerado em `backend/swagger.json`.
- Schemas Zod validam enums e datas; o Prisma permanece compatível com SQLite usando strings para campos enumerados.

### Frontend

- Shell responsivo: sidebar desktop/mobile, header sticky, tema claro/escuro e navegação protegida.
- Design system baseado em shadcn/ui, Tailwind e tokens roxos com destaque dourado.
- Dashboard redesenhado com KPIs, gráfico de crescimento, próximos eventos, aniversariantes e atalhos.
- Membros: CRUD, filtros, busca persistida na URL, tabela/grid, drawers, ações em massa e feedback de loading/erro.
- Grupos: listagem em tabela/grid, filtros, paginação, criação/edição/exclusão e validação de horários/conflitos.
- Eventos: listagem em tabela/grid, filtros por tipo/status, paginação e CRUD integrado à API.
- Presença: painel por evento para adicionar/remover participantes e atualizar status em tempo real.
- QR Code: cada evento gera um QR apontando para sua rota autenticada de check-in no celular.
- Relatórios: endpoint `/reports/overview` com KPIs reais de membros, grupos, eventos e presença.
- Membros: exportação CSV e lista de aniversariantes dos próximos 30 dias.
- Configurações: formulário funcional para identidade, tema, fuso e formatos de data/hora.
- Calendário: visão mensal responsiva com expansão de eventos semanais/mensais e lembretes registrados.
- Financeiro: lançamentos em centavos, resumo de entradas/saídas/saldo e controles por perfil.
- Permissões: papéis ADMIN, PASTOR, LEADER, SECRETARY e USER aplicados no backend e no menu.
- Portal: página mobile-first com próximos encontros e atalhos para check-in.
- Operação: `/health`, script de backup SQLite, Docker healthcheck e documentação de migração para PostgreSQL.

## Decisões técnicas

1. **pnpm** é o gerenciador oficial: já existiam workspace e lockfile, e ele evita múltiplos lockfiles no monorepo.
2. **shadcn/ui** é a base obrigatória dos componentes de interface; customizações preservam seus tokens e primitives.
3. **React Query + Orval** mantêm cache e cliente tipado sincronizados com o Swagger.
4. **SQLite** fica como banco padrão do MVP; uma migração para PostgreSQL pode ser feita depois sem alterar os contratos da API.
5. Animações usam Framer Motion com suporte a `prefers-reduced-motion`.

## Validação executada

- `pnpm --filter @kairos/frontend lint`
- `pnpm --filter @kairos/frontend typecheck`
- `pnpm --filter @kairos/frontend build`
- `pnpm --filter @kairos/backend lint`
- `pnpm --filter @kairos/backend build`
- `pnpm --filter @kairos/backend exec jest --runInBand` (28 testes)

Todos os comandos acima passam. O build informa apenas que os dados do Browserslist estão antigos; isso não bloqueia o MVP.

## Próximos passos prioritários

1. Integrar os indicadores de `/reports/overview` ao dashboard principal.
2. Criar notificações por e-mail/WhatsApp (mantidas fora desta rodada).
3. Migrar SQLite para PostgreSQL em staging e automatizar backups externos.
4. Adicionar ordenação de colunas e exportação por filtros avançados.
5. Cobrir frontend com testes E2E e revisar permissões por perfil.
