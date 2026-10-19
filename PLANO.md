# PLANO — Base: como os agentes usam um site hoje (Formação WebMCP · curso 0 de 6) — 19/10/2026

Repo `inematds/formacao-webmcp-base-v72`. Peça do CURRICULO: `~/projetos/wifi/longrun/2026-10-19-formacao-webmcp-v72/CURRICULO.md` §0. Régua de "atual": `PESQUISA-ESTADO-DA-ARTE.md` (19/10/2026).
Público: dev web, maker ou dono técnico de site que edita HTML/JS e roda terminal; nunca mexeu com agentes no site. Sai com o diagnóstico do próprio site.
Kit: `kit/` (Playwright 1.63.0 de 04/09/2026, página fictícia Oficina Pedal Livre, scripts locais). **Nenhum passo chama modelo.** Todas as práticas rodam em 127.0.0.1 ou no site do próprio aluno.

## Conferência das fontes (passo 0, regra do Nei de 19/10)

Legenda: **confere** com a PESQUISA · **velho** (substituído pelo atual, não copiado) · **sem confirmação** (fora, ou "relatado por X").

| Fonte antiga | O que afirma | Marca | O que o curso 0 usa |
|---|---|---|---|
| `webmcp-2-builder/curso/builder/modulo-1-1` | "Cinco formas de conversar com um site": Web semântica, automação, API, MCP, WebMCP | **velho** (mapa sem os agentes de out/2026) | Vira 3 jeitos (ler, operar a tela, chamar ferramenta) com os agentes da PESQUISA §3 (Playwright MCP com snapshot de acessibilidade, Chrome DevTools MCP, Claude para Chrome) |
| idem | API em `document.modelContext.registerTool` com `AbortController` | **confere** (§1.2) | Só o nome da superfície e a detecção; `registerTool` é do curso 2 |
| idem | "Snapshot conferido em 24/09/2026, draft de 17/09/2026" | **velho** | Spec de **16/10/2026** (`dt-updated` lido em 19/10 pelo `kit/estado.sh`) |
| `inemaeventos/webmcp/index.html` §01 | "O padrão está nascendo agora… quem espera o padrão fechar chega tarde" | **velho** (tom de padrão iminente) | Rascunho de Community Group, "not a W3C Standard"; Chrome Status "Proposed", sem data de estável; WebKit contra (§1.1, §1.5, §1.6) |
| idem §01 | "Hoje atrás de Origin Trial no navegador" | **confere** | Origin trial Chrome 149–156 e Edge 150 (§1.5, §1.6), com selo "experimental em 19/10/2026" |
| idem §02 | "Um formulário que já existe vira ferramenta" (`toolname`) como caminho de entrada | **velho** | API declarativa **fora da spec**, só no Chrome (§1.4); no curso 0 só citada como tal; detalhe no curso 2 aula 6 |
| idem §04 | Arquitetura em 8 camadas (descoberta… evals) | **confere** como mapa | Não usada aqui (é do curso 5 aula 1) |
| idem §04/§05 | Readiness mede a camada 1; dicas de SEO (title, canonical, alt) | **confere** | Aula 7 lê o Readiness; SEO a fundo → Formação inemaSEO |
| `webmcp-1-formacao` | "80 horas · 12 semanas", 16 módulos, 4 fases | **velho** | Formação v7.2 de 6 cursos × 8 aulas; nada de carga horária prometida |
| idem | Readiness como diagnóstico de entrada | **confere** | Aula 7 |
| `webmcp-readiness` (remoto `3f3d1c8`, 24/09/2026, v2.2.2) | Detecta só `document.modelContext` (`text-signals.mjs`), regra `origin-trial`, rede privada bloqueada salvo `ALLOW_PRIVATE_TARGETS=1` | **confere** (§1.2, §1.5) | Aula 7 roda o scanner local, versão fixada; `npm test` → 33 pass (capturado) |
| idem | Pesos 0,3 WebMCP · 0,3 SEO · 0,2 GEO · 0,2 AEO na nota geral (`audit-rules.mjs`) | **confere** com o código | Citado; leitura dos pesos → `formacao-inemaseo-sistemas-v72` aula 3 |
| idem | `learningRecommendations` aponta para `webmcp-1-formacao` | **velho** (fora do escopo: repo de fonte não se altera) | Anotado no retorno para o Nei |
| idem (local `9ae7d73`) | 5 commits à frente do remoto | n/a | O curso fixa o commit **publicado** `3f3d1c8` |
| `webmcp-2-builder/labs/inema-cursos.html` | Lab com Tailwind CDN e registro real quando `document.modelContext` existe | **confere** na API; **não usado** | Página própria do kit, sem CDN (o lab depende de rede e mistura curso 2) |
| `agent-browser/README.md` | `snapshot` devolve a árvore de acessibilidade com refs | **confere** (§3.4, mesmo princípio do Playwright MCP) | Aula 2 usa `locator.ariaSnapshot()` do Playwright 1.63.0 (o mesmo formato que o Playwright MCP entrega) |
| Short WebMCP (`eventos-shorts` v1.0.0, SRT PT/EN/ES) | "Com WebMCP a página descreve o que sabe fazer" | **confere** | Usado na aula 1 como conceito |
| idem | "Um formulário que já existe vira ferramenta" | **velho** (declarativa fora da spec) | Aviso escrito embaixo do vídeo |
| idem | "A segurança fica com o site, não com o modelo" | **sem confirmação** / contraria §1.8 e §3 (prompt injection sem solução) | Aviso escrito: o site decide o que expõe, mas nenhum agente é imune; curso 4 |
| idem | Não diz `navigator` nem "padrão" | **confere** | — |
| `formacao-inemaseo-fundacao-v72` aula 6 | Robôs por finalidade (busca, ação do usuário, treino) e nomes | **confere** (curso irmão de 19/10, dono do assunto) | Aula 6 usa a tabela no `kit/robots.py` e aponta para lá |
| PESQUISA §4.6 | Web Bot Auth: rascunho IETF `-00`, RFC 9421, `Signature-Agent`, JWKS well-known; Cloudflare conta signed agents como Verified desde 01/07/2026 | **confere** | Aula 6, só conceito |
| PESQUISA §3.2/§3.3 | Atlas, auto browse | **[2ª]** | Fora como fato; Atlas só "relatado pela cobertura" se aparecer |
| Nomes de modelo nas fontes (astra: GPT-6 Astra; aiv2026: claude-haiku-4-5) | — | **velho / preso a modelo** | Nenhum nome de modelo como recomendação |

Atualizações em relação aos cursos antigos (vão para o retorno):
1. Spec 17/09/2026 → **16/10/2026**; superfície `document.modelContext` (PR #177, 19/05/2026); `navigator.modelContext` não aparece na spec (0 menções, `kit/estado.sh`).
2. "Padrão nascendo" → **rascunho de CG**, Chrome Status "Proposed", origin trial Chrome 149–156 / Edge 150, Mozilla neutra, WebKit contra (lido nas issues em 19/10).
3. "Formulário vira ferramenta" → **API declarativa fora da spec**, só no Chrome.
4. "Cinco formas" → **três jeitos** com os agentes de out/2026 (snapshot de acessibilidade do Playwright MCP).
5. MCP: revisão **2026-07-28** (stateless, `server/discover`); sem SSE/`initialize` no texto.
6. Readiness: rodado local com versão fixada (v2.2.2, `3f3d1c8`) e nota lida como diagnóstico, não ranking.

## As 8 aulas

| # | slug | Objetivo (≤160) | Diagrama | Prática · pronto quando |
|---|---|---|---|---|
| 1 | tres-jeitos | Distinguir ler, operar a tela e chamar ferramenta e ver os três rodando contra a página de exemplo do kit. | 3 jeitos + "o seu site" | `node tres-jeitos.mjs depois` → `2 · operar  achou 3 campos` · `saída: 0`; `antes` → `travou` · `saída: 1` |
| 2 | o-que-o-agente-ve | Ler a árvore de acessibilidade que o agente recebe e comparar com a captura de tela da mesma página. | tela × árvore × modelo | `node arvore.mjs antes --tela …` → `problemas: 10` · `saída: 1` |
| 3 | html-semantico | Corrigir rótulos, botão, landmarks e alt até o arvore.mjs não achar nenhum problema na sua cópia da página. | 6 consertos | `node arvore.mjs ~/oficina/antes.html` → `problemas: 0` · `saída: 0` |
| 4 | mcp-e-webmcp | Situar MCP (servidor) e WebMCP (página) numa figura e ver a detecção de recurso com fallback rodando. | agente ↔ servidor MCP / página WebMCP | `node detectar.mjs` → `sem API … botão Agendar: sim` · `saída: 0` |
| 5 | estavel-e-rascunho | Ler na fonte, com data, em que pé o WebMCP está: spec, origin trial e posição de cada navegador. | estável × rascunho | `bash estado.sh` → `versão de 2026-10-16` … `saída: 0` |
| 6 | quem-chega | Ler o seu robots.txt por finalidade e entender por que só uma assinatura identifica o agente. | busca / usuário / treino / assinatura | `python3 robots.py site/robots.txt` → `treino  GPTBot bloqueado` · `saída: 0` |
| 7 | readiness | Rodar o WebMCP Readiness na sua máquina e ler o diagnóstico sem confundir nota com ranking. | página → scanner → 4 categorias → plano | `npm test` → `ℹ pass 33`; `node readiness-local.mjs … depois` → `nota 52` |
| 8 | plano | Montar o plano do seu site para agentes com as saídas das aulas 1–7 e conferir que ficou completo. | mapa (4 degraus) + gerador | `python3 conferir-plano.py meu-plano.md` → `7/7 seções preenchidas` · `saída: 0` |

Dono de cada assunto (só link): robots completo → inemaSEO fundação aula 6; pesos/nota → inemaSEO sistemas aula 3; WebMCP como preparação para dono de site → inemaSEO IAs aula 7; MCP servidor → curso 1; API WebMCP → curso 2; agentes de navegador → curso 3; prompt injection/Web Bot Auth a fundo → curso 4.
Vídeo: short WebMCP (PT/EN/ES) na aula 1, com aviso. Sem avatar novo.
