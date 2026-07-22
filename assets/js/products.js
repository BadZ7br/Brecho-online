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
    { id: 'bolt', name: 'Bolt Pendant Chain', price: 115.0, size: 'Único', variant: 'Acessório', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAudUyeuCloZiebvMB96uDyrBCODsWNnBeR8SqSmofcjQp-Fl4kQygQqRZ5XuP8sZY-bAKZfcWIiIoPOeKZpNIi_lziqlgczDLgPKxGnFmOG0LyxE2dBGao7cfmykVaiupmHESJL2Z52q1IjvH6C9F5iUa4w5Xeh51NBHtuTVCbGuhZOdJdOJn4DfuAJTjhtnEcE2Im-cEbvyEd9AYiTclC0Jp2o_38YDZGxniVbetjtjcFJReI3e4LdYVz1PxEPmT8QA7ExJk_5ho2', alt: 'Colar de corrente prateada com pingente de parafuso industrial.', weightKg: 0.15, stock: 12, description: 'Corrente bolta chunky com acabamento prateado fosco.' },
    { id: 'hoodie', name: 'Vintage 90s Box Logo Hoodie', price: 289.0, size: 'XL', variant: 'Washed Black', image: 'img/produto-hoodie.svg', alt: 'Moletom vintage anos 90 com estampa desbotada no peito.', weightKg: 0.9, stock: 3, description: 'Moletom soft, oversized e com vibe retrô dos anos 90.' },
    { id: 'botas', name: 'Urban Combat Boots', price: 450.0, size: '42', variant: 'Distressed Leather', image: 'img/produto-botas.svg', alt: 'Coturno urbano de couro desgastado com sola grossa.', weightKg: 1.6, stock: 4, description: 'Botas robustas com sola de combate e acabamento desgastado.' },
    { id: 'corrente', name: 'Padlock Heavy Chain', price: 120.0, size: 'Único', variant: 'Acessório', image: 'img/produto-corrente.svg', alt: 'Corrente prateada chunky com pingente de cadeado.', weightKg: 0.35, stock: 10, description: 'Corrente pesada com cadeado inspirado na cena industrial.' },
    { id: 'crop-denim', name: 'Crop Top Jeans Destroyed', price: 55.0, size: 'M', variant: 'Light Wash', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', alt: 'Crop top jeans com fios soltos e lavagem clara.', weightKg: 0.2, stock: 7, description: 'Crop jeans com acabamento destroyed e lavagem solar.' },
    { id: 'cargo-preta', name: 'Calça Cargo Oversized', price: 89.0, size: '44', variant: 'Preto', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', alt: 'Calça cargo preta com bolsos laterais grandes.', weightKg: 0.6, stock: 9, description: 'Cargo preta com caimento amplo e bolsos tacticos.' },
    { id: 'boné-trucker', name: 'Trucker Cap Graffiti', price: 39.0, size: 'Único', variant: 'Preto/Branco', image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=500&fit=crop', alt: 'Boné trucker preto com estampa graffiti.', weightKg: 0.12, stock: 15, description: 'Trucker cap com arte graffiti e fecho ajustável.' },
    { id: 'moletom-canguru', name: 'Hoodie Canguru Neon', price: 179.0, size: 'G', variant: 'Preto/Verde', image: 'https://images.unsplash.com/photo-1556821840-3a63f7b8e7d1?w=400&h=500&fit=crop', alt: 'Moletom preto com detalhes neon verde.', weightKg: 0.75, stock: 6, description: 'Hoodie canguru com detalhes neon e costuras reforçadas.' },
    { id: 'jaqueta-couro', name: 'Bomber Jacket Vintage', price: 320.0, size: 'L', variant: 'Marrom', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', alt: 'Jaqueta bomber de couro marrom vintage.', weightKg: 1.1, stock: 3, description: 'Bomber de couro legítimo com character vintage.' },
    { id: 'meias-skull', name: 'Meias Calaveras Pack 3', price: 29.0, size: '40-44', variant: 'Pack', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c8f?w=400&h=500&fit=crop', alt: 'Pack de 3 meias com estampa caveira mexicana.', weightKg: 0.15, stock: 20, description: 'Pack de meias com estampa calavera, algodão cannetê.' },
    { id: 'regata-grunge', name: 'Regata Slasher Punk', price: 32.0, size: 'P', variant: 'Off White', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop', alt: 'Regata branca com cortes laterais e estampa de filme slasher.', weightKg: 0.12, stock: 11, description: 'Regata com cortes laterais e estampa horror punk.' },
    { id: 'bermuda-cargo', name: 'Bermuda Cargo Mil-Spec', price: 65.0, size: '42', variant: 'Verde Militar', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop', alt: 'Bermuda cargo verde militar com bolsos laterais ampliados.', weightKg: 0.4, stock: 8, description: 'Cargo bermuda com estética militar e bolsos cargueiros.' }
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
