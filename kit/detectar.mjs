// detectar.mjs — abre a página duas vezes e mostra a detecção de recurso do WebMCP com fallback:
//   sem API  → o que todo navegador comum faz hoje (19/10/2026)
//   com stub → um objeto vazio no lugar de document.modelContext, só para ver o outro ramo.
//              O stub NÃO é a API nem o polyfill; a API de verdade é assunto do curso 2.
// Nos dois casos o formulário tem de continuar lá: é o fallback.
// Uso: node detectar.mjs [depois|arquivo.html|https://seu-site]
import { chromium } from "playwright";
import { abrir } from "./servidor.mjs";

const { url, fechar } = await abrir(process.argv[2] || "depois");
const browser = await chromium.launch();
let ok = true;
for (const [rotulo, stub] of [["sem API ", false], ["com stub", true]]) {
  const page = await browser.newPage();
  if (stub) await page.addInitScript(() => Object.defineProperty(Document.prototype, "modelContext", { get: () => ({}), configurable: true }));
  const msgs = [];
  page.on("console", (m) => msgs.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  const botao = await page.getByRole("button", { name: "Agendar" }).count();
  const webmcp = msgs.find((m) => m.startsWith("WebMCP")) || "(a página não faz detecção)";
  if (!botao || webmcp.startsWith("(")) ok = false;
  console.log(`${rotulo} · ${webmcp} · botão Agendar: ${botao ? "sim" : "não"}`);
  await page.close();
}
await browser.close();
await fechar();
process.exit(ok ? 0 : 1);
