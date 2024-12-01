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
  - [x] Datas importantes
  - [x] Profissão
  - [x] Estado civil
- [x] Listagem com filtros
  - [x] Por status
  - [x] Por grupo
  - [x] Por data
- [x] Histórico de participação
  - [x] Eventos
  - [x] Grupos
- [x] Deleção com cascade
- [ ] Aniversariantes

### 3. Grupos/Células 
- [x] Cadastro de grupos
  - [x] Nome e descrição
  - [x] Tipo (célula, ministério, curso)
  - [x] Local e horário
  - [x] Validação de conflitos
    - [x] Prevenção de sobreposição
    - [x] Múltiplos grupos em salas diferentes
    - [x] Validação de formato (HH:mm)
- [x] Associação de membros
  - [x] Definição de líderes
  - [x] Histórico de participação
  - [x] Deleção com cascade
- [ ] Relatórios
  - [ ] Frequência
  - [ ] Crescimento

### 4. Eventos 
- [x] Criação de eventos
  - [x] Título e descrição
  - [x] Data e hora
  - [x] Local
  - [x] Tipo
- [x] Controle de presença
  - [x] Lista de participantes
  - [x] Check-in
- [ ] Relatórios
  - [ ] Participação
  - [ ] Estatísticas

### 5. Dashboard 
- [ ] Visão geral
  - [ ] Total de membros
  - [ ] Distribuição por status
  - [ ] Grupos ativos
- [ ] Aniversariantes do mês
- [ ] Próximos eventos
- [ ] Novos membros

### 6. Relatórios 
- [ ] Crescimento
  - [ ] Novos membros
  - [ ] Batismos
- [ ] Frequência
  - [ ] Eventos
  - [ ] Grupos
- [ ] Exportação
  - [ ] Excel
  - [ ] PDF

## Infraestrutura 

### Backend
- [x] Fastify
- [x] Prisma
- [x] SQLite
- [x] JWT Auth
- [x] Modularização das rotas
  - [x] Autenticação
  - [x] Membros
  - [x] Grupos
  - [x] Eventos
  - [x] Sistema
  - [x] Uploads
- [x] Schemas padronizados
  - [x] Validação com Zod
  - [x] Respostas de erro
  - [x] Respostas de sucesso
  - [x] Paginação
- [x] Testes
  - [x] Autenticação
    - [x] Registro de usuário
    - [x] Login
    - [x] Perfil
    - [x] Troca de senha
  - [x] Membros
    - [x] Criação
    - [x] Listagem
    - [x] Detalhes
    - [x] Atualização
    - [x] Deleção com cascade
  - [x] Grupos
    - [x] Criação
    - [x] Listagem
    - [x] Adição de membros
    - [x] Remoção de membros
    - [x] Deleção com cascade
  - [x] Sistema
    - [x] Informações
    - [x] Configurações da igreja

### Frontend
- [x] Next.js 14
- [x] TypeScript
- [x] Tailwind
- [x] shadcn/ui

## Distribuição 
- [ ] Docker
  - [ ] Backend
  - [ ] Frontend
  - [ ] Banco de dados
- [ ] CI/CD
  - [ ] GitHub Actions
  - [ ] Deploy automático
- [ ] Monitoramento
  - [ ] Logs
  - [ ] Métricas
  - [ ] Alertas