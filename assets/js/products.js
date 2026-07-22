/**
 * CORRE BRECHÓ — Catálogo de produtos
 * Fonte única de verdade usada pela vitrine (index.html) e pelo carrinho (carrinho.html).
 * Quando houver a base de dados local, usamos os produtos do banco.
 */
(function (global) {
  'use strict';

  const FALLBACK_PRODUCTS = [
    { id: 'yinyang', name: 'Bermuda Jeans Yin Yang Streetwear', price: 40.0, size: '46', variant: 'Streetwear', image: 'img/Shortyingyang.png', alt: 'Bermuda jeans azul com lavagem desgastada, estampa yin yang e detalhes orientais na perna direita', weightKg: 0.35, stock: 6, description: 'Bermuda jeans oversized com atitude streetwear e estampa yin yang.' },
    { id: 'short', name: 'Short Jeans Dark Streetwear', price: 35.0, size: '40', variant: 'Dark Grey', image: 'img/short2;png.png', alt: 'Short jeans cinza feminino com estampa gótica preta na perna direita e fechamento por botões frontais.', weightKg: 0.28, stock: 5, description: 'Short jeans dark com acabamento desfiado e design urbano.' },
    { id: 'flannel', name: 'Heavy Flannel Blue Ash', price: 245.0, size: 'L', variant: 'Blue Ash Plaid', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjvI6v5KCEfWalM3KmMU6uzrq34XFi7nrSsRdiXmLSLlCUwTDMqZPwYzxA0MAMhCA0yYeaB1ffEUrE-Bzf7xT-rolKN-HOH-5aEaRNItnmCl_XRlmvZWv0lYkbP0s7vNdxVh08kCMqdr_Q-RJQNbOxaWTWFFPqwDGj7snXjeZ20LHu9JWsgJfE6RvRhv_jETiyH8-suqbWmiWltr1jq0CcBm5RjQlLpKX4dPcakc1aO7mindV5LxXp7jCZ9kGkOd4f6LvwZVk68KRl', alt: "Camisa flanela oversized xadrez azul e preto, com remendo personalizado 'CORRE' no peito.", weightKg: 0.5, stock: 8, description: 'Flanela pesada com estética grunge e corte oversized.' },
    { id: 'bolt', name: 'Bolt Pendant Chain', price: 115.0, size: 'Único', variant: 'Acessório', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAudUyeuCloZiebvMB96uDyrBCODsWNnBeR8SqSmofcjQp-Fl4kQygQqRZ5XuP8sZY-bAKZfcWIiIoPOeKZpNIi_lziqlgczDLgPKxGnFmOG0LyxE2dBGao7cfmykVaiupmHESJL2Z52q1IjvH6C9F5iUa4w5Xeh51NBHtuTVCbGuhZOdJdOJn4DfuAJTjhtnEcE2Im-cEbvyEd9AYiTclC0Jp2o_38YDZGxniVbetjtjcFJReI3e4LdYVz1PxEPmT8QA7ExJk_5ho2', alt: 'Colar de corrente prateada com pingente de parafuso industrial.', weightKg: 0.15, stock: 12, description: 'Corrente bolta chunky com acabamento prateado fosco.' }
  ];

  function normalizeProduct(product) {
    return {
      id: String(product.id || product.ID_produto || '').trim(),
      name: product.nome || product.name || '',
      price: Number(product.preco || product.price || 0),
      size: product.tamanho || product.size || '',
      variant: product.variante || product.variant || '',
      image: product.imagem || product.image || '',
      alt: product.alt || product.nome || product.name || '',
      weightKg: Number(product.pesoKg || product.weightKg || 0.4),
      stock: Number(product.estoque || product.stock || 0),
      description: product.descricao || product.description || '',
      categoryId: product.ID_categoria || product.categoryId || null,
      sellerId: product.ID_vendedor || product.sellerId || null,
      ID_produto: product.ID_produto || null
    };
  }

  function loadProducts() {
    if (global.BrechoDB && typeof global.BrechoDB.getProducts === 'function') {
      return global.BrechoDB.getProducts().map(normalizeProduct);
    }
    return FALLBACK_PRODUCTS.map(normalizeProduct);
  }

  function buildIndex(products) {
    return products.reduce((acc, product) => {
      if (product.id) acc[product.id] = product;
      return acc;
    }, {});
  }

  function refreshProductCatalog() {
    const products = loadProducts();
    const productsById = buildIndex(products);
    global.PRODUCTS = products;
    global.PRODUCTS_BY_ID = productsById;
    return { products, productsById };
  }

  if (!global.refreshProductCatalog) {
    global.refreshProductCatalog = refreshProductCatalog;
  }
  refreshProductCatalog();
})(window);
