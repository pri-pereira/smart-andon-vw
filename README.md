# Smart Andon - Sistema de Andon para Volkswagen Taubaté

![Smart Andon](https://img.shields.io/badge/Status-MVP-blue)
![PWA](https://img.shields.io/badge/PWA-Progressive%20Web%20App-green)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS%204-blue)

## 📋 Visão Geral

**Smart Andon** é um sistema PWA (Progressive Web App) otimizado para tablets Android em ambiente industrial. Desenvolvido para a **Célula de Vidros da Volkswagen Taubaté**, permite que operadores registrem rapidamente tacto e código de peça com interface minimalista e intuitiva.

### Características Principais

✅ **Interface Industrial Minimalista**
- Design Modernismo Industrial com Azul Volkswagen (#001E50)
- Botões grandes (64x64px) otimizados para toque
- Tipografia clara e legível em qualquer iluminação

✅ **Fluxo Linear Simples**
- Tela 1: Informar Tacto (3 dígitos)
- Tela 2: Informar Código da Peça (com live-search)
- Confirmação com checkmark verde animado

✅ **Dashboard de Logística**
- Tabela em tempo real com registros de andon
- Estatísticas: Total, Hoje, Célula de Vidros
- Atualização automática a cada 2 segundos

✅ **PWA Completo**
- Instalação em tela inicial (Android/iOS)
- Funcionalidade offline com Service Worker
- Ícones em múltiplas resoluções

✅ **Pronto para Produção**
- Deploy imediato na Vercel
- Otimizado para performance
- Compatível com tablets Android via Wi-Fi

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- Git

### Instalação Local

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/smart-andon-vw.git
cd smart-andon-vw

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir em http://localhost:3000
```

### Build para Produção

```bash
# Compilar para produção
pnpm build

# Testar build localmente
pnpm preview
```

## 📁 Estrutura do Projeto

```
smart-andon-vw/
├── client/                          # Frontend React + Tailwind CSS
│   ├── public/
│   │   ├── manifest.json           # Manifesto PWA
│   │   ├── sw.js                   # Service Worker
│   │   ├── icon-192.png            # Ícone 192x192
│   │   ├── icon-512.png            # Ícone 512x512
│   │   ├── apple-touch-icon.png    # Ícone iOS
│   │   └── robots.txt              # SEO
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Operador.tsx        # Fluxo principal do operador
│   │   │   └── Logistica.tsx       # Dashboard de logística
│   │   ├── components/
│   │   │   ├── Header.tsx          # Cabeçalho com logo VW
│   │   │   ├── NumericKeyboard.tsx # Teclado numérico
│   │   │   └── SuccessCheckmark.tsx # Confirmação de sucesso
│   │   ├── hooks/
│   │   │   ├── useCatalogoPecas.ts # Hook para catálogo
│   │   │   └── useRegistroAndon.ts # Hook para registros
│   │   ├── App.tsx                 # Roteamento principal
│   │   ├── main.tsx                # Entry point React
│   │   └── index.css               # Estilos globais + Tailwind
│   └── index.html                  # HTML principal
├── server/                          # Express server (compatibilidade)
├── shared/
│   └── types.ts                    # Tipos TypeScript compartilhados
├── package.json                    # Dependências
├── DEPLOY.md                       # Guia de deploy
└── README.md                       # Este arquivo
```

## 🎨 Design System

### Cores (Identidade VW)

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul VW | #001E50 | Primário, textos, bordas |
| Branco Puro | #FFFFFF | Fundo, espaçamento |
| Verde Sucesso | #22C55E | Confirmação, sucesso |
| Vermelho Erro | #EF4444 | Alertas, erros |
| Cinza Claro | #F3F4F6 | Secundário, backgrounds |

### Tipografia

- **Display (Títulos)**: Roboto Bold 28-32px
- **Body (Texto)**: Roboto Regular 16-18px
- **Números**: Roboto Mono Bold 24-32px
- **Labels**: Roboto Medium 12-14px

### Componentes

#### NumericKeyboard
Teclado numérico com 16 botões (3x4 + ações):
```tsx
<NumericKeyboard
  onInput={(valor) => setTacto(tacto + valor)}
  onClear={() => setTacto('')}
  onSubmit={() => handleConfirm()}
  submitLabel="CONFIRMAR"
  submitDisabled={tacto.length !== 3}
/>
```

#### SuccessCheckmark
Animação de confirmação por 2 segundos:
```tsx
<SuccessCheckmark
  visible={showSuccess}
  message="Andon registrado com sucesso!"
  onComplete={() => resetForm()}
/>
```

## 📊 Dados de Teste

O sistema inclui 10 peças de teste:

| Código | Nome | Descrição |
|--------|------|-----------|
| 088 | Vidro Lateral Polo | Vidro lateral para Polo |
| 101 | Para-brisa Taos | Para-brisa para Taos |
| 202 | Vigia Traseiro T-Cross | Vigia traseiro para T-Cross |
| 303 | Vidro Porta Dianteira | Vidro de porta dianteira |
| 404 | Kit Fixação Cola | Kit de fixação com cola |
| 505 | Guarnição de Borracha | Guarnição de borracha |
| 606 | Sensor de Chuva | Sensor de chuva automático |
| 707 | Presilha de Fixação | Presilha para fixação |
| 808 | Vidro Lateral Virtus | Vidro lateral para Virtus |
| 909 | Selante PU Industrial | Selante poliuretano |

## 🔄 Fluxo de Uso

### Operador

1. **Tela 1 - Informar Tacto**
   - Teclado numérico aparece
   - Digita 3 dígitos
   - Botão CONFIRMAR ativa automaticamente

2. **Tela 2 - Informar Peça**
   - Teclado numérico aparece
   - Conforme digita, live-search busca peça
   - Peça encontrada exibe nome e código
   - Botão ENVIAR ativa quando peça encontrada

3. **Confirmação**
   - Checkmark verde com animação
   - Mensagem "Andon registrado com sucesso!"
   - Retorna automaticamente para Tela 1 após 2 segundos

### Logística

1. Acesse `/logistica`
2. Visualize tabela com todos os registros
3. Estatísticas em cards (Total, Hoje, Célula)
4. Atualização automática a cada 2 segundos

## 🌐 PWA - Instalação em Tela Inicial

### Android

1. Abra o app em um tablet Android
2. Toque no menu (⋮) do navegador
3. Selecione "Adicionar à tela de início"
4. O app será instalado como aplicativo nativo

### iOS

1. Abra o app em um iPad
2. Toque em Compartilhar
3. Selecione "Adicionar à Tela de Início"
4. O app será adicionado com ícone personalizado

## 🔧 Desenvolvimento

### Adicionar Nova Peça

Edite `client/src/hooks/useCatalogoPecas.ts`:

```typescript
{
  id: '11',
  codigo: '010',
  nome: 'Nova Peça',
  descricao: 'Descrição da peça',
  ativo: true,
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
}
```

### Adicionar Nova Rota

Edite `client/src/App.tsx`:

```typescript
<Route path={"/nova-rota"} component={NovaPagina} />
```

### Estender com Supabase

Para integração com banco de dados em tempo real:

1. Crie projeto em [supabase.com](https://supabase.com)
2. Instale cliente: `pnpm add @supabase/supabase-js`
3. Atualize hooks para usar Supabase Realtime
4. Configure variáveis de ambiente

## 📦 Deploy

### Vercel (Recomendado)

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

```bash
# Deploy rápido
vercel --prod
```

### Outras Plataformas

- **Netlify**: Suporta builds Vite
- **GitHub Pages**: Configure em Settings → Pages
- **Railway**: Suporta Node.js + Vite

## 🔒 Segurança

- ✅ HTTPS automático (Vercel)
- ✅ Service Worker para cache seguro
- ✅ Sem dados sensíveis em localStorage
- ✅ CORS configurado corretamente
- ⚠️ Implementar autenticação para produção

## 📱 Compatibilidade

| Dispositivo | Navegador | Status |
|-------------|-----------|--------|
| Android Tablet | Chrome | ✅ Testado |
| Android Tablet | Firefox | ✅ Suportado |
| iPad | Safari | ✅ Suportado |
| Desktop | Chrome | ✅ Funcional |
| Desktop | Firefox | ✅ Funcional |

## 🚨 Troubleshooting

### App não carrega

```bash
# Limpar cache
rm -rf .next dist node_modules
pnpm install
pnpm dev
```

### Ícones não aparecem

Verifique se arquivos estão em `client/public/`:
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

### Live-search não funciona

Verifique console do navegador (F12) para erros TypeScript.

## 📚 Documentação

- [Vite](https://vitejs.dev)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Wouter](https://github.com/molefrog/wouter)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m "Add: sua feature"`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

## 📄 Licença

Projeto desenvolvido para **Volkswagen Taubaté - Célula de Vidros**.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Volkswagen Taubaté**

Última atualização: Fevereiro 2026
