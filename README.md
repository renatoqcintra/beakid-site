# BEAKID — Site institucional e catálogo de calçados infantis

Site responsivo da **BEAKID**, marca de calçados infantis de Birigui (SP), feito com **HTML, CSS e JavaScript puro**, sem frameworks e sem etapa de build. O site apresenta a marca, exibe um catálogo filtrável de produtos e leva o cliente à compra pela Shopee, pelo Mercado Livre ou pelo WhatsApp.

🔗 **Site no ar:** [beakid.com.br](https://beakid.com.br)

![Prévia do site BEAKID](assets/images/og-beakid.jpg)

## Funcionalidades

- **Catálogo dinâmico** com 26 produtos, montado a partir de um array de dados em JavaScript.
- **Filtros** por categoria (tênis, sapatilhas, sandálias, botas) e por gênero (meninas e meninos).
- **Busca** por nome e **ordenação** dos produtos.
- **Galeria de fotos** em janela modal, com navegação entre imagens e miniaturas.
- **Botões de compra** por produto: Shopee, Mercado Livre e WhatsApp (com mensagem pré-preenchida).
- **Seção do Instagram** com prévia dos posts e link para o perfil da loja.
- **Menu mobile**, cabeçalho que reage à rolagem e animações de entrada (reveal) ao rolar a página.
- **Layout responsivo**, que se adapta a celular, tablet e computador.

## SEO e medição

O projeto também inclui a parte técnica de visibilidade e análise:

- `<title>` e meta description próprios, tag **canonical** e metadados **Open Graph** e **Twitter Card** (com imagem de compartilhamento 1200×630).
- Dados estruturados **Schema.org em JSON-LD** (`Organization` e `WebSite`).
- HTML semântico, com hierarquia correta de `h1`, `h2` e `h3`.
- `robots.txt`, `sitemap.xml` e `llms.txt`.
- Conjunto completo de **favicons** (`.ico`, PNG e `apple-touch-icon`).
- **Google Tag Manager** com **Google Analytics 4**, e site cadastrado no **Google Search Console**.

## Tecnologias

- HTML5 e CSS3 (variáveis CSS, Flexbox e Grid)
- JavaScript (ES6+), sem bibliotecas
- Fontes Poppins e Nunito (Google Fonts)
- Hospedagem na Hostinger, com `.htaccess` para configurações do servidor

## Estrutura do projeto

```
├── index.html        # Estrutura da página, metadados e JSON-LD
├── style.css         # Estilos, cores e responsividade
├── script.js         # Dados dos produtos, filtros, galeria e interações
├── robots.txt
├── sitemap.xml
├── llms.txt
├── favicon.ico
├── .htaccess
└── assets/
    └── images/       # Logo, fotos dos produtos, favicons e imagem de compartilhamento
```

## Como rodar localmente

Não precisa instalar nada. Há duas opções:

1. Abra o arquivo `index.html` direto no navegador; ou
2. Rode um servidor local na pasta do projeto, por exemplo:

```bash
python -m http.server 8000
```

e acesse `http://localhost:8000`.

## Como editar o catálogo

Os produtos ficam no array `PRODUTOS` do arquivo `script.js`. Cada item tem nome, gênero, categoria, preço, cores, fotos e links de compra. Os links das lojas e o contato ficam no objeto `CONFIG`, no início do mesmo arquivo. Para adicionar ou alterar um produto, basta editar esses dados, sem mexer no HTML.

## Autor

Desenvolvido por **Renato Queiroz Cintra**, estudante de Técnico em Informática no IFSP, campus Birigui.

- GitHub: [@renatoqcintra](https://github.com/renatoqcintra)
