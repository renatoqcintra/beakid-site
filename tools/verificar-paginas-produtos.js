#!/usr/bin/env node
/* ==========================================================================
   BEAKID — Verificador das páginas de produto (ferramenta de DESENVOLVIMENTO)
   Valida contra os dados reais do script.js que:
     - todo produto válido tem exatamente uma página
     - slugs são únicos (sem colisões)
     - o JSON-LD de cada página é JSON válido, do tipo Product, sem offers
       (os preços não são mais exibidos no site)
     - o canonical de cada página corresponde à sua URL
     - imagens referenciadas existem no disco
     - o sitemap contém homepage + todas as páginas, sem URLs extras
     - o script.js continua íntegro (catálogo, helpers de slug, sem duplicação)
   Uso:  node tools/verificar-paginas-produtos.js
   Sai com código 1 se houver qualquer falha.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const DIR_PRODUTOS = path.join(RAIZ, "produtos");
const DOMINIO = "https://beakid.com.br";

let falhas = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { falhas++; console.log("  FALHA: " + msg); }
}
function info(msg) { console.log("  ✓ " + msg); }

/* Mesma lógica do gerador: extrai dados reais do script.js */
function carregarDadosDoSite() {
  const src = fs.readFileSync(path.join(RAIZ, "script.js"), "utf8");
  const marcaSlug = src.indexOf("/* SLUG-INICIO");
  const fimSlug = src.indexOf("SLUG-FIM */");
  if (marcaSlug === -1 || fimSlug === -1) throw new Error("script.js: marcadores de slug ausentes.");
  const blocoSlug = src.slice(marcaSlug, fimSlug + "SLUG-FIM */".length);
  const corte = src.indexOf("4) ESTADO");
  const codigo = src.slice(0, src.lastIndexOf("/*", corte)) + "\n" + blocoSlug +
    "\nglobalThis.__BEAKID__ = { CONFIG, CATEGORIAS, PRODUTOS, slugProduto };";
  const ctx = vm.createContext({});
  vm.runInContext(codigo, ctx, { filename: "script.js" });
  return ctx.__BEAKID__;
}

function extrairJsonLd(html) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return { __erro: e.message }; }
}

/* Mesma normalização do campo `codigo` usada pelo gerador (para checar o sku). */
function normalizarCodigoFonte(p) {
  if (!p.codigo) return null;
  if (typeof p.codigo === "string") return p.codigo;
  if (Array.isArray(p.codigo)) {
    return p.codigo.map((c) => (typeof c === "string" ? c : `${c.nome}: ${c.codigo}`)).join(" | ");
  }
  return String(p.codigo);
}

function main() {
  const { PRODUTOS, slugProduto } = carregarDadosDoSite();
  const validos = PRODUTOS.filter((p) => p.id && p.nome && Array.isArray(p.imagens) && p.imagens.length && p.link);

  console.log(`\n== Páginas de produto (catálogo: ${PRODUTOS.length} produtos, ${validos.length} válidos) ==`);

  const slugsEsperados = new Set();
  for (const p of validos) {
    const slug = slugProduto(p, PRODUTOS);
    slugsEsperados.add(slug);
    const arquivo = path.join(DIR_PRODUTOS, slug, "index.html");
    if (!fs.existsSync(arquivo)) { ok(false, `página ausente: produtos/${slug}/index.html`); continue; }

    const html = fs.readFileSync(arquivo, "utf8");

    // Canonical
    ok(html.includes(`<link rel="canonical" href="${DOMINIO}/produtos/${slug}/">`),
      `${slug}: canonical incorreto ou ausente`);

    // Título e H1
    ok(html.includes(`<title>${p.nome} | BEAKID</title>`), `${slug}: título não corresponde ao nome do produto`);
    ok(html.includes(`<h1 class="pp-title">${p.nome.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</h1>`),
      `${slug}: H1 não corresponde ao nome do produto`);

    // Botão de compra com o link real
    ok(html.includes(`href="${p.link}"`), `${slug}: link de compra (Shopee) não é o do catálogo`);
    if (p.linkMercadoLivre) ok(html.includes(`href="${p.linkMercadoLivre}"`), `${slug}: link Mercado Livre não é o do catálogo`);

    // Preços: nenhum valor monetário pode aparecer no conteúdo visível
    ok(!/R\$\s*\d/.test(html), `${slug}: valor monetário (R$ ...) aparece na página`);
    ok(!/[\d]+,[\d]{2}\s*(reais|BRL)/i.test(html), `${slug}: valor monetário fora do padrão R$ detectado`);
    ok(html.includes("Ver preço na loja"), `${slug}: aviso "Ver preço na loja" ausente`);

    // JSON-LD
    const ld = extrairJsonLd(html);
    ok(ld && !ld.__erro, `${slug}: JSON-LD inválido ou ausente${ld && ld.__erro ? " — " + ld.__erro : ""}`);
    if (ld && !ld.__erro) {
      const produto = (ld["@graph"] || []).find((n) => n["@type"] === "Product");
      ok(!!produto, `${slug}: JSON-LD sem Product`);
      if (produto) {
        ok(produto.name === p.nome, `${slug}: JSON-LD name divergente`);
        ok(Array.isArray(produto.image) && produto.image.every((u) => u.startsWith(DOMINIO + "/assets/")),
          `${slug}: JSON-LD image com URL não absoluta`);
        // Imagens do JSON-LD existem no disco
        for (const u of produto.image) {
          const rel = u.replace(DOMINIO + "/", "");
          ok(fs.existsSync(path.join(RAIZ, rel)), `${slug}: imagem JSON-LD inexistente no disco: ${rel}`);
        }
        ok(!("aggregateRating" in produto) && !("review" in produto), `${slug}: JSON-LD tem avaliação/review não verificável`);
        // Sem offers: os preços não são exibidos na página, então o schema
        // não pode declarar oferta com valor (deve corresponder ao visível).
        ok(!("offers" in produto), `${slug}: JSON-LD tem offers mesmo sem preço exibido na página`);
      }
      const bc = (ld["@graph"] || []).find((n) => n["@type"] === "BreadcrumbList");
      ok(!!bc, `${slug}: JSON-LD sem BreadcrumbList`);
    }

    // Imagens do HTML existem (qualquer src relativo que aponte para assets/)
    const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => !/^https?:\/\//.test(s));
    ok(imgs.length > 0, `${slug}: nenhuma imagem referenciada`);
    for (const rel of imgs) {
      // Resolve o caminho relativo ao diretório da página produtos/<slug>/
      const resolvido = path.resolve(DIR_PRODUTOS, slug, rel);
      ok(fs.existsSync(resolvido), `${slug}: imagem inexistente: ${rel}`);
      ok(!resolvido.replace(/\\/g, "/").includes("/produtos/assets"), `${slug}: imagem sem prefixo ../../ (quebra na URL): ${rel}`);
    }

    // Estrutura básica: tags principais balanceadas
    for (const tag of ["html", "head", "body", "main", "header", "footer", "div", "section", "nav", "a", "p", "button", "script", "h1"]) {
      const abre = (html.match(new RegExp(`<${tag}(\\s|>)`, "g")) || []).length;
      const fecha = (html.match(new RegExp(`</${tag}>`, "g")) || []).length;
      ok(abre === fecha, `${slug}: tag <${tag}> desbalanceada (${abre} abertas, ${fecha} fechadas)`);
    }

    // Códigos internos: proibidos no conteúdo visível, permitidos apenas como
    // sku no JSON-LD (dados estruturados). Compara o HTML sem o bloco de JSON-LD.
    const htmlVisivel = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
    ok(!/pp-detalhe__label">Código</.test(htmlVisivel), `${slug}: seção visual "Código" reapareceu na página`);
    ok(!/Código: /.test(htmlVisivel), `${slug}: frase "Código: ..." reapareceu no conteúdo visível`);
    if (typeof p.codigo === "string" && p.codigo) {
      ok(!htmlVisivel.includes(p.codigo), `${slug}: identificador interno "${p.codigo}" exposto no conteúdo visível`);
    }
    if (ld && !ld.__erro) {
      const produtoLd = (ld["@graph"] || []).find((n) => n["@type"] === "Product");
      const skuEsperado = normalizarCodigoFonte(p);
      if (produtoLd && skuEsperado) {
        ok(produtoLd.sku === skuEsperado, `${slug}: sku preservado no JSON-LD (esperado "${skuEsperado}")`);
      }
    }
  }
  info(`${slugsEsperados.size} páginas conferidas contra o catálogo`);

  // Slugs únicos
  const slugs = validos.map((p) => slugProduto(p, PRODUTOS));
  ok(new Set(slugs).size === slugs.length, "há colisão de slug entre produtos");
  info("slugs únicos, sem colisões");

  // Órfãs
  if (fs.existsSync(DIR_PRODUTOS)) {
    const dirs = fs.readdirSync(DIR_PRODUTOS).filter((d) => fs.statSync(path.join(DIR_PRODUTOS, d)).isDirectory());
    const orfaos = dirs.filter((d) => !slugsEsperados.has(d));
    ok(orfaos.length === 0, "pastas órfãs em produtos/: " + orfaos.join(", "));
    const arquivos = fs.readdirSync(DIR_PRODUTOS).filter((f) => !fs.statSync(path.join(DIR_PRODUTOS, f)).isDirectory());
    ok(arquivos.length === 0, "arquivos soltos em produtos/: " + arquivos.join(", "));
    info("nenhuma página órfã ou arquivo inesperado em produtos/");
  }

  // Sitemap
  console.log("\n== Sitemap ==");
  const sm = fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const esperados = new Set([DOMINIO + "/", ...[...slugsEsperados].map((s) => `${DOMINIO}/produtos/${s}/`)]);
  ok(locs.length === new Set(locs).size, "sitemap com URLs duplicadas");
  for (const l of locs) ok(esperados.has(l), "sitemap contém URL inesperada: " + l);
  for (const e of esperados) ok(locs.includes(e), "sitemap sem URL esperada: " + e);
  ok(locs.every((l) => l.startsWith(DOMINIO)), "sitemap com URL fora do domínio canônico");
  ok(!locs.some((l) => /shopee|mercadolivre|wa\.me/.test(l)), "sitemap com link externo de marketplace");
  info(`${locs.length} URLs no sitemap (1 homepage + ${locs.length - 1} produtos), todas válidas`);

  // Integridade do catálogo original
  console.log("\n== Catálogo original ==");
  const src = fs.readFileSync(path.join(RAIZ, "script.js"), "utf8");
  ok(/const PRODUTOS = \[/.test(src), "array PRODUTOS removido do script.js");
  ok(src.split("const PRODUTOS =").length === 2, "PRODUTOS duplicado no script.js");
  ok(src.includes("urlPaginaProduto(p)"), "link 'Ver detalhes' ausente no card do catálogo");
  ok(/function slugProduto\(/.test(src) && /function urlPaginaProduto\(/.test(src), "helpers de slug ausentes");
  const index = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");
  ok(index.includes('"@type": "Organization"') && index.includes('"@type": "WebSite"'), "Schema Organization/WebSite da homepage removido");
  ok(!/"@type":\s*"Product"/.test(index), "homepage ganhou Schema Product (não permitido)");
  ok(index.includes('<link rel="canonical" href="https://beakid.com.br/">'), "canonical da homepage alterado");
  const robots = fs.readFileSync(path.join(RAIZ, "robots.txt"), "utf8");
  ok(!/disallow/i.test(robots), "robots.txt com regra Disallow");
  ok(robots.includes("Sitemap: " + DOMINIO + "/sitemap.xml"), "robots.txt sem referência ao sitemap");
  // Nenhum valor monetário no código que gera conteúdo público
  ok(!src.includes("R$"), "script.js contém valor monetário (R$) em algum trecho");
  ok(/precoAtual: /.test(src), "campos precoAtual/precoAntigo removidos do PRODUTOS (devem ser preservados)");
  info("PRODUTOS intacto, Organization/WebSite preservados, robots.txt ok, sem valores no script.js");

  // Reprodutibilidade: regenerar não deve alterar nada
  console.log("\n== Reprodutibilidade ==");
  const antes = {};
  for (const s of slugsEsperados) antes[s] = fs.readFileSync(path.join(DIR_PRODUTOS, s, "index.html"), "utf8");
  const smAntes = sm;
  require("child_process").execSync("node tools/gerar-paginas-produtos.js", { cwd: RAIZ, stdio: "pipe" });
  let identico = true;
  for (const s of slugsEsperados) {
    if (fs.readFileSync(path.join(DIR_PRODUTOS, s, "index.html"), "utf8") !== antes[s]) { identico = false; ok(false, `regeneração alterou produtos/${s}/index.html`); }
  }
  ok(fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8") === smAntes, "regeneração alterou o sitemap.xml");
  if (identico) info("regenerar é idempotente (nenhum arquivo alterado)");

  console.log(`\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : "HOUVE FALHAS"} — ${checks} verificações, ${falhas} falha(s).\n`);
  process.exit(falhas === 0 ? 0 : 1);
}

main();
