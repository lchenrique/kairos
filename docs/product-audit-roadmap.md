# Kairos — auditoria do produto e roadmap

Data da auditoria: 04/09/2026

## Diagnóstico executivo

O Kairos já tem uma base sólida para um MVP: autenticação, membros, grupos, eventos, presença/check-in, calendário, financeiro, relatórios e configurações. O principal problema não é falta de telas; é falta de conexão entre os fluxos e de uma primeira experiência que explique o que fazer.

Hoje o sistema parece mais completo no código do que no uso real. Um usuário novo pode entrar em um banco sem dados, ver cards vazios e não descobrir como criar o primeiro evento, como esse evento chega ao calendário, ou como convidar alguém para a equipe.

Há também um bloqueador técnico P0: os 28 testes de API passaram, mas a preparação da suíte apaga a base `backend/prisma/dev.db` e os testes chamam a API na porta de desenvolvimento (`localhost:3333`). Depois da execução, o banco local ficou com apenas `test@example.com` e nenhum membro, grupo, evento ou lançamento financeiro. Testes precisam de uma base e de um servidor isolados antes de qualquer demonstração ou publicação.

## Como o produto funciona hoje

### Conceitos que precisam ficar explícitos

| Conceito | O que é hoje | Decisão de produto |
| --- | --- | --- |
| Membro | Pessoa da congregação cadastrada no módulo Membros | Continua sendo o cadastro pastoral/operacional |
| Equipe | Usuários que possuem acesso ao sistema, na tabela `User` | Separar visualmente de Membros e permitir convite |
| Encontro | Registro de Evento (culto, célula, ministério ou outro) | Usar “Evento” como nome técnico e “Encontro” como linguagem do portal |
| Calendário | Outra visualização dos mesmos Eventos | Todo item deve abrir o detalhe do evento |
| Relatório | Leitura agregada dos dados de membros, grupos e eventos | Não cadastra dados; deve apontar para a origem e permitir análise |

## Modelo recomendado para igrejas-sede e congregações

O cadastro deve usar dois níveis:

1. **Rede/Organização:** a conta que assina o Kairos, define o plano, administra cobrança e pode enxergar indicadores consolidados.
2. **Igreja/Unidade:** a sede, congregação, campo ou campus que possui seus próprios membros, grupos, eventos, presença e lançamentos financeiros.

“Filial” pode ser entendido, mas para igrejas os termos mais naturais são “congregação”, “unidade”, “campo” ou “campus”. A interface pode usar “Igrejas e unidades” para ser clara a diferentes denominações.

### Experiência esperada

- No primeiro acesso, o usuário cria a Rede e automaticamente a primeira unidade, marcada como sede.
- Em **Configurações → Igrejas e unidades**, um administrador adiciona as demais congregações, com nome, endereço, timezone, responsável e status.
- Um seletor persistente na barra lateral alterna entre “Todas as unidades” e uma unidade específica.
- A visão “Todas as unidades” consolida membros, eventos, presença e indicadores; o financeiro continua separado por unidade, com consolidação explícita para evitar confusão de caixa.
- Usuários centrais recebem escopo da Rede; pastores, líderes e secretários podem ficar restritos a uma ou mais unidades.
- Cada registro operacional recebe `churchId`/`unitId`. Nenhuma consulta pode retornar dados de outra unidade apenas porque o usuário conhece o ID.

### Modelo técnico alvo

`Organization → Church/Unit → (Member, Group, Event, FinanceEntry, Setting)`

Usuários devem ter uma relação de associação, como `OrganizationUser` ou `ChurchUser`, contendo papel e escopo. O papel global (proprietário/administrador da Rede) não deve ser confundido com o papel local (pastor/líder/secretário da unidade). Eventos de toda a Rede podem ser representados por uma unidade “Rede” ou por um escopo explícito, sem tornar `churchId` opcional em todas as entidades.

### Migração do MVP atual

Antes de vender o modo multi-unidade, criar uma organização padrão, transformar a atual `Church` singleton na primeira unidade e preencher o vínculo de todos os registros existentes para ela. A migração deve ter backup, verificação de contagens e testes de isolamento. Não se deve reutilizar o ID `default` como solução definitiva de multi-tenancy.

### Mapa de módulos

| Módulo | Estado real | O que manter | Ajuste prioritário |
| --- | --- | --- | --- |
| Dashboard | Parcialmente útil | Indicadores, aniversariantes e próximos eventos | Corrigir “Ver agenda”, reduzir sensação de vazio e adicionar ações para o primeiro cadastro |
| Membros | Bom MVP | CRUD, filtros, tabela/grid, CSV, aniversariantes | Ordenação, importação, histórico e estados vazios guiados |
| Grupos | Bom MVP | CRUD e associação de membros/líderes | Histórico de participação, escopo do líder e atalhos para criar encontro |
| Eventos | Funcional, porém fragmentado | CRUD, filtros, participantes e check-in | Unificar com calendário, participantes no fluxo de criação e recorrência com fim/edição |
| Portal | Visualmente bom, semanticamente ambíguo | Próximos encontros e atalhos | Explicar que encontros são eventos, corrigir atalho de check-in e permitir abrir o evento |
| Calendário | Visualização básica | Mês e recorrência semanal/mensal | Eventos clicáveis, lista do dia, estados vazios e filtros por tipo/status |
| Relatórios | Apenas leitura agregada | Indicadores de membros e presença | Período, comparação, drill-down, exportação e links para a origem |
| Financeiro | Ledger básico funcional | Entradas, saídas, saldo e proteção por perfil | Formulário em modal, edição, filtros por período/tipo e categorias consistentes |
| Configurações | Igreja + troca de perfil | Identidade e preferências | Onboarding, convite/revogação de equipe e vínculo opcional com membro |
| Comunicação | Ausente | — | Adiar SMS/push; começar por notificações de eventos e e-mail/WhatsApp transacional |

## Fluxos essenciais que devem funcionar de ponta a ponta

### Fluxo operacional principal

`Cadastrar membro → associar a grupo → criar evento → adicionar participantes → registrar presença → consultar relatório`

Critério: cada etapa deve ter um próximo passo visível. Ao criar um evento, o usuário deve poder adicionar participantes imediatamente; ao abrir o calendário, o evento deve levar ao detalhe/check-in; o relatório deve levar de volta aos eventos ou membros que originaram o número.

### Fluxo de primeiro acesso

`Criar igreja → criar administrador → cadastrar 3 membros → criar grupo → criar primeiro encontro → convidar equipe`

Esse fluxo deve ser assistido por um checklist de onboarding e por uma base de demonstração opcional. Um banco novo não pode parecer quebrado apenas porque está vazio.

### Fluxo financeiro

`Abrir Financeiro → Novo lançamento (modal) → validar valor/categoria/data → salvar → atualizar saldo e relatório`

O formulário deve ficar em um `Dialog` do shadcn/ui. A página permanece compacta, com resumo, filtros e tabela; edição usa o mesmo modal.

### Fluxo de equipe

`Configurações → Equipe → Convidar pessoa → definir papel → convite pendente → aceitar → (opcional) vincular a um membro`

Equipe não deve depender de existir um registro em Membros. São identidades diferentes: uma pessoa pode operar o sistema sem ser membro cadastrado, e um membro pode existir sem login.

## Escopo recomendado

### Manter e tornar confiável

- Membros, grupos, eventos, presença/check-in, calendário, financeiro básico e relatórios.
- Sidebar, tema, PageHeader compacto e animações sequenciais já aprovadas visualmente.
- API tipada, validações, proteção por papel e componentes shadcn/ui.

### Ajustar agora

- Isolar testes da base de desenvolvimento e adicionar testes ao CI.
- Criar seed de demonstração idempotente com igreja, administrador, membros, grupos, eventos, participantes e lançamentos.
- Corrigir links quebrados e atalhos: “Ver agenda” deve abrir Eventos/Calendário; “Check-in” deve abrir a seleção de eventos ou o detalhe do evento.
- Tornar o calendário uma navegação real: clique no evento, detalhe lateral/modal, link para presença e lista de eventos do dia.
- Trocar o cadastro financeiro inline por modal e adicionar edição/filtros.
- Criar convite, ativação, troca de papel, revogação e desativação de usuários da equipe.
- Melhorar estados vazios com ações: “Criar primeiro evento”, “Cadastrar primeiro membro”, “Adicionar lançamento”.
- Renomear e explicar a relação entre Portal, Encontros e Eventos.

### Adiar ou descartar do MVP

- SMS, push e automações complexas antes de validar e-mail/WhatsApp transacional.
- Contabilidade completa, conciliação bancária, centros de custo e aprovação multinível.
- Feed social público, gamificação e gráficos decorativos sem decisão operacional associada.
- Um cadastro genérico de configurações sem caso de uso claro.

## Roadmap por fases

### P0 — Fundamentos e confiabilidade

1. Separar servidor/base de testes da execução local; proibir qualquer teste de integração contra `3333`/`dev.db`.
2. Adicionar `pnpm test` ao CI e documentar comandos seguros de desenvolvimento, demonstração e produção.
3. Criar seed/demo idempotente e uma ação clara para restaurar dados de demonstração.
4. Corrigir links quebrados, textos ambíguos e atalhos de eventos/calendário.
5. Padronizar estados de carregamento, erro e vazio com CTA contextual.
6. Definir matriz de permissões por papel no backend, não apenas na navegação.

**Aceite P0:** uma pessoa nova consegue entrar, entender o produto, criar um membro e um evento, ver o evento no calendário e executar um check-in sem suporte manual; rodar testes não altera dados locais.

### P1 — Operação diária da igreja

1. Calendário conectado ao detalhe do evento, com lista do dia e filtros.
2. Criação/edição de evento com participantes, recorrência com data final e exceções básicas.
3. Financeiro em modal shadcn, com editar, filtros de período/tipo, categorias e exportação CSV.
4. Equipe com convite por e-mail/link, status pendente, revogação, desativação e proteção contra remoção do último administrador.
5. Relatórios com período, comparação, exportação e links para membros/eventos.
6. Checklist de onboarding e configuração inicial da igreja.

**Aceite P1:** o administrador consegue operar a semana inteira (agenda, presença, equipe e caixa) sem recorrer a rotas escondidas ou editar banco.

### P2 — Engajamento e automação

1. Portal de membros com acesso público/tokenizado, confirmação de presença e histórico pessoal.
2. Lembretes reais de evento e confirmações por e-mail; validar WhatsApp antes de investir em SMS/push.
3. Histórico de participação por grupo e membro, aniversários acionáveis e modelos de comunicação.
4. Importação de membros por CSV com pré-visualização, validação e relatório de erros.

### P3 — SaaS comercial

1. Criar `Organization`/Rede e `Church`/Unit, com primeira unidade criada no onboarding.
2. Adicionar contexto de unidade e `churchId` a User, Member, Group, Event, FinanceEntry e Setting; aplicar isolamento no backend.
3. Criar seletor de unidade, cadastro de congregações e visão consolidada com filtros de origem.
4. Migrar SQLite para PostgreSQL em staging/produção, com backups, restauração testada e observabilidade.
5. Convites e permissões com escopo por igreja/campus; auditoria, soft delete e exportação/retensão de dados.
6. Assinaturas, período de teste, limites por plano, cobrança e portal do cliente.
7. LGPD: consentimento, finalidade, exportação, exclusão e política de privacidade.

## Modelo comercial inicial

Validar preço com igrejas antes de fixar valores. A divisão de valor pode ser:

- **Essencial:** membros, grupos, eventos, calendário e presença; uma igreja e equipe pequena.
- **Gestão:** tudo do Essencial + financeiro, relatórios, automações, portal e mais usuários.
- **Rede/Enterprise:** múltiplos campi, permissões avançadas, auditoria, integrações, suporte e SLA.

O produto completo também pode ser vendido como implantação/licença, mas o código atual não está pronto para instalação multi-tenant: a tabela `Church` é singleton e as entidades não possuem `churchId`. Essa decisão deve ser tomada antes de vender como SaaS.

## Métricas de sucesso

- Primeiro setup concluído em menos de 10 minutos.
- Criar evento e encontrá-lo no calendário em menos de 2 minutos.
- Registrar um lançamento financeiro em menos de 30 segundos.
- Convidar um membro da equipe sem compartilhar senha.
- Pelo menos um fluxo operacional completo por semana: evento criado → presença registrada → relatório consultado.
- Zero testes alterando a base de desenvolvimento.

## Próxima execução recomendada

Executar P0 em uma sequência curta: isolamento dos testes, seed/demo, correção de navegação e estados vazios. Em seguida, implementar P1 começando pelo calendário conectado aos eventos, pelo financeiro em modal e pelo convite de equipe. Só depois faz sentido priorizar comunicação e a camada comercial SaaS.
