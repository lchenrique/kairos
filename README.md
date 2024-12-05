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

1. Clone the repository
```bash
git clone https://github.com/lchenrique/kairos.git
cd kairos
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Setup environment variables
```bash
# Backend
cp .env.example .env
# Edit .env with your configurations
```

4. Run migrations
```bash
cd backend
npx prisma migrate dev
```

5. Start the development servers
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm run dev
```

## 🔮 Roadmap

- [ ] Dashboard implementation
- [ ] Advanced reporting system
- [ ] Docker containerization
- [ ] CI/CD pipeline
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

## 🛠 Stack Tecnológica

### Backend
- **Framework**: Fastify
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: JWT
- **Validação**: Zod
- **Testes**: Cobertura completa para funcionalidades principais

### Frontend
- **Framework**: Next.js 15
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui

## 📦 Instalação

1. Clone o repositório
```bash
git clone https://github.com/lchenrique/kairos.git
cd kairos
```

2. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente
```bash
# Backend
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações
```bash
cd backend
npx prisma migrate dev
```

5. Inicie os servidores de desenvolvimento
```bash
# Backend
npm run dev

# Frontend (em outro terminal)
cd ../frontend
npm run dev
```

## 🔮 Roadmap

- [ ] Implementação do Dashboard
- [ ] Sistema avançado de relatórios
- [ ] Containerização com Docker
- [ ] Pipeline de CI/CD
- [ ] Sistema de monitoramento

## 📄 Licença

Este é um software proprietário. Todos os direitos reservados.
Copyright 2024 Kairos. A cópia, modificação, distribuição ou uso não autorizado deste software, por qualquer meio, é estritamente proibido.

## 📞 Suporte

Para suporte, por favor entre em contato com a equipe de desenvolvimento.
