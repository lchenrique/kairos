# Auditoria de prontidão para lançamento

## Veredito

**Não pronto.**

O projeto tem uma base funcional consistente para um beta técnico: lint, typecheck, build, 60 testes de API e um E2E integrado passaram. Onboarding, multi-igreja, sessão segura, remoção dos mocks, indicadores reais e a matriz aprovada de permissões foram implementados e validados. O lançamento comercial ainda está bloqueado por evidências externas: entrega real de e-mail transacional, Cloudinary, build das imagens, deploy e restore em staging, configuração dos segredos e QA humano em dispositivos/leitor de tela.

O sistema pode ser demonstrado localmente com o seed atual, mas isso não equivale a estar pronto para receber dados reais de várias igrejas.

## Resumo do estado atual

- Monorepo pnpm com backend Fastify/Prisma/SQLite e frontend Next.js 14 com App Router.
- Rotas principais de membros, grupos, eventos, check-in, calendário, finanças, relatórios e configurações existem.
- Os scripts de desenvolvimento usam API em `http://localhost:3333` e frontend em `http://localhost:3001`; o E2E usa instâncias isoladas em 3341 e 3012.
- O fluxo automatizado recria um banco vazio pelas migrations, executa setup, autenticação pelo Clerk, cadastros principais, restrições de usuário comum e logout.
- A suíte da API cobre caminhos positivos, erros de domínio, isolamento multi-tenant, ciclo de sessão e testes negativos para os cinco papéis. A autenticação atual é o Clerk: o backend valida apenas o Bearer token do Clerk e a suíte passou a assinar JWTs RS256 de teste, sem mock de regra de negócio (detalhes na continuação de 11/09/2026).
- A base suporta uma Rede com sede e filiais, contexto ativo por unidade e visão consolidada autorizada.
- O seed demonstrativo mantém credencial conhecida somente para desenvolvimento e é recusado quando `NODE_ENV=production`.
- O repositório já continha muitas alterações locais e elas foram preservadas; nenhum commit foi criado.

## Continuação da verificação (11/09/2026)

Em 11/09/2026 a prontidão foi revalidada com foco em autenticação, suíte de API e publicação. A autenticação do produto migrou para o Clerk: o backend valida apenas o Bearer token do Clerk (`backend/src/lib/clerk.ts`, decorator `authenticate` em `backend/src/server.ts`) e as rotas de senha respondem 410 `CLERK_REQUIRED`.

### O que foi corrigido

- A suíte de API estava quebrada (59/60 falhando com 410/401) porque ainda exercitava o fluxo antigo por senha. Foi reescrita para exercitar o Clerk de verdade: `backend/scripts/test-api.mjs` gera um par de chaves RSA e injeta `CLERK_JWT_KEY` (público) no servidor de teste, e `backend/src/__tests__/api.test.ts` assina JWTs RS256 de teste. Nenhuma regra de negócio foi mockada.
- `pnpm-workspace.yaml` usava `allowBuilds:`, chave não reconhecida pelo pnpm 11.15.1. Foi trocada por `onlyBuiltDependencies:` com `@biomejs/biome`, `@prisma/client`, `@prisma/engines`, `bcrypt`, `core-js-pure`, `esbuild`, `prisma` e `unrs-resolver`; confirmado com `pnpm config get only-built-dependencies`.
- UI: listas de membros, grupos e eventos unificadas em `ListShell`/`ListToolbar` compartilhados, com empty state padronizado; correções em finance/relatórios (datas, select de categoria, DatePicker) e overflow no drawer de grupos.

### Comandos e resultados

| Comando | Resultado |
| --- | --- |
| `pnpm --filter @kairos/backend test` | 60 passed / 60 total |
| `pnpm --filter @kairos/backend build` | exit 0 |
| `pnpm --filter @kairos/backend check` | "Checked 70 files. No fixes applied." |
| `pnpm --filter @kairos/frontend typecheck` | verde |
| `pnpm --filter @kairos/frontend lint` | verde |
| `pnpm --filter @kairos/frontend build` | sucesso; rotas listadas, incluindo `/setup` e `/auth` |

### Deploy e smoke

- Deploys concluídos no Coolify, projeto Kairos/production: kairos-frontend (`qsmztum9f4u5jkozgry1co8d`) e kairos-api (`7jmh9fwxcdoganysatkeiztv`).
- Smoke público: `https://kairos.codebycarlos.dev` respondeu HTTP 200 com a copy nova; `https://api.kairos.codebycarlos.dev/health` respondeu 200 `{status:ok,database:ok}`.
- Commits recentes em `main`: `a778e63`, `ec0c1ac`, `4ba0236`, `315b7b8`, `11e491a`.

### Bug de ambiente local (não do produto)

- Nesta máquina o store do pnpm está em `D:` e `pnpm install/rebuild` falha com erro de symlink cross-drive. Para rodar a suíte local é preciso usar `pnpm --config.verify-deps-before-run=false ...`.

### Não executado nesta rodada

- E2E (`pnpm test:e2e`) e QA manual não foram executados nesta rodada.

## Funcionalidades já validadas

As validações abaixo foram executadas no workspace atual. As evidências de sessão por cookie são anteriores à migração para o Clerk e ficam mantidas como histórico; a autenticação vigente é a descrita em `## Continuação da verificação (11/09/2026)`.

- `pnpm lint`: sucesso; Biome no backend informou “No fixes applied” e o lint do Next não reportou erros.
- `pnpm typecheck`: sucesso; TypeScript do frontend e compilação TypeScript do backend passaram.
- `pnpm test`: sucesso, 60 de 60 testes passando em uma suíte Jest, usando banco e porta de teste isolados.
- `pnpm build`: sucesso; backend compilado e Next gerou as páginas estáticas/dinâmicas previstas.
- `pnpm test:e2e`: sucesso, 1 de 1 cenário Playwright em 2,5 minutos, com frontend, backend e banco isolados.
- `GET /health`: 200.
- Preflight CORS de `http://localhost:3001` para `/auth/login`: 204, com `Access-Control-Allow-Origin` e credenciais.
- Login administrativo por cookie HttpOnly: 200 com papel `ADMIN`, sem JWT exposto no JSON.
- Com sessão válida, `/auth/profile`, `/system/church`, `/members`, `/groups`, `/events`, `/reports/overview` e `/finance` responderam 200 para o papel autorizado.
- Sem cookie, `/dashboard` redireciona para `/login`; um `USER` autenticado é redirecionado de `/dashboard` para `/portal`.
- Fluxos de criação/listagem/edição e relações básicas de membros, grupos, eventos, participantes e finanças estão cobertos pelos testes de API.

Essas evidências validam a implementação local, o isolamento entre tenants e os limites de papel. Não validam entrega de provedores externos, concorrência/carga, recuperação de desastre em infraestrutura real ou experiência em dispositivos físicos.

## Bloqueadores P0

P0 significa que o item precisa ser resolvido ou explicitamente retirado do escopo antes de um lançamento público.

### P0-1: onboarding e criação da igreja - CONCLUÍDO em 05/09/2026

**Evidência:** `frontend/middleware.ts` trata `/setup` como público, mas `pnpm build` não lista essa rota e o smoke test `GET /setup` retorna 404. O backend registra usuários globalmente; `Church` é criado pelo seed e a atualização exige autenticação.

**Risco:** uma instalação nova não consegue criar a igreja e o administrador pela interface; a operação depende de acesso manual ao banco, seed ou API.

**Critério de aceite:** uma instalação vazia abre `/setup`, cria a igreja e o primeiro administrador, inicia sessão e chega ao dashboard sem seed manual; tentativas repetidas não criam duas organizações por acidente.

**Status:** concluído. O backend agora expõe o status público da instalação e um setup atômico que cria a Rede, a igreja sede, o primeiro administrador e as duas associações de acesso. A página pública `/setup` usa os componentes shadcn existentes, cria a sessão pela mesma resposta autenticada do login e redireciona ao dashboard. O login consulta o status e envia instalações vazias para o setup. Uma instalação já configurada recebe `409 SETUP_ALREADY_COMPLETED` e não cria registros adicionais. Durante o primeiro E2E sobre migrations, foi descoberto que a migration multi-tenant criava uma Rede legada órfã até em banco vazio; a migration aditiva `202609050007_remove_empty_legacy_organization` remove somente esse sentinela sem igreja e sem usuário.

**Arquivos modificados:** `backend/src/routes/auth/setup.ts`, `backend/src/routes/auth/index.ts`, `backend/src/schemas/auth.ts`, `backend/src/__tests__/api.test.ts`, `backend/swagger.json`, `backend/prisma/migrations/202609050007_remove_empty_legacy_organization/migration.sql`, `frontend/src/app/(auth)/setup/page.tsx`, `frontend/src/app/(auth)/login/page.tsx` e cliente Orval em `frontend/src/lib/api/generated`.

**Comandos e resultados:** `pnpm --filter @kairos/backend build` passou; `pnpm --filter @kairos/backend check` passou; `pnpm --filter @kairos/frontend generate:api` regenerou o contrato; `pnpm --filter @kairos/frontend typecheck` passou; `pnpm --filter @kairos/frontend lint` passou sem avisos; `pnpm test` passou com 38/38 testes; `pnpm --filter @kairos/frontend build` passou e listou `/setup` como rota estática. O build ainda emitiu os avisos já conhecidos de `edge-server` com `SIGTERM` recuperado e base Browserslist desatualizada. O preparo do banco de teste ainda emite `EPERM` do Prisma ao tentar regenerar o client no Windows, mas a suíte inicia no banco isolado e termina com sucesso.

**Testes de aceite adicionados:** banco vazio informa `available: true`; o setup cria exatamente uma Rede, uma sede e um administrador; depois informa `available: false`; uma segunda tentativa retorna 409 e mantém as contagens em uma Rede, uma igreja e um usuário. O E2E recria um SQLite exclusivamente pelas sete migrations, abre `/setup`, preenche os campos pelos respectivos rótulos, cria a Rede e chega ao dashboard sem seed. O backup `backend/backups/kairos-2026-09-06T00-03-25-343Z.db` foi feito antes de aplicar a sétima migration ao `dev.db`.

**Bloqueios restantes:** nenhum para o P0-1.

### P0-2: decidir e implementar o modelo de tenancy - CONCLUÍDO em 05/09/2026

**Evidência:** `backend/prisma/schema.prisma` tem `Church.id` fixo como `default`; `Member`, `Group`, `Event`, `FinanceEntry`, `Setting` e demais entidades não têm `churchId`/`unitId`. Não existe seletor ou escopo de unidade no frontend.

**Risco:** dados de igrejas diferentes não podem ser isolados. Isso impede a promessa de sede, filiais ou SaaS multi-igreja solicitada no produto.

**Critério de aceite:** confirmar single-tenant para o primeiro lançamento e remover essa promessa da comunicação, ou implementar organização/unidade, contexto ativo, escopo em todas as queries e testes que comprovem que um usuário nunca lê ou altera dados de outra igreja.

**Status:** concluído. A V1 foi confirmada como multi-igreja. O modelo agora usa `Organization` (Rede), `Church` (igreja/unidade), `OrganizationUser` e `ChurchUser`; membros, grupos, eventos, finanças e configurações possuem unidade obrigatória. O backend resolve o escopo pelo JWT e por `X-Church-Id`, aceita consolidação explícita com `all` e valida acesso antes de toda leitura ou mutação operacional. O frontend ganhou seletor persistente de unidade e cadastro de congregações em Configurações.

**Arquivos modificados:** `backend/prisma/schema.prisma`, `backend/prisma/migrations/202609050001_baseline/migration.sql`, `backend/prisma/migrations/202609050002_multitenancy/migration.sql`, `backend/prisma/seed.ts`, `backend/src/lib/tenant.ts`, rotas de autenticação, membros, grupos, eventos, finanças, relatórios e sistema, testes de API, `frontend/src/lib/stores/church-store.ts`, `frontend/src/hooks/use-church-context.ts`, `frontend/src/components/layout/church-switcher.tsx`, `frontend/src/components/settings/church-unit-manager.tsx`, sidebar, configurações, cliente Axios, Swagger e cliente Orval gerado.

**Comandos e resultados:** `prisma format` e `prisma validate` passaram; as duas migrations foram aplicadas com sucesso em banco temporário vazio; `backup` criou `backend/backups/kairos-2026-09-05T22-03-39-459Z.db`; baseline e migration multi-tenant foram aplicadas ao banco local; contagens permaneceram em 2 usuários, 1 igreja, 6 membros, 2 grupos, 2 eventos e 2 lançamentos, com 1 Rede e 2 associações de usuário criadas; `PRAGMA foreign_key_check` não retornou violações; backend build/check, frontend lint/typecheck/build passaram; `pnpm test` passou com 36/36 testes.

**Testes de aceite adicionados:** criação de segunda unidade; listagem do contexto da Rede; isolamento de membro por unidade; visão consolidada explícita; rejeição de participante pertencente a outra unidade; usuário restrito impedido de acessar unidade não atribuída; rejeição de uma unidade pertencente a outra Rede.

**Bloqueios restantes:** nenhum para o P0-2. O onboarding que cria Rede, primeira unidade e administrador é tratado separadamente no P0-1.

### P0-3: recuperação de senha e ciclo de vida da conta - IMPLEMENTADO, SMTP EXTERNO PENDENTE

**Evidência:** o login aponta para `/forgot-password`, que não existe. `POST /auth/password/reset-request` e `POST /auth/password/reset` estão protegidos por autenticação; o código armazena token, mas não há envio de e-mail. Não há revogação de sessão.

**Risco:** usuário deslogado não consegue recuperar acesso; o caminho de suporte é manual e o token JWT permanece válido por até sete dias.

**Critério de aceite:** usuário deslogado solicita recuperação, recebe link por provedor configurado, define senha com token de uso único e expirável, sessões antigas são tratadas conforme a política, e o fluxo tem testes positivos e negativos.

**Status:** implementação concluída e validada localmente. A recuperação agora é pública e não revela a existência da conta; o token aleatório é armazenado somente como SHA-256, expira em 60 minutos e é apagado no primeiro uso. Reset, troca de senha e logout incrementam `User.sessionVersion`; o backend consulta usuário e associação atuais em cada autenticação e rejeita todos os JWTs anteriores. As páginas `/forgot-password` e `/reset-password` foram criadas com componentes shadcn e o logout da interface chama a API antes de limpar o estado local.

**Arquivos modificados:** `backend/prisma/schema.prisma`, migration `202609050003_session_revocation`, `backend/src/lib/mailer.ts`, configuração de ambiente, servidor, rotas de login, setup, registro, senha e logout, testes de API, `backend/.env.example`, `backend/package.json`, `pnpm-lock.yaml`, `frontend/src/app/(auth)/forgot-password/page.tsx`, `frontend/src/app/(auth)/reset-password/page.tsx`, `frontend/src/hooks/use-auth.ts`, middleware, Swagger e cliente Orval gerado.

**Comandos e resultados:** `pnpm --filter @kairos/backend exec prisma format` e `prisma validate` passaram; backup local criado em `backend/backups/kairos-2026-09-05T22-36-23-684Z.db`; a migration foi aplicada ao banco local e as três migrations foram reaplicadas com sucesso em um banco temporário vazio; `pnpm test` passou com 42/42 testes; backend build/check, frontend typecheck/lint/build passaram; o build lista `/forgot-password` e `/reset-password`. A primeira tentativa de instalar o mailer encontrou stores divergentes do pnpm; a segunda reutilizou explicitamente o store já ligado ao workspace e concluiu sem reinstalar o projeto.

**Testes de aceite adicionados:** resposta idêntica para e-mail existente e inexistente; token persistido apenas como hash; expiração futura; rejeição de token inválido e expirado; uso único; senha anterior recusada; JWT anterior recusado após reset, troca e logout; novo login aceito depois de cada revogação.

**Evidência externa adicional em 05/09/2026:** o MCP da conta Hostinger confirmou `codebycarlos.dev` ativo, nameservers da Hostinger, MX `mx1.hostinger.com`/`mx2.hostinger.com`, SPF da Hostinger, três CNAMEs DKIM e DMARC publicado. `Test-NetConnection smtp.hostinger.com -Port 465` resolveu o host e confirmou conexão TCP. A configuração da aplicação passou a adotar por padrão `smtp.hostinger.com:465`, SSL, `kairos@codebycarlos.dev` e o remetente `Kairos`, preservando sobrescrita por ambiente e limites de conexão. Foi criado o comando `pnpm --filter @kairos/backend email:verify`, que autentica sem enviar ou, somente com `--to`, envia uma única mensagem de smoke. Build/check e 60/60 testes passaram. A execução segura sem destinatário encerrou informando apenas `SMTP_PASSWORD` ausente, sem revelar segredo.

**Bloqueio restante:** o Coolify do VPS foi autenticado e o projeto `Kairos / production` foi criado, mas `SMTP_PASSWORD` não existe nos ambientes Process, User ou Machine do workspace e o MCP Hostinger não fornece a senha da caixa. Cadastre-a diretamente em **Kairos > production > recurso da aplicação > Environment Variables**, apenas em runtime, como variável bloqueada. A autenticação SMTP e a entrega externa ainda dependem dessa senha; a tarefa não é marcada como totalmente concluída sem executar o verificador e receber convite/recuperação em uma caixa externa.

### P0-4: remover autenticação mock e stub enganoso - CONCLUÍDO em 05/09/2026

**Evidência:** `frontend/src/app/api/auth/login/route.ts` retorna usuário e `mock-jwt-token` independentemente das credenciais. `frontend/src/app/api/auth/logout/route.ts` é um stub. A tela atual usa a API backend, mas a rota mock continua publicamente acessível.

**Risco:** confusão entre ambientes, falsa percepção de login e possibilidade de integração acidental com uma identidade fixa.

**Critério de aceite:** a rota mock é removida ou isolada atrás de um mecanismo de teste que não seja publicado; login valida credenciais no backend; logout limpa a sessão e a documentação não aponta para endpoint falso.

**Status:** concluído. As rotas Next `frontend/src/app/api/auth/login/route.ts` e `logout/route.ts` foram removidas. O frontend usa exclusivamente o contrato gerado da API Fastify para login e logout, e a busca no código não encontra mais `mock-jwt-token`, dados do usuário fixo ou comentários do stub.

**Arquivos modificados:** remoção de `frontend/src/app/api/auth/login/route.ts` e `frontend/src/app/api/auth/logout/route.ts`.

**Comandos e resultados:** `rg` não encontrou referências ao mock; frontend lint passou; build passou e não lista mais `/api/auth/login` ou `/api/auth/logout`; typecheck passou após o build regenerar os tipos antigos do `.next`. A primeira execução do typecheck falhou somente porque o cache de tipos ainda referenciava as rotas recém-removidas, e a repetição sobre os artefatos atuais passou.

**Bloqueios restantes:** nenhum para o P0-4. Credenciais de demonstração e política de seed pertencem ao P0-8.

### P0-5: eliminar dados demonstrativos apresentados como dados reais - CONCLUÍDO em 05/09/2026

**Evidência:** `frontend/src/app/(app)/dashboard/page.tsx` e `frontend/src/features/dashboard/components/dashboard-stats.tsx` contêm crescimento mensal, aniversariantes, alertas e textos estáticos; um card de relatório mostra “Em breve”.

**Risco:** a liderança pode tomar decisões com números fictícios e perder confiança no produto.

**Critério de aceite:** cada número exibido vem de endpoint real e tem estado vazio/carregando/erro, ou é rotulado de forma inequívoca como exemplo; não existem valores fictícios no dashboard de produção.

**Status:** concluído. O dashboard passou a consumir somente a agenda real e `GET /dashboard/overview`. Foram removidos a série fixa de crescimento, percentual inventado, aniversariantes fictícios, alerta de 12 membros, recomendação estática apresentada como atenção, “sinal da semana” e o card de Relatórios “Em breve”. Os quatro indicadores mostram membros ativos, grupos, próximos eventos e taxa de confirmação calculados pela API. Participação, agenda e pontos de atenção derivados de membros inativos e confirmações pendentes possuem estados de carregamento, erro e vazio. O texto do destaque esclarece que os números refletem a unidade selecionada. O endpoint próprio separa a visão operacional do Dashboard do módulo de Relatórios e permite aplicar permissões diferentes sem duplicar a consulta.

**Arquivos modificados:** `frontend/src/app/(app)/dashboard/page.tsx`, `frontend/src/features/dashboard/components/dashboard-stats.tsx`, `frontend/src/hooks/use-dashboard-overview.ts`, `backend/src/lib/community-overview.ts`, `backend/src/routes/dashboard/index.ts`, `backend/src/routes/reports/index.ts` e `backend/src/server.ts`.

**Comandos e resultados:** formatação Biome dos arquivos passou; busca com `rg` não encontrou os valores, rótulos ou arrays fictícios removidos; frontend typecheck e lint passaram; o build de produção passou e gerou `/dashboard`. A API real usada pelo Dashboard está coberta pela suíte final de 60/60 testes, incluindo a permissão específica de `GET /dashboard/overview`.

**Critério de aceite verificado:** não restam constantes de demonstração no dashboard; indicadores vêm do contrato gerado da API; agenda e resumo exibem erro, carregamento e vazio sem substituir falhas por números inventados.

**Bloqueios restantes:** nenhum para o P0-5. Série histórica real, aniversários e análises avançadas só devem voltar quando existirem consultas próprias e regras de negócio confirmadas.

### P0-6: fechar exposição por papel e escopo de recurso - CONCLUÍDO em 05/09/2026

**Evidência original:** finanças e relatórios aceitavam qualquer usuário autenticado, a navegação não era uma barreira de segurança e não existia uma política única por recurso. O papel global de `User` também podia divergir da associação do usuário com a Rede.

**Critério de aceite:** matriz de permissões aprovada, aplicada no backend por recurso e organização/unidade, com testes negativos para cada papel; cookie de sessão protegido, verificação de expiração e tratamento de 401 no frontend.

**Matriz aprovada e implementada:**

| Recurso | Administrador | Pastor | Secretário | Líder | Usuário |
| --- | --- | --- | --- | --- | --- |
| Dashboard | leitura | leitura | leitura | sem acesso | sem acesso |
| Membros | leitura e alteração | leitura e alteração | leitura e alteração | sem acesso | sem acesso |
| Grupos | leitura e alteração | leitura e alteração | leitura e alteração | somente leitura | sem acesso |
| Eventos e calendário | leitura e alteração | leitura e alteração | leitura e alteração | somente leitura | somente leitura |
| Portal | leitura | leitura | leitura | leitura | leitura |
| Relatórios | leitura | leitura | sem acesso | sem acesso | sem acesso |
| Financeiro | leitura e alteração | somente leitura | sem acesso | sem acesso | sem acesso |
| Configurações da igreja | leitura e alteração | leitura e alteração | sem acesso | sem acesso | sem acesso |
| Equipe, Rede e unidades | leitura e alteração | sem acesso | sem acesso | sem acesso | sem acesso |

**Status:** concluído. A política está centralizada em permissões de recurso no backend e espelhada para navegação, rotas e controles no frontend. Todas as rotas operacionais aplicam autorização antes da consulta ou mutação, além do escopo multi-tenant já existente. O papel efetivo vem de `OrganizationUser`, fonte de verdade da Rede, e não do campo global do usuário. Dashboard ganhou endpoint próprio para permitir Secretário sem abrir Relatórios. Financeiro permite leitura ao Pastor e alteração somente ao Administrador. Líder e Usuário podem consultar eventos sem receber a lista de participantes; o Líder consulta grupos sem receber o diretório de membros. O recorte de “grupos próprios do Líder” foi explicitamente adiado; na V1 ele possui apenas leitura geral de grupos e eventos.

O cookie permanece HttpOnly, Secure em produção e SameSite Lax. Assinatura, expiração, versão de sessão e associação ativa são verificadas pelo backend. Mutações autenticadas por cookie exigem o cabeçalho anti-CSRF `X-Kairos-Client: web`. Middleware e layout autenticado redirecionam rotas incompatíveis com o papel; sidebar, botões, menus e atalhos escondem ações indisponíveis, sem substituir a proteção da API.

**Arquivos modificados nesta tarefa:** `backend/src/lib/authorization.ts`, `backend/src/lib/community-overview.ts`, `backend/src/routes/dashboard/index.ts`, `backend/src/server.ts`, rotas de autenticação/equipe, membros, grupos, eventos, finanças, relatórios, sistema e uploads, `backend/src/__tests__/api.test.ts`, `backend/swagger.json`, `frontend/src/lib/permissions.ts`, `frontend/src/middleware.ts`, layout autenticado, sidebar, configurações, Dashboard, Portal, Calendário, Financeiro, listas/cards de Grupos e Eventos, `frontend/src/hooks/use-dashboard-overview.ts` e `e2e/core-flow.spec.ts`.

**Comandos e resultados:** `pnpm --filter @kairos/backend check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passaram. A suíte da API terminou com 60/60 testes; o cenário integrado terminou com 1/1 teste em 2,5 minutos. `git diff --check` não encontrou erro de whitespace, somente avisos de conversão LF/CRLF do worktree no Windows. O build repetiu apenas o aviso não bloqueante da base Browserslist desatualizada.

**Testes de aceite adicionados:** a regressão cria sessões para Pastor, Secretário, Líder e Usuário com o papel global deliberadamente divergente e confirma que vale a associação da Rede. Para cada papel, testa leituras permitidas e respostas 403 em Dashboard, Membros, Grupos, Eventos, Relatórios, Financeiro, Configurações, Equipe e informação de sistema. Também comprova CRUD do Secretário, Financeiro somente leitura para Pastor, bloqueio de mutações do Líder/Usuário e ocultação de membros/participantes. O E2E comprova que `USER` entra no Portal, não vê módulos administrativos, é redirecionado ao tentar abrir o Dashboard, vê Eventos sem criação e recebe 403 ao consultar Equipe ou Membros diretamente na API.

**Bloqueios restantes:** nenhum para o P0-6.

### P0-7: provisionamento seguro da equipe - IMPLEMENTADO, SMTP EXTERNO PENDENTE

**Evidência:** `POST /auth/users` permite que um administrador defina diretamente a senha de outro usuário. Não existe convite, ativação, suspensão, revogação nem regra robusta para impedir a remoção do último administrador.

**Risco:** compartilhamento de senha, dificuldade de desligar acessos e contas órfãs.

**Critério de aceite:** convite ou ativação com senha definida pelo próprio usuário, expiração e auditoria; administrador pode suspender/revogar acesso; pelo menos um administrador ativo é sempre preservado.

**Status:** implementação concluída e validada localmente. O cadastro direto de usuário com senha administrativa e o registro público foram removidos. Administradores enviam convites vinculados à Rede e à unidade ativa; o token aleatório é armazenado somente como SHA-256, expira em 72 horas, pode ser revogado e não é retornado pela API. A pessoa convidada usa a página pública `/accept-invite` para definir a própria senha. A tela de Configurações lista usuários e histórico de convites, permite alterar papel, suspender, reativar, revogar convite e revogar permanentemente o acesso à Rede. Suspensão e revogação invalidam sessões; a revogação preserva o usuário global para não apagar uma identidade que possa participar de outra Rede. O backend bloqueia demissão, suspensão e revogação do último administrador ativo.

**Arquivos modificados:** `backend/prisma/schema.prisma`, migration `backend/prisma/migrations/202609050004_team_invites/migration.sql`, `backend/src/lib/mailer.ts`, `backend/src/routes/auth/index.ts`, `backend/src/routes/auth/invites.ts`, `backend/src/routes/auth/users.ts`, `backend/src/routes/auth/login.ts`, remoção de `backend/src/routes/auth/register.ts`, testes e bootstrap de teste, `backend/swagger.json`, `frontend/src/app/(auth)/accept-invite/page.tsx`, `frontend/src/components/settings/user-role-manager.tsx`, `frontend/src/middleware.ts`, `frontend/orval.config.ts` e cliente Orval em `frontend/src/lib/api/generated`.

**Comandos e resultados:** `prisma format`, `prisma validate` e `prisma generate` passaram; backup local criado em `backend/backups/kairos-2026-09-05T22-48-01-931Z.db`; a migration foi aplicada ao banco local e as quatro migrations foram reaplicadas em banco temporário vazio; backend build/check passaram; `pnpm --filter @kairos/frontend generate:api` regenerou e limpou artefatos obsoletos; frontend typecheck e lint passaram; o build de produção passou e lista `/accept-invite`. A suíte final passou com 48/48 testes. Uma execução intermediária falhou por um identificador inexistente adicionado somente ao novo teste; o teste foi corrigido e tanto o build quanto a suíte completa passaram na repetição.

**Testes de aceite adicionados:** token não é exposto e o hash, prazo, unidade e autor do convite são persistidos; convite expirado e reutilizado são recusados; senha é escolhida no aceite; convite pendente pode ser revogado; suspensão bloqueia sessão e login imediatamente; reativação restaura o acesso; revogação remove associações da Rede, preserva o usuário global e invalida a sessão; o último administrador ativo não pode ser demovido, suspenso ou removido.

**Bloqueio restante:** assim como no P0-3, o envio real do convite depende somente do `SMTP_PASSWORD` da caixa Hostinger. DNS, conectividade TCP, configuração e comando de smoke estão validados; falta autenticar, receber um convite real de `kairos@codebycarlos.dev`, abrir o link e concluir a ativação. O restante do fluxo está validado localmente.

### P0-8: configuração de produção, segredo e dados - IMPLEMENTADO LOCALMENTE, STAGING PENDENTE

**Evidência:** `backend/.env.example` contém `JWT_SECRET` placeholder e `DATABASE_URL=file:./dev.db`; o seed imprime credenciais conhecidas (`admin@kairos.local` / `Kairos@2026!`). `.gitignore` não ignora `.env`, `backend/prisma/dev.db`, `.next` ou `dist`. O Docker executa `prisma db push` na inicialização.

**Risco:** segredo previsível, conta demo em produção, vazamento acidental de banco/ambiente e mudanças de schema não controladas no startup.

**Critério de aceite:** segredo forte injetado por secret manager, seed bloqueado em produção, arquivos sensíveis ignorados e removidos do artefato, migrações versionadas e executadas em etapa controlada, backup/restauração testados e checklist de ambiente preenchido.

**Status:** controles locais implementados. Produção agora recusa `JWT_SECRET` ausente, conhecido ou com menos de 32 caracteres e também recusa SMTP sem senha. O seed demo falha imediatamente com `NODE_ENV=production`. `.gitignore` e `.dockerignore` cobrem ambientes, bancos SQLite, journals, builds, cobertura, backups e logs. A regra antiga que ignorava `backend/prisma/migrations` foi removida; o conjunto atual de sete migrations é versionável. O backend não executa mais `db push`; o Compose usa um serviço one-shot `migrate` com `prisma migrate deploy`, persiste somente `prisma/data` para não ocultar os SQLs e inicia a API apenas após a migration. `FRONTEND_URL` e `NEXT_PUBLIC_API_URL` são obrigatórios no Compose, impedindo publicação silenciosa com `localhost`; a URL pública da API também é argumento de build do frontend. Foram adicionados backup compatível com a `DATABASE_URL` SQLite, restore com validação do cabeçalho, confirmação `--force` e cópia de segurança anterior, além de documentação de rollback, Coolify e checklist por deploy.

**Arquivos modificados:** `.gitignore`, `.dockerignore`, `backend/.gitignore`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/.env.example`, `docker-compose.yml`, `backend/prisma/seed.ts`, `backend/src/config/env.ts`, `backend/scripts/backup-db.mjs`, `backend/scripts/restore-db.mjs`, `backend/package.json`, `README.md` e `docs/production.md`.

**Comandos e resultados:** backend build/check passaram; execução do seed com `NODE_ENV=production` falhou com a mensagem esperada; import da configuração de produção recusou segredo curto e aceitou segredo de teste com 32 caracteres e SMTP preenchido; `docker compose config --quiet` passou com valores de teste; `node --check` passou nos scripts de backup e restore. A validação inicial aplicou quatro migrations e exercitou backup/restore; o conjunto atual de sete migrations foi reaplicado em banco vazio e revalidado no P1-10. Os artefatos temporários do ensaio foram removidos sem tocar no `dev.db`. `git check-ignore` confirmou proteção de `.env`, SQLite, journals, `.next`, `dist` e backups; `git status` confirmou que `backend/prisma/migrations` não está mais oculto. O build de imagens foi tentado, mas não iniciou porque o pipe `dockerDesktopLinuxEngine` não existe enquanto o Docker Desktop está desligado.

**Critério de aceite verificado localmente:** seed bloqueado em produção; segredos obrigatórios e com validação mínima; banco e `.env` fora do artefato/contexto; migrations versionadas e aplicadas com `migrate deploy`; procedimento de backup e restauração funcional em banco isolado; rollback documentado.

**Bloqueios restantes:** o Coolify `4.3.14` foi acessado pela API, o servidor foi confirmado e o projeto `Kairos` com ambiente `production` foi criado. Os domínios aprovados `kairos.codebycarlos.dev` e `api.kairos.codebycarlos.dev` já resolvem para o VPS. Ainda é necessário cadastrar `JWT_SECRET` e `SMTP_PASSWORD` reais no recurso; `SMTP_PASSWORD` não está presente no workspace. O recurso e o deploy não foram criados porque o `docker-compose.yml`, os Dockerfiles, as migrations e a versão lançável continuam fora do commit disponível no GitHub, e a tarefa proíbe criar commit. Também é necessário validar imagens, ensaiar backup/restore em staging e preencher responsáveis, alertas e armazenamento externo. Esses itens não podem ser considerados concluídos apenas com valores locais de teste.

## Tarefas P1 antes do lançamento

| Tarefa | Evidência atual | Critério de aceite |
| --- | --- | --- |
| Corrigir erros de domínio - CONCLUÍDO | Grupos agora seguem o mesmo tratamento explícito de membros/eventos e possuem regressão automatizada | IDs inexistentes retornam 404 consistente, com mensagem segura e teste automatizado |
| Completar gestão da equipe - IMPLEMENTADO, SMTP PENDENTE | Fluxo e autorização administrativa validados; falta comprovar a entrega externa do convite | Lista, papel, convite, suspensão e remoção têm estados claros e testes de autorização |
| Tornar relatórios acionáveis - CONCLUÍDO | Período, origem, CSV, estados e atalhos para registros fonte implementados | Usuário escolhe período, entende a origem dos números e exporta ou navega para o registro fonte |
| Finalizar calendário - CONCLUÍDO | Séries limitadas com fim/exceções, formulário completo, visão móvel e estado vazio implementados | Série tem início/fim/exceções, calendário funciona em viewport móvel sem scroll inesperado e possui estado vazio |
| Fortalecer finanças - CONCLUÍDO | Modal, categorias, filtro, CSV, confirmação acessível, validação e autoria com exclusão lógica implementados | Modal acessível, categorias, exportação, confirmação consistente, validação de erro e trilha mínima de alteração |
| Cobrir upload e dependências externas - IMPLEMENTADO LOCALMENTE, CLOUDINARY PENDENTE | Configuração, limites, feedback e isolamento por igreja implementados; falta validar o provedor real em staging | Configuração, limites, erros, remoção segura e teste sem credencial são documentados |
| Criar testes de frontend/E2E - CONCLUÍDO | Playwright recria banco pelas migrations, percorre o fluxo principal e roda no CI | Teste automatizado cobre login, onboarding, CRUD principal, permissões e logout em ambiente limpo |
| Fazer revisão visual e acessível - VALIDADO AUTOMATICAMENTE, QA MANUAL PENDENTE | Axe WCAG AA, teclado, foco, dois temas, desktop e 390 px cobertos no E2E; falta somente leitor de tela/dispositivo real | Contraste, foco, teclado, labels, leitor de tela, estados de erro e viewports principais são verificados e registrados |
| Melhorar operação do servidor - CONCLUÍDO | Importação sem bind, lifecycle, SIGTERM, correlação e health degradado foram implementados e testados | SIGTERM encerra Fastify/Prisma corretamente, logs têm correlação e health check falha de forma observável |
| Preparar banco e backup - VALIDADO LOCALMENTE, INFRA PENDENTE | Sete migrations, backup/restore e rollback validados; agendamento, cópia externa e restore em staging dependem da hospedagem | Deploy reproduzível, backup agendado, restore ensaiado e plano de rollback documentado |
| Alinhar ambientes e documentação - VALIDADO LOCALMENTE, STAGING PENDENTE | Matriz dev/test/E2E/Docker/produção, envs, pnpm, portas, seed e comandos Windows documentados; domínios e deploy aguardam hospedagem | URLs, CORS, variáveis, portas, seed e comandos de produção estão documentados e testados |

### P1-1: corrigir erros de domínio - CONCLUÍDO em 05/09/2026

**Status:** concluído. Leituras e exclusões de grupos inexistentes retornam `404 GROUP_NOT_FOUND` com mensagem de domínio segura, sem propagar `P2025` ou detalhes internos do Prisma. Os demais CRUDs operacionais já verificam a existência e o escopo da unidade antes da mutação.

**Arquivos modificados nesta tarefa:** `backend/src/__tests__/api.test.ts`. A correção em `backend/src/routes/groups/get.ts` e `backend/src/routes/groups/delete.ts` já fazia parte das alterações multi-tenant ainda não documentadas por teste negativo.

**Comandos e resultados:** `pnpm --filter @kairos/backend check` passou; `pnpm test` passou com 52/52 testes.

**Testes de aceite:** `GET /groups/does-not-exist` e `DELETE /groups/does-not-exist` retornam exatamente 404, código `GROUP_NOT_FOUND`, mensagem segura e corpo sem `P2025`.

**Bloqueios restantes:** nenhum para esta tarefa.

### P1-2: completar gestão da equipe - IMPLEMENTADO, SMTP EXTERNO PENDENTE

**Status:** lista, convite, definição de senha pelo convidado, mudança de papel, suspensão, reativação, revogação de convite e remoção de acesso já estão implementados. Nesta tarefa foi adicionada a regressão que comprova que um Secretário autenticado recebe 403 em todas as operações de gestão da equipe; somente ADMIN pode executá-las. Os testes anteriores já cobrem estados, uso único, expiração, revogação de sessão e preservação do último administrador.

**Arquivos modificados nesta tarefa:** `backend/src/__tests__/api.test.ts`.

**Comandos e resultados:** `pnpm --filter @kairos/backend check` passou; `pnpm test` passou com 53/53 testes.

**Teste de autorização adicionado:** um membro da equipe com papel `SECRETARY` não pode listar usuários/convites, criar ou revogar convite, alterar papel, suspender ou remover acesso.

**Bloqueio restante:** falta fornecer `SMTP_PASSWORD` no gerenciador de segredos, executar `pnpm --filter @kairos/backend email:verify --to <caixa-externa>` e concluir um aceite pelo link recebido. O MCP confirmou domínio e DNS, mas não fornece a senha da caixa. A matriz dos demais módulos foi concluída no P0-6.

### P1-3: tornar relatórios acionáveis - CONCLUÍDO em 05/09/2026

**Status:** o relatório permite selecionar últimos 30 dias, últimos 90 dias, ano atual ou todo o histórico. A API filtra eventos e confirmações pelo período e devolve o intervalo usado; membros e grupos são explicitamente apresentados como estoque atual. A interface exporta o resumo em CSV, oferece atalhos para Membros, Grupos e Eventos e mostra estados de carregamento, erro e ausência de participações.

**Arquivos modificados:** `backend/src/schemas/reports.ts`, `backend/src/routes/reports/index.ts`, `backend/src/__tests__/api.test.ts`, `backend/swagger.json`, `frontend/src/app/(app)/reports/page.tsx`, chamadas do relatório no dashboard e cliente Orval em `frontend/src/lib/api/generated`.

**Comandos e resultados:** backend build/check passaram; `pnpm test` passou com 54/54 testes; cliente Orval regenerado; frontend typecheck e lint passaram; build de produção passou e gerou `/reports`. O único aviso foi a base Browserslist desatualizada já registrada.

**Testes de aceite:** período padrão é 90 dias; a consulta de 30 dias informa datas; “todo o histórico” informa intervalo nulo e inclui um evento antigo excluído do período recente. A exportação usa o utilitário CSV já exercitado pelo módulo de membros e todos os indicadores exportados vêm da resposta da API.

**Bloqueios restantes:** nenhum para esta tarefa. O P0-6 restringe Relatórios a Administrador e Pastor.

### P1-4: finalizar calendário - CONCLUÍDO em 05/09/2026

**Status:** eventos recorrentes agora persistem data final e uma lista de exceções. O formulário exige término para novas séries e permite informar datas sem encontro. O calendário respeita esses campos, limita séries legadas sem término a 12 meses e possui um limite defensivo de iterações. Em telas menores que `md`, a grade foi substituída por uma agenda vertical; a largura mínima de 760 px foi removida. Carregamento, erro e mês vazio têm estados próprios.

**Arquivos modificados:** `backend/prisma/schema.prisma`, migration `backend/prisma/migrations/202609050005_event_recurrence/migration.sql`, schemas e rotas de eventos, testes, Swagger, `frontend/src/features/events/components/event-drawer/form.tsx`, `schema.ts`, `frontend/src/app/(app)/calendar/page.tsx` e cliente Orval gerado.

**Comandos e resultados:** Prisma format/validate/generate passaram; backend build/check passaram; `pnpm test` passou com 54/54 testes; Orval regenerou o cliente; frontend typecheck, lint e build passaram. Foi criado o backup `backend/backups/kairos-2026-09-05T23-37-50-538Z.db`, a migration aditiva foi aplicada ao `dev.db` e as cinco migrations foram reaplicadas com sucesso em um banco temporário vazio, depois removido. Uma tentativa de remover o banco temporário com `pnpm exec rimraf` na raiz não encontrou o binário; a repetição a partir do pacote backend removeu os dois artefatos. O build repetiu apenas os avisos conhecidos de Browserslist e encerramento recuperado do compilador edge.

**Testes de aceite:** criação de evento semanal persiste e devolve o término e a exceção em formato ISO; o frontend só envia séries novas com término; o cálculo ignora exceções, não ultrapassa o fim e não pode entrar em loop ilimitado; a página não contém mais `min-w-[760px]` e renderiza lista móvel navegável.

**Bloqueios restantes:** nenhum para esta tarefa. O processamento de lembretes continua P2 e não foi implementado.

### P1-5: fortalecer finanças - CONCLUÍDO em 05/09/2026

**Status:** criação e edição permanecem em modal shadcn compacto. O formulário oferece categorias comuns sem impedir categorias próprias, valida erros em uma região anunciada, e a listagem permite filtrar pelas categorias realmente usadas. Os lançamentos filtrados podem ser exportados em CSV. `window.confirm` foi substituído por `AlertDialog`. Criação e alteração registram ID/nome do responsável; remoção passou a ser lógica, preservando data e responsável no banco e retirando o lançamento de listas e totais.

**Arquivos modificados:** `backend/prisma/schema.prisma`, migration `backend/prisma/migrations/202609050006_finance_audit/migration.sql`, `backend/src/schemas/finance.ts`, `backend/src/routes/finance/index.ts`, testes, Swagger, `frontend/src/app/(app)/finance/page.tsx` e cliente Orval gerado.

**Comandos e resultados:** Prisma format/validate/generate, backend check/build passaram; `pnpm test` passou com 55/55 testes; Orval regenerou o cliente; frontend typecheck, lint e build passaram. Backup local criado em `backend/backups/kairos-2026-09-05T23-45-09-106Z.db`; a sexta migration foi aplicada ao `dev.db` e todas as seis migrations foram reaplicadas em banco temporário vazio, removido depois do ensaio. O build emitiu apenas os avisos conhecidos de Browserslist e do compilador edge recuperado.

**Testes de aceite:** a API devolve categorias; criação e edição persistem autor; a exclusão preserva `deletedAt`, `deletedById` e `deletedByName`, enquanto uma nova listagem não devolve o item e não o inclui nos totais. A interface usa componentes shadcn para modal, selects e confirmação e exporta somente os registros do filtro atual.

**Bloqueios restantes:** nenhum técnico para esta tarefa. O P0-6 permite leitura ao Administrador e Pastor e alteração somente ao Administrador.

### P1-6: cobrir upload e dependências externas - IMPLEMENTADO LOCALMENTE, CLOUDINARY PENDENTE

**Status:** o formulário de membro deixou de salvar imagens como `data:` e agora envia a foto otimizada para a API. Cliente e servidor aceitam somente JPG, PNG e WebP de até 5 MB. A interface mostra envio e falha em uma região acessível, permite câmera em `Dialog` shadcn e só limpa o campo após a remoção remota responder com sucesso. O backend lê o Cloudinary pela configuração validada, responde `503 IMAGE_STORAGE_UNAVAILABLE` quando as três credenciais não existem e separa arquivos em `kairos/{rede}/{igreja}/members`. A exclusão rejeita qualquer `publicId` fora da Rede e da igreja ativas.

**Arquivos modificados:** `backend/.env.example`, `backend/src/schemas/config.ts`, `backend/src/config/env.ts`, `backend/src/lib/cloudinary.ts`, `backend/src/routes/uploads/index.ts`, `backend/src/routes/uploads/upload.ts`, `backend/src/routes/uploads/delete.ts`, `backend/src/__tests__/api.test.ts`, `backend/swagger.json`, `docker-compose.yml`, `frontend/src/components/ui/image-upload.tsx`, `frontend/src/features/members/components/member-form/form.tsx`, `frontend/next.config.js`, `README.md` e `docs/production.md`.

**Comandos e resultados:** backend check e build passaram; a suíte completa passou com 59/59 testes; frontend typecheck, lint e build de produção passaram; `docker compose config --quiet` passou com segredos fictícios de validação. O build repetiu somente os avisos já conhecidos de Browserslist desatualizado e encerramento recuperado do compilador edge.

**Testes de aceite:** arquivo com MIME não permitido retorna `400 INVALID_IMAGE_TYPE`; imagem válida sem as credenciais retorna `503 IMAGE_STORAGE_UNAVAILABLE`; imagem acima de 5 MB retorna `413 IMAGE_TOO_LARGE`; tentativa de excluir um identificador de outra Rede retorna 400 antes de chamar o provedor. O manual de produção documenta as três variáveis, o modo degradado, limites, caminho por tenant e o smoke de envio/remoção.

**Bloqueio restante:** o workspace não possui credenciais Cloudinary. Por isso, criação e exclusão reais no provedor ainda precisam ser comprovadas em staging seguindo `docs/production.md`. Essa pendência não impede cadastros sem foto, mas impede declarar o recurso de fotos integralmente validado.

### P1-7: criar testes de frontend/E2E - CONCLUÍDO em 05/09/2026

**Status:** Playwright foi adicionado ao monorepo e ao CI. Cada execução sobe frontend em 3012 e backend em 3341, recria apenas `backend/prisma/e2e.db` com `prisma migrate reset` e não usa seed. Um cenário serial percorre setup, logout voluntário, login, criação e leitura de membro, grupo e evento, convite/aceite de usuário comum, ausência do link administrativo, resposta 403 ao tentar listar a equipe e logout final. As operações completas de atualização e exclusão continuam cobertas pela suíte de API.

**Arquivos modificados:** `package.json`, `pnpm-lock.yaml`, `playwright.config.ts`, `e2e/core-flow.spec.ts`, `.github/workflows/ci.yml`, `.gitignore`, `README.md`, migration `backend/prisma/migrations/202609050007_remove_empty_legacy_organization/migration.sql`, `frontend/src/app/(auth)/setup/page.tsx`, `frontend/src/lib/stores/auth-store.ts`, `frontend/src/hooks/use-auth.ts`, `frontend/src/lib/api/axios-instance.ts`, formulário/schema de membro, formulário/hook de grupo e este documento.

**Comandos e resultados:** a primeira instalação de Playwright não alterou arquivos porque o pnpm detectou store incompatível; a repetição com `--store-dir C:\Users\lchen\AppData\Local\pnpm\store\v11` instalou `@playwright/test`. `pnpm exec playwright install chromium` passou. O E2E final passou com 1/1 cenário em 27,2 s. `pnpm lint` passou em ambos os pacotes; a primeira execução geral de typecheck encontrou a assinatura não adaptada de `mutateAsync` na edição de grupo, corrigida no hook; na repetição, typecheck, 59/59 testes da API e builds de backend/frontend passaram. O build manteve apenas os avisos conhecidos de Browserslist e compilador edge recuperado.

**Falhas reais encontradas e corrigidas pelo E2E:** migration deixava uma Rede sentinela em banco vazio e bloqueava o setup; rótulos “Nome da Rede” e “Igreja sede” apontavam para `div` em vez dos inputs; navegação do setup tinha um refresh redundante; logout voluntário era classificado como sessão expirada; membro sem e-mail não podia ser salvo apesar de o campo ser opcional; grupo sem horários enviava strings vazias inválidas e fechava o drawer antes de confirmar sucesso.

**Critério de aceite verificado:** ambiente limpo e reproduzível; setup e login reais; registros principais visíveis após criação; usuário comum sem ação administrativa e com 403 da API; dois logouts concluídos sem falso aviso de expiração. Traces, vídeo e screenshot ficam retidos automaticamente apenas quando há falha; relatórios locais são ignorados pelo Git.

**Bloqueios restantes:** nenhum para esta tarefa. A matriz completa dos papéis foi adicionada ao mesmo cenário E2E e à suíte de API no P0-6.

### P1-8: fazer revisão visual e acessível - VALIDADO AUTOMATICAMENTE, QA MANUAL PENDENTE

**Status:** a suíte E2E agora audita Dashboard, Membros, Grupos, Eventos, Calendário, Relatórios, Financeiro, Configurações e Portal em 1280 x 720 e 390 x 844. O Dashboard também é verificado no tema oposto e o Login após logout. A auditoria usa Axe com WCAG 2 A/AA e WCAG 2.1 A/AA, bloqueia impactos críticos ou sérios, verifica overflow horizontal e preserva capturas do Dashboard desktop e Calendário mobile. O fluxo por teclado comprova que o primeiro Tab alcança o link de salto e que Enter move o foco para o conteúdo principal.

**Correções realizadas:** contraste do e-mail na sidebar e do card inverso do Dashboard; nomes acessíveis para filtros, alternância de visualização e paginação; cabeçalhos não ordenáveis deixaram de ser botões vazios; badge de sucesso recebeu contraste AA; rótulo do Portal passou a usar a cor inversa correta; cabeçalho de Eventos tornou-se responsivo. Durante a matriz, foi descoberto que o rate limit podia fazer o middleware interpretar `429` como token inválido e apagar o cookie. O middleware agora invalida a sessão somente em `401/403`, preservando-a em indisponibilidade transitória; o ambiente `test` usa teto maior para não distorcer a auditoria.

**Arquivos modificados:** `package.json`, `pnpm-lock.yaml`, `playwright.config.ts`, `e2e/core-flow.spec.ts`, `backend/src/server.ts`, `frontend/src/middleware.ts`, `frontend/src/components/layout/profile-section.tsx`, `frontend/src/app/(app)/dashboard/page.tsx`, `frontend/src/features/members/components/member-list/filters.tsx`, `frontend/src/features/members/components/member-list/page-size-selector.tsx`, `frontend/src/components/ui/data-table.tsx`, `frontend/src/components/ui/pagination-with-info.tsx`, `frontend/src/components/ui/badge.tsx`, `frontend/src/features/events/components/event-list/header.tsx` e `frontend/src/app/(app)/portal/page.tsx`.

**Comandos e resultados:** `@axe-core/playwright` foi instalado com o store pnpm do workspace. Execuções intermediárias localizaram os controles sem nome, três contrastes insuficientes, o overflow de Eventos e o falso logout. O cenário focado em Eventos passou com 1/1 teste em 56,3 s. Após a matriz de permissões, a execução integral final passou com 1/1 teste em 2,5 min. `pnpm lint`, `pnpm typecheck`, `pnpm test` com 60/60 casos e `pnpm build` também passaram. O build mostrou apenas o aviso conhecido da base Browserslist desatualizada.

**Critério de aceite verificado:** nenhuma violação Axe crítica/séria nas rotas auditadas; nenhum overflow da página nos viewports cobertos; foco por teclado e skip link funcionais; estados claro/escuro do Dashboard auditados; componentes interativos corrigidos no shadcn local; capturas visuais geradas após as animações.

**Bloqueio restante:** Axe e a árvore de acessibilidade não substituem uso por uma pessoa com leitor de tela nem teste em dispositivo físico. NVDA/VoiceOver, zoom de 200% e navegadores móveis reais exigem QA humano de staging antes do lançamento comercial. Nenhuma falha bloqueante conhecida permaneceu na validação automatizada.

### P1-9: melhorar operação do servidor - CONCLUÍDO em 05/09/2026

**Status:** importar `server.ts`/`dist/server.js` não inicia mais a escuta. O módulo exporta início, parada e tratamento de sinal; `SIGINT` e `SIGTERM` fecham Fastify e desconectam Prisma antes do processo terminar. Toda requisição recebe UUID de correlação ou reutiliza um `X-Request-Id` seguro enviado pelo cliente, devolvendo-o na resposta e expondo-o via CORS. O health check continua consultando o banco, responde 503 em degradação e agora registra a falha com o mesmo identificador da requisição.

**Arquivos modificados:** `backend/src/server.ts`, `backend/src/routes/system/health.ts`, `backend/src/__tests__/api.test.ts`, `backend/scripts/test-server-lifecycle.mjs`, `backend/package.json`, `docs/production.md` e este documento.

**Comandos e resultados:** `pnpm --filter @kairos/backend check` e build passaram. `pnpm --filter @kairos/backend test:lifecycle` confirmou que a importação não abre porta, `startServer` escuta em 3336, `/health` responde 200, `X-Request-Id: lifecycle-test` aparece no log e na resposta, e `handleShutdown('SIGTERM')` fecha a porta e registra o encerramento seguro. A suíte da API passou com 59/59 testes e confirmou também a propagação de `health-api-test` no health check. `git diff --check` não encontrou erro de whitespace; exibiu apenas os avisos já existentes de conversão LF/CRLF no Windows.

**Critério de aceite verificado:** importação sem efeito colateral de rede; início explícito; tratamento de SIGTERM exercitado; Fastify e Prisma encerrados; porta fechada após shutdown; logs e respostas correlacionados; falha do banco produz 503 seguro e log observável.

**Bloqueios restantes:** nenhum para o ciclo de vida local. O envio dos logs para um agregador, alertas externos e a janela de término do orquestrador ainda dependem da infraestrutura de staging e permanecem como itens operacionais do checklist, não como defeitos do servidor.

### P1-10: preparar banco e backup - VALIDADO LOCALMENTE, INFRA PENDENTE

**Status:** o caminho local e o artefato de deploy estão preparados. O Compose executa `prisma migrate deploy` em serviço one-shot antes do backend, usa volume persistente para o SQLite e não executa `db push` em produção. Backup e restore possuem comandos próprios; o restore exige `--force`, valida o cabeçalho SQLite e salva uma cópia pré-restore. O manual descreve parada para consistência, retenção externa e rollback para banco e imagem anteriores.

**Arquivos modificados nesta tarefa:** somente `LAUNCH_READINESS.md`. A implementação já estava em `docker-compose.yml`, `backend/package.json`, `backend/scripts/backup-db.mjs`, `backend/scripts/restore-db.mjs`, `backend/prisma/migrations` e `docs/production.md` por causa do P0-8.

**Comandos e resultados:** `prisma migrate deploy` criou um SQLite isolado e aplicou as sete migrations em ordem. O primeiro comando de massa falhou antes do backup porque o registro de teste omitiu o campo obrigatório `Organization.slug`; ele foi corrigido sem mudança no produto. Na repetição, foi criado o valor “Antes do backup”, gerado o backup, alterado para “Depois do backup”, executado o restore com cópia de segurança e confirmado “Antes do backup”. Os três artefatos temporários foram verificados dentro do workspace e removidos. `docker compose config --quiet` passou com valores fictícios de validação. `docker info` confirmou que o daemon Docker continua desligado (`dockerDesktopLinuxEngine` ausente), portanto o build e a subida reais da pilha não puderam ser repetidos localmente.

**Critério de aceite verificado:** migrations reproduzíveis em banco vazio; Compose ordena migration antes da API; backup e restore funcionais em SQLite isolado; cópia pré-restore; rollback documentado; nenhum banco real ou arquivo de ambiente alterado.

**Bloqueios restantes:** configurar job diário, criptografia, retenção e armazenamento fora do servidor; executar o restore em staging no volume final; validar as imagens e a migration com Docker/CI ativo; designar responsável pelo backup. Esses itens exigem a infraestrutura de hospedagem e impedem marcar a operação como integralmente pronta para produção, embora a implementação local esteja concluída.

### P1-11: alinhar ambientes e documentação - VALIDADO LOCALMENTE, STAGING PENDENTE

**Status:** desenvolvimento, testes de API, E2E, Docker local e produção possuem uma matriz explícita de portas, URLs e bancos. O backend local usa `http://localhost:3001` como `FRONTEND_URL` padrão, igual ao script real do Next; o Compose publica frontend em 3000 e backend em 3333, mas exige que as duas URLs públicas sejam informadas. O README informa Node 20 LTS, pnpm 11.15.1/Corepack, cópia dos dois exemplos de ambiente, início conjunto ou separado, opção Turbopack, portas, E2E isolado, seed exclusivamente demo e comandos Docker para Bash e PowerShell. O destino foi confirmado como Coolify `4.3.14`; o projeto `Kairos / production` foi criado e os domínios públicos foram aprovados e resolvidos. Existe validação CI, mas deploy automatizado ainda não existe.

**Arquivos modificados:** `backend/src/config/env.ts`, `backend/.env.example`, `backend/src/lib/mailer.ts`, `backend/scripts/verify-email.mjs`, `backend/package.json`, `docker-compose.yml`, `README.md`, `docs/production.md` e este documento. Nenhum `.env` real foi exibido ou alterado.

**Comandos e resultados:** backend check e build passaram; a suíte completa da API passou com 60/60 testes, incluindo CORS da origem 3001. `pnpm install --frozen-lockfile --offline` sem store explícito recusou trocar `node_modules` por não haver TTY e não alterou dependências; a repetição com `--store-dir C:\Users\lchen\AppData\Local\pnpm\store\v11` passou, confirmou o lockfile atualizado e não instalou nada. `docker compose config --quiet` passou com valores descartáveis depois que as URLs públicas se tornaram obrigatórias. O endpoint do Coolify respondeu 302 para o login; a conta Hostinger não apresentou hospedagem web ativa.

**Critério de aceite verificado:** gerenciador e versão declarados; arquivos de exemplo dos dois serviços; URLs e portas coerentes por ambiente; CORS local testado; seed e migrations diferenciados por finalidade; comandos de desenvolvimento, validação, produção, backup e restore documentados; instruções compatíveis com PowerShell.

**Bloqueios restantes:** publicar a versão lançável no repositório sem violar a proibição atual de commit; então criar o recurso Docker Compose e preencher `FRONTEND_URL=https://kairos.codebycarlos.dev`, `NEXT_PUBLIC_API_URL=https://api.kairos.codebycarlos.dev`, `API_INTERNAL_URL=http://backend:3333` e `COOKIE_DOMAIN=.codebycarlos.dev`. Depois é necessário executar migration/smoke e definir o pipeline de publicação. Criar o recurso agora faria o Coolify carregar o commit remoto antigo, que não contém os artefatos atuais de implantação.

## Melhorias P2 para depois

- Central de notificações e lembretes reais.
- Portal independente para membros e acesso por convite ou token.
- Importação em massa, histórico de grupos e acompanhamento pastoral aprofundado.
- Relatórios configuráveis, metas e dashboards por papel.
- Fluxo financeiro avançado, aprovação e conciliação.
- Cobrança recorrente, planos, limites e faturamento.
- Otimização de imagens, atualização do Browserslist e ajustes de performance após métricas reais.
- PostgreSQL e escalabilidade horizontal, se o beta confirmar necessidade.

## Bugs, riscos e pendências

- Recuperação e convite dependem da credencial SMTP de staging para comprovar entrega real.
- O seed usa credencial administrativa conhecida apenas no ambiente demo e agora é bloqueado em produção.
- O token de sessão passou para cookie HttpOnly/Secure/SameSite definido pelo backend e não é mais exposto no JSON ou estado do frontend.
- JWT de sete dias não tem refresh ou rotação; revogação por versão já cobre reset, troca de senha, logout, suspensão e remoção de acesso.
- A autorização por recurso e o isolamento por Rede/unidade estão implementados; falta monitorar tentativas 403 e regressões de política em produção.
- O Líder possui leitura geral de grupos/eventos na V1. O vínculo com “grupos próprios” foi adiado e deve ser tratado como P2 antes de ampliar suas mutações.
- O Portal é a página inicial de Líder e Usuário, mas ainda não oferece experiência independente, preferências pessoais ou dados vinculados à identidade do membro.
- Notificações e lembretes não têm processamento de entrega.
- Cloudinary exige configuração externa não contemplada no onboarding.
- O DMARC atual está em política `p=none`, adequada para observação inicial, mas sem quarentena/rejeição de mensagens que falhem autenticação; endurecer a política exige primeiro validar todos os remetentes legítimos.
- CI está configurado para lint, typecheck, API, build e E2E, mas não publica, não executa migrações de staging e não faz scan de dependências.
- Docker usa `prisma migrate deploy` em serviço one-shot e as migrations deixaram de ser ignoradas pelo Git; falta validar a imagem com o daemon ativo.
- Backup e restauração passaram em banco local isolado e o rollback foi documentado; staging, armazenamento externo, monitoramento e alertas ainda precisam de evidência.
- O build passou e registrou somente o aviso de base do Browserslist desatualizada em aproximadamente 22 meses.
- O worktree já estava com muitos arquivos modificados e não foi limpo para preservar o trabalho existente.

## Segurança, autenticação e permissões

### Pontos positivos observados

- Senhas passam por bcrypt.
- Há helmet, rate limit global e CORS configurável.
- A sessão usa cookie HttpOnly, Secure em produção e SameSite Lax; o JWT não é exposto ao JavaScript.
- Mutações por cookie exigem um cabeçalho anti-CSRF aceito somente pelas origens CORS configuradas.
- A matriz aprovada está centralizada por permissão e aplicada nas rotas, no middleware e nos controles da interface.
- Queries e mutações operacionais têm escopo de Rede/unidade e testes negativos entre tenants.
- O ambiente de produção rejeita segredo JWT ausente, conhecido ou com menos de 32 caracteres.
- Reset, troca de senha, logout, suspensão e remoção de acesso revogam sessões anteriores.

### Pendências de alto risco

- O envio SMTP real da recuperação ainda depende de segredo e validação em staging; o fluxo local, expiração e uso único estão cobertos.
- Segredos finais, domínio do cookie, origens CORS e URLs públicas ainda precisam ser cadastrados e validados na hospedagem.
- Gestão da equipe cobre convite, expiração, autor, suspensão, revogação e preservação do último administrador, mas falta exercitar a entrega SMTP real.
- Cloudinary ainda não foi exercitado com credenciais reais; o isolamento do identificador por tenant foi validado localmente.
- Backup, restore, alertas e retenção de logs ainda não foram exercitados na infraestrutura final.
- Rotação transparente/refresh de JWT não faz parte da política atual. A sessão expira em sete dias e pode ser revogada por versão.

## UX, responsividade e acessibilidade

- Os módulos protegidos e o Login passaram por Axe WCAG A/AA, verificação de overflow em 1280 x 720 e 390 x 844, foco por teclado e troca de tema no Dashboard.
- O calendário usa uma agenda própria no mobile e não apresentou overflow na matriz automatizada.
- O projeto usa componentes locais baseados em shadcn; ações condicionais por papel foram ocultadas sem remover os guardas da API.
- A landing não entrou na matriz Axe final e não existe regressão visual por comparação de pixels para todos os estados de tema e hover.
- A recuperação de senha possui páginas públicas; falta validação visual e entrega SMTP em staging.
- O Portal é o destino padrão de Líder e Usuário, mas ainda exige o mesmo login e shell do painel.
- O botão de notificações exibe contagem estática e não possui fluxo de leitura.
- Estados vazios, falhas de API e carregamentos existem nos módulos principais, mas nem todas as combinações foram exercitadas pelo E2E.
- Finanças usa `Dialog`/`AlertDialog` shadcn para cadastro, edição e exclusão.
- Ainda falta QA humano com NVDA ou VoiceOver, zoom a 200%, dispositivos físicos e navegadores móveis reais.

## Build, deploy, ambiente e observabilidade

- Scripts principais estão definidos no `package.json` raiz e nos manifests de `backend` e `frontend`.
- `.github/workflows/ci.yml` executa install congelado, lint, typecheck, testes de API, build e E2E em Node 20, mas não faz deploy, migration/smoke em staging ou verificação de segurança.
- `docker-compose.yml` expõe backend em 3333 e frontend em 3000; o desenvolvimento local usa frontend em 3001. CORS de desenvolvimento cobre as duas portas, e o Compose exige `FRONTEND_URL` e `NEXT_PUBLIC_API_URL` explícitos.
- SQLite com volume Docker é adequado apenas para um escopo pequeno e uma estratégia operacional simples; não há evidência de comportamento em múltiplas réplicas.
- `backend/src/routes/system/health.ts` e o health check do Docker fornecem uma base de monitoramento, mas não há alerta externo, métricas, tracing ou política de retenção de logs.
- `backend/src/server.ts` trata `SIGINT`/`SIGTERM` e encerra Fastify/Prisma; a janela do orquestrador ainda precisa ser configurada em staging.
- `backend/.env.example` e `frontend/.env.example` documentam as variáveis dos dois serviços; segredos permanecem vazios ou como instrução de substituição.
- `docs/production.md` documenta segredos, build, migrations, backup, restore, rollback, monitoramento e checklist; o restore foi exercitado em banco local isolado, mas não em staging.

## Arquivos e comandos usados como evidência

### Documentação e configuração

- `README.md`, `context.md`, `task.md`, `docs/product-audit-roadmap.md`, `docs/production.md` e `design-system/kairos/MASTER.md`.
- `package.json`, `pnpm-workspace.yaml`, `backend/package.json`, `frontend/package.json`.
- `backend/.env.example`, `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/next.config.js`, `.github/workflows/ci.yml` e `.gitignore`.

### Código inspecionado

- `backend/prisma/schema.prisma` e `backend/prisma/seed.ts`.
- `backend/src/server.ts`, `backend/src/config/env.ts`, `backend/src/routes/auth/*`, `members/*`, `groups/*`, `events/*`, `finance/*`, `reports/*`, `system/*` e `uploads/*`.
- `backend/scripts/test-api.mjs`, `backend/src/__tests__/api.test.ts` e `backend/src/__tests__/setup.ts`.
- `frontend/src/middleware.ts`, `frontend/src/lib/permissions.ts`, layouts, páginas de dashboard, membros, grupos, portal, eventos, calendário, relatórios, finanças e configurações.
- `frontend/src/features/dashboard/*`, `frontend/src/features/events/*`, `frontend/src/features/groups/*`, `frontend/src/features/members/*` e `frontend/src/lib/api/*`.

### Comandos e resultados

| Comando ou verificação | Resultado |
| --- | --- |
| `pnpm --filter @kairos/backend check` | Sucesso; 64 arquivos verificados sem correção |
| `pnpm lint` | Sucesso; sem erro reportado |
| `pnpm typecheck` | Sucesso |
| `pnpm test` | Sucesso; 60/60 testes |
| `pnpm build` | Sucesso; somente aviso de Browserslist registrado acima |
| `pnpm test:e2e` | Sucesso; 1/1 cenário em 2,5 minutos |
| `git diff --check` | Sem erro de whitespace; somente avisos LF/CRLF do Windows |
| MCP Hostinger: domínio/DNS | Domínio ativo; MX, SPF, três DKIM e DMARC presentes |
| MCP Hostinger: hospedagem | Nenhuma ordem ou website ativo para `codebycarlos.dev`; deploy Node não disponível nessa conta |
| `Test-NetConnection smtp.hostinger.com -Port 465` | DNS resolvido e conexão TCP bem-sucedida |
| `pnpm --filter @kairos/backend email:verify` | Script e build executados; bloqueio explícito somente em `SMTP_PASSWORD`, sem envio |
| `curl -I https://coolify.codebycarlos.dev` | 302 para o login do Coolify no servidor atual |
| API autenticada do Coolify | Versão `4.3.14`; um servidor disponível; projeto `Kairos` e ambiente `production` criados |
| Resolução DNS dos domínios finais | Frontend e API resolvem para `129.80.148.195`; nenhum registro novo necessário |
| Comparação Git local/upstream | `HEAD` e upstream no mesmo commit; a versão lançável e o Compose permanecem no working tree, portanto o deploy Git foi corretamente adiado |
| `docker compose config --quiet` com valores descartáveis | Sucesso após tornar as URLs públicas obrigatórias |
| `GET http://localhost:3333/health` | 200 |
| Preflight CORS de `http://localhost:3001` | 204 com origem permitida e credenciais |
| Setup e login administrativo no E2E | Rede, sede e administrador criados em banco vazio; redirecionamento ao Dashboard |
| Matriz de permissões da API | Cinco papéis exercitados; leituras e mutações permitidas/bloqueadas conforme a matriz |
| Rota protegida incompatível no frontend | `USER` redirecionado de `/dashboard` para `/portal` |
| `/setup` sem cookie | Rota pública presente no build; disponibilidade protegida por `GET /auth/setup/status` |
| `/groups/does-not-exist` autenticado | 404 `GROUP_NOT_FOUND`, sem detalhe do Prisma |

Os testes de API usam `backend/prisma/test.db` e porta 3335. O E2E usa `backend/prisma/e2e.db`, backend em 3341 e frontend em 3012. Nenhuma dessas execuções altera o banco de desenvolvimento ou depende do processo que possa estar ocupando 3001/3333.

## Ordem recomendada de execução

1. Definir hospedagem e domínios finais; cadastrar `JWT_SECRET`, SMTP, URLs, CORS e domínio do cookie no gerenciador de segredos.
2. Ligar o daemon/pipeline Docker, construir as imagens e executar `prisma migrate deploy` em staging.
3. Exercitar convite e recuperação por e-mail real, incluindo abertura do link e definição da senha.
4. Configurar Cloudinary e validar envio, leitura e remoção de foto dentro do tenant correto.
5. Configurar backup diário fora do servidor e executar restore completo no volume de staging.
6. Rodar o E2E e um smoke manual em staging com os cinco papéis, conferindo logs e respostas 403.
7. Fazer QA humano com leitor de tela, zoom de 200%, dispositivos reais e os dois temas.
8. Configurar agregação de logs, alertas, plantão, suporte, privacidade, retenção e canal de incidentes.
9. Executar carga mínima, documentar rollback do release e realizar a decisão final de lançamento.

## Checklist final de lançamento

- [x] Modelo single-tenant ou multi-tenant aprovado e refletido no produto.
- [x] `/setup` cria igreja/unidade e administrador em banco vazio.
- [ ] Convite, recuperação, troca, logout e revogação de acesso funcionam.
- [x] Nenhuma rota mock ou credencial demo está publicada; o seed demo é recusado em produção.
- [ ] Segredos vêm de ambiente seguro; seed demo é bloqueado em produção.
- [x] Dados de organizações/unidades ficam isolados por query e por teste negativo.
- [x] Matriz de papéis foi aprovada e aplicada no backend e frontend.
- [x] Dashboard e relatórios exibem apenas dados reais ou rótulos de demonstração explícitos.
- [ ] Membros, grupos, eventos, check-in, calendário e finanças passam pelo fluxo E2E principal.
- [ ] Erros 4xx/5xx têm contrato consistente e mensagens seguras.
- [x] Finanças têm confirmação, auditoria mínima, exportação e backup verificado localmente.
- [ ] Layouts claro/escuro, hover, foco, teclado, contraste e mobile foram revisados.
- [ ] Backup e restauração foram ensaiados em staging.
- [x] Migrações e rollback são reproduzíveis localmente.
- [ ] CI executa lint, typecheck, API, build e E2E; scans de segurança relevantes ainda faltam.
- [ ] Health check, logs, métricas, alertas e responsável de plantão estão definidos.
- [ ] Domínio, CORS, URLs, limites, e-mails e provedores externos estão configurados.
- [ ] Política de privacidade, retenção de dados, termos, suporte e canal de incidentes estão disponíveis.
- [ ] Deploy de produção foi ensaiado e há plano de rollback.

> Revalidação de 11/09/2026: os itens de código e teste locais (Biome com 70 arquivos verificados, backend build exit 0, 60/60 testes de API exercitando o Clerk real, frontend typecheck/lint/build verdes) foram reexecutados e estão verdes. Os itens acima permanecem desmarcados enquanto dependerem de staging, segredos SMTP/Cloudinary, E2E desta rodada e QA humano.

## Conclusão

O Kairos concluiu os P0 e P1 que dependiam somente de código local. Onboarding, multi-tenant, sessão, indicadores reais, permissões, fluxos principais, acessibilidade automatizada e operação local possuem evidência. O próximo passo é operacional: staging, segredos, SMTP, Cloudinary, imagens Docker, backup externo, observabilidade e QA humano. Como ainda há critérios P0 que dependem dessas evidências externas, o veredito para lançamento público permanece **não pronto**; tecnicamente, a aplicação está preparada para iniciar a homologação em staging.

Em 11/09/2026 os itens de código e teste locais foram revalidados com a autenticação já migrada para o Clerk: a suíte de API voltou a 60/60, o backend compilou (exit 0), o Biome verificou 70 arquivos sem correções e o frontend passou typecheck, lint e build. O deploy no Coolify foi concluído e o smoke público respondeu 200 no frontend e no health da API. Os bloqueios externos (SMTP real, Cloudinary, restore em staging, observabilidade e QA humano) continuam abertos, assim como o E2E e o QA manual desta rodada, que não foram executados.
