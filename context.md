# Kairos - Contexto do Desenvolvimento

## Última Sessão (06/12/2023)

### Estado Atual do Backend

#### Implementado e Testado 

##### Autenticação e Setup
- Sistema de autenticação completo com JWT
- Proteção de rotas implementada
- Setup inicial com dados da igreja
- Recuperação de senha funcionando
- Testes de API passando

##### Gestão de Membros
- CRUD completo implementado
- Dados pessoais e contatos
- Filtros por status, grupo e data
- Testes de API passando
  - Criação
  - Listagem e filtros
  - Atualização
  - Deleção

##### Grupos e Células
- Cadastro completo com validações
- Sistema de agendamento
- Associação de membros
- Testes de API passando
  - CRUD completo
  - Associação de membros

#### Em Desenvolvimento 

##### Eventos
- API implementada mas não testada
- Funcionalidades planejadas:
  - Criação de eventos
  - Controle de presença
  - Check-in de participantes
  - Tipos de evento configuráveis

### Estado Atual do Frontend

#### Implementado 

##### Arquitetura
- Next.js 14 com App Router
- TypeScript strict mode
- Tailwind CSS para estilização
- shadcn/ui para componentes base
- Orval para geração de client API
- Tanstack React Query para cache
- Zod para validação de formulários
- Framer Motion para animações

##### Membros
- Visualização em tabela e grid
- Filtros por status
- Criar novo membro
- Editar membro
- Visualizar detalhes
- Interface parcialmente responsiva
- Animações e transições

#### Em Desenvolvimento 

##### Membros - UI Pronta (sem integração)
- Menu de ações
- Ações em massa
- Seleção múltipla
- Deleção de membros

##### Pendente
- Histórico de participação
- Integração com grupos
- Integração com eventos
- Grupos (interface + integração)
- Eventos (interface + integração)

#### Estrutura do Projeto
```
frontend/
├── src/
│   ├── app/              # Páginas do Next.js
│   │   └── (app)/       # Rotas protegidas
│   │       ├── members/  # Páginas de membros
│   │       ├── groups/   # Páginas de grupos
│   │       └── events/   # Páginas de eventos
│   ├── components/       # Componentes compartilhados
│   │   └── ui/          # Componentes base (shadcn)
│   ├── features/        # Features por domínio
│   │   ├── members/     # Feature de membros
│   │   ├── groups/      # Feature de grupos
│   │   └── events/      # Feature de eventos
│   ├── lib/            # Utilitários e configurações
│   │   ├── api/        # Cliente API gerado
│   │   └── utils/      # Funções utilitárias
│   └── store/          # Estado global
```

### Próximos Passos

#### Backend
1. Implementar testes de eventos
2. Adicionar testes unitários
3. Implementar testes E2E
4. Melhorar documentação da API

#### Frontend
1. Implementar funcionalidades de deleção
2. Integrar ações em massa
3. Desenvolver interfaces de grupos
4. Desenvolver interfaces de eventos
5. Implementar testes

### Considerações Técnicas
- Manter consistência no uso de tipos
- Seguir padrões de UI/UX estabelecidos
- Priorizar performance e acessibilidade
- Documentar decisões de arquitetura

### Padrões e Boas Práticas
1. **Código**
   - TypeScript strict mode
   - ESLint + Prettier
   - Conventional Commits

2. **UI/UX**
   - Design system consistente
   - Feedback visual claro
   - Animações sutis
   - Responsividade

3. **Performance**
   - Code splitting
   - Lazy loading
   - Otimização de imagens
   - Cache eficiente

4. **Segurança**
   - Validação de inputs
   - Sanitização de dados
   - Proteção de rotas
   - Tratamento de erros
