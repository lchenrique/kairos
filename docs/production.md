# Operação em produção

## Pré-requisitos e segredos

O backend recusa iniciar em produção quando `JWT_SECRET` tem menos de 32 caracteres, usa um valor conhecido de exemplo ou quando as credenciais SMTP estão ausentes. Gere o segredo fora do repositório e armazene-o no gerenciador de segredos da hospedagem.

Variáveis obrigatórias para o deploy:

| Variável | Regra |
| --- | --- |
| `JWT_SECRET` | Valor aleatório com pelo menos 32 caracteres, nunca versionado |
| `SMTP_PASSWORD` | Senha da caixa transacional, nunca versionada |
| `SMTP_USER` | `kairos@codebycarlos.dev` enquanto esse for o remetente autorizado |
| `FRONTEND_URL` | Origem pública exata do frontend, usada por CORS e links de email |
| `NEXT_PUBLIC_API_URL` | URL pública da API; precisa existir durante o build do frontend |
| `API_INTERNAL_URL` | URL usada pelo middleware para validar a sessão; no Compose, `http://backend:3333` |
| `COOKIE_DOMAIN` | Opcional; domínio compartilhado como `.exemplo.com` quando app e API usam subdomínios |
| `DATABASE_URL` | SQLite persistente; no Compose, `file:./data/kairos.db` |
| `CLOUDINARY_CLOUD_NAME` | Opcional; nome da conta usada para fotos de membros |
| `CLOUDINARY_API_KEY` | Opcional; chave da API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Opcional e secreto; nunca deve ser exposto ao frontend |

`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` e `MAIL_FROM` têm os padrões aprovados da Hostinger na aplicação e no `docker-compose.yml`; todos continuam sobrescrevíveis por ambiente. Confirme SPF, DKIM e DMARC do domínio antes de liberar convites ou recuperação.

### E-mail transacional Hostinger

O domínio `codebycarlos.dev` usa MX da Hostinger e o remetente previsto é `Kairos <kairos@codebycarlos.dev>`. A senha da caixa deve entrar somente como `SMTP_PASSWORD` no gerenciador de segredos do ambiente.

Na verificação de 05/09/2026, a zona possuía os dois MX da Hostinger, SPF, os três registros DKIM e DMARC com política de observação `p=none`; a porta `smtp.hostinger.com:465` também estava acessível a partir do ambiente de desenvolvimento. A [configuração oficial da Hostinger](https://support.hostinger.com/en/articles/1575756-how-to-get-email-account-configuration-details-for-hostinger-email) confirma SMTP com SSL na porta 465 e o endereço completo da caixa como usuário. Antes de elevar o DMARC para `quarantine` ou `reject`, valide todos os remetentes legítimos e acompanhe os relatórios para não bloquear tráfego válido.

Depois de cadastrar as variáveis, valide primeiro apenas a autenticação, sem enviar mensagem:

```bash
pnpm --filter @kairos/backend email:verify
```

Para o smoke de entrega, informe uma caixa externa controlada pela equipe:

```bash
pnpm --filter @kairos/backend email:verify --to responsavel@exemplo.com
```

O comando nunca imprime `SMTP_PASSWORD`. O modo sem `--to` apenas autentica e encerra; o modo com destinatário envia uma única mensagem identificada como teste. Depois, execute pela interface um convite e uma recuperação de senha, abra os dois links recebidos e confirme que eles apontam para o `FRONTEND_URL` público correto.

A sessão usa cookie HttpOnly, Secure em produção e SameSite Lax. Sirva app e API em HTTPS e, se estiverem em subdomínios diferentes, configure `COOKIE_DOMAIN` para o domínio pai. O middleware consulta `API_INTERNAL_URL` e não libera uma rota protegida apenas porque existe um cookie.

O seed é exclusivamente demonstrativo e encerra com erro quando `NODE_ENV=production`. Uma instalação real deve começar vazia e usar `/setup` para criar a Rede, a sede e o primeiro administrador.

## Matriz de ambientes

| Ambiente | Frontend | API | Banco |
| --- | --- | --- | --- |
| Desenvolvimento | `http://localhost:3001` | `http://localhost:3333` | `backend/prisma/dev.db` |
| Testes de API | não se aplica | `http://localhost:3335` | `backend/prisma/test.db` |
| E2E | `http://localhost:3012` | `http://localhost:3341` | `backend/prisma/e2e.db` |
| Docker local | `http://localhost:3000` | `http://localhost:3333` | volume `kairos-db` |
| Staging/produção | domínio público configurado | domínio público configurado | volume persistente definido pela hospedagem |

No desenvolvimento, copie `backend/.env.example` para `backend/.env` e `frontend/.env.example` para `frontend/.env.local`. No Docker, os valores vêm do ambiente do Compose. `FRONTEND_URL` é a origem usada pelo CORS e pelos links enviados por e-mail; ela deve corresponder exatamente ao frontend do ambiente. Não reutilize arquivos de ambiente entre desenvolvimento, E2E e produção.

## Implantação no Coolify

Em 05/09/2026, o acesso autenticado confirmou o Coolify `4.3.14` no VPS e o servidor `localhost` disponível para implantação. Foi criado o projeto `Kairos` com o ambiente `production`. Os domínios aprovados são `https://kairos.codebycarlos.dev` para o frontend e `https://api.kairos.codebycarlos.dev` para a API; ambos já resolvem para `129.80.148.195` pelo DNS existente, portanto nenhum registro redundante foi adicionado.

O recurso da aplicação e o deploy ainda não foram criados. O Coolify precisa ler o `docker-compose.yml` do repositório Git, mas o Compose, os Dockerfiles, as migrations e as demais alterações da versão lançável ainda estão somente no working tree local. O `HEAD` local e o upstream continuam no mesmo commit, e publicar agora carregaria uma versão antiga. Envie primeiro as alterações aprovadas ao repositório conforme o processo de release; depois crie o recurso Docker Compose no projeto `Kairos / production`.

O caminho preparado é um recurso Docker Compose conectado ao repositório Git. O `docker-compose.yml` é a fonte de verdade, conforme a [documentação oficial do Coolify](https://coolify.io/docs/knowledge-base/docker/compose). Ao carregar o Compose:

1. Publique o serviço `frontend` no domínio do app, porta 3000.
2. Publique o serviço `backend` no domínio da API, porta 3333.
3. Defina `FRONTEND_URL` e `NEXT_PUBLIC_API_URL` com HTTPS e sem barra final. Ambos são obrigatórios no Compose para impedir deploy acidental com `localhost`.
4. Marque `NEXT_PUBLIC_API_URL` também como variável de build, porque o Next incorpora esse valor no bundle.
5. Cadastre `JWT_SECRET`, `SMTP_PASSWORD` e `CLOUDINARY_API_SECRET` na página **Environment Variables** do recurso, disponíveis somente em runtime e bloqueados para que o Coolify os trate como segredos. Não marque `SMTP_PASSWORD` como build-time. Se um valor contiver `$`, use o modo literal do Coolify.
6. Mantenha o volume `kairos-db` persistente e configure cópia de backup fora do servidor.
7. Depois do deploy, confirme migration, `/health`, setup/login, troca de unidade, smoke SMTP e E2E contra staging.

As [variáveis do Coolify](https://coolify.io/docs/knowledge-base/environment-variables) podem ser separadas entre build e runtime. Não transforme `SMTP_PASSWORD` ou `JWT_SECRET` em build arguments e não copie valores mascarados de volta para o editor.

### Fotos de membros

As três variáveis `CLOUDINARY_*` precisam ser configuradas em conjunto para habilitar fotos. Quando elas não existem, o restante do cadastro de membros continua disponível e `POST /uploads` responde `503 IMAGE_STORAGE_UNAVAILABLE` com uma mensagem segura.

O upload aceita somente JPG, PNG e WebP, com limite de 5 MB. O frontend reduz a imagem para até 800 por 800 pixels antes do envio. Os arquivos ficam no caminho `kairos/{rede}/{igreja}/members` e a exclusão recusa identificadores que não pertençam à Rede e à igreja ativas.

Para validar em staging, configure uma conta Cloudinary exclusiva do ambiente, envie uma foto pelo formulário de membro, salve o cadastro, abra a imagem em uma nova sessão e remova a foto. Confirme no painel do provedor que o arquivo foi criado e depois excluído. Não reutilize a chave de produção em desenvolvimento local.

## Build e migrations

O frontend incorpora `NEXT_PUBLIC_API_URL` no build. No Docker Compose, esse valor é enviado como argumento de build. Alterar apenas a variável do container já construído não troca a URL; faça um novo build.

As migrations ficam versionadas em `backend/prisma/migrations`. O serviço `migrate` executa `prisma migrate deploy` uma vez e o backend só inicia quando essa etapa termina com sucesso. O volume persiste somente `backend/prisma/data`, portanto não oculta as migrations incluídas na imagem.

Valide a configuração antes do deploy:

```bash
docker compose config --quiet
pnpm --filter @kairos/backend exec prisma validate
```

Para subir a pilha:

```bash
docker compose up --build -d
docker compose ps
```

Não use `prisma db push` em produção. Para rollback de schema, pare a aplicação, restaure o backup anterior à migration e volte para a imagem anterior. As migrations atuais não possuem `down` automático.

## Backup e restauração

O MVP usa SQLite e uma única réplica gravadora. Faça backup com o backend parado ou em janela sem escritas para garantir uma cópia consistente:

```bash
docker compose stop backend
docker compose run --rm backend pnpm --filter @kairos/backend backup
docker compose start backend
```

O arquivo é salvo em `backend/backups` no container e no diretório `backups` do host pelo volume do Compose. Agende a cópia diariamente, criptografe-a e replique-a para armazenamento externo com retenção definida.

Restauração exige confirmação explícita com `--force` e cria uma cópia `pre-restore` do banco atual antes de sobrescrevê-lo:

```bash
docker compose stop backend
docker compose run --rm backend pnpm --filter @kairos/backend restore -- backups/kairos-AAAA-MM-DD.db --force
docker compose run --rm migrate
docker compose start backend
```

Depois, confira `/health`, faça login e valide as contagens de membros, grupos, eventos e finanças. Nunca ensaie restore diretamente no banco de produção: copie o backup para staging e execute o procedimento completo lá.

## Monitoramento e resposta

- `GET /health` verifica API, banco e uptime.
- Toda resposta da API inclui `X-Request-Id`. O backend reutiliza um identificador recebido somente quando ele contém até 128 caracteres alfanuméricos ou `._:-`; nos demais casos gera um UUID. Registre esse valor no frontend e no suporte para localizar a mesma requisição nos logs.
- Falhas de banco fazem o health check responder 503 e geram log de erro correlacionado, sem expor detalhes internos ao cliente.
- Em `SIGTERM` ou `SIGINT`, o processo fecha o Fastify, aguarda as conexões em andamento e desconecta o Prisma antes de encerrar. O orquestrador deve conceder uma janela de término, em vez de enviar encerramento forçado imediatamente.
- O Compose espera o healthcheck do backend antes de iniciar o frontend.
- Encaminhe os logs estruturados do Fastify ao agregador da hospedagem.
- Alerte para respostas 5xx, 429, falha da migration e três falhas consecutivas do healthcheck.
- Defina quem recebe alertas, o canal de incidente e o tempo máximo de resposta antes do lançamento.

## Checklist por deploy

- [ ] Backup recente copiado para fora do servidor e restore ensaiado em staging.
- [ ] Imagens identificadas por versão imutável e versão anterior disponível.
- [ ] `JWT_SECRET` e `SMTP_PASSWORD` vieram do gerenciador de segredos.
- [ ] `FRONTEND_URL` e `NEXT_PUBLIC_API_URL` apontam para os domínios públicos corretos.
- [ ] `docker compose config --quiet` passou sem interpolação ausente.
- [ ] Serviço `migrate` terminou com código zero.
- [ ] Backend ficou saudável e o frontend abriu.
- [ ] Setup ou login, troca de unidade, CRUD principal e logout passaram no smoke test.
- [ ] Convite e recuperação chegaram em uma caixa externa.
- [ ] Logs e alertas foram observados pela pessoa responsável.
