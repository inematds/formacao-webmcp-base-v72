// deteccao.js — detecção de recurso do WebMCP com fallback (kit do curso 0, Formação WebMCP).
// Spec usada: WebMCP, Draft Community Group Report de 16/10/2026 (document.modelContext).
// É rascunho de Community Group, não padrão: no Chrome só com origin trial (149–156) ou flag local.
// Sem a API, nada muda: o formulário acima continua sendo o caminho para pessoas e agentes.
(function () {
  const caminho = "modelContext" in document
    ? "WebMCP presente: aqui a página registraria as ferramentas (curso 2 da formação)"
    : "WebMCP ausente: o site segue pelo formulário, igual para todos";
  document.documentElement.dataset.webmcp = "modelContext" in document ? "sim" : "nao";
  console.log(caminho);
})();
