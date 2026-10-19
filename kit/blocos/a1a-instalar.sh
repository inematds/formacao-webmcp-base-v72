[ -d ~/projetos/formacao-webmcp-base-v72 ] || git clone -q https://github.com/inematds/formacao-webmcp-base-v72 ~/projetos/formacao-webmcp-base-v72
cd ~/projetos/formacao-webmcp-base-v72/kit
npm ci --no-audit --no-fund && npx playwright install chromium
node -e "import('playwright').then(p => console.log('playwright pronto:', p.chromium.executablePath().split('/').slice(-3).join('/')))"
