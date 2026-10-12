/* ==========================================================================
   BEAKID — script.js
   Site estático (HTML + CSS + JS puro). Sem backend, sem checkout próprio.
   Os botões de compra redirecionam para canais externos definidos em CONFIG.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) CONFIGURAÇÃO CENTRAL
   -------------------------------------------------------------------------- */
const CONFIG = {
  instagram: "https://instagram.com/lojabeakid", 
  whatsapp: "https://wa.me/5518981797922", 
  shopee: "COLOCAR_LINK_DA_LOJA_BEAKID_NA_SHOPEE_AQUI",
  shein: "COLOCAR_LINK_DA_LOJA_BEAKID_NA_SHEIN_AQUI",
  mercadoLivre: "COLOCAR_LINK_DO_MERCADO_LIVRE_AQUI",

  canalPadrao: "shopee",

  mensagemWhatsapp: (produto) =>
    `Olá! Tenho interesse no produto *${produto.nome}* (${produto.precoAtual !== null ? "R$ " + produto.precoAtual.toFixed(2).replace(".", ",") : ""}) que vi no site da BEAKID. Pode me ajudar?`,
};

/* --------------------------------------------------------------------------
   2) CATEGORIAS
   -------------------------------------------------------------------------- */
const CATEGORIAS = [
  { id: "tenis", nome: "Tênis", sub: "Com e sem LED", filtro: "tenis", imagem: "./assets/images/categorias/categoria-tenis.jpeg" },
  { id: "sapatilhas", nome: "Sapatilhas", sub: "Laços e detalhes", filtro: "sapatilhas", imagem: "./assets/images/categorias/categoria-sapatilhas.jpeg" },
  { id: "sandalias", nome: "Sandálias", sub: "Leveza e cor", filtro: "sandalias", imagem: "./assets/images/categorias/categoria-sandalias.jpeg" },
  { id: "botas", nome: "Botas", sub: "Coturnos e botas", filtro: "botas", imagem: "./assets/images/categorias/categoria-botas.jpeg" },
];

const GENEROS = [
  { id: "todos", label: "Todos" },
  { id: "meninas", label: "Meninas" },
  { id: "meninos", label: "Meninos" },
];

/* --------------------------------------------------------------------------
   3) PRODUTOS
   Você pode adicionar 'linkMercadoLivre: "SUA_URL"' a qualquer produto abaixo
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   3) PRODUTOS
   -------------------------------------------------------------------------- */
const PRODUTOS = [
  // ================= TÊNIS =================
  {
    id: "p01-azul",
    nome: "Tênis Infantil Menino com LED Beakid — Azul",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: "Azul",
    codigo: "301-005",
    precoAtual: 79.10,
    precoAntigo: 89.90,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27 ],
    imagens: ["./assets/images/calcados/p01-azul.jpeg", "./assets/images/calcados/p01-azul-2.jpeg", "./assets/images/calcados/p01-azul-3.jpeg", "./assets/images/calcados/p01-azul-4.jpeg", "./assets/images/calcados/p01-azul-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/50064951260/",
    linkMercadoLivre: "https://www.mercadolivre.com.br/tenis-infantil-menino-com-led-calca-facil-confortavel/up/MLBU4447179419"
  },
  {
    id: "p01-caramelo",
    nome: "Tênis Infantil Menino com LED Beakid — Caramelo",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: "Caramelo",
    codigo: "302-012",
    precoAtual: 79.10,
    precoAntigo: 89.90,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27 ],
    imagens: ["./assets/images/calcados/p01-caramelo.jpeg", "./assets/images/calcados/p01-caramelo-2.jpeg", "./assets/images/calcados/p01-caramelo-3.jpeg", "./assets/images/calcados/p01-caramelo-4.jpeg", "./assets/images/calcados/p01-caramelo-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22192059336/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4052663778-tnis-infantil-led-masculino-casual-menino-luzinha-pisca-_JM"
  },
  {
    id: "p01-pretoevermelho",
    nome: "Tênis Infantil Menino com LED Beakid — Preto",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: "Preto",
    codigo: "301-002",
    precoAtual: 79.10,
    precoAntigo: 89.90,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27 ],
    imagens: ["./assets/images/calcados/p01-pretoevermelho.jpeg", "./assets/images/calcados/p01-pretoevermelho-2.jpeg", "./assets/images/calcados/p01-pretoevermelho-3.jpeg", "./assets/images/calcados/p01-pretoevermelho-4.jpeg", "./assets/images/calcados/p01-pretoevermelho-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/46767179594/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4052639448-tnis-infantil-led-masculino-casual-luzinha-pisca-_JM"
  },

  {
    id: "p26",
    nome: "Tênis de Rodinha Beakid com LED Infantil Menino — 1 Rodinha, Recarregável",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8006-639",
    precoAtual: 181.45,
    precoAntigo: null,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p26.jpeg", "./assets/images/calcados/p26-2.jpeg", "./assets/images/calcados/p26-3.jpeg", "./assets/images/calcados/p26-4.jpeg", "./assets/images/calcados/p26-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22497441672/",
    linkMercadoLivre :"https://produto.mercadolivre.com.br/MLB-2648376599-tenis-masculino-com-rodinha-e-luz-led-luzinha-_JM"
  },
  {
    id: "p43",
    nome: "Tênis Infantil Menino Cano Alto Colorido Escolar — Sola Branca",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "505-166",
    precoAtual: 103.64,
    precoAntigo: 145.9,
    tamanhos: [25, 26, 27, 28, 29, 30],
    imagens: ["./assets/images/calcados/p43.jpeg", "./assets/images/calcados/p43-2.jpeg", "./assets/images/calcados/p43-3.jpeg", "./assets/images/calcados/p43-4.jpeg", "./assets/images/calcados/p43-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22593872410/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4300443797-tnis-infantil-menino-sola-branca-moderno-cano-alto-_JM"
  },
  {
    id: "p02",
    nome: "Tênis Infantil Feminino Luz LED com Rodinha — Recarregável, Colorido",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8021-238",
    precoAtual: 181.45,
    precoAntigo: 199.90,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p02.jpeg", "./assets/images/calcados/p02-2.jpeg", "./assets/images/calcados/p02-3.jpeg", "./assets/images/calcados/p02-4.jpeg", "./assets/images/calcados/p02-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22192673688/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-5181041664-tnis-de-rodinha-infantil-feminino-beakid-luz-led-rosa-_JM"
  },
  {
    id: "p03",
    nome: "Tênis Beakid de Rodinha Infantil Menina com LED — Recarregável, Casual",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8005-041",
    precoAtual: 199,
    precoAntigo: 220,
    tamanhos: [28, 29, 30, 31, 32],
    imagens: ["./assets/images/calcados/p03.jpeg", "./assets/images/calcados/p03-2.jpeg", "./assets/images/calcados/p03-3.jpeg", "./assets/images/calcados/p03-4.jpeg", "./assets/images/calcados/p03-5.jpeg", "./assets/images/calcados/p03-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22192673688/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-1914871644-tenis-infantil-feminino-luz-led-rodinha-luzinha-menina-moda-_JM"
  },
  {
    id: "p09",
    nome: "Tênis Infantil Menina Escolar com Luz LED — Colorido, Moda",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "rosa - 204-002 e preto - 204-010",
    precoAtual: 79.10,
    precoAntigo: 89.90,
    tamanhos: [26, 27, 28, 29, 30],
    imagens: ["./assets/images/calcados/p09.jpeg", "./assets/images/calcados/p09-2.jpeg", "./assets/images/calcados/p09-3.jpeg", "./assets/images/calcados/p09-4.jpeg", "./assets/images/calcados/p09-5.jpeg", "./assets/images/calcados/p09-6.jpeg", "./assets/images/calcados/p09-7.jpeg", "./assets/images/calcados/p09-8.jpeg", "./assets/images/calcados/p09-9.jpeg"],
    link: "https://shopee.com.br/product/1049291132/21598981042/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4196178061-tnis-infantil-menina-beakid-luzinha-com-led-conforto-moda-_JM"
  },


  {
    id: "p28",
    nome: "Tênis Infantil Beakid Menina Escolar Casual — Teen/Adolescente, Premium",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "505-233",
    precoAtual: 103.69,
    precoAntigo: 145.9,
    tamanhos: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p28.jpeg", "./assets/images/calcados/p28-2.jpeg", "./assets/images/calcados/p28-3.jpeg", "./assets/images/calcados/p28-4.jpeg", "./assets/images/calcados/p28-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/23293872409/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4300481095-tnis-infantil-menina-cano-alto-colorido-com-cadarco-_JM"
  },
  {
    id: "p31",
    nome: "Tênis Infantil Beakid Menina Luzinha Love — Calce Fácil, Branco ou Rosa",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "205-010 - rosa, 205-001 - branco",
    precoAtual: 79.1,
    precoAntigo: 89.9,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27 ],
    imagens: ["./assets/images/calcados/p31.jpeg", "./assets/images/calcados/p31-2.jpeg", "./assets/images/calcados/p31-3.jpeg", "./assets/images/calcados/p31-4.jpeg", "./assets/images/calcados/p31-5.jpeg", "./assets/images/calcados/p31-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22997083511/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2078286270-tnis-beakid-infantil-menina-glitter-com-luz-led-cadarco-_JM"
  },

  {
    id: "p44",
    nome: "Tênis Infantil Menina com LED Colorido — Nova Coleção, com Pingente",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cores: null,
    codigo: [
      { nome: "Branco", codigo: "206-001" },
      { nome: "Preto", codigo: "206-002" },
    ],
    novaColecao: true,
    precoAtual: 94.05,
    precoAntigo: null,
    tamanhos: [26, 27, 28, 29, 30],
    imagens: ["./assets/images/calcados/p44-branco.jpeg", "./assets/images/calcados/p44-branco-2.jpeg", "./assets/images/calcados/p44-branco-3.jpeg", "./assets/images/calcados/p44-preto.jpeg", "./assets/images/calcados/p44-preto-2.jpeg", "./assets/images/calcados/p44-preto-3.jpeg", "./assets/images/calcados/p44-tabelademedida.jpeg"],
    link: "https://shopee.com.br/product/1049291132/48517751634/",
    linkMercadoLivre: "https://www.mercadolivre.com.br/tenis-infantil-premium-menina-led-pingente-primeiros-passos/up/MLBU5172493123"
  },
  {
    id: "p45",
    nome: "Tênis Infantil Menina com Rodinha e LED Recarregável — Branco",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8005-001",
    precoAtual: 199,
    precoAntigo: null,
    tamanhos: [26, 27, 28, 29, 30],
    imagens: ["./assets/images/calcados/p45.jpeg", "./assets/images/calcados/p45-2.jpeg", "./assets/images/calcados/p45-3.jpeg", "./assets/images/calcados/p45-4.jpeg", "./assets/images/calcados/p45-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22192673688/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-1914871644-tenis-infantil-feminino-luz-led-rodinha-luzinha-menina-moda-_JM"
  },
  {
    id: "p42",
    nome: "Tênis Infantil com Rodinha e LED — Premium, Estilo Skate",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8005-002",
    precoAtual: 199,
    precoAntigo: 220,
    tamanhos: [26, 27, 28, 29, 30],
    imagens: ["./assets/images/calcados/p42.jpeg", "./assets/images/calcados/p42-2.jpeg", "./assets/images/calcados/p42-3.jpeg", "./assets/images/calcados/p42-4.jpeg", "./assets/images/calcados/p42-5.jpeg", "./assets/images/calcados/p42-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22497441672/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2648376599-tenis-masculino-com-rodinha-e-luz-led-luzinha-_JM"
  },

    {
    id: "p53",
    nome: "Tênis Infantil Masculino com LED e Rodinha — Preto com Brilho",
    genero: "meninos",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8020-002",
    precoAtual: 199,
    precoAntigo: 220,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p53.jpeg", "./assets/images/calcados/p53-2.jpeg", "./assets/images/calcados/p53-3.jpeg", "./assets/images/calcados/p53-4.jpeg", "./assets/images/calcados/p53-5.jpeg", "./assets/images/calcados/p53-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22497441672/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2648376599-tenis-masculino-com-rodinha-e-luz-led-luzinha-_JM"
  },

      {
    id: "p54",
    nome: "Tênis Infantil Menina com LED Colorido, Recarregável e Rodinha Removível",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8020-401",
    precoAtual: 199,
    precoAntigo: 220,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p54.jpeg", "./assets/images/calcados/p54-2.jpeg", "./assets/images/calcados/p54-3.jpeg", "./assets/images/calcados/p54-4.jpeg", "./assets/images/calcados/p54-5.jpeg", "./assets/images/calcados/p54-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22192673688/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2201119826-tnis-infantil-feminino-botinha-rodinha-e-luz-led-_JM"
  },

        {
    id: "p55",
    nome: "Tênis Infantil com LED Recarregável e Rodinha Removível — Rosa Espelhado",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "8005-010",
    precoAtual: 199,
    precoAntigo: 220,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p55.jpeg", "./assets/images/calcados/p55-2.jpeg", "./assets/images/calcados/p55-3.jpeg", "./assets/images/calcados/p55-4.jpeg", "./assets/images/calcados/p55-5.jpeg", "./assets/images/calcados/p55-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/21598824510/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-1914871644-tenis-infantil-feminino-luz-led-rodinha-luzinha-menina-moda-_JM"
  },

      {
    id: "p56",
    nome: "Tênis Infantil com LED por Impacto e Glitter",
    genero: "meninas",
    tipo: "tenis",
    canal: "shopee",
    cor: null,
    codigo: "202-010- rosa e 202-007 - palha",
    precoAtual: 79.9,
    precoAntigo: null,
    tamanhos: [28, 29, 30, 31, 32, 33, 34, 35, 36],
    imagens: ["./assets/images/calcados/p56.jpeg", "./assets/images/calcados/p56-2.jpeg", "./assets/images/calcados/p56-3.jpeg", "./assets/images/calcados/p56-4.jpeg", "./assets/images/calcados/p56-5.jpeg", "./assets/images/calcados/p56-6.jpeg", "./assets/images/calcados/p56-7.jpeg"],
    link: "https://shopee.com.br/product/1049291132/23296555944/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4196174157-tenis-infantil-beakid-meninas-luzinha-led-moda-confortavel-_JM"
  },


  // ================= SAPATILHAS =================


  {
    id: "p08",
    nome: "Sapatilha Infantil Feminina Beakid com Laço — Pérolas e Pedrarias",
    genero: "meninas",
    tipo: "sapatilhas",
    canal: "shopee",
    cores: ["Preto", "Branco", "Nude", "Rosa", "Dourado", "Prateado", "Branco Verniz"],
    codigo: "Branca VERNIZ - 07-207-585 e branco fosco 07-207-001",
    precoAtual: 69.93,
    precoAntigo: 99.9,
    tamanhos: [24, 25, 26, 27, 28],
    imagens: ["./assets/images/calcados/p08.jpeg",
              "./assets/images/calcados/p08-2.jpeg",
              "./assets/images/calcados/p08-3.jpeg",
              "./assets/images/calcados/p08-4.jpeg",
              "./assets/images/calcados/p08-5.jpeg",
              "./assets/images/calcados/p08-6.jpeg",
              "./assets/images/calcados/p08-7.jpeg",
              "./assets/images/calcados/p08-8.jpeg",
              "./assets/images/calcados/p08-9.jpeg",
              "./assets/images/calcados/p08-10.jpeg",
              "./assets/images/calcados/p08-11.jpeg",
              "./assets/images/calcados/p08-12.jpeg",
              "./assets/images/calcados/p08-13.jpeg",
              "./assets/images/calcados/p08-14.jpeg",
              "./assets/images/calcados/p08-15.jpeg",
              
    ],
    link: "https://shopee.com.br/product/1049291132/23993112206/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-3684099413-sapatilha-infantil-menina-garota-laco-qualidade-confortavel-_JM"
  },


  {
    id: "p13",
    nome: "Sapatilha Beakid com Enfeite Infantil Menina — Confortável, para Festas, Casamentos e Batizados",
    genero: "meninas",
    tipo: "sapatilhas",
    canal: "shopee",
    cores: ["Preto", "Branco", "Nude", "Rosa", "Dourado", "Prateado", "Branco Verniz"],
    codigo: "07-202-585",
    precoAtual: 69.93,
    precoAntigo: null,
    tamanhos: [24, 25, 26, 27, 28],
    imagens: ["./assets/images/calcados/p13.jpeg", "./assets/images/calcados/p13-2.jpeg", "./assets/images/calcados/p13-3.jpeg", "./assets/images/calcados/p13-4.jpeg", "./assets/images/calcados/p13-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22992985114/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-5577423752-sapatilha-beakid-feminina-conforto-leve-festa-com-enfeite-_JM"
  },

  {
    id: "p16",
    nome: "Sapatilha Beakid Infantil Feminina com Laço de Pérolas — Batizado, Passeio e Rotina",
    genero: "meninas",
    tipo: "sapatilhas",
    canal: "shopee",
    cores: ["Preto", "Branco", "Nude", "Rosa", "Dourado", "Prateado", "Branco Verniz"],
    codigo: "07-206-016",
    precoAtual: 69.93,
    precoAntigo: null,
    tamanhos: [24, 25, 26, 27, 28],
    imagens: ["./assets/images/calcados/p16.jpeg", "./assets/images/calcados/p16-2.jpeg", "./assets/images/calcados/p16-3.jpeg", "./assets/images/calcados/p16-4.jpeg"],
    link: "https://shopee.com.br/product/1049291132/19497750862/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-5066359160-sapatilha-infantil-feminina-boneca-formal-menina-laco-beakid-_JM"
  },



  {
    id: "p35",
    nome: "Sapatilha Infantil Beakid Menina com Enfeite de Flor — Social, Branco/Preto/Bege",
    genero: "meninas",
    tipo: "sapatilhas",
    canal: "shopee",
    cores: ["Preto", "Branco", "Nude", "Rosa", "Dourado", "Prateado", "Branco Verniz"],
    codigo: "07-203-001 branco fosco e 07-203-585 branco verniz",
    precoAtual: 69.93,
    precoAntigo: null,
    tamanhos: [24, 25, 26, 27, 28],
    imagens: ["./assets/images/calcados/p35.jpeg", "./assets/images/calcados/p35-2.jpeg", "./assets/images/calcados/p35-3.jpeg", "./assets/images/calcados/p35-4.jpeg", "./assets/images/calcados/p35-5.jpeg", "./assets/images/calcados/p35-6.jpeg", "./assets/images/calcados/p35-7.jpeg", "./assets/images/calcados/p35-8.jpeg", "./assets/images/calcados/p35-9.jpeg", "./assets/images/calcados/p35-10.jpeg", "./assets/images/calcados/p35-11.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22397613025/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-4651427798-sapatilha-infantil-feminina-com-flor-leve-conforto-boneca-_JM"
  },

  // ================= SANDÁLIAS =================

  {
    id: "p50",
    nome: "Sandália Infantil Menina",
    genero: "meninas",
    tipo: "sandalias",
    canal: "shopee",
    cor: null,
    codigo: "102-007",
    precoAtual: 79.90,
    precoAntigo: null,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27],
    imagens: ["./assets/images/calcados/p50.jpeg", "./assets/images/calcados/p50-2.jpeg", "./assets/images/calcados/p50-3.jpeg", "./assets/images/calcados/p50-4.jpeg", "./assets/images/calcados/p50-5.jpeg"],
    link: "https://shopee.com.br/product/1049291132/19197251289/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2064605835-sandalia-infantil-feminina-com-luz-rasteira-menina-luzinha-_JM"
  },
  {
    id: "p51",
    nome: "Sandália Infantil com LED — Coleção Verão",
    genero: "meninas",
    tipo: "sandalias",
    canal: "shopee",
    cor: null,
    codigo: "104-010",
    precoAtual: 79.90,
    precoAntigo: null,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27],
    imagens: ["./assets/images/calcados/p51.jpeg", "./assets/images/calcados/p51-2.jpeg", "./assets/images/calcados/p51-3.jpeg", "./assets/images/calcados/p51-4.jpeg", "./assets/images/calcados/p51-5.jpeg", "./assets/images/calcados/p51-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/19397251371/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-3246628641-sandalia-infantil-infantil-beb-festa-luz-led-luzinha-_JM"
  },

    {
    id: "p52",
    nome: "Sandália Infantil com LED",
    genero: "meninas",
    tipo: "sandalias",
    canal: "shopee",
    cor: null,
    codigo: "105-687",
    precoAtual: 79.90,
    precoAntigo: null,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27],
    imagens: ["./assets/images/calcados/p52.jpeg", "./assets/images/calcados/p52-2.jpeg", "./assets/images/calcados/p52-3.jpeg", "./assets/images/calcados/p52-4.jpeg", "./assets/images/calcados/p52-5.jpeg", "./assets/images/calcados/p52-6.jpeg", "./assets/images/calcados/p52-7.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22896546399/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2064605835-sandalia-infantil-feminina-com-luz-rasteira-menina-luzinha-_JM"
  },

  {
    id: "p57",
    nome: "Sandália Infantil Menina Beakid Com Led Que Acende Flor Rosa Luzinha que Pisca Colorido",
    genero: "meninas",
    tipo: "sandalias",
    canal: "shopee",
    cor: null,
    codigo: "101-027",
    precoAtual: 79.90,
    precoAntigo: null,
    tamanhos: [20, 21, 22, 23, 24, 25, 26, 27],
    imagens: ["./assets/images/calcados/p57.jpeg", "./assets/images/calcados/p57-2.jpeg", "./assets/images/calcados/p57-3.jpeg", "./assets/images/calcados/p57-4.jpeg", "./assets/images/calcados/p57-5.jpeg", "./assets/images/calcados/p57-6.jpeg"],
    link: "https://shopee.com.br/product/1049291132/20697244981/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-2064605835-sandalia-infantil-feminina-com-luz-rasteira-menina-luzinha-_JM"
  },



  // ================= BOTAS =================
  {
    id: "p20",
    nome: "Coturno 3 em 1 Beakid Bota Infantil Menina — Off White, Lisa/Com Laço/Com Tira",
    genero: "meninas",
    tipo: "botas",
    canal: "shopee",
    cor: null,
    codigo: "1003-098",
    precoAtual: 98.70,
    precoAntigo: null,
    tamanhos: [28, 29, 30, 31, 32, 33, 34 ,35, 36],
    imagens: ["./assets/images/calcados/p20.jpeg", "./assets/images/calcados/p20-2.jpeg", "./assets/images/calcados/p20-3.jpeg", "./assets/images/calcados/p20-4.jpeg", "./assets/images/calcados/p20-5.jpeg", "./assets/images/calcados/p20-6.jpeg", "./assets/images/calcados/p20-7.jpeg"],
    link: "https://shopee.com.br/product/1049291132/22993875328/",
    linkMercadoLivre: "https://produto.mercadolivre.com.br/MLB-5339950326-coturno-3-em-1-beakid-bota-infantil-com-enfeites-off-white-_JM"
  },

];

/* --------------------------------------------------------------------------
   4) ESTADO
   -------------------------------------------------------------------------- */
let filtroAtivo = "todos";
let generoAtivo = "todos";
let ordenacaoAtiva = "recentes";

/* --------------------------------------------------------------------------
   5) HELPERS
   -------------------------------------------------------------------------- */
function formatarPreco(valor) {
  if (valor === null || valor === undefined) return null;
  return valor.toFixed(2).replace(".", ",");
}

const CORES_HEX = {
  "Preto": "#1a1a1a", "Branco": "#ffffff", "Nude": "#e3c4a8",
  "Rosa": "#ff9ec7", "Dourado": "#d4af37", "Prateado": "#c0c0c0",
  "Branco Verniz": "#fafafa", "Azul": "#3b6fd6", "Caramelo": "#c17a3d",
  "Vermelho": "#d6392e", "Palha": "#e8d4a0",
};
function corHex(nomeCor) { return CORES_HEX[nomeCor] || "#cccccc"; }

function renderColorDot(corItem) {
  const nome = typeof corItem === "string" ? corItem : corItem.nome;
  const codigo = typeof corItem === "object" && corItem.codigo ? ` — ${corItem.codigo}` : "";
  return `<span class="color-dot" style="background:${corHex(nome)}" title="${nome}${codigo}"></span>`;
}

function placeholderAttrs(nomeArquivo, descricao) {
  const msg = `Imagem: ${descricao}\\n(substituir em ${nomeArquivo})`.replace(/'/g, "\\'");
  return `onerror="this.onerror=null;this.classList.add('img-placeholder');this.removeAttribute('src');this.replaceWith(Object.assign(document.createElement('div'),{className:'img-placeholder',style:'width:100%;height:100%;display:flex;align-items:center;justify-content:center;',textContent:'${descricao}'}))"`;
}

// NOVO: Função para pegar o link de WhatsApp separado
function getWhatsappLink(produto) {
  const texto = encodeURIComponent(CONFIG.mensagemWhatsapp(produto));
  return CONFIG.whatsapp.includes("?") ? `${CONFIG.whatsapp}&text=${texto}` : `${CONFIG.whatsapp}?text=${texto}`;
}

/* --------------------------------------------------------------------------
   6) RENDER — CATEGORIAS
   -------------------------------------------------------------------------- */
function renderCategorias() {
  const grid = document.getElementById("categoriesGrid");
  grid.innerHTML = CATEGORIAS.map((cat) => `
    <div class="category-card reveal" data-filtro="${cat.filtro}" tabindex="0" role="button" aria-label="Filtrar por ${cat.nome}">
      <img alt="${cat.nome}" src="${cat.imagem}" loading="lazy"
        onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='var(--bg-lilac)';this.insertAdjacentHTML('beforeend','<span style=\\'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font-family:Poppins,sans-serif;font-size:11px;font-weight:600;color:#9c3acc\\'>Foto categoria ${cat.nome}<br>(${cat.imagem})</span>')">
      <div class="category-card__overlay"></div>
      <div class="category-card__label">${cat.nome}<span>${cat.sub}</span></div>
    </div>
  `).join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => aplicarFiltro(card.dataset.filtro, true));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") aplicarFiltro(card.dataset.filtro, true);
    });
  });

  observarReveal();
}

/* --------------------------------------------------------------------------
   7) RENDER — FILTROS (PILLS)
   -------------------------------------------------------------------------- */
const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "tenis", label: "Tênis" },
  { id: "sapatilhas", label: "Sapatilhas" },
  { id: "sandalias", label: "Sandálias" },
  { id: "botas", label: "Botas" },
];

function renderFiltros() {
  const wrap = document.getElementById("filterPills");
  wrap.innerHTML = FILTROS.map((f) => `
    <button class="filter-pill ${f.id === filtroAtivo ? "is-active" : ""}" data-filtro="${f.id}">${f.label}</button>
  `).join("");

  wrap.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => aplicarFiltro(btn.dataset.filtro, false));
  });
}

function renderGeneros() {
  const wrap = document.getElementById("generoPills");
  if (!wrap) return;
  wrap.innerHTML = GENEROS.map((g) => `
    <button class="filter-pill filter-pill--genero ${g.id === generoAtivo ? "is-active" : ""}" data-genero="${g.id}">${g.label}</button>
  `).join("");

  wrap.querySelectorAll(".filter-pill--genero").forEach((btn) => {
    btn.addEventListener("click", () => aplicarGenero(btn.dataset.genero, false));
  });
}

function aplicarFiltro(filtro, scrollParaCatalogo) {
  filtroAtivo = filtro;
  renderFiltros();
  renderProdutos();
  atualizarCategoriaAtiva();
  if (scrollParaCatalogo) document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function aplicarGenero(genero, scrollParaCatalogo) {
  generoAtivo = genero;
  renderGeneros();
  renderProdutos();
  if (scrollParaCatalogo) document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function atualizarCategoriaAtiva() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.filtro === filtroAtivo);
  });
}

/* --------------------------------------------------------------------------
   8) RENDER — PRODUTOS
   -------------------------------------------------------------------------- */
function getProdutosFiltrados() {
  let lista = PRODUTOS.slice();
  if (filtroAtivo !== "todos") lista = lista.filter((p) => p.tipo === filtroAtivo);
  if (generoAtivo !== "todos") lista = lista.filter((p) => p.genero === generoAtivo || p.genero === "unissex");
  if (ordenacaoAtiva === "menor-preco") {
    lista.sort((a, b) => (a.precoAtual ?? Infinity) - (b.precoAtual ?? Infinity));
  } else if (ordenacaoAtiva === "maior-preco") {
    lista.sort((a, b) => (b.precoAtual ?? -Infinity) - (a.precoAtual ?? -Infinity));
  }
  return lista;
}

function renderProdutos() {
  const grid = document.getElementById("productsGrid");
  const lista = getProdutosFiltrados();

  if (lista.length === 0) {
    grid.innerHTML = `<div class="products__empty">Nenhum produto encontrado para este filtro.</div>`;
    return;
  }

  // Modificado: Troca do botão "quero esse" pelos 3 botões empilhados 
  grid.innerHTML = lista.map((p) => `
    <article class="product-card reveal">
      <div class="product-card__media" data-produto-id="${p.id}" role="button" tabindex="0" aria-label="Ver fotos de ${p.nome}">
        <img alt="${p.nome}" src="${p.imagens[0]}" loading="lazy"
          onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='var(--bg-lilac)';this.insertAdjacentHTML('beforeend','<span style=\\'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font-family:Poppins,sans-serif;font-size:11px;font-weight:600;color:#9c3acc\\'>Foto ${p.nome}<br>(${p.imagens[0]})</span>')">
        ${p.novaColecao ? `<span class="product-card__new-badge">Nova Coleção</span>` : ""}
        ${p.imagens.length > 1 ? `<span class="product-card__gallery-badge">📷 ${p.imagens.length}</span>` : ""}
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${labelCategoria(p)}</div>
        <div class="product-card__name">${p.nome}</div>
        <div class="product-card__sizes">
          ${p.tamanhos.map((t) => `<span>${t}</span>`).join("")}
        </div>
        ${p.cores && p.cores.length > 0 ? `
        <div class="product-card__colors">
          ${p.cores.map((c) => renderColorDot(c)).join("")}
        </div>` : ""}
        <div class="product-card__price-row">
          ${p.precoAtual !== null
            ? `<span class="product-card__price">R$ ${formatarPreco(p.precoAtual)}</span>${p.precoAntigo ? `<span class="product-card__price-old">R$ ${formatarPreco(p.precoAntigo)}</span>` : ""}`
            : `<span class="product-card__price product-card__price--pendente">Ver preço na loja</span>`}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
          <a class="btn btn-primary btn-block btn-sm" href="${p.link || CONFIG.shopee}" target="_blank" rel="noopener" style="background-color: #ee4d2d; color: white; border: none;">Comprar na Shopee</a>
          <a class="btn btn-primary btn-block btn-sm" href="${p.linkMercadoLivre || '#'}" target="_blank" rel="noopener" style="background-color: #ffe600; color: #2d3277; border: none;">Comprar no Mercado Livre</a>
          <a class="btn btn-primary btn-block btn-sm" href="${getWhatsappLink(p)}" target="_blank" rel="noopener" style="background-color: #25D366; color: white; border: none;">Falar com vendedor</a>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".product-card__media").forEach((media) => {
    media.addEventListener("click", () => abrirGaleria(media.dataset.produtoId));
    media.addEventListener("keypress", (e) => {
      if (e.key === "Enter") abrirGaleria(media.dataset.produtoId);
    });
  });

  observarReveal();
}

function labelCategoria(p) {
  const generoLabel = { meninas: "Meninas", meninos: "Meninos", unissex: "Unissex" }[p.genero] || "";
  const tipoLabel = { tenis: "Tênis", sapatilhas: "Sapatilha", sandalias: "Sandália", botas: "Bota" }[p.tipo] || "";
  const partes = [tipoLabel, generoLabel].filter(Boolean);
  if (p.cor) partes.push(p.cor);
  return partes.join(" · ");
}

/* --------------------------------------------------------------------------
   8b) GALERIA DE FOTOS (abre ao clicar na foto de capa do produto)
   -------------------------------------------------------------------------- */
let galeriaProdutoAtual = null;
let galeriaIndiceAtual = 0;

function abrirGaleria(produtoId) {
  const produto = PRODUTOS.find((p) => p.id === produtoId);
  if (!produto) return;

  galeriaProdutoAtual = produto;
  galeriaIndiceAtual = 0;

  const overlay = document.getElementById("galeriaOverlay");
  renderGaleriaConteudo();
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function fecharGaleria() {
  const overlay = document.getElementById("galeriaOverlay");
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
  galeriaProdutoAtual = null;
}

function navegarGaleria(direcao) {
  if (!galeriaProdutoAtual) return;
  const total = galeriaProdutoAtual.imagens.length;
  galeriaIndiceAtual = (galeriaIndiceAtual + direcao + total) % total;
  renderGaleriaConteudo();
}

function irParaFotoGaleria(indice) {
  galeriaIndiceAtual = indice;
  renderGaleriaConteudo();
}

function renderGaleriaConteudo() {
  const p = galeriaProdutoAtual;
  if (!p) return;
  const total = p.imagens.length;
  const fotoAtual = p.imagens[galeriaIndiceAtual];

  document.getElementById("galeriaImagemPrincipal").innerHTML = `
    <img alt="${p.nome} — foto ${galeriaIndiceAtual + 1} de ${total}" src="${fotoAtual}"
      onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='var(--bg-lilac)';this.insertAdjacentHTML('beforeend','<span style=\\'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-family:Poppins,sans-serif;font-size:13px;font-weight:600;color:#9c3acc\\'>Foto ${galeriaIndiceAtual + 1} de ${p.nome}<br>(${fotoAtual})</span>')">
  `;

  document.getElementById("galeriaContador").textContent = total > 1 ? `${galeriaIndiceAtual + 1} / ${total}` : "";
  document.getElementById("galeriaNome").textContent = p.nome;
  document.getElementById("galeriaCores").innerHTML = (p.cores && p.cores.length > 0)
    ? `Cores: ${p.cores.map((c) => renderColorDot(c)).join("")}`
    : "";
  document.getElementById("galeriaPreco").innerHTML = p.precoAtual !== null
    ? `R$ ${formatarPreco(p.precoAtual)}${p.precoAntigo ? ` <span class="galeria-preco-old">R$ ${formatarPreco(p.precoAntigo)}</span>` : ""}`
    : `Ver preço na loja`;

  // Modificado: Configurando os 3 novos botões da galeria
  const btnShopee = document.getElementById("galeriaBtnShopee");
  btnShopee.href = p.link || CONFIG.shopee;

  const btnML = document.getElementById("galeriaBtnML");
  btnML.href = p.linkMercadoLivre || "#";

  const btnZap = document.getElementById("galeriaBtnZap");
  btnZap.href = getWhatsappLink(p);

  const setas = document.querySelectorAll(".galeria-seta");
  setas.forEach((s) => (s.style.display = total > 1 ? "flex" : "none"));

  const thumbsWrap = document.getElementById("galeriaThumbs");
  if (total > 1) {
    thumbsWrap.style.display = "flex";
    thumbsWrap.innerHTML = p.imagens.map((img, i) => `
      <button class="galeria-thumb ${i === galeriaIndiceAtual ? "is-active" : ""}" data-indice="${i}" aria-label="Ver foto ${i + 1}">
        <img alt="Miniatura ${i + 1}" src="${img}" onerror="this.onerror=null;this.style.background='var(--bg-lilac)';this.style.opacity='0.3'">
      </button>
    `).join("");
    thumbsWrap.querySelectorAll(".galeria-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => irParaFotoGaleria(Number(thumb.dataset.indice)));
    });
  } else {
    thumbsWrap.style.display = "none";
    thumbsWrap.innerHTML = "";
  }
}

function wireGaleria() {
  document.getElementById("galeriaFechar").addEventListener("click", fecharGaleria);
  document.getElementById("galeriaOverlay").addEventListener("click", (e) => {
    if (e.target.id === "galeriaOverlay") fecharGaleria();
  });
  document.getElementById("galeriaSetaAnterior").addEventListener("click", () => navegarGaleria(-1));
  document.getElementById("galeriaSetaProxima").addEventListener("click", () => navegarGaleria(1));

  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("galeriaOverlay");
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") fecharGaleria();
    if (e.key === "ArrowLeft") navegarGaleria(-1);
    if (e.key === "ArrowRight") navegarGaleria(1);
  });
}

/* --------------------------------------------------------------------------
   9) RENDER — INSTAGRAM
   -------------------------------------------------------------------------- */
function renderInstagram() {
  const grid = document.getElementById("instagramGrid");
  const total = 6;
  let html = "";
  for (let i = 1; i <= total; i++) {
    const arquivo = `./assets/images/instagram/instagram-${i}.png`;
    html += `
      <a class="instagram-tile" href="${CONFIG.instagram}" target="_blank" rel="noopener" aria-label="Ver post no Instagram">
        <img alt="Post BEAKID no Instagram" src="${arquivo}" loading="lazy"
          onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='var(--purple-light)';this.insertAdjacentHTML('beforeend','<span style=\\'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;font-family:Poppins,sans-serif;font-size:10px;font-weight:600;color:#9c3acc\\'>${arquivo}</span>')">
        <div class="instagram-tile__overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
        </div>
      </a>
    `;
  }
  grid.innerHTML = html;
  observarReveal();
}

/* --------------------------------------------------------------------------
   10) LINKS DINÂMICOS (CONFIG)
   -------------------------------------------------------------------------- */
function wireLinks() {
  const whatsappGenerico = CONFIG.whatsapp;
  [
    "linkWhatsappHeader", "linkWhatsappMobile", "footerWhatsapp", "footerWhatsappLink",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = whatsappGenerico;
  });

  [
    "linkInstagram", "linkInstagramMobile", "linkInstagramCta", "footerInstagram", "footerInstagramLink",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.instagram;
  });
}

/* --------------------------------------------------------------------------
   11) HEADER — sombra ao rolar
   -------------------------------------------------------------------------- */
function wireHeaderScroll() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   12) MENU MOBILE
   -------------------------------------------------------------------------- */
function wireMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const abrir = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", abrir);
    hamburger.classList.toggle("is-active", abrir);
    hamburger.setAttribute("aria-expanded", String(abrir));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* --------------------------------------------------------------------------
   13) LINKS DE FILTRO NO MENU (data-filtro-link)
   -------------------------------------------------------------------------- */
function wireFiltroLinks() {
  document.querySelectorAll("[data-filtro-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const valor = link.dataset.filtroLink;
      if (GENEROS.some((g) => g.id === valor)) {
        aplicarGenero(valor, true);
      } else {
        aplicarFiltro(valor, true);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   14) ORDENAÇÃO
   -------------------------------------------------------------------------- */
function wireOrdenacao() {
  const select = document.getElementById("sortSelect");
  select.addEventListener("change", () => {
    ordenacaoAtiva = select.value;
    renderProdutos();
  });
}

/* --------------------------------------------------------------------------
   15) BUSCA (placeholder simples — filtra por nome via prompt)
   -------------------------------------------------------------------------- */
function wireBusca() {
  const btn = document.getElementById("btnSearch");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("sortSelect").focus();
  });
}

/* --------------------------------------------------------------------------
   16) SCROLL REVEAL
   -------------------------------------------------------------------------- */
let revealObserver;
function observarReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.reveal--visible)").forEach((el) => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   17) INIT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  wireHeaderScroll();
  wireMobileMenu();
  wireFiltroLinks();
  wireOrdenacao();
  wireBusca();
  wireGaleria();

  renderCategorias();
  renderFiltros();
  renderGeneros();
  renderProdutos();
  renderInstagram();

  observarReveal();
});