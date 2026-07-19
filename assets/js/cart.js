/**
 * CORRE BRECHÓ — Carrinho de compras
 * Persiste em localStorage (chave abaixo) e funciona em qualquer página
 * que inclua products.js + cart.js. Sem itens fixos: o carrinho começa
 * sempre vazio até o usuário adicionar algo.
 */
(function (global) {
  "use strict";

  const CART_KEY = "correbrecho_cart_v1";

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Carrinho corrompido, reiniciando.", e);
      return [];
    }
  }

  function persist(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadges();
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: getCartDetails() }));
  }

  function addToCart(productId, qty) {
    qty = qty || 1;
    if (!global.PRODUCTS_BY_ID || !global.PRODUCTS_BY_ID[productId]) {
      console.error("Produto inexistente:", productId);
      return;
    }
    const cart = getCart();
    const existing = cart.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty });
    }
    persist(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((i) => i.id !== productId);
    persist(cart);
  }

  function setQty(productId, qty) {
    let cart = getCart();
    if (qty <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    } else {
      const item = cart.find((i) => i.id === productId);
      if (item) item.qty = qty;
    }
    persist(cart);
  }

  function clearCart() {
    persist([]);
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  // Junta os itens salvos (id/qty) com os dados completos do catálogo
  function getCartDetails() {
    const products = global.PRODUCTS_BY_ID || {};
    return getCart()
      .map((i) => {
        const product = products[i.id];
        return product ? Object.assign({}, product, { qty: i.qty }) : null;
      })
      .filter(Boolean);
  }

  function getSubtotal() {
    return getCartDetails().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getTotalWeightKg() {
    return getCartDetails().reduce((sum, i) => sum + i.weightKg * i.qty, 0);
  }

  function updateCartBadges() {
    const count = getCartCount();
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      if (count > 0) {
        el.textContent = count > 99 ? "99+" : String(count);
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", updateCartBadges);
  // Mantém o badge sincronizado se o carrinho mudar em outra aba
  global.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) updateCartBadges();
  });

  global.CorreCart = {
    getCart,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    getCartCount,
    getCartDetails,
    getSubtotal,
    getTotalWeightKg,
    updateCartBadges,
    formatBRL
  };
})(window);
