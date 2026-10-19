// arvore.mjs — mostra a página como um agente de navegador a lê: a árvore de acessibilidade
// (o snapshot que o Playwright MCP entrega ao modelo) ao lado da captura de tela, e confere
// o que falta para um agente achar cada campo pelo nome.
// Uso: node arvore.mjs [antes|depois|arquivo.html|https://seu-site] [--tela /tmp/tela.png]
// Saída 0 = nenhum problema; 1 = há controles sem nome ou HTML sem semântica.
import { chromium } from "playwright";
import { abrir } from "./servidor.mjs";

const args = process.argv.slice(2);
const iTela = args.indexOf("--tela");
const tela = iTela >= 0 ? args.splice(iTela, 2)[1] : null;
const alvo = args[0] || "depois";

const { url, fechar } = await abrir(alvo);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto(url, { waitUntil: "load" });

const arvore = await page.locator("body").ariaSnapshot();
const linhas = arvore.split("\n");
console.log(`## árvore de acessibilidade · ${linhas.length} linhas · ${Buffer.byteLength(arvore)} bytes`);
console.log(linhas.slice(0, 18).join("\n") + (linhas.length > 18 ? "\n(…)" : ""));
if (tela) {
  const png = await page.screenshot({ path: tela });
  console.log(`## tela · ${tela} · ${png.length} bytes (o modelo teria de ler pixels)`);
}

const problemas = [];
const CONTROLES = /^\s*- (textbox|combobox|checkbox|radio|spinbutton|button|link|img)(?: "([^"]*)")?/;
for (const l of linhas) {
  const m = l.match(CONTROLES);
  if (m && !m[2]) problemas.push(`${m[1]} sem nome acessível`);
}
const dom = await page.evaluate(() => {
  const r = [];
  if (!document.documentElement.lang) r.push("<html> sem lang");
  if (!document.querySelector("main")) r.push("sem <main>");
  if (!document.querySelector("h1")) r.push("sem <h1>");
  for (const el of document.querySelectorAll("[onclick]"))
    if (!["BUTTON", "A", "INPUT"].includes(el.tagName)) r.push(`<${el.tagName.toLowerCase()}> clicável que não é botão ("${el.textContent.trim()}")`);
  for (const el of document.querySelectorAll("input:not([type=hidden]), select, textarea"))
    if (!el.labels?.length && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby"))
      r.push(`campo #${el.id || "?"} sem <label>${el.placeholder ? " (só placeholder)" : ""}`);
  return r;
});
problemas.push(...dom);

console.log(`## conferência · ${url.replace(/127\.0\.0\.1:\d+/, "127.0.0.1:PORTA")}`);
for (const p of problemas) console.log(`  - ${p}`);
console.log(`problemas: ${problemas.length}`);

await browser.close();
await fechar();
process.exit(problemas.length ? 1 : 0);
