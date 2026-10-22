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
- **Páginas individuais de produto** em `produtos/<slug>/`, geradas a partir do mesmo array `PRODUTOS`, com título, descrição, galeria, tamanhos, preços e botões de compra.

## SEO e medição

O projeto também inclui a parte técnica de visibilidade e análise:

- `<title>` e meta description próprios, tag **canonical** e metadados **Open Graph** e **Twitter Card** (com imagem de compartilhamento 1200×630).
- Dados estruturados **Schema.org em JSON-LD** (`Organization` e `WebSite` na homepage; `Product` com `Offer` e `BreadcrumbList` em cada página de produto).
- Cada página de produto tem **canonical próprio**, `title`, meta description e Open Graph próprios.
- HTML semântico, com hierarquia correta de `h1`, `h2` e `h3`.
- `robots.txt`, `sitemap.xml` (homepage + todas as páginas de produto) e `llms.txt`.
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
├── produto.css       # Estilos das páginas individuais de produto
├── script.js         # Dados dos produtos, filtros, galeria e interações
├── produtos/         # Páginas individuais (geradas) — produtos/<slug>/index.html
├── tools/
│   ├── gerar-paginas-produtos.js    # Gerador das páginas + sitemap (Node, só dev)
│   └── verificar-paginas-produtos.js # Verificações automáticas (Node, só dev)
├── robots.txt
├── sitemap.xml
├── llms.txt
├── favicon.ico
├── .htaccess
└── assets/
    └── images/       # Logo, fotos dos produtos, favicons e imagem de compartilhamento
```

## Páginas individuais de produto

O catálogo continua dinâmico na homepage, e cada produto também tem uma página estática própria, acessível direto pela URL, por exemplo:

`https://beakid.com.br/produtos/tenis-infantil-menino-com-led-beakid-azul/`

Essas páginas são **geradas** a partir do array `PRODUTOS` do `script.js` (fonte única de dados) pelo script `tools/gerar-paginas-produtos.js`. O Node.js é usado **apenas como ferramenta de desenvolvimento** — o site publicado continua 100% estático, sem backend e sem build na hospedagem.

### Gerar / atualizar as páginas

Com Node.js instalado (v16+), na pasta do projeto:

```bash
node tools/gerar-paginas-produtos.js
```

O comando:

- cria/atualiza `produtos/<slug>/index.html` para cada produto do catálogo;
- remove pastas órfãs de produtos que saíram do catálogo;
- reescreve o `sitemap.xml` com a homepage e todas as páginas geradas.

Sempre que o array `PRODUTOS` mudar (preço, foto, link, produto novo/removido), rode o comando novamente e envie a pasta `produtos/` e o `sitemap.xml` atualizados para a hospedagem.

### Verificar

```bash
node tools/verificar-paginas-produtos.js
```

Confere, contra os dados reais do `script.js`: existência e unicidade das páginas, JSON-LD válido e coerente (preço, moeda, links), canônicos, imagens existentes, sitemap completo sem URLs externas e a integridade do catálogo original.

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
