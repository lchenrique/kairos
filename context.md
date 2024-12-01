# Kairos - Contexto do Desenvolvimento

## Última Sessão (01/12/2023)

### Estado Atual do Backend

#### Autenticação e Setup
- Sistema de autenticação completo com JWT
- Proteção de rotas implementada
- Setup inicial com dados da igreja
- Recuperação de senha funcionando

#### Gestão de Membros
- CRUD completo implementado
- Dados pessoais, contatos, datas importantes
- Filtros por status, grupo e data
- Histórico de participação em eventos e grupos
- Deleção em cascade funcionando

#### Grupos e Células
- Cadastro completo com validações
- Sistema avançado de agendamento:
  - Prevenção de conflitos de horário
  - Suporte a grupos simultâneos em salas diferentes
  - Validação de formato HH:mm
- Associação de membros com roles
- Deleção em cascade implementada

#### Eventos
- Criação com título, descrição, data e local
- Controle de presença e check-in
- Tipos de evento configuráveis

### Infraestrutura

#### Backend (Node.js)
- Fastify com TypeScript
- Prisma ORM com SQLite
- Autenticação JWT
- Modularização por domínio:
  ```
  backend/
  ├── src/
  │   ├── routes/          # Rotas por domínio
  │   │   ├── auth/        # Autenticação
  │   │   ├── members/     # Membros
  │   │   ├── groups/      # Grupos
  │   │   ├── events/      # Eventos
  │   │   └── system/      # Sistema
  │   ├── schemas/         # Schemas Zod
  │   ├── lib/            # Utilitários
  │   └── server.ts       # Setup do servidor
  ├── prisma/
  │   └── schema.prisma   # Modelo do banco
  └── package.json
  ```

#### Schemas e Validações
- Schemas padronizados com Zod
- Respostas de erro consistentes:
  ```typescript
  {
    statusCode: number
    error: string
    message: string
  }
  ```
- Respostas de sucesso padronizadas
- Paginação implementada

#### Testes
- Cobertura completa das principais rotas:
  - Autenticação (registro, login, perfil, senha)
  - Membros (CRUD completo)
  - Grupos (CRUD e membros)
  - Sistema (info e configurações)
- Testes passando com sucesso

### Ambiente de Desenvolvimento
- API: http://localhost:3333
- Banco: SQLite (dev.db)
- Testes: Jest com supertest

### Próximos Passos
1. Dashboard com visão geral
2. Relatórios de crescimento e frequência
3. Gerenciamento de usuários (staff)
4. Sistema de aniversariantes

### Melhorias Futuras
- Frequência dos grupos (semanal, quinzenal)
- Capacidade das salas
- Exceções para feriados
- Exportação de relatórios
- Monitoramento e logs

### Padrões do Projeto
- TypeScript strict mode
- Schemas Zod em todas as rotas
- Respostas padronizadas
- Tratamento de erros consistente
- Testes automatizados
- Commits semânticos
