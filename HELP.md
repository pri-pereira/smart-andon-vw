# 📖 Manual do Usuário - Smart Andon VW

Bem-vindo ao **Smart Andon Volkswagen Taubaté**! Este manual fornece instruções passo a passo para operadores e equipes de logística.

---

## 🎯 Guia do Operador

### O que é o Smart Andon?

O Smart Andon é um sistema de comunicação visual em tempo real que permite aos operadores registrar rapidamente quando uma peça é necessária na linha de produção. O sistema alerta a equipe de logística para entregar a peça dentro de um prazo de **600 segundos (10 minutos)**.

### Passo 1: Acessar a Página do Operador

1. Abra o navegador e acesse a página inicial do Smart Andon.
2. Clique no botão **"Operador"** (com o ícone de capacete).
3. Você será direcionado para a tela de entrada de dados.

### Passo 2: Informar o Número do Tacto

1. Na tela **"INFORME O TACTO"**, você verá um teclado numérico.
2. Digite os **3 dígitos do seu tacto** (número de identificação da sua estação de trabalho).
3. Exemplo: Se seu tacto é **123**, clique nos botões 1, 2, 3 na sequência.
4. Clique no botão **"CONFIRMAR"** para prosseguir.

**Dica:** Se cometer um erro, clique em **"LIMPAR"** para recomeçar.

### Passo 3: Selecionar a Peça Necessária

1. Na tela **"NÚMERO DA PEÇA"**, você verá um teclado numérico novamente.
2. Digite o **código da peça** que você precisa.
3. Exemplos de códigos:
   - **088**: Vidro Lateral Polo
   - **101**: Para-brisa Taos
   - **202**: Vigia Traseiro T-Cross
   - **303**: Vidro Porta Dianteira
   - **404**: Kit Fixação Cola
   - **505**: Guarnição de Borracha
   - **606**: Sensor de Chuva
   - **707**: Presilha de Fixação
   - **808**: Vidro Lateral Virtus
   - **909**: Selante PU Industrial

4. Conforme você digita, o sistema procura a peça automaticamente.
5. Quando a peça for encontrada, você verá uma mensagem **"✓ Peça Encontrada"** com o nome da peça.
6. Clique em **"ENVIAR"** para registrar o andon.

**Dica:** Se a peça não for encontrada, verifique o código e tente novamente.

### Passo 4: Confirmação de Sucesso

1. Após clicar em "ENVIAR", você verá uma tela de confirmação com um **checkmark verde** e a mensagem **"Andon registrado com sucesso!"**.
2. O sistema retornará automaticamente à tela inicial para um novo registro.
3. A equipe de logística foi notificada e começará a contar o tempo para entregar a peça.

### ⏱️ Entendendo o Tempo de Tacto

- **Tacto**: 600 segundos (10 minutos)
- **Verde (0-50%)**: Fluxo normal - peça em caminho.
- **Amarelo (50-80%)**: Alerta - prazo de entrega se aproximando.
- **Vermelho (80-100%)**: Risco de parada - peça atrasada.
- **Vermelho (>100%)**: Tempo excedido - atraso crítico.

---

## 🚚 Guia da Logística

### O que é o Dashboard de Logística?

O Dashboard de Logística é a central de controle onde você monitora todos os andons registrados pelos operadores. Você pode ver em tempo real quais peças precisam ser entregues e o status de cada entrega.

### Passo 1: Acessar o Dashboard

1. Abra o navegador e acesse a página inicial do Smart Andon.
2. Clique no botão **"Logística"** (com o ícone de caminhão).
3. Você será direcionado para a página de login.
4. Faça login com suas credenciais corporativas (e-mail e senha Volkswagen).

### Passo 2: Entender a Interface

A página do Dashboard está dividida em três seções principais:

#### **Seção 1: Estatísticas (Cards no Topo)**

- **Total**: Número total de andons registrados para a data selecionada.
- **Concluídos**: Número de entregas finalizadas.
- **Pendentes**: Número de entregas ainda aguardando conclusão.

#### **Seção 2: Filtro por Data**

- Use o campo **"Filtrar por Data"** para visualizar andons de um dia específico.
- Por padrão, o sistema mostra os andons de **hoje**.
- Clique no campo de data para selecionar um dia diferente.

#### **Seção 3: Lista de Entregas**

Cada card de entrega contém:

- **Barra de Progresso Horizontal**: Mostra visualmente o tempo decorrido desde o registro do andon.
  - **Verde**: Até 50% do tempo (fluxo normal).
  - **Amarelo**: 50% a 80% (alerta).
  - **Vermelho**: Acima de 80% (risco de parada).
  - **Tempo em MM:SS**: Exibido acima da barra.

- **Informações da Peça**:
  - **Tacto**: Número da estação de trabalho que solicitou a peça.
  - **Código**: Código único da peça.
  - **Peça**: Nome completo da peça.
  - **Horário**: Hora exata em que o andon foi registrado.
  - **Célula**: Área de produção (ex: Célula Vidros).

- **Status**:
  - Se a entrega está **Pendente**: Você verá um botão verde **"✓ Entrega Concluída"**.
  - Se a entrega está **Concluída**: Você verá uma mensagem verde com a hora de conclusão.

### Passo 3: Registrar uma Entrega Concluída

1. Localize o card da peça que você acabou de entregar.
2. Clique no botão **"✓ Entrega Concluída"** (botão verde).
3. O sistema registrará a conclusão e atualizará o status do card.
4. Você verá uma confirmação visual com a mensagem **"Entrega de [Nome da Peça] concluída!"**.

### Passo 4: Monitorar Entregas Críticas

- **Barras Vermelhas**: Indicam entregas que estão atrasadas ou em risco de parada.
- **Barras Amarelas**: Indicam entregas que precisam de atenção em breve.
- **Barras Verdes**: Indicam entregas dentro do prazo normal.

Priorize as entregas com barras vermelhas para evitar paradas na produção.

### ⏰ Dicas Importantes para Logística

1. **Atualize o Dashboard Regularmente**: O sistema atualiza em tempo real, mas verifique periodicamente.
2. **Cumpra o Prazo de 600 Segundos**: Cada segundo conta! Tente entregar antes que a barra fique vermelha.
3. **Comunique Atrasos**: Se houver algum problema, comunique imediatamente ao supervisor.
4. **Verifique a Data**: Certifique-se de que está visualizando a data correta no filtro.

---

## 🔧 Troubleshooting (Resolução de Problemas)

### Problema: Peça não aparece no Dashboard após registro

**Solução**: 
- Verifique se você está visualizando a data correta no filtro.
- Recarregue a página (F5 ou Ctrl+R).
- Verifique se o código da peça foi digitado corretamente.

### Problema: Barra de progresso não está atualizando

**Solução**:
- Recarregue a página.
- Verifique sua conexão com a internet.
- Limpe o cache do navegador.

### Problema: Não consigo fazer login

**Solução**:
- Verifique se está usando suas credenciais corporativas (e-mail Volkswagen).
- Verifique se o CAPS LOCK está desativado.
- Tente redefinir sua senha clicando em "Esqueceu a senha?".

### Problema: O sistema mostra a data errada

**Solução**:
- O sistema usa o horário de Brasília (UTC-3).
- Verifique se o relógio do seu computador está correto.
- Se o problema persistir, contate o suporte técnico.

---

## 📞 Suporte Técnico

Se você encontrar problemas que não estão listados acima, entre em contato com:

- **E-mail**: suporte@volkswagen.com.br
- **Telefone**: (12) 3634-1234
- **Horário**: Segunda a sexta, 7h às 17h

---

## 📋 Resumo Rápido

### Para Operadores:
1. Clique em **"Operador"** na página inicial.
2. Digite seu **tacto** (3 dígitos).
3. Digite o **código da peça**.
4. Clique em **"ENVIAR"**.
5. Pronto! A logística foi notificada.

### Para Logística:
1. Clique em **"Logística"** na página inicial.
2. Faça login com suas credenciais.
3. Monitore a **barra de progresso** de cada peça.
4. Clique em **"✓ Entrega Concluída"** quando entregar a peça.
5. Priorize as **barras vermelhas** (atrasos).

---

**Versão**: Smart Andon v2.0  
**Última atualização**: Fevereiro de 2026  
**Desenvolvido por**: Volkswagen Taubaté - Célula de Vidros
