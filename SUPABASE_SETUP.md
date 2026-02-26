# Smart Andon - Setup Supabase

## 🔧 Configuração do Banco de Dados

Este guia descreve como configurar o Supabase para o Smart Andon com comunicação em tempo real.

### Pré-requisitos

- Conta Supabase criada
- URL do Supabase: `https://lfnyqsxtfvcwvhvstwoe.supabase.co`
- Anon Key: `sb_publishable_5cLB8UfDurOPmYNsEmHNfg_MB2juGQo`

## 📋 Passo 1: Criar Tabelas

1. Acesse o [Dashboard Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **SQL Editor** (ícone de chave inglesa)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase-schema.sql`
6. Clique em **Run**

### O que será criado:

- **Tabela `catalogo_pecas`**: Catálogo de peças com 10 itens de teste
- **Tabela `registros_andon`**: Registros de andon com timestamp
- **Índices**: Para otimizar queries
- **Seed Data**: 10 peças pré-carregadas

## 🔐 Passo 2: Configurar Row Level Security (Opcional)

Para ambiente de produção, recomenda-se ativar RLS:

1. Vá para **Authentication** → **Policies**
2. Crie policies para cada tabela:

### Policy para `catalogo_pecas` (Leitura Pública)

```sql
CREATE POLICY "Allow public read on catalogo_pecas"
  ON catalogo_pecas FOR SELECT
  USING (ativo = true);
```

### Policy para `registros_andon` (Inserção Pública)

```sql
CREATE POLICY "Allow public insert on registros_andon"
  ON registros_andon FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read on registros_andon"
  ON registros_andon FOR SELECT
  USING (true);
```

## 🔄 Passo 3: Habilitar Realtime (Comunicação em Tempo Real)

1. Vá para **Database** → **Replication**
2. Clique em **Source** (seu projeto)
3. Ative replication para as tabelas:
   - `catalogo_pecas`
   - `registros_andon`

Isso permite que mudanças no banco sejam transmitidas em tempo real para os clientes.

## 📊 Passo 4: Verificar Dados

1. Vá para **Table Editor**
2. Selecione `catalogo_pecas`
3. Verifique se as 10 peças foram inseridas
4. Selecione `registros_andon` (vazia inicialmente)

## 🧪 Passo 5: Testar Conexão

O projeto já inclui a configuração do Supabase em `client/src/lib/supabase.ts`.

Para testar a conexão:

```bash
cd /home/ubuntu/smart-andon-vw
pnpm dev
```

Abra o navegador em `http://localhost:3000` e verifique o console (F12) para erros de conexão.

## 🚀 Passo 6: Deploy na Vercel

Quando fizer deploy na Vercel, adicione as variáveis de ambiente:

1. No Dashboard da Vercel, vá para **Settings** → **Environment Variables**
2. Adicione:
   ```
   VITE_SUPABASE_URL=https://lfnyqsxtfvcwvhvstwoe.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_5cLB8UfDurOPmYNsEmHNfg_MB2juGQo
   ```

## 📝 Estrutura das Tabelas

### `catalogo_pecas`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| codigo | VARCHAR(10) | Código único da peça (ex: 088) |
| nome | VARCHAR(255) | Nome da peça |
| descricao | TEXT | Descrição opcional |
| ativo | BOOLEAN | Peça ativa (true) ou inativa (false) |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data da última atualização |

### `registros_andon`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| tacto | VARCHAR(3) | Tacto informado (3 dígitos) |
| codigo_peca | VARCHAR(10) | Código da peça (FK) |
| nome_peca | VARCHAR(255) | Nome da peça (desnormalizado) |
| celula | VARCHAR(100) | Célula de origem (ex: CÉLULA DE VIDROS) |
| horario | TIMESTAMP | Horário do registro |
| criado_em | TIMESTAMP | Data de criação |

## 🔍 Queries Úteis

### Listar todas as peças ativas

```sql
SELECT * FROM catalogo_pecas WHERE ativo = true ORDER BY codigo;
```

### Contar registros de hoje

```sql
SELECT COUNT(*) FROM registros_andon 
WHERE DATE(criado_em) = CURRENT_DATE;
```

### Peças mais solicitadas

```sql
SELECT codigo_peca, nome_peca, COUNT(*) as total
FROM registros_andon
GROUP BY codigo_peca, nome_peca
ORDER BY total DESC
LIMIT 10;
```

### Registros por hora

```sql
SELECT 
  DATE_TRUNC('hour', criado_em) as hora,
  COUNT(*) as total
FROM registros_andon
WHERE DATE(criado_em) = CURRENT_DATE
GROUP BY DATE_TRUNC('hour', criado_em)
ORDER BY hora DESC;
```

## 🔗 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)

## ⚠️ Troubleshooting

### Erro: "Relation does not exist"

- Verifique se o script SQL foi executado com sucesso
- Confirme que as tabelas aparecem em **Table Editor**

### Erro: "Anonymous access denied"

- Verifique se as policies estão criadas
- Confirme que `ativo = true` para peças

### Realtime não funciona

- Verifique se replication está habilitada
- Reinicie o servidor: `pnpm dev`

### Dados não aparecem no app

- Abra o console (F12) e procure por erros
- Verifique a conexão com Supabase
- Confirme que as variáveis de ambiente estão corretas

## 📞 Suporte

Para dúvidas sobre Supabase, consulte a [documentação oficial](https://supabase.com/docs).

---

**Última atualização**: Fevereiro 2026
