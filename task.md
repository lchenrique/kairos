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
  - [x] Por grupo
  - [x] Por data
- [ ] Histórico de participação
  - [ ] Eventos
  - [ ] Grupos
- [ ] Deleção com cascade
- [ ] Ações em massa (UI implementada)
  - [ ] Ativar/Desativar
  - [ ] Adicionar/Remover de grupos
  - [ ] Excluir
- [x] Interface implementada
  - [x] Visualizar detalhes
  - [x] Criar novo membro
  - [x] Editar membro
  - [x] Menu de ações com ícones
  - [x] Visualização em tabela e grid
  - [x] Animações e transições
- [ ] Aniversariantes

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
- [ ] Relatórios
  - [ ] Frequência
  - [ ] Crescimento

### 4. Eventos 
- [ ] Criação de eventos
  - [ ] Título e descrição
  - [ ] Data e hora
  - [ ] Local
  - [ ] Tipo de evento
- [ ] Check-in
  - [ ] QR Code
  - [ ] Lista manual
- [ ] Relatórios
  - [ ] Presença
  - [ ] Crescimento

### 5. Dashboard
- [x] Estatísticas gerais
  - [x] Total de membros
  - [x] Membros ativos/inativos
  - [x] Grupos ativos
- [ ] Gráficos
  - [ ] Crescimento mensal
  - [ ] Distribuição por status
  - [ ] Frequência em eventos
- [ ] Alertas
  - [ ] Aniversariantes do mês
  - [ ] Membros inativos
  - [ ] Eventos próximos

### 6. Configurações
- [x] Dados da igreja
  - [x] Nome e CNPJ
  - [x] Endereço
  - [x] Contatos
- [ ] Customização
  - [ ] Logo
  - [ ] Cores
  - [ ] Idioma

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
    - [ ] Deleção
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
  - [x] Filtros dinâmicos
  - [x] Cards de estatísticas
  - [x] Formulários dinâmicos
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