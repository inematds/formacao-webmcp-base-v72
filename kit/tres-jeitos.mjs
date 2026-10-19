// tres-jeitos.mjs — o mesmo pedido ("agendar uma revisão") pelos três jeitos que um agente usa um site:
//   1 · ler     baixa o HTML, sem rodar JavaScript (como uma ferramenta de fetch/busca)
//   2 · operar  abre um navegador, acha os campos pelo rótulo e clica (como um agente de navegador)
//   3 · chamar  procura ferramentas declaradas pela página (WebMCP, rascunho de 16/10/2026)
// Uso: node tres-jeitos.mjs [antes|depois|arquivo.html|https://seu-site]   (só no seu site ou local)
import { chromium } from "playwright";
import { abrir } from "./servidor.mjs";

const { url, fechar } = await abrir(process.argv[2] || "depois");
let falhou = false;

// 1 · ler
const html = await (await fetch(url)).text();
const conta = (re) => (html.match(re) || []).length;
const h1 = (html.match(/<h1[^>]*>([^<]*)</i) || [, "(sem <h1>)"])[1];
console.log(`1 · ler     ${(html.length / 1024).toFixed(1)} KB de HTML · h1: ${h1} · <form>: ${conta(/<form\b/gi)} · <label>: ${conta(/<label\b/gi)}`);

// 2 · operar
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: "load" });
const doKit = ["antes", "depois", undefined].includes(process.argv[2]);
if (!doKit) {
  // no seu site: conta os controles que o agente acha pelo nome na árvore de acessibilidade
  const arvore = await page.locator("body").ariaSnapshot();
  const ctl = [...arvore.matchAll(/^\s*- (textbox|combobox|checkbox|radio|spinbutton|button|link)(?: "([^"]*)")?/gm)];
  const sem = ctl.filter((m) => !m[2]).length;
  if (sem) falhou = true;
  console.log(`2 · operar  ${ctl.length} controles na árvore · ${sem} sem nome (esses o agente teria de adivinhar pela tela)`);
}
let passo = 'campo "Seu nome"';
if (doKit) try {
  await page.getByLabel("Seu nome").fill("Ana", { timeout: 2000 });
  passo = 'campo "Serviço"';
  await page.getByLabel("Serviço").selectOption("completa", { timeout: 2000 });
  passo = 'campo "Data"';
  await page.getByLabel("Data").fill("2026-10-25", { timeout: 2000 });
  passo = 'botão "Agendar"';
  await page.getByRole("button", { name: "Agendar" }).click({ timeout: 2000 });
  console.log(`2 · operar  achou 3 campos e o botão pelo nome · tela diz: ${await page.getByRole("status").textContent()}`);
} catch {
  falhou = true;
  console.log(`2 · operar  travou: não achou o ${passo} pelo nome em 2 s (o agente teria de adivinhar pela tela)`);
}

// 3 · chamar
// só LISTA as ferramentas (getTools); nunca executa nenhuma
const api = await page.evaluate(async () => {
  if (!("modelContext" in document)) return null;
  try { return (await document.modelContext.getTools()).map((t) => t.name); } catch { return []; }
});
console.log(`3 · chamar  document.modelContext: ${api ? "presente" : "ausente"} neste Chromium ${browser.version()}` +
  (api ? ` · ${api.length} ferramenta(s) registrada(s)${api.length ? ": " + api.slice(0, 4).join(", ") + (api.length > 4 ? ", …" : "") : ""}`
       : " → sem ferramentas declaradas, o agente fica no jeito 2"));

await browser.close();
await fechar();
process.exit(falhou ? 1 : 0);
