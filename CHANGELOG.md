# Changelog
Todos os lançamentos e mudanças notáveis neste projeto serão documentados neste arquivo.
Os tópicos tem a seguinte descrições
- **Adicionado**: Para novos recursos.
- **Corrigido**: Para bugs resolvidos.
- **Alterado**: Para mudanças em funcionalidades já existentes.
- **Removido**: Para recursos que foram tirados do app.

## [3.0.0] – 2026-04-10
### Adicionado
- Nova funcionalidade de contar cédulas/moedas e salvar os valores
- Inclusão da do menu na página index.html
- Separação em três páginas: contador.html, caixa.html e index.html dai versão 3
- Inclusão de tags no index.html para ter compatibilidade com iPhone/Safari
- Inclusão do icone "Livro Caixa" em dimensão 192x192

## [2.0.1] – 2026-04-10
### Alterado
- Mensagem de confirmação do botão "Encerrar"
- Reposicionar a chamada do arquivo js/script.js para a tag <head>
- Alterar manifest.json para ajustar a tela de abertura

## [2.0.0] – 2026-04-10
### Adicionado
- Criação da funcionalidade "Enviar Relatório WhatsApp"
- Criação da funcionalidade de abatimentos de valores quando houver repasses de décimas ou contribuições 
--da conferência para o Concelho Particular.
- Criação da possibilidade de armazenar o produto dos cálculos e carregar esses dados na tela inicial toda 
--vez que a aplicação for iniciada.
- Modularização e molhoramento dos códigos .js(s) e .css(s)
--Como agora está usando módulos (type="module"), o navegador exige que o projeto seja rodado através de 
--um servidor local   --para carregar os arquivos (por questões de segurança do protocolo http/https).
--Se tentar abrir o index.html clicando duas vezes no arquivo (protocolo file://), os imports podem falhar.
- Inclusão campo "número da ata" no carregamento inicial
- Inclusão campo "Data da reunião" no carregamento inicial
- Inclusão dos campos "Data da reunião"
- Melhoramento no código que engloba a dinâmica de carregamento da página
- Mudança no 'scroll' automático para uma transição mais suave.
- Adição de funções que garanta que a aplicação funcione melhor no IOS/Safari
--Essa mudanças fora focadas nas mascaras dos campos de valor e data.
--No CSS foi adcionada uma instrução que impede o zoom automático no iOS em campos de formulário
- Adicionar a instrução <meta name="theme-color" content="#0064b6"> que pinta a barra de status do 
--navegador/sistema. Só para Android.
### Alterado
- Reescrita do projeto para novo desing
- Melhoramento e reescrita das funções java script
- Retirar chamadas de Java Script do código HTML
- Retirada dos códigos de Java Script e CSS do html principal
- Alterar estrutura do código separando os arquivos em pastas
- Criação das pastas `assets`, `css`, `js` e dos arquivos README.md e CHANGELOG.md
- Fazer com que a mensagem de validação desapareça automaticamente
- Substituir as funções de alerta “alert()” e confirmação "confirm()" por Modal
### Corrigido
- Toranar o campo 27 não editável importando o valor do campo 12
- Ajustar alguns cálculos

## [1.0.0] – 2025-09-??
- Primeira versão da aplicação
- Foi construída para ser executada com a tecnologia PWA (Progressive Web App).
- Toda codificação de html, css e Java Script fica em um único arquivo html.