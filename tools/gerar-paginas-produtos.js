#!/usr/bin/env node
/* ==========================================================================
   BEAKID — Gerador de páginas estáticas de produto (ferramenta de DESENVOLVIMENTO)
   --------------------------------------------------------------------------
   Lê o array PRODUTOS real do script.js (fonte única de dados) e gera:
     - uma página HTML independente em produtos/<slug>/index.html para cada produto
     - o sitemap.xml atualizado com a homepage + páginas de produto

   O site continua 100% estático: o Node.js NÃO é usado em produção.
   Uso:  node tools/gerar-paginas-produtos.js
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const DIR_PRODUTOS = path.join(RAIZ, "produtos");
const DOMINIO = "https://beakid.com.br";

/* ------------------------------------------------------------------
   1) Ler os dados reais do script.js (CONFIG, CATEGORIAS, PRODUTOS e
      os helpers de slug, que ficam dentro do bloco SLUG-INICIO/FIM).
   ------------------------------------------------------------------ */
function carregarDadosDoSite() {
  const src = fs.readFileSync(path.join(RAIZ, "script.js"), "utf8");

  const marcaSlug = src.indexOf("/* SLUG-INICIO");
  const fimSlug = src.indexOf("SLUG-FIM */");
  if (marcaSlug === -1 || fimSlug === -1) {
    throw new Error("script.js: marcadores SLUG-INICIO / SLUG-FIM não encontrados.");
  }
  const blocoSlug = src.slice(marcaSlug, fimSlug + "SLUG-FIM */".length);

  const corte = src.indexOf("4) ESTADO");
  if (corte === -1) throw new Error("script.js: seção '4) ESTADO' não encontrada.");
  const codigo = src.slice(0, src.lastIndexOf("/*", corte)) + "\n" + blocoSlug +
    "\nglobalThis.__BEAKID__ = { CONFIG, CATEGORIAS, GENEROS, PRODUTOS, slugProduto, slugBaseProduto, slugifyTexto };";

  const ctx = vm.createContext({});
  vm.runInContext(codigo, ctx, { filename: "script.js" });
  const dados = ctx.__BEAKID__;
  if (!dados || !Array.isArray(dados.PRODUTOS)) {
    throw new Error("Não foi possível extrair o array PRODUTOS do script.js.");
  }
  return dados;
}

/* ------------------------------------------------------------------
   2) Helpers
   ------------------------------------------------------------------ */
function escHtml(texto) {
  return String(texto == null ? "" : texto)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function caminhoRelativoParaRaiz(caminhoImagem) {
  // "./assets/images/calcados/x.jpeg" -> "../../assets/images/calcados/x.jpeg"
  return String(caminhoImagem).replace(/^\.\//, "").replace(/^\//, "");
}

function urlAbsoluta(caminhoImagem) {
  return DOMINIO + "/" + caminhoRelativoParaRaiz(caminhoImagem);
}

function normalizarCores(p) {
  if (Array.isArray(p.cores) && p.cores.length) {
    return p.cores.map((c) => (typeof c === "string" ? c : c && c.nome)).filter(Boolean);
  }
  if (typeof p.cor === "string" && p.cor) return [p.cor];
  return [];
}

function normalizarCodigo(p) {
  if (!p.codigo) return null;
  if (typeof p.codigo === "string") return p.codigo;
  if (Array.isArray(p.codigo)) {
    return p.codigo.map((c) => (typeof c === "string" ? c : `${c.nome}: ${c.codigo}`)).join(" | ");
  }
  return String(p.codigo);
}

function faixaTamanhos(p) {
  const t = Array.isArray(p.tamanhos) ? p.tamanhos.slice().sort((a, b) => a - b) : [];
  if (!t.length) return null;
  return { lista: t, min: t[0], max: t[t.length - 1] };
}

const TIPO_SINGULAR = { tenis: "tênis", sapatilhas: "sapatilha", sandalias: "sandália", botas: "bota" };
const TIPO_ARTIGO = { tenis: "um tênis", sapatilhas: "uma sapatilha", sandalias: "uma sandália", botas: "uma bota" };
const TIPO_PLURAL = { tenis: "tênis", sapatilhas: "sapatilhas", sandalias: "sandálias", botas: "botas" };
const GENERO_TXT = { meninas: "meninas", meninos: "meninos", unissex: "meninas e meninos" };
const GENERO_LABEL = { meninas: "Meninas", meninos: "Meninos", unissex: "Unissex" };

function nomeCategoriaTipo(p) {
  return { tenis: "Tênis", sapatilhas: "Sapatilhas", sandalias: "Sandálias", botas: "Botas" }[p.tipo] || "Calçados";
}

function rotuloCategoria(p) {
  const partes = [nomeCategoriaTipo(p), GENERO_LABEL[p.genero] || ""].filter(Boolean);
  const cores = normalizarCores(p);
  if (cores.length === 1) partes.push(cores[0]);
  return partes.join(" · ");
}

function linkWhatsapp(p, CONFIG) {
  const texto = encodeURIComponent(CONFIG.mensagemWhatsapp(p));
  return CONFIG.whatsapp.includes("?") ? `${CONFIG.whatsapp}&text=${texto}` : `${CONFIG.whatsapp}?text=${texto}`;
}

/* Monta uma descrição natural usando somente dados reais do produto. */
function montarDescricao(p) {
  const tipo = TIPO_SINGULAR[p.tipo] || "calçado";
  const genero = GENERO_TXT[p.genero] || "infantil";
  const cores = normalizarCores(p);
  const tam = faixaTamanhos(p);

  const p1Parts = [`${p.nome}`];
  p1Parts.push(`é ${TIPO_ARTIGO[p.tipo] || "um calçado"} infantil para ${genero} da BEAKID`);
  if (cores.length === 1) p1Parts.push(`na cor ${cores[0]}`);
  else if (cores.length > 1) p1Parts.push(`disponível em ${cores.join(", ")}`);
  let paragrafo1 = p1Parts.join(" ") + ".";
  if (p.novaColecao) paragrafo1 += " Faz parte da nova coleção da BEAKID.";

  const p2Parts = [];
  if (tam) p2Parts.push(`Tamanhos disponíveis: ${tam.lista.join(", ")}.`);
  p2Parts.push("As compras são finalizadas nos marketplaces oficiais da BEAKID, com envio para todo o Brasil.");
  const paragrafo2 = p2Parts.join(" ");

  return { paragrafo1, paragrafo2 };
}

/* Meta description curta, específica e fiel aos dados. */
function montarMetaDescription(p) {
  const tipo = TIPO_SINGULAR[p.tipo] || "calçado";
  const genero = p.genero === "meninos" ? "menino" : p.genero === "meninas" ? "menina" : "infantil";
  const cores = normalizarCores(p);
  const tam = faixaTamanhos(p);
  let texto = `${p.nome} — ${tipo} infantil para ${genero}`;
  if (cores.length === 1) texto += `, cor ${cores[0]}`;
  if (tam) texto += `. Tamanhos ${tam.min} a ${tam.max}`;
  texto += ". Compre na Shopee ou Mercado Livre.";
  const sufixo = " Envio para todo o Brasil.";
  if (texto.length + sufixo.length <= 158) {
    texto += sufixo;
  } else if (texto.length > 158) {
    texto = texto.slice(0, 157).replace(/\s+\S*$/, "").replace(/[\s.]+$/, "") + ".";
  }
  return texto;
}

/* ------------------------------------------------------------------
   3) Schema.org (JSON-LD) — somente dados reais e verificáveis.
      Sem aggregateRating/review (não há avaliações reais no catálogo)
      e sem declarar disponibilidade em estoque (não há estoque confiável).
   ------------------------------------------------------------------ */
function montarJsonLd(p, urlPagina, urlImagemAbsoluta) {
  const produto = {
    "@type": "Product",
    "@id": urlPagina,
    name: p.nome,
    image: p.imagens.map(urlAbsoluta),
    description: montarDescricao(p).paragrafo1 + " " + montarDescricao(p).paragrafo2,
    brand: { "@type": "Brand", name: "BEAKID" },
    category: `${(TIPO_SINGULAR[p.tipo] || "Calçado").replace(/^./, (c) => c.toUpperCase())} infantil para ${GENERO_TXT[p.genero] || "infantil"}`,
  };

  const codigo = normalizarCodigo(p);
  if (codigo) produto.sku = codigo;

  const cores = normalizarCores(p);
  if (cores.length === 1) produto.color = cores[0];
  else if (cores.length > 1) produto.color = cores;

  const tam = faixaTamanhos(p);
  if (tam) produto.size = tam.lista.join(", ");

  // Sem offers: os preços não são mais exibidos no site, e o preço do
  // marketplace pode mudar. Declarar um Offer com valor aqui contraria o
  // conteúdo visível da página e as diretrizes do Google (dados estruturados
  // devem corresponder ao conteúdo exibido ao usuário).
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: DOMINIO + "/" },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: DOMINIO + "/#catalogo" },
      { "@type": "ListItem", position: 3, name: p.nome, item: urlPagina },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [produto, breadcrumb],
  };
}

/* ------------------------------------------------------------------
   4) Template da página de produto
   ------------------------------------------------------------------ */
function montarPagina(p, slug, dados) {
  const { CONFIG } = dados;
  const urlPagina = `${DOMINIO}/produtos/${slug}/`;
  // As páginas ficam em produtos/<slug>/, logo os recursos locais usam ../../
  const imagens = p.imagens.map((img) => "../../" + caminhoRelativoParaRaiz(img));
  const descricao = montarDescricao(p);
  const cores = normalizarCores(p);
  const tam = faixaTamanhos(p);

  const thumbsHtml = imagens.map((img, i) => `
        <button class="pp-thumb ${i === 0 ? "is-active" : ""}" data-indice="${i}" aria-label="Ver foto ${i + 1} de ${escHtml(p.nome)}">
          <img src="${escHtml(img)}" alt="Miniatura ${i + 1} — ${escHtml(p.nome)}" loading="lazy">
        </button>`).join("");

  const detalhesHtml = `
        ${tam ? `<div class="pp-detalhe"><span class="pp-detalhe__label">Tamanhos</span>
          <div class="pp-sizes">${tam.lista.map((t) => `<span>${t}</span>`).join("")}</div></div>` : ""}
        ${cores.length ? `<div class="pp-detalhe"><span class="pp-detalhe__label">${cores.length > 1 ? "Cores" : "Cor"}</span>
          <div class="pp-colors">${cores.map((c) => `<span class="pp-color-chip">${escHtml(c)}</span>`).join("")}</div></div>` : ""}`;

  const jsonLd = JSON.stringify(montarJsonLd(p, urlPagina, imagens[0]), null, 2);

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W4QV2JDT');</script>
<!-- End Google Tag Manager -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(p.nome)} | BEAKID</title>
<meta name="description" content="${escHtml(montarMetaDescription(p))}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${urlPagina}">

<meta property="og:type" content="product">
<meta property="og:site_name" content="BEAKID">
<meta property="og:url" content="${urlPagina}">
<meta property="og:title" content="${escHtml(p.nome)} | BEAKID">
<meta property="og:description" content="${escHtml(montarMetaDescription(p))}">
<meta property="og:image" content="${urlAbsoluta(imagens[0])}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">

<!-- Dados estruturados (Schema.org: Product + BreadcrumbList) -->
<script type="application/ld+json">
${jsonLd}
</script>

<link rel="icon" href="../../assets/images/ico/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="192x192" href="../../assets/images/ico/favicon-192.png">
<link rel="apple-touch-icon" href="../../assets/images/ico/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../style.css">
<link rel="stylesheet" href="../../produto.css">
</head>
<body class="pagina-produto">
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W4QV2JDT"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div class="topbar">Envio para todo o Brasil</div>

<header class="header" id="header">
  <div class="header__inner container">
    <a href="../../" class="logo" aria-label="BEAKID — página inicial">
      <img src="../../assets/images/logo/logo-beakid200.png" alt="BEAKID" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('span'),{innerHTML:'BEA<span class=dot>KID</span>'}))">
    </a>
    <nav class="nav-menu" aria-label="Navegação principal">
      <a href="../../">Início</a>
      <a href="../../#sobre">Sobre</a>
      <a href="../../#catalogo">Catálogo</a>
      <a href="${escHtml(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram</a>
    </nav>
    <div class="header__actions">
      <a class="icon-btn" href="${escHtml(CONFIG.whatsapp)}" target="_blank" rel="noopener" aria-label="Fale com a BEAKID no WhatsApp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      </a>
    </div>
  </div>
</header>

<main id="topo">
  <section class="pp-section">
    <div class="container">
      <nav class="pp-breadcrumb" aria-label="Navegação estrutural (migalhas de pão)">
        <a href="../../">Início</a> <span aria-hidden="true">›</span>
        <a href="../../#catalogo">${escHtml(nomeCategoriaTipo(p))}</a> <span aria-hidden="true">›</span>
        <span aria-current="page">${escHtml(p.nome)}</span>
      </nav>

      <div class="pp-grid">
        <div class="pp-gallery">
          <div class="pp-gallery__main">
            <img id="ppImagemPrincipal" src="${escHtml(imagens[0])}" alt="${escHtml(p.nome)} — foto principal"${imagens.length > 1 ? "" : ' fetchpriority="high"'}>
          </div>
          ${imagens.length > 1 ? `<div class="pp-gallery__thumbs" id="ppThumbs">${thumbsHtml}
          </div>` : ""}
        </div>

        <div class="pp-info">
          <span class="pp-category">${escHtml(rotuloCategoria(p))}</span>
          <h1 class="pp-title">${escHtml(p.nome)}</h1>

          <div class="pp-price-row">
            <span class="pp-price pp-price--pendente">Ver preço na loja</span>
          </div>

          ${detalhesHtml}

          <div class="pp-description">
            <p>${escHtml(descricao.paragrafo1)}</p>
            <p>${escHtml(descricao.paragrafo2)}</p>
          </div>

          <div class="pp-buy">
            <a class="btn btn-primary btn-block" href="${escHtml(p.link)}" target="_blank" rel="noopener" style="background-color:#ee4d2d;color:#fff;border:none;">Comprar na Shopee</a>
            ${p.linkMercadoLivre ? `<a class="btn btn-primary btn-block" href="${escHtml(p.linkMercadoLivre)}" target="_blank" rel="noopener" style="background-color:#ffe600;color:#2d3277;border:none;">Comprar no Mercado Livre</a>` : ""}
            <a class="btn btn-primary btn-block" href="${escHtml(linkWhatsapp(p, CONFIG))}" target="_blank" rel="noopener" style="background-color:#25D366;color:#fff;border:none;">Falar com vendedor</a>
          </div>
          <p class="pp-buy-note">A compra é finalizada na Shopee ou no Mercado Livre. Preço e disponibilidade podem mudar na loja.</p>

          <a class="pp-back" href="../../#catalogo">← Voltar ao catálogo BEAKID</a>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <div class="footer__bottom">
      <span>© 2026 BEAKID — Calçados Infantis. Todos os direitos reservados.</span>
      <span>Feito com 💜 em Birigui, SP</span>
    </div>
  </div>
</footer>

${imagens.length > 1 ? `<script>
(function () {
  var principal = document.getElementById("ppImagemPrincipal");
  var thumbs = document.querySelectorAll("#ppThumbs .pp-thumb");
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      var img = thumb.querySelector("img");
      if (!img) return;
      principal.src = img.getAttribute("src");
      principal.alt = "${escHtml(p.nome)} — foto " + (Number(thumb.dataset.indice) + 1);
      thumbs.forEach(function (t) { t.classList.remove("is-active"); });
      thumb.classList.add("is-active");
    });
  });
})();
</script>` : ""}
</body>
</html>
`;
}

/* ------------------------------------------------------------------
   5) Sitemap — preserva a entrada da homepage e inclui as páginas geradas
   ------------------------------------------------------------------ */
function gerarSitemap(slugs) {
  let entradaHome = `  <url>\n    <loc>${DOMINIO}/</loc>\n    <lastmod>2026-09-29</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`;
  try {
    const atual = fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8");
    const m = atual.match(/<url>\s*<loc>https:\/\/beakid\.com\.br\/<\/loc>[\s\S]*?<\/url>/);
    if (m) {
      // Preserva os dados da homepage, reescrevendo apenas a formatação.
      const loc = m[0].match(/<loc>([^<]+)<\/loc>/)[1];
      const lastmod = m[0].match(/<lastmod>([^<]+)<\/lastmod>/);
      const changefreq = m[0].match(/<changefreq>([^<]+)<\/changefreq>/);
      const priority = m[0].match(/<priority>([^<]+)<\/priority>/);
      const extras = [
        lastmod ? `    <lastmod>${lastmod[1]}</lastmod>` : null,
        changefreq ? `    <changefreq>${changefreq[1]}</changefreq>` : null,
        priority ? `    <priority>${priority[1]}</priority>` : null,
      ].filter(Boolean).join("\n");
      entradaHome = `  <url>\n    <loc>${loc}</loc>\n${extras}\n  </url>`;
    }
  } catch (_) { /* usa o padrão acima */ }

  const urlsProduto = slugs.map((slug) =>
    `  <url>\n    <loc>${DOMINIO}/produtos/${slug}/</loc>\n  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradaHome}
${urlsProduto}
</urlset>
`;
}

/* ------------------------------------------------------------------
   6) Execução
   ------------------------------------------------------------------ */
function main() {
  const dados = carregarDadosDoSite();
  const { PRODUTOS, slugProduto } = dados;

  const avisos = [];
  const slugs = [];
  const vistos = new Set();

  for (const p of PRODUTOS) {
    if (!p.id || !p.nome || !Array.isArray(p.imagens) || p.imagens.length === 0 || !p.link) {
      avisos.push(`PRODUTO INVÁLIDO (pulado): ${p.id || "(sem id)"}`);
      continue;
    }
    const slug = slugProduto(p, PRODUTOS);
    if (vistos.has(slug)) {
      throw new Error(`Colisão de slug: ${slug} (produto ${p.id}). Ajuste o nome ou o id.`);
    }
    vistos.add(slug);
    slugs.push(slug);

    for (const img of p.imagens) {
      const abs = path.join(RAIZ, caminhoRelativoParaRaiz(img));
      if (!fs.existsSync(abs)) avisos.push(`Imagem ausente (${p.id}): ${img}`);
    }

    const dir = path.join(DIR_PRODUTOS, slug);
    fs.mkdirSync(dir, { recursive: true });
    // A página só referencia imagens que existem no disco.
    const imagensExistentes = p.imagens.filter((img) =>
      fs.existsSync(path.join(RAIZ, caminhoRelativoParaRaiz(img))));
    const produtoParaPagina = Object.assign({}, p, {
      imagens: imagensExistentes.length ? imagensExistentes : p.imagens.slice(0, 1),
    });
    fs.writeFileSync(path.join(dir, "index.html"), montarPagina(produtoParaPagina, slug, dados), "utf8");
  }

  // Remove páginas órfãs (produtos removidos do catálogo).
  if (fs.existsSync(DIR_PRODUTOS)) {
    for (const entrada of fs.readdirSync(DIR_PRODUTOS)) {
      if (!vistos.has(entrada)) {
        fs.rmSync(path.join(DIR_PRODUTOS, entrada), { recursive: true, force: true });
        avisos.push(`Página órfã removida: produtos/${entrada}/`);
      }
    }
  }

  fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), gerarSitemap(slugs), "utf8");

  console.log(`OK: ${slugs.length} página(s) de produto gerada(s) em produtos/ e sitemap.xml atualizado.`);
  if (avisos.length) {
    console.log("\nAvisos:");
    for (const a of avisos) console.log(" - " + a);
  }
}

main();
