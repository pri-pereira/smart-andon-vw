# Smart Andon - Guia de Deploy

## Visão Geral

O Smart Andon é um PWA (Progressive Web App) otimizado para tablets Android em ambiente industrial. Este guia descreve como fazer o deploy na Vercel.

## Pré-requisitos

- Conta no GitHub
- Conta na Vercel (conectada ao GitHub)
- Node.js 18+ instalado localmente (opcional, para testes)

## Estrutura do Projeto

```
smart-andon-vw/
├── client/                 # Frontend React + Tailwind CSS
│   ├── public/            # Ativos estáticos (ícones, manifesto, SW)
│   ├── src/
│   │   ├── pages/         # Páginas: Operador, Logística
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Hooks customizados
│   │   └── index.css      # Estilos globais + Tailwind
│   └── index.html         # HTML principal
├── server/                # Express server (compatibilidade)
├── shared/                # Tipos TypeScript compartilhados
└── package.json           # Dependências do projeto
```

## Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Fazer Push do Código para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial Smart Andon MVP"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/smart-andon-vw.git
   git push -u origin main
   ```

2. **Conectar Vercel ao GitHub**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Selecione o repositório `smart-andon-vw`

3. **Configurar Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar (2-3 minutos)
   - Seu app estará disponível em `https://smart-andon-vw.vercel.app`

### Opção 2: CLI da Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Deploy em produção
vercel --prod
```

## Configuração de Domínio Customizado

1. No Dashboard da Vercel, acesse **Settings** → **Domains**
2. Adicione seu domínio customizado (ex: `andon.volkswagen.com`)
3. Configure os registros DNS conforme instruções da Vercel
4. Aguarde propagação DNS (até 48 horas)

## Variáveis de Ambiente

Atualmente, o MVP usa dados locais (localStorage). Para integração com Supabase em produção:

1. Crie um projeto no [Supabase](https://supabase.com)
2. No Dashboard da Vercel, acesse **Settings** → **Environment Variables**
3. Adicione as variáveis:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

## Funcionalidades PWA

### Instalação em Tela Inicial

O app oferece automaticamente a opção "Adicionar à Tela de Início" em navegadores Android:

1. Abra o app em um tablet Android
2. Toque no menu (⋮) do navegador
3. Selecione "Adicionar à tela de início"
4. O app será instalado como um aplicativo nativo

### Funcionalidade Offline

O Service Worker (`sw.js`) permite uso offline:
- Acesso aos dados já carregados
- Sincronização automática quando retorna online
- Cache de ativos estáticos

## Monitoramento

### Analytics

O projeto inclui integração com Umami Analytics:
- Acesse o Dashboard da Vercel para visualizar métricas
- Rastreamento automático de pageviews e eventos

### Logs

Para visualizar logs em tempo real:

```bash
vercel logs [deployment-url]
```

## Troubleshooting

### Build falha com erro de TypeScript

```bash
# Limpar cache e reconstruir
rm -rf .next dist node_modules
pnpm install
pnpm build
```

### App não carrega no tablet

1. Verifique conexão Wi-Fi
2. Limpe cache do navegador: Menu → Configurações → Aplicativos → Chrome → Armazenamento → Limpar Cache
3. Recarregue a página (Ctrl+Shift+R)

### Ícones não aparecem

1. Verifique se os arquivos estão em `client/public/`:
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
   - `manifest.json`

2. Recarregue com cache limpo

## Próximos Passos

### Integração com Supabase (Recomendado)

Para funcionalidade em tempo real com banco de dados:

1. Crie tabelas no Supabase:
   ```sql
   CREATE TABLE catalogo_pecas (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     codigo VARCHAR(10) UNIQUE NOT NULL,
     nome VARCHAR(255) NOT NULL,
     descricao TEXT,
     ativo BOOLEAN DEFAULT true,
     criado_em TIMESTAMP DEFAULT now(),
     atualizado_em TIMESTAMP DEFAULT now()
   );

   CREATE TABLE registros_andon (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     tacto VARCHAR(3) NOT NULL,
     codigo_peca VARCHAR(10) NOT NULL,
     nome_peca VARCHAR(255) NOT NULL,
     celula VARCHAR(100) NOT NULL,
     horario TIMESTAMP NOT NULL,
     criado_em TIMESTAMP DEFAULT now()
   );
   ```

2. Instale cliente Supabase:
   ```bash
   pnpm add @supabase/supabase-js
   ```

3. Atualize hooks em `client/src/hooks/` para usar Supabase Realtime

### Autenticação de Operadores

Implemente login simples para rastrear qual operador registrou cada andon:

1. Adicione tabela `operadores` no Supabase
2. Implemente tela de login antes do fluxo principal
3. Inclua `operador_id` em cada registro

### Relatórios e Dashboards

Expanda o dashboard de logística com:
- Filtros por data/hora
- Gráficos de peças mais solicitadas
- Exportação de dados (CSV/PDF)
- Alertas em tempo real

## Suporte

Para dúvidas ou problemas:

1. Verifique logs no Dashboard da Vercel
2. Consulte documentação do Vite: https://vitejs.dev
3. Consulte documentação do Tailwind: https://tailwindcss.com
4. Consulte documentação do Supabase: https://supabase.com/docs

## Segurança

### Checklist de Segurança

- [ ] Variáveis de ambiente não commitadas (`.env` em `.gitignore`)
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] CORS configurado corretamente para APIs externas
- [ ] Rate limiting configurado no backend (se aplicável)
- [ ] Dados sensíveis não armazenados em localStorage

### Proteção de Dados

O MVP armazena dados em localStorage do navegador. Para ambiente de produção:

1. Implemente autenticação de operadores
2. Use Supabase com Row Level Security (RLS)
3. Criptografe dados sensíveis em trânsito (HTTPS)
4. Implemente auditoria de ações

## Licença

Projeto desenvolvido para Volkswagen Taubaté - Célula de Vidros.
