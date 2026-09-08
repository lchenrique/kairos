# Kairos - Sistema de Gestão para Igrejas

## MVP Features

### 1. Autenticação e Setup 
- [x] Login/Logout
- [x] Proteção de rotas
- [x] Setup inicial (primeiro acesso)
  - [x] Dados da igreja
  - [x] Criação do admin
- [x] Recuperação de senha
- [ ] Gerenciamento de usuários (staff)

### 2. Membros 
- [x] Cadastro completo
  - [x] Dados pessoais
  - [x] Contatos
- [x] Listagem com filtros
  - [x] Por status
  - [x] Por texto
  - [x] Persistência via URL
- [x] Interface implementada
  - [x] Visualizar detalhes
  - [x] Criar novo membro
  - [x] Editar membro
  - [x] Menu de ações com ícones
  - [x] Visualização em tabela e grid
  - [x] Animações e transições
  - [x] Hook de ações centralizado
  - [x] Padrões de interação consistentes
- [x] Ações em massa
  - [x] Seleção múltipla
  - [x] Ativar/desativar
  - [x] Excluir
- [ ] Ordenação nas colunas da tabela
- [x] Exportação para CSV
- [x] Aniversariantes (próximos 30 dias)

### 3. Grupos/Células 
- [x] Cadastro de grupos
  - [x] Nome e descrição
  - [x] Tipo (célula, ministério, departamento e outros)
  - [x] Local e horário
  - [x] Validação de conflitos e formato (HH:mm)
- [x] CRUD integrado à API
- [x] Associação de membros na interface
  - [x] Associação e deleção em cascade na API
  - [x] Definição de líderes na interface
  - [ ] Histórico de participação

### 4. Eventos 
- [x] Cadastro de eventos
  - [x] Nome e descrição
  - [x] Data e horário
  - [x] Local e tipo
  - [x] Filtros, tabela/grid e CRUD integrado à API
- [x] Check-in/presença de participantes
  - [x] QR Code com rota de check-in autenticada
  - [x] Endpoints de lista manual/status na API
  - [x] Interface de check-in manual/status
- [x] Relatórios
  - [x] Presença
  - [x] Estatísticas

### 5. Financeiro 
- [x] Entradas
  - [x] Dízimos
  - [x] Ofertas
  - [x] Doações
- [x] Saídas
  - [x] Despesas fixas
  - [x] Despesas variáveis
  - [x] Investimentos
- [x] Relatórios
  - [x] Balanço
  - [x] Fluxo de caixa
  - [x] Gráficos

### 6. Comunicação 
- [ ] Notificações
  - [ ] Email
  - [ ] SMS
  - [ ] Push
- [ ] Templates
  - [ ] Aniversário
  - [ ] Eventos
  - [ ] Comunicados

## Progresso Atual

### Componentes de Membros
- [x] Criação de formulário de membros
- [x] Listagem de membros com grid e tabela
- [x] Componente de cartão de membro
- [x] Filtros de membros
- [x] Paginação flexível
- [x] Integração com backend para CRUD de membros
- [x] Hook de ações centralizado
- [x] Padrões de interação consistentes

### Componentes de UI
- [x] Grid genérico com paginação
- [x] Componentes de card reutilizáveis
- [x] Animações com Framer Motion
- [x] Tema dark/light
- [x] Componentes de formulário dinâmicos

### Próximas Etapas
- [ ] Integrar os indicadores de relatórios ao dashboard principal
- [ ] Adicionar ordenação de colunas no módulo de membros
- [ ] Aprimorar autenticação e permissões
- [ ] Otimizar performance e carregamento
- [ ] Criar notificações por e-mail/WhatsApp (fora desta rodada)
- [ ] Migrar SQLite para PostgreSQL em staging

## Progresso desta sessão (03/09/2026)

- [x] Padronização do workspace em pnpm (`pnpm-workspace.yaml`, lockfile único e `packageManager` declarado).
- [x] Shell responsivo com sidebar desktop/mobile, header acessível, navegação para grupos, eventos e configurações.
- [x] Tokens visuais refeitos com roxo como primária, dourado como destaque e suporte a dark mode/reduced motion.
- [x] Dashboard redesenhado com indicadores, gráfico de crescimento, próximos eventos e atalhos.
- [x] Módulo de grupos com listagem, filtros, tabela/grid, criação, edição, exclusão e validação.
- [x] Módulo de eventos habilitado no backend e implementado no frontend com CRUD, filtros e participantes via API.
- [x] Página de configurações da igreja integrada ao backend.
- [x] Upload multipart configurado com limite de 5 MB.
- [x] Painel de membros/líderes em grupos, presença manual e QR Code nos eventos.
- [x] Endpoint de relatórios reais (`/reports/overview`) e página de indicadores.
- [x] Exportação CSV, aniversariantes, Docker, CI e hardening básico (Helmet, rate limit, CORS e MIME).
- [x] Calendário mensal com eventos recorrentes e lembretes configuráveis.
- [x] Histórico de presença por membro.
- [x] Financeiro com entradas, saídas, saldo e API protegida por perfil.
- [x] Perfis de acesso e gestão da equipe (administrador, pastor, líder, secretário e usuário).
- [x] Portal responsivo e endpoint de saúde/backup operacional.
- [x] Validações executadas: frontend lint/typecheck/build, backend lint/build e 28 testes de API.

## Desafios Técnicos Resolvidos
- Sincronização de estado com React Query
- Renderização flexível de componentes
- Gerenciamento de estado global
- Tipagem segura com TypeScript

## Melhorias Contínuas
- Refatoração de componentes para maior reusabilidade
- Otimização de performance
- Testes unitários e de integração

## Infraestrutura

### 1. Backend
- [x] Node.js com Fastify
- [x] TypeScript
- [x] SQLite (Prisma)
- [x] Prisma ORM
- [x] JWT Authentication
- [x] API Documentation
- [x] Testes de API
  - [x] Autenticação
    - [x] Login/Logout
    - [x] Recuperação de senha
    - [x] Proteção de rotas
  - [x] Membros
    - [x] Criação
    - [x] Listagem e filtros
    - [x] Atualização
    - [x] Deleção
  - [x] Grupos
    - [x] CRUD completo
    - [x] Associação de membros
  - [x] Eventos (CRUD e participantes cobertos)
    - [x] CRUD automatizado
    - [x] Check-in/status de participante automatizado
- [ ] Testes
  - [ ] Unitários
  - [ ] E2E

### 2. Frontend
- [x] Next.js 14 com App Router
- [x] TypeScript strict mode
- [x] Tailwind CSS + shadcn/ui
- [x] Gerenciamento de estado
  - [x] Zustand para estado global
  - [x] React Query para cache
  - [x] Zod para validação
- [x] Features por domínio
  - [x] Membros
    - [x] Listagem com grid/tabela
    - [x] Filtros e busca
    - [x] Formulário de cadastro
    - [x] Formulário de edição
    - [x] Visualização de detalhes
    - [x] Deleção
    - [x] Ações em massa
  - [x] Grupos (base do módulo)
    - [x] Listagem com grid/tabela
    - [x] Filtros e busca
    - [x] Formulário de cadastro/edição
    - [x] Associação de membros e definição de líderes
  - [x] Eventos (base do módulo)
    - [x] Listagem com grid/tabela
    - [x] Filtros e busca
    - [x] Formulário de cadastro/edição
    - [x] Check-in manual e status de participantes
- [x] Configurações da igreja
- [x] Componentes reutilizáveis
  - [x] DataTable com seleção múltipla
  - [x] Componentes de card reutilizáveis
  - [x] Animações com Framer Motion
  - [x] Tema dark/light
- [x] UI/UX
  - [x] Design system consistente
  - [x] Feedback visual (loading/erro)
  - [x] Animações com Framer Motion
  - [x] Layout responsivo
- [ ] Testes
  - [ ] Unitários
  - [ ] Integração
  - [ ] E2E

### 3. DevOps
- [x] Docker
  - [ ] Backend
  - [ ] Frontend
  - [ ] Banco de dados
- [x] CI/CD
  - [ ] GitHub Actions
  - [ ] Deploy automático
  - [ ] Testes automáticos
  - [ ] Monitoramento

## Tarefas do Projeto Kairos

## Em Andamento
- [x] Setup inicial do projeto
  - [x] Configuração do Next.js 14
  - [x] Configuração do TypeScript
  - [x] Configuração do TailwindCSS
  - [x] Configuração do ESLint
  - [x] Configuração do Prettier
  - [x] Configuração do Jest
  - [x] Configuração do Cypress

- [x] Autenticação
  - [x] Implementação do JWT
  - [x] Proteção de rotas
  - [x] Páginas de login/registro
  - [x] Middleware de autenticação
  - [x] Refresh token

- [x] Layout Base
  - [x] Sidebar responsiva
  - [x] Header com perfil
  - [x] Dark mode
  - [x] Tema customizado
  - [x] Animações suaves
  - [x] Breadcrumbs

- [x] Gerenciamento de Membros
  - [x] CRUD completo
  - [x] Listagem com grid/tabela
  - [x] Filtros e ordenação
  - [x] Paginação
  - [x] Pesquisa
  - [x] Upload de foto
  - [x] Validação de formulários
  - [x] Feedback visual (toasts)
  - [x] Confirmação de ações
  - [x] Drawer para edição/visualização
  - [x] Card de membro com design moderno
  - [x] Hook personalizado para ações do membro
  - [x] Controle granular de estilos
  - [x] Mix de estilos próprios e do design system

## Próximos Passos
- [x] Gerenciamento de Grupos (base concluída)
  - [x] CRUD de grupos
  - [x] Associação de membros e definição de líderes
  - [ ] Hierarquia de grupos
  - [ ] Permissões por grupo

- [x] Gerenciamento de Eventos (CRUD concluído)
  - [x] Calendário de eventos
  - [x] Criação/edição de eventos
  - [x] Inscrição/check-in manual em eventos
  - [x] Lembretes configuráveis (notificações ficam para depois)
  - [x] Relatórios de presença

- [x] Financeiro
  - [x] Registro de dízimos/ofertas
  - [x] Controle de despesas
  - [x] Relatórios financeiros
  - [x] Gráficos e dashboards

- [ ] Comunicação
  - [ ] Sistema de mensagens
  - [ ] Notificações push
  - [ ] E-mails automáticos
  - [ ] Anúncios internos

- [ ] Relatórios e Analytics
  - [x] Dashboard geral
  - [ ] Relatórios customizados
  - [x] Exportação de dados
  - [x] Gráficos e métricas

## Melhorias Técnicas
- [ ] Design System
  - [x] Componentes base shadcn/ui
  - [x] Estilos personalizados quando necessário
  - [x] Controle granular de temas
  - [ ] Documentação de componentes
  - [ ] Guia de estilos
  - [ ] Storybook

- [ ] Testes
  - [ ] Testes unitários
  - [ ] Testes de integração
  - [ ] Testes e2e
  - [ ] Cobertura de testes

- [ ] Performance
  - [ ] Otimização de imagens
  - [ ] Lazy loading
  - [ ] Code splitting
  - [ ] Caching

- [ ] DevOps
  - [x] CI/CD
  - [x] Docker
  - [x] Monitoramento básico (healthcheck)
  - [x] Logs estruturados

- [ ] Segurança
  - [ ] Audit de dependências
  - [x] Rate limiting
  - [x] CORS restritivo por ambiente
  - [x] Validação de upload e inputs com Zod
