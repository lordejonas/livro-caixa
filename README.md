# 📘 Livro Caixa SSVP - Conferências

Uma **PWA (Progressive Web App)** desenvolvida para facilitar o lançamento e a prestação de contas do livro caixa das Conferências da Sociedade de São Vicente de Paulo (SSVP). 

O app automatiza cálculos complexos como as **Décimas**, repasses de **Coleta de Ozanam** e **Contribuição da Solidariedade**, gerando um resumo pronto para compartilhamento via WhatsApp.

---

## 🚀 Funcionalidades

* **Lançamentos Dinâmicos:** Interface limpa que exibe apenas os campos selecionados pelo usuário.
* **Cálculos Automáticos:** * Base de cálculo para Décimas (10%).
    * Soma de Receitas e Despesas da semana.
    * Balanço total e saldo em tesouraria.
    * Repasses automáticos baseados nos regulamentos da SSVP.
* **Relatório WhatsApp:** Gera um resumo formatado com a posição do caixa e a data atual para envio rápido em grupos.
* **Suporte Offline:** Funciona sem internet após o primeiro acesso, graças ao Service Worker.
* **Instalável:** Pode ser adicionado à tela inicial do Android ou iOS como um aplicativo nativo.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Estrutura responsiva com variáveis CSS.
* **JavaScript (Vanilla):** Lógica de cálculo e manipulação de DOM sem dependências externas.
* **PWA:** Service Worker para cache e `manifest.json` para instalação.
* **WhatsApp API:** Integração para exportação de dados via URL Encoding.

---

## 📂 Estrutura de Arquivos

```text
├── index.html          # Estrutura principal e formulários
├── manifest.json       # Configurações de instalação da PWA
├── sw.js               # Service Worker para funcionamento offline
├── css/
│   └── style.css       # Estilização responsiva e visual do app
├── js/
│   ├── script.js       # Core: Lógica de interface e cálculos matemáticos
│   └── export.js       # Relatório: Formatação e envio para WhatsApp
└── assets/
    └── icons/          # Ícones do aplicativo em diferentes tamanhos
```

---

## ⚙️ Como Utilizar

    Saldo Inicial: Informe o saldo da semana anterior e as décimas acumuladas (se houver).

    Lançamentos: Utilize o menu de seleção para escolher o tipo de entrada ou saída.

    Cálculo: Clique em "Calcular Lançamentos" para processar todos os valores.

    Compartilhamento: Após o cálculo, o botão verde de WhatsApp aparecerá para enviar o resumo.

    Limpeza: Para iniciar uma nova semana, utilize o botão "Limpar Tudo".

---

## 📝 Regras de Negócio Implementadas

    Campo 06 (Base Décima): Soma dos campos 01 a 05.

    Campo 24 (Décimas): 10% automático do valor no Campo 06.

    Repasses: O valor informado no Campo 08 (Ozanam/Solidariedade) é replicado automaticamente para o Campo 26 (Saída).

    Tesouraria: O cálculo final de recursos em tesouraria considera o saldo livre mais as provisões de décimas e contribuições a enviar ao Conselho Particula

---

## ✒️ Autoria e Versão

    Desenvolvido por: [Jonas Linhares Conferência Santa Perpétua e Santa Felicidade]

    Versão: 3.0.0-Beta N

---

## 🔄 Histórico de Versões

    Histórico de Mudanças: Veja o [CHANGELOG.md](./CHANGELOG.md) para detalhes de todas as atualizações.

---

"Servir aos nossos mestres e senhores com alegria e simplicidade."

---