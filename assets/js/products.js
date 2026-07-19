/**
 * CORRE BRECHÓ — Catálogo de produtos
 * Fonte única de verdade usada pela vitrine (index.html) e pelo carrinho (carrinho.html).
 * weightKg é usado no cálculo de frete.
 */
const PRODUCTS = [
  {
    id: "hoodie",
    name: "Vintage 90s Box Logo Hoodie",
    price: 289.00,
    size: "XL",
    variant: "Washed Black",
    image: "img/produto-hoodie.svg",
    alt: "Moletom vintage anos 90 com estampa desbotada no peito, estilo streetwear urbano.",
    weightKg: 0.9
  },
  {
    id: "botas",
    name: "Urban Combat Boots",
    price: 450.00,
    size: "42",
    variant: "Distressed Leather",
    image: "img/produto-botas.svg",
    alt: "Coturno urbano de couro desgastado com sola grossa, estilo neo-punk industrial.",
    weightKg: 1.6
  },
  {
    id: "corrente",
    name: "Padlock Heavy Chain",
    price: 120.00,
    size: "Único",
    variant: "Acessório",
    image: "img/produto-corrente.svg",
    alt: "Corrente prateada chunky com pingente de cadeado, estética industrial brutalista.",
    weightKg: 0.35
  },
  {
    id: "tee",
    name: "Vintage Graphic Tee",
    price: 189.90,
    size: "XL",
    variant: "Band Print",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGXyzVV_umqySky_XxVM6yfCOELi1M9WPgf-ZDe7vt1R1DlqgE__nWsz1CuG2kmAkk92IQ7ESlfo_VOlTEih-Oz8P8NprB2xeH5jIrUY8NaFJwgb_vd5_oqOGQ-Bx3fU_8BsxeIslx3RnEEaJkgn1PlaaO_RT5T1UfKAlUjp0AjHjRAmkrmlH23pYFycu94S8CZho7cmqejdIx9KBw0Ora9oTU9VzPQWmsoJ4oZBZ_dsOssv_k_-pH5YiaXXRNeKOVZ5Yig3xenbB9",
    alt: "Camiseta gráfica vintage dos anos 90 com estampa de banda de rock desbotada, sobre asfalto.",
    weightKg: 0.25
  },
  {
    id: "cargo",
    name: "Military Cargo Distressed",
    price: 320.00,
    size: "42",
    variant: "Grey Wash",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3YjJwJi4_GtWdaq1iN5KW-pFJScqFcVGDB5N6xI8VH2QhfQdCLHtZZ5L9-9FzTuYShlkeQ4owRtkGUdl6AHO-CvrDDvQM8oIeej1xQ6-qis564vCk5vvD0oRFd7qQYtzznZYFh6RjoEYUnjZsDelVio9-0he7SeKGaxDPY7vvv-KYVDuTzCUYJS6fOMbGdPHfSs6sQU6lAjNzOftOyq9zCv8oowZ_iJtxvgYmF_Bh5SAm9ppC_laTOdg4Pvv1QPDhjhiOBHCRTrmy",
    alt: "Calça cargo desgastada cinza chumbo com bolsos funcionais, sobre um barril metálico enferrujado.",
    weightKg: 0.7
  },
  {
    id: "flannel",
    name: "Heavy Flannel Blue Ash",
    price: 245.00,
    size: "L",
    variant: "Blue Ash Plaid",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjvI6v5KCEfWalM3KmMU6uzrq34XFi7nrSsRdiXmLSLlCUwTDMqZPwYzxA0MAMhCA0yYeaB1ffEUrE-Bzf7xT-rolKN-HOH-5aEaRNItnmCl_XRlmvZWv0lYkbP0s7vNdxVh08kCMqdr_Q-RJQNbOxaWTWFFPqwDGj7snXjeZ20LHu9JWsgJfE6RvRhv_jETiyH8-suqbWmiWltr1jq0CcBm5RjQlLpKX4dPcakc1aO7mindV5LxXp7jCZ9kGkOd4f6LvwZVk68KRl",
    alt: "Camisa flanela oversized xadrez azul e preto, com remendo personalizado 'CORRE' no peito, em uma cerca de arame.",
    weightKg: 0.5
  },
  {
    id: "bolt",
    name: "Bolt Pendant Chain",
    price: 115.00,
    size: "Único",
    variant: "Acessório",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAudUyeuCloZiebvMB96uDyrBCODsWNnBeR8SqSmofcjQp-Fl4kQygQqRZ5XuP8sZY-bAKZfcWIiIoPOeKZpNIi_lziqlgczDLgPKxGnFmOG0LyxE2dBGao7cfmykVaiupmHESJL2Z52q1IjvH6C9F5iUa4w5Xeh51NBHtuTVCbGuhZOdJdOJn4DfuAJTjhtnEcE2Im-cEbvyEd9AYiTclC0Jp2o_38YDZGxniVbetjtjcFJReI3e4LdYVz1PxEPmT8QA7ExJk_5ho2",
    alt: "Colar de corrente prateada com pingente de parafuso industrial, sobre uma laje de ardósia escura.",
    weightKg: 0.15
  }
];

// Índice rápido por id
const PRODUCTS_BY_ID = PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});

// Anexa explicitamente a window: `const`/`let` de topo de script NÃO vira
// propriedade de `window` automaticamente, e cart.js precisa acessá-los
// via `window.PRODUCTS_BY_ID`.
window.PRODUCTS = PRODUCTS;
window.PRODUCTS_BY_ID = PRODUCTS_BY_ID;
