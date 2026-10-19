#!/usr/bin/env python3
"""robots.py — lê um robots.txt e diz, por FINALIDADE, quem você deixou entrar na raiz do site.

Finalidades e nomes de robô seguem a aula 6 do curso Fundação da Formação inemaSEO
(formacao-inemaseo-fundacao-v72), que é a dona do assunto robots.txt:
  busca            OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot
  ação do usuário  ChatGPT-User, Claude-User, Perplexity-User
  treino           GPTBot, ClaudeBot, Google-Extended
Regra simplificada: vale o grupo com o nome do robô; sem ele, o grupo "*". Só olha a raiz "/"
("bloqueado" = Disallow: / ; "parcial" = bloqueia alguns caminhos). Não prova quem chega:
o robots.txt é um pedido, e o nome do robô no User-Agent pode ser falsificado.
Uso: python3 robots.py <arquivo|https://seu-site/robots.txt>
"""
import sys
import urllib.request

FINALIDADES = {
    "busca": ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "Googlebot", "Bingbot"],
    "ação do usuário": ["ChatGPT-User", "Claude-User", "Perplexity-User"],
    "treino": ["GPTBot", "ClaudeBot", "Google-Extended"],
}


def ler(fonte):
    if fonte.startswith(("http://", "https://")):
        req = urllib.request.Request(fonte, headers={"User-Agent": "Mozilla/5.0 (kit robots.py do curso INEMA)"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read().decode("utf-8", "replace")
    return open(fonte, encoding="utf-8").read()


def grupos(texto):
    """{nome do robô em minúsculas: [(campo, valor), ...]}"""
    g, atuais, regras_vistas = {}, [], False
    for linha in texto.splitlines():
        linha = linha.split("#", 1)[0].strip()
        if ":" not in linha:
            continue
        campo, valor = (p.strip() for p in linha.split(":", 1))
        campo = campo.lower()
        if campo == "user-agent":
            if regras_vistas:
                atuais, regras_vistas = [], False
            atuais.append(valor.lower())
            g.setdefault(valor.lower(), [])
        elif campo in ("allow", "disallow") and atuais:
            regras_vistas = True
            for a in atuais:
                g[a].append((campo, valor))
    return g


def situacao(regras):
    if regras is None:
        return "liberado"
    dis = [v for c, v in regras if c == "disallow" and v]
    if "/" in dis and ("allow", "/") not in regras:
        return "bloqueado"
    return "parcial" if dis else "liberado"


def main():
    if len(sys.argv) < 2:
        print(__doc__.strip())
        return 2
    g = grupos(ler(sys.argv[1]))
    print(f"grupos no arquivo: {', '.join(sorted(g)) or '(nenhum)'}")
    for fin, robos in FINALIDADES.items():
        partes = []
        for r in robos:
            regras = g.get(r.lower(), g.get("*"))
            origem = "" if r.lower() in g else "*"
            partes.append(f"{r} {situacao(regras)}{' (' + origem + ')' if origem else ''}")
        print(f"{fin:16} {' · '.join(partes)}")
    print("lembrete: robots.txt pede, não identifica. Quem prova quem é: assinatura na requisição (Web Bot Auth, rascunho IETF).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
