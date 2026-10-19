O=${TMPDIR:-/tmp}/oficina
mkdir -p $O && cp ~/projetos/formacao-webmcp-base-v72/kit/site/antes.html $O/
cd ~/projetos/formacao-webmcp-base-v72/kit
node arvore.mjs $O/antes.html | tail -3; echo "saída: ${PIPESTATUS[0]}"
