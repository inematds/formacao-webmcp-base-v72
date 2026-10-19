E=${TMPDIR:-/tmp}/ensaio-formacao-webmcp-base-v72
cd ~/projetos/formacao-webmcp-base-v72/kit
node readiness-local.mjs $E/webmcp-readiness https://inema.club/ --json ${TMPDIR:-/tmp}/readiness-inema.json; echo "saída: $?"
