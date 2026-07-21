/**
 * CORRE BRECHÓ — Catálogo de produtos
 * Fonte única de verdade usada pela vitrine (index.html) e pelo carrinho (carrinho.html).
 * Quando houver a base de dados local, usamos os produtos do banco.
 */
(function (global) {
  'use strict';

  const FALLBACK_PRODUCTS = [
    {
      id: 'hoodie',
      name: 'Vintage 90s Box Logo Hoodie',
      price: 289.0,
      size: 'XL',
      variant: 'Washed Black',
      image: 'img/produto-hoodie.svg',
      alt: 'Moletom vintage anos 90 com estampa desbotada no peito, estilo streetwear urbano.',
      weightKg: 0.9,
      stock: 3
    },
    {
      id: 'botas',
      name: 'Urban Combat Boots',
      price: 450.0,
      size: '42',
      variant: 'Distressed Leather',
      image: 'img/produto-botas.svg',
      alt: 'Coturno urbano de couro desgastado com sola grossa, estilo neo-punk industrial.',
      weightKg: 1.6,
      stock: 4
    },
    {
      id: 'corrente',
      name: 'Padlock Heavy Chain',
      price: 120.0,
      size: 'Único',
      variant: 'Acessório',
      image: 'img/produto-corrente.svg',
      alt: 'Corrente prateada chunky com pingente de cadeado, estética industrial brutalista.',
      weightKg: 0.35,
      stock: 10
    }
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

  global.refreshProductCatalog = refreshProductCatalog;
  global.refreshProductCatalog();
})(window);
