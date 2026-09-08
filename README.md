# Kairos - Church Management System | Sistema de Gestão para Igrejas

[English](#english) | [Português](#português)

# English

Kairos is a comprehensive church management system designed to streamline administrative tasks and enhance community engagement. Built with modern technologies and focused on user experience, it provides tools for member management, group coordination, and event organization.

## 🚀 Features

### Authentication & Setup
- Complete JWT-based authentication system
- Initial church setup and configuration
- Password recovery
- Role-based access control

### Member Management
- Comprehensive member profiles
  - Personal information
  - Contact details
  - Important dates
  - Professional info
  - Marital status
- Advanced filtering system
- Participation history tracking
- Cascade deletion support

### Groups & Cells
- Multi-type group support (cells, ministries, courses)
- Smart scheduling system
  - Conflict prevention
  - Multiple room support
  - Time format validation
- Leadership assignment
- Member association
- Participation tracking

### Events
- Event creation and management
- Attendance tracking
- Check-in system
- Participant listing
- Monthly calendar with recurring events

### Finance & access
- Income/expense ledger with balance summary
- Role-based access for staff profiles
- Mobile-first community portal

## 🛠 Tech Stack

### Backend
- **Framework**: Fastify
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Testing**: Full coverage for core features

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## 📦 Installation

Requirements: Node.js 20 LTS and pnpm 11.15.1. You can enable the package manager declared by the project with `corepack enable`.

1. Clone the repository
```bash
git clone https://github.com/lchenrique/kairos.git
cd kairos
```

2. Install dependencies
```bash
# Dependências do monorepo
pnpm install
```

3. Setup environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env.local
# Edit the copied files with your local configurations
```

Member photos are optional in local development. Configure all three `CLOUDINARY_*` variables from `backend/.env.example` to enable upload; without them, member records still work but image upload returns a documented 503.

4. Run migrations
```bash
pnpm --filter @kairos/backend migrate:deploy
```

5. Start the development servers
```bash
pnpm dev
```

Development uses `http://localhost:3001` for the frontend and `http://localhost:3333` for the API. To start them separately, run `pnpm dev:backend` and `pnpm dev:frontend` in different terminals. Turbopack is optional through `pnpm --filter @kairos/frontend dev:turbo`.

6. Validate the release flow
```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

The E2E command uses ports 3012 and 3341 and resets only `backend/prisma/e2e.db`.

### Docker

For a local production-like run in Bash, define the public URLs, a strong `JWT_SECRET`, and the Hostinger SMTP password before starting the services:

```bash
FRONTEND_URL="http://localhost:3000" NEXT_PUBLIC_API_URL="http://localhost:3333" JWT_SECRET="use-ao-menos-32-caracteres-aleatorios" SMTP_PASSWORD="senha-da-caixa" docker compose up --build
```

In PowerShell:

```powershell
$env:JWT_SECRET = "use-ao-menos-32-caracteres-aleatorios"
$env:SMTP_PASSWORD = "senha-da-caixa"
$env:FRONTEND_URL = "http://localhost:3000"
$env:NEXT_PUBLIC_API_URL = "http://localhost:3333"
docker compose up --build
```

The frontend is available at `http://localhost:3000` and the API/docs at `http://localhost:3333/docs`.

## 🔮 Roadmap

- [x] Dashboard implementation
- [x] Groups and events CRUD (core)
- [x] Advanced reporting system (overview and attendance)
- [x] Docker containerization
- [x] CI validation pipeline
- [ ] Automated staging/production deployment
- [ ] Monitoring system

## 📄 License

This is proprietary software. All rights reserved.
Copyright 2024 Kairos. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

# Português

Kairos é um sistema abrangente de gestão para igrejas, projetado para simplificar tarefas administrativas e melhorar o engajamento da comunidade. Construído com tecnologias modernas e focado na experiência do usuário, fornece ferramentas para gestão de membros, coordenação de grupos e organização de eventos.

## 🚀 Funcionalidades

### Autenticação e Configuração
- Sistema completo de autenticação baseado em JWT
- Configuração inicial da igreja
- Recuperação de senha
- Controle de acesso baseado em funções

### Gestão de Membros
- Perfis completos dos membros
  - Informações pessoais
  - Dados de contato
  - Datas importantes
  - Informações profissionais
  - Estado civil
- Sistema avançado de filtros
- Histórico de participação
- Suporte à deleção em cascata

### Grupos e Células
- Suporte a múltiplos tipos de grupos (células, ministérios, cursos)
- Sistema inteligente de agendamento
  - Prevenção de conflitos
  - Suporte a múltiplas salas
  - Validação de formato de horário
- Atribuição de liderança
- Associação de membros
- Acompanhamento de participação

### Eventos
- Criação e gestão de eventos
- Controle de presença
- Sistema de check-in
- Listagem de participantes
- Calendário mensal com recorrência

### Financeiro e acesso
- Livro de entradas e saídas com resumo de saldo
- Permissões por perfil de equipe
- Portal responsivo para a comunidade

## 🛠 Stack Tecnológica

### Backend
- **Framework**: Fastify
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: JWT
- **Validação**: Zod
- **Testes**: Cobertura completa para funcionalidades principais

### Frontend
- **Framework**: Next.js 14
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui

## 📦 Instalação

Pré-requisitos: Node.js 20 LTS e pnpm 11.15.1. Ative o gerenciador declarado pelo projeto com `corepack enable`.

1. Clone o repositório
```bash
git clone https://github.com/lchenrique/kairos.git
cd kairos
```

2. Instale as dependências
```bash
# Dependências do monorepo
pnpm install
```

3. Configure as variáveis de ambiente
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env.local
# Edite os arquivos copiados com suas configurações locais
```

Fotos de membros são opcionais no ambiente local. Configure as três variáveis `CLOUDINARY_*` de `backend/.env.example` para habilitar o envio; sem elas, o cadastro continua funcionando e apenas o upload de imagem retorna um erro 503 documentado.

4. Execute as migrações
```bash
pnpm --filter @kairos/backend migrate:deploy
```

5. Inicie os servidores de desenvolvimento
```bash
pnpm dev
```

O desenvolvimento usa `http://localhost:3001` para o frontend e `http://localhost:3333` para a API. Para iniciar separadamente, execute `pnpm dev:backend` e `pnpm dev:frontend` em terminais diferentes. O Turbopack é opcional com `pnpm --filter @kairos/frontend dev:turbo`.

6. Valide o fluxo de lançamento
```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

O E2E usa as portas 3012 e 3341 e recria somente `backend/prisma/e2e.db`.

### Dados de demonstração e testes

Para preencher o ambiente local com uma igreja, membros, grupos, eventos e lançamentos financeiros:

```bash
pnpm --filter @kairos/backend seed
```

O seed é idempotente, cria o acesso administrativo local `admin@kairos.local` com a senha `Kairos@2026!` e é bloqueado quando `NODE_ENV=production`. Instalações reais devem usar `/setup`, sem seed.

Para executar os testes de API com segurança:

```bash
pnpm test
```

A suíte sobe uma API isolada na porta `3335` e usa `backend/prisma/test.db`; ela não apaga a base de desenvolvimento.

### Docker

Para executar uma versão semelhante à produção em Bash, defina as URLs públicas, um segredo JWT forte e a senha SMTP da Hostinger:

```bash
FRONTEND_URL="http://localhost:3000" NEXT_PUBLIC_API_URL="http://localhost:3333" JWT_SECRET="use-ao-menos-32-caracteres-aleatorios" SMTP_PASSWORD="senha-da-caixa" docker compose up --build
```

No PowerShell:

```powershell
$env:JWT_SECRET = "use-ao-menos-32-caracteres-aleatorios"
$env:SMTP_PASSWORD = "senha-da-caixa"
$env:FRONTEND_URL = "http://localhost:3000"
$env:NEXT_PUBLIC_API_URL = "http://localhost:3333"
docker compose up --build
```

O frontend fica em `http://localhost:3000` e a API/documentação em `http://localhost:3333/docs`.

## 🔮 Roadmap

- [x] Implementação do Dashboard
- [x] CRUD base de grupos e eventos
- [x] Sistema de relatórios e presença
- [x] Containerização com Docker
- [x] Pipeline de validação em CI
- [ ] Deploy automatizado em staging/produção
- [ ] Sistema de monitoramento

## 📄 Licença

Este é um software proprietário. Todos os direitos reservados.
Copyright 2024 Kairos. A cópia, modificação, distribuição ou uso não autorizado deste software, por qualquer meio, é estritamente proibido.

## 📞 Suporte

Para suporte, por favor entre em contato com a equipe de desenvolvimento.
