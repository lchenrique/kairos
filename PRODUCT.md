# Kairos

## Nome e resumo

**Kairos** é uma plataforma web de gestão para igrejas. O produto reúne, em um só lugar, cadastro e acompanhamento de membros, grupos, eventos, presença, calendário, finanças básicas, relatórios e administração da equipe.

O estado observado é de um MVP funcional para uma igreja, ainda sem os elementos necessários para ser anunciado como SaaS multi-igreja. A definição abaixo separa o que existe no código do que ainda precisa ser decidido ou implementado.

## Problema que o produto resolve

[SUPOSIÇÃO] Igrejas pequenas e médias precisam substituir planilhas, mensagens dispersas e controles manuais por uma visão única da comunidade. O Kairos tenta reduzir o trabalho operacional e facilitar decisões pastorais por meio de:

- uma base central de pessoas e seus vínculos com grupos;
- organização de encontros, participantes e check-in;
- calendário de atividades;
- registro financeiro simples;
- indicadores para acompanhamento da comunidade;
- controle de acesso para cada função da equipe.

Essa hipótese de problema ainda precisa ser validada com igrejas usuárias. Não há pesquisa de usuário, métricas de uso ou evidência de clientes no repositório.

## Usuário-alvo

Os papéis já modelados no produto são `ADMIN`, `PASTOR`, `LEADER`, `SECRETARY` e `USER` (`backend/src/schemas/auth.ts`). O público operacional provável é:

- administrador ou pastor, responsável pela configuração e governança;
- secretaria, responsável por cadastros, presença e rotinas;
- líderes, responsáveis por grupos e eventos;
- usuários somente leitura, caso a igreja opte por conceder esse acesso;
- membros da igreja, como público potencial de um portal futuro.

[SUPOSIÇÃO] A primeira versão deve ser vendida para a equipe da igreja, e não diretamente para todos os membros. O portal atual é protegido pelo mesmo login do painel e, portanto, ainda não é um portal público ou de acesso por convite.

## Fluxo principal do usuário

### Fluxo operacional atual

1. O usuário acessa `/login` e autentica com e-mail e senha.
2. O painel redireciona para `/dashboard` quando há um token no cookie.
3. A equipe cadastra ou importa manualmente membros em `/members`.
4. Cria grupos em `/groups` e relaciona membros a eles.
5. Cria eventos em `/events`, adiciona participantes e registra presença/check-in.
6. Consulta a agenda em `/calendar` e os encontros relacionados em `/portal`.
7. Registra entradas e saídas em `/finance`.
8. Consulta indicadores agregados em `/reports` e ajusta igreja e usuários em `/settings`.

Esse fluxo foi exercitado por testes de API e por smoke tests HTTP. A autenticação e as operações básicas de membros, grupos, eventos, relatórios e finanças responderam com sucesso no ambiente local. O fluxo começa com um usuário previamente criado ou com seed; não há onboarding de primeira instalação.

### Fluxo esperado para a primeira instalação

1. O responsável cria a igreja, a unidade inicial e a conta administradora.
2. Confirma dados básicos e preferências.
3. Convida a equipe por e-mail, com definição de papéis.
4. Importa ou cadastra membros.
5. Configura grupos, eventos e rotina de check-in.
6. Acompanha indicadores e finanças.

Esse fluxo é uma definição de produto, não uma funcionalidade disponível hoje. `/setup` está declarado como caminho público no middleware, mas retorna 404 e não há página de cadastro de igreja.

## Funcionalidades existentes

### Acesso e administração

- Login, registro de usuário, perfil e alteração de senha.
- JWT com validade de sete dias.
- Papéis administrativos e guardas de rota no backend.
- Consulta e edição dos dados da igreja.
- Criação direta de usuários da equipe e alteração de papel por administrador.
- Middleware de proteção de páginas no frontend.

### Membros

- CRUD de membros, busca, filtros, paginação e visualizações de tabela e cards.
- Status e dados pessoais.
- Aniversariantes.
- Exportação CSV.
- Histórico de participação ligado a eventos.

### Grupos

- CRUD de grupos.
- Filtros, paginação e visualizações de tabela e cards.
- Inclusão, remoção e definição de papel de membro no grupo.
- Validações de agenda e conflito de horário.

### Eventos, encontros e presença

- CRUD de eventos.
- Participantes e status de participação.
- Check-in por evento, inclusive componente de QR code.
- Registro de histórico de presença.
- Eventos recorrentes semanais na visualização do calendário.

### Calendário e portal

- Calendário mensal com eventos e ocorrências recorrentes calculadas no cliente.
- Área chamada “Portal” que apresenta eventos como encontros e direciona para detalhes e check-in.

### Finanças

- Cadastro, edição, listagem, filtros por tipo e período e exclusão de lançamentos.
- Resumo de receitas, despesas e saldo.
- Formulário de inclusão em modal.

### Relatórios e painel

- Endpoint e tela de visão geral de relatórios com dados agregados.
- Cards de estatísticas, gráfico de atividade e próximos eventos no dashboard.

## Funcionalidades parcialmente implementadas ou inconsistentes

- **Onboarding:** não existe tela `/setup`, criação de igreja ou primeiro administrador; a instalação depende de seed ou chamada direta à API.
- **Multi-igreja e unidades:** o schema possui uma igreja singleton (`Church.id = "default"`) e as entidades operacionais não têm `churchId` ou `unitId`. Não há isolamento de dados nem seletor de unidade.
- **Recuperação de senha:** os endpoints de reset exigem autenticação e não enviam e-mail; o link do login aponta para `/forgot-password`, rota inexistente.
- **Equipe:** o administrador define uma senha diretamente ao criar o usuário. Não há convite, ativação, revogação, suspensão ou recuperação de acesso pela equipe.
- **Dashboard:** aniversariantes, crescimento, atenção pastoral e parte dos indicadores são valores estáticos no frontend. Um card de relatórios mostra “Em breve”.
- **Relatórios:** a tela é uma visão agregada; faltam período selecionável, filtros, detalhamento, exportação e cadastro de metas/perguntas.
- **Calendário:** a recorrência é expandida no cliente e não modela fim da série, exceções, feriados ou uma visualização otimizada para celular.
- **Portal:** é uma área autenticada do painel, não um portal independente para membros.
- **Notificações:** o formulário de evento apenas registra que lembretes poderão existir no futuro; não há worker, entrega ou central de notificações real.
- **Uploads:** dependem de credenciais externas do Cloudinary e não há fluxo de configuração ou fallback documentado.
- **Qualidade de erros:** alguns erros de domínio chegam como 500; por exemplo, `GET /groups/does-not-exist` retorna `P2025` como erro interno em vez de 404.
- **Rotas de marketing:** não existem páginas independentes para `/recursos`, `/precos`, `/sobre` ou `/contato`; a landing usa seções âncora.
- **Logout:** a rota frontend é um stub e não há revogação de tokens no backend.

## Escopo provável da primeira versão lançável

[SUPOSIÇÃO] Para reduzir risco, a primeira versão lançável deve ser um beta controlado para uma única igreja/unidade, com usuários convidados manualmente e dados reais pequenos. O escopo funcional deve ser:

1. Login, logout seguro, alteração e recuperação de senha.
2. Onboarding para criar igreja e administrador inicial.
3. Membros com CRUD, busca, filtros e exportação.
4. Grupos com membros e regras básicas de agenda.
5. Eventos, participantes, check-in e calendário responsivo.
6. Finanças simples com categorias mínimas, filtros e resumo.
7. Relatórios baseados somente em dados reais e claramente explicados.
8. Configurações da igreja e gestão segura da equipe.
9. Papéis documentados, verificações de autorização no backend e isolamento da igreja escolhida.
10. Backup, restauração testada, logs, health check e um fluxo automatizado de fumaça.

O produto só deve ser chamado de “SaaS multi-igreja” depois de implementar o isolamento por organização/unidade e validar esse cenário com testes negativos.

## Funcionalidades que podem ficar para depois

- Convites em massa, importação avançada e sincronização com outras bases.
- Comunicação, campanhas, e-mail, WhatsApp e notificações automáticas.
- Portal público ou portal com token para membros.
- Histórico detalhado de participação por grupo e trilhas pastorais.
- Relatórios customizáveis, metas, exportação avançada e dashboards por papel.
- Fluxo financeiro com categorias, anexos, aprovação, conciliação e auditoria completa.
- Assinaturas, cobrança, planos, limites e faturamento do SaaS.
- PostgreSQL e arquitetura para múltiplas instâncias, caso o beta inicial permaneça em SQLite.
- Aplicativos móveis e integrações externas.

## Regras e decisões de negócio identificadas

- O primeiro registro global recebe papel `ADMIN`; registros seguintes recebem `USER` (`backend/src/routes/auth/register.ts`).
- E-mail de usuário é único.
- Senhas são armazenadas com hash bcrypt.
- O token JWT tem validade de sete dias e é enviado no cookie não HttpOnly pelo frontend atual.
- Operações de membros exigem, em geral, `ADMIN`, `PASTOR` ou `SECRETARY`; grupos e eventos permitem também `LEADER`.
- Lançamentos financeiros exigem valor positivo em centavos e têm tipos de entrada ou saída.
- Leitura de várias áreas está disponível para qualquer usuário autenticado, mesmo quando a navegação sugere papéis mais restritos.
- Grupos possuem dia, horário e local e há validação de conflito.
- Eventos podem ter participantes e status de presença; alterações de participantes recriam vínculos e registram histórico.
- A origem CORS é restrita em produção à variável `FRONTEND_URL`; em desenvolvimento aceita localhost nas portas 3000 e 3001.
- O seed cria uma igreja chamada “Igreja Kairos”, usuários e dados demonstrativos idempotentes.
- A persistência atual é SQLite local, sem relação entre registros e uma organização ou unidade.

## Suposições feitas pelo agente

- [SUPOSIÇÃO] O comprador principal é a liderança ou secretaria de uma igreja pequena ou média.
- [SUPOSIÇÃO] O beta pode começar com uma única unidade, desde que a comunicação não prometa multi-igreja.
- [SUPOSIÇÃO] A criação de novas igrejas e unidades é requisito comercial futuro, não apenas uma preferência visual.
- [SUPOSIÇÃO] Membros não devem receber acesso ao painel administrativo por padrão.
- [SUPOSIÇÃO] Um fluxo de convite por e-mail é mais adequado que compartilhar uma senha inicial.
- [SUPOSIÇÃO] SQLite é suficiente para o beta de baixa concorrência, mas não foi validado para operação SaaS.
- [SUPOSIÇÃO] O produto precisa atender à LGPD e manter histórico mínimo de alterações, embora não exista política ou requisito jurídico no repositório.
- [SUPOSIÇÃO] O idioma inicial é português do Brasil e a operação será feita em navegador moderno.

## Dúvidas que precisam de confirmação humana

1. O lançamento inicial será single-tenant ou já deve suportar sede, filiais e várias igrejas?
2. Cada igreja terá unidades com usuários, membros e relatórios separados? Haverá visão consolidada da sede?
3. Quem pode ver e editar finanças, relatórios, membros e dados pastorais?
4. O portal será público, por convite, por token ou permanecerá interno?
5. Qual provedor deve enviar convites e recuperação de senha?
6. A igreja poderá criar usuários com senha provisória ou o convite será obrigatório?
7. Quais dados precisam de consentimento, retenção, exportação e exclusão para LGPD?
8. Qual ambiente de produção, banco, domínio, estratégia de backup e SLA serão usados?
9. Quais módulos entram no plano inicial e quais ficarão fora da primeira versão comercial?
10. Há necessidade de cobrança recorrente, planos, limites, suporte e termos de uso no primeiro lançamento?

