# Plano do meu site para agentes

## Site e data
Site: Oficina Pedal Livre (fictícia, kit/site/ do curso)
Data do diagnóstico: 19/10/2026

## Como os agentes usam o site hoje
Ler: o HTML traz o h1, um formulário e três rótulos. Operar: um agente de navegador acha os três campos e o botão pelo nome e agenda. Chamar: document.modelContext ausente no Chromium do teste, então o agente fica em operar a tela.

## O que o agente enxerga
Problemas do arvore.mjs antes: 10 · depois das correções: 0
Correções: label em cada campo, button no lugar do div clicável, main, h1, lang="pt-BR" e alt na imagem.

## Quem pode entrar
Busca liberada, ação do usuário liberada, treino bloqueado (decisão anotada no robots.txt). O robots.txt pede; não identifica quem chega.

## Readiness
Nota: 52 em 19/10/2026 (diagnóstico, não ranking)
Primeiro: descrição nos resultados e URL canônica (SEO, curso Fundação da inemaSEO). As falhas de ferramentas WebMCP ficam para o curso 2: sem ferramenta registrada, elas são esperadas.

## WebMCP
Estado lido em 19/10/2026: spec de 16/10/2026 (rascunho de Community Group), origin trial no Chrome 149 e no Edge 150, Mozilla neutra, WebKit contra.
Decisão: laboratório no curso 2, com detecção de recurso e o formulário como fallback.

## Próximos passos
Curso 1 (servidor MCP do serviço de agendamento). Rever este plano em 19/01/2027 ou quando a spec mudar de data.
