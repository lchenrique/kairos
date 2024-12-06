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
- [ ] Exportação para CSV
- [ ] Aniversariantes (pós-MVP)

### 3. Grupos/Células 
- [ ] Cadastro de grupos
  - [ ] Nome e descrição
  - [ ] Tipo (célula, ministério, curso)
  - [ ] Local e horário
  - [ ] Validação de conflitos
    - [ ] Prevenção de sobreposição
    - [ ] Múltiplos grupos em salas diferentes
    - [ ] Validação de formato (HH:mm)
- [ ] Associação de membros
  - [ ] Definição de líderes
  - [ ] Histórico de participação
  - [ ] Deleção com cascade

### 4. Eventos 
- [ ] Cadastro de eventos
  - [ ] Nome e descrição
  - [ ] Data e horário
  - [ ] Local
  - [ ] Tipo (culto, reunião, treinamento)
- [ ] Check-in de participantes
  - [ ] QR Code
  - [ ] Lista manual
- [ ] Relatórios
  - [ ] Presença
  - [ ] Estatísticas

### 5. Financeiro 
- [ ] Entradas
  - [ ] Dízimos
  - [ ] Ofertas
  - [ ] Doações
- [ ] Saídas
  - [ ] Despesas fixas
  - [ ] Despesas variáveis
  - [ ] Investimentos
- [ ] Relatórios
  - [ ] Balanço
  - [ ] Fluxo de caixa
  - [ ] Gráficos

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
- [ ] Implementar gestão de grupos/ministérios
- [ ] Adicionar relatórios e estatísticas
- [ ] Desenvolver sistema de eventos
- [ ] Aprimorar autenticação e permissões
- [ ] Otimizar performance e carregamento

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
- [x] Node.js com Express
- [x] TypeScript
- [x] PostgreSQL
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
  - [ ] Eventos (não testado)
    - [ ] CRUD
    - [ ] Check-in
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
    - [ ] Ações em massa (UI implementada)
  - [ ] Grupos
    - [ ] Listagem com grid/tabela
    - [ ] Filtros e busca
    - [ ] Formulário de cadastro/edição
    - [ ] Associação de membros
  - [ ] Eventos
    - [ ] Listagem com grid/tabela
    - [ ] Filtros e busca
    - [ ] Formulário de cadastro/edição
    - [ ] Check-in de participantes
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
- [ ] Docker
  - [ ] Backend
  - [ ] Frontend
  - [ ] Banco de dados
- [ ] CI/CD
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
- [ ] Gerenciamento de Grupos
  - [ ] CRUD de grupos
  - [ ] Associação de membros
  - [ ] Hierarquia de grupos
  - [ ] Permissões por grupo

- [ ] Gerenciamento de Eventos
  - [ ] Calendário de eventos
  - [ ] Criação/edição de eventos
  - [ ] Inscrição em eventos
  - [ ] Lembretes e notificações
  - [ ] Relatórios de presença

- [ ] Financeiro
  - [ ] Registro de dízimos/ofertas
  - [ ] Controle de despesas
  - [ ] Relatórios financeiros
  - [ ] Gráficos e dashboards

- [ ] Comunicação
  - [ ] Sistema de mensagens
  - [ ] Notificações push
  - [ ] E-mails automáticos
  - [ ] Anúncios internos

- [ ] Relatórios e Analytics
  - [ ] Dashboard geral
  - [ ] Relatórios customizados
  - [ ] Exportação de dados
  - [ ] Gráficos e métricas

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
  - [ ] CI/CD
  - [ ] Docker
  - [ ] Monitoramento
  - [ ] Logs

- [ ] Segurança
  - [ ] Audit de dependências
  - [ ] Rate limiting
  - [ ] CORS
  - [ ] Sanitização de inputs