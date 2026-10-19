// readiness-local.mjs — roda o scanner WebMCP Readiness (código aberto, inematds/webmcp-readiness)
// na SUA máquina, sem passar pelo site webmcp.inema.pro, e imprime o diagnóstico resumido.
// O scanner é passivo: abre a página num Chromium headless e lê; não executa ferramenta nenhuma.
// Uso: node readiness-local.mjs <pasta-do-webmcp-readiness> [antes|depois|https://seu-site] [--json arquivo]
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { abrir } from "./servidor.mjs";

const args = process.argv.slice(2);
const iJson = args.indexOf("--json");
const destino = iJson >= 0 ? args.splice(iJson, 2)[1] : null;
const [pasta, alvo = "depois"] = args;
if (!pasta) { console.log("uso: node readiness-local.mjs <pasta-do-webmcp-readiness> [alvo] [--json arquivo]"); process.exit(2); }

const local = !/^https?:\/\//.test(alvo);
process.env.CHROMIUM_PATH ||= chromium.executablePath();   // o Chromium do kit (Playwright)
if (local) process.env.ALLOW_PRIVATE_TARGETS = "1";         // só para a página do kit em 127.0.0.1

const { analyzeReadiness } = await import(pathToFileURL(path.resolve(pasta, "lib/readiness.mjs")).href);
const { url, fechar } = await abrir(alvo);
const r = await analyzeReadiness(url);
await fechar();
if (destino) await writeFile(destino, JSON.stringify(r, null, 2));

const nome = local ? `kit/site/${alvo}.html` : r.finalUrl;
console.log(`Readiness ${r.environment.scannerVersion} · ${nome} · nota ${r.score} (${r.grade.label})`);
console.log("  " + Object.values(r.categories).map((c) => `${c.label} ${c.score}`).join(" · "));
console.log(`  falhas: ${r.summary.blockers} · avisos: ${r.summary.warnings} · ok: ${r.summary.passed} · ferramentas WebMCP: ${r.summary.tools} · document.modelContext no Chromium do scan: ${r.environment.modelContextAvailable ? "sim" : "não"}`);
for (const f of r.findings.filter((x) => x.status === "fail")) console.log(`  [falha] ${f.category} · ${f.title}`);
console.log(`  lembrete do próprio scanner: ${r.limitations.at(-1)}`);
