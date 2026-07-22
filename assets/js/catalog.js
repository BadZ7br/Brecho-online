(function (global) {
    'use strict';

    let currentFilter = { search: '', categoryId: null };

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function createProductCard(product) {
        const wrapper = document.createElement('article');
        wrapper.className = 'group bg-surface-container-high border border-outline-variant hover:border-primary transition-colors overflow-hidden rounded-sm';

        const safeName = escapeHtml(product.name);
        const safeAlt = escapeHtml(product.alt || product.name);
        const safeImage = escapeHtml(product.image);
        const safeDesc = escapeHtml(product.description || '');
        const safeSize = escapeHtml(product.size || 'ÚNICO');
        const safeId = escapeHtml(product.id);

        wrapper.innerHTML = `
      <div class="relative aspect-[3/4] overflow-hidden">
        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt="${safeAlt}"
          src="${safeImage}">
        <div class="absolute top-2 left-2 bg-black text-white font-label-mono px-2 text-[10px]">TAM ${safeSize}</div>
      </div>
      <div class="p-4">
        <h4 class="font-body-lg text-primary truncate uppercase">${safeName}</h4>
        <p class="font-label-mono text-on-surface-variant mt-2 leading-tight text-[13px]">${safeDesc}</p>
        <div class="flex justify-between items-center mt-4">
          <span class="font-label-mono text-secondary-container">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          <button type="button" data-add-to-cart="${safeId}"
            aria-label="Adicionar ${safeName} ao carrinho"
            class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">add_shopping_cart</button>
        </div>
      </div>
    `;

        return wrapper;
    }

    function getFilteredProducts() {
        let products = global.PRODUCTS || [];
        const search = currentFilter.search.trim().toLowerCase();
        const catId = currentFilter.categoryId;

        if (search) {
            products = products.filter(p =>
                (p.name || '').toLowerCase().includes(search) ||
                (p.description || '').toLowerCase().includes(search)
            );
        }

        if (catId != null) {
            products = products.filter(p => p.categoryId === catId);
        }

        return products;
    }

    function renderCatalog() {
        const container = document.getElementById('productGrid');
        if (!container) return;

        const products = getFilteredProducts();
        container.innerHTML = '';

        if (!products.length) {
            container.innerHTML = '<p class="font-label-mono text-on-surface-variant col-span-full text-center py-8">Nenhum produto encontrado.</p>';
            return;
        }

        products.forEach(product => container.appendChild(createProductCard(product)));
        attachAddToCartListeners();
    }

    function setFilter(opts) {
        if (opts.search !== undefined) currentFilter.search = opts.search;
        if (opts.categoryId !== undefined) currentFilter.categoryId = opts.categoryId;
        renderCatalog();
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const productId = btn.dataset.addToCart;
                const product = window.PRODUCTS_BY_ID?.[productId];
                if (!product) return;
                window.CorreCart.addToCart(productId, 1);
                if (typeof showCartToast === 'function') showCartToast(product.name);
                btn.classList.add('scale-125');
                setTimeout(() => btn.classList.remove('scale-125'), 150);
            });
        });
    }

    async function initCatalog() {
        if (window.BrechoDB) {
            if (typeof window.BrechoDB.initDatabase === 'function') {
                await window.BrechoDB.initDatabase();
            } else if (typeof window.BrechoDB.refreshProductCatalog === 'function') {
                window.BrechoDB.refreshProductCatalog();
            }
        }
        renderCatalog();
    }

    global.initCatalog = initCatalog;
    global.setCatalogFilter = setFilter;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalog);
    } else {
        initCatalog();
    }
})(window);
