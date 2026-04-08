# Changelog
Todos os lançamentos e mudanças notáveis neste projeto serão documentados neste arquivo.
Os tópicos tem a seguinte descrições
- **Adicionado**: Para novos recursos.
- **Corrigido**: Para bugs resolvidos.
- **Alterado**: Para mudanças em funcionalidades já existentes.
- **Removido**: Para recursos que foram tirados do app.

## [?.?.?] - 2026-04-?? (implementando)
### Adicionado
- Adcionar a funcionalidade de manter dados da ultima reunião
- Adcionar a descrição do número da ATA no relatório do WhatAPP
### Alterado
- Melhoramento na apresentação de dados no relatório do WhatAPP omitindo campos com valor zero

## [2.4.7] - 2026-04-08
### Alterado
- reescrita e adição de funções que garanta que a plciação funcione melhor no IOS/Safari
--Essa mudanças fora focadas nas mascaras dos campos de valor e data.
--No CSS foi adcionada uma instrução que impede o zoom automático no iOS em campos de formulário

## [2.4.6] - 2026-04-08
### Alterado
- Retirar a função "confirm()" quando acionar o botão "Limpar Tudo"
### Adicionado
- Modal para receber a confirmação ou não do usuário quando acionar o botão "Limpar Tudo"

## [2.3.6] - 2026-04-08
### Corrigido
- O campo 'data da reunião' esta deixando passar datas inexistentes ex: 31/02/2026 
- Alterar o 'innerHTML' para 'textContent' e habilitar o  white-space: pre-line na propriedade CSS #message
--para quando a string conter o caractere \n acontecer uma quebra de linha na página.
--A medida de trocar 'innerHTML' para 'textContent' é importante pois 
--é segura contra ataques de injeção de código (XSS) do que usar innerHTML.

## [2.3.5] - 2026-04-08
### Removido
- Alert para validar o não preencimeno do campo 14 na tela inicial
### Adicionado
- Para informar ao usuário a necessidade de preencher o valor do campo 14 a mensagem é exibida na proria pagina
-- desaparecendo automaticamente
### Alterado
- Modularização e molhoramento dos códigos .js(s) e .css(s)
-- Como agora está usando módulos (type="module"), o navegador exige que o projeto seja rodado através de um servidor local   para carregar os arquivos (por questões de segurança do protocolo http/https).
Se tentar abrir o index.html clicando duas vezes no arquivo (protocolo file://), os imports podem falhar.

## [2.2.4] - 2026-04-07
### Adicionado
- Inclusão Campo "número da atá" no carregamento inicial
- Inclusão Campo "Data da reunião" no carregamento inicial
- Inclusão dos campos "Data da reunião" e "número da atá" no relatório WhatsApp
### Alterado
- Retirar do relatório do WhatsApp as linhas 'Coleta na reunião' e 'Décimas recolhida' caso valor igual a zero
- Acrescentado mais dois caracteres "=" na parte de despesa do combo

## [2.1.3] - 2026-04-07
### Alterado
- Melhoramento no código que engloba a dinâmica de carregamento da página
- Mudançã no 'scroll' automático para uma transição mais suave.

## [2.1.2] - 2026-04-03
### Adicionado
- Criação do arquivo README.md e CHANGELOG.md
- Mudaça do texto das descrições de alguns tópicos

## [2.1.1] - 2026-04-03
### Adicionado
- Criação da funcionalidade "Enviar Relatório WhatsApp"
- Criação do arquivo README.md e CHANGELOG.md

## [2.0.1] - 2026-04-03
### Alterado
- Alterar estrutura do códico separando os arquivos em pastas
- Criação das pastas `assets`, `css`, `js`.

## [2.0.0] - 2026-04-02
### Alterado
- Reescrita do projeto para novo desing
- Melhoramento e reescrita das funções java script
- Retirar chamadas de Java Script do código HTML
- Retirada dos códigos de Java Script e CSS do html principal
### Corrigido
- Toranar o campo 27 não editável importando o valor do campo 12

## [1.0.0] - 2025-09-01
### Adicionado
- Implementar o PWA (Progressive Web App) na aplicação

## [0.1.0] - 2025-09-01
### Adicionado
- Primeira versão com um único arquivo HTML contendo JS e CSS