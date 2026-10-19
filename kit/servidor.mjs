// servidor.mjs — serve kit/site/ numa porta livre de 127.0.0.1 (só a sua máquina) e devolve a URL.
// alvo: "antes" | "depois" | caminho de um .html seu | URL http(s) do seu site (aí não sobe servidor).
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), "site");
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".svg": "image/svg+xml", ".txt": "text/plain; charset=utf-8", ".css": "text/css" };

export async function abrir(alvo = "depois") {
  if (/^https?:\/\//.test(alvo)) return { url: alvo, fechar: async () => {} };
  let raiz = SITE, arquivo = `${alvo}.html`;
  if (alvo.endsWith(".html")) { raiz = path.dirname(path.resolve(alvo)); arquivo = path.basename(alvo); }
  const srv = http.createServer(async (req, res) => {
    const nome = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || arquivo;
    const p = path.join(raiz, path.normalize(nome));
    if (!p.startsWith(raiz)) { res.writeHead(403).end(); return; }
    try {
      const corpo = await readFile(p);
      res.writeHead(200, { "content-type": TIPOS[path.extname(p)] || "application/octet-stream" }).end(corpo);
    } catch { res.writeHead(404).end("não encontrado"); }
  });
  await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
  const url = `http://127.0.0.1:${srv.address().port}/${arquivo}`;
  return { url, fechar: () => new Promise((ok) => srv.close(ok)) };
}
