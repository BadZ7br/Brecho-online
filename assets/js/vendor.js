(function (global) {
    'use strict';

    const sellerName = document.getElementById('sellerName');
    const statProducts = document.getElementById('statProducts');
    const statStock = document.getElementById('statStock');
    const statOrders = document.getElementById('statOrders');
    const statRevenue = document.getElementById('statRevenue');
    const metricsList = document.getElementById('metricsList');
    const sellerProductsContainer = document.getElementById('sellerProductsContainer');
    const productForm = document.getElementById('productForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const vendorFeedback = document.getElementById('vendorFeedback');

    const categorySelect = document.getElementById('productCategory');
    const productNameInput = document.getElementById('productName');
    const productIdInput = document.getElementById('productId');
    const productPriceInput = document.getElementById('productPrice');
    const productStockInput = document.getElementById('productStock');
    const productWeightInput = document.getElementById('productWeight');
    const productSizeInput = document.getElementById('productSize');
    const productVariantInput = document.getElementById('productVariant');
    const productImageInput = document.getElementById('productImage');
    const productDescriptionInput = document.getElementById('productDescription');

    let currentSeller = null;
    let editingProductId = null;

    function formatBRL(value) {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function buildCategoryOptions(categories) {
        if (!categorySelect) return;
        categorySelect.innerHTML = categories
            .map(category => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
            .join('');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function createProductCard(product) {
        const wrapper = document.createElement('article');
        wrapper.className = 'bg-surface-container p-6 border border-outline-variant rounded-md';

        const safeName = escapeHtml(product.name);
        const safeDesc = escapeHtml(product.description || 'Sem descrição adicional.');
        const safeId = escapeHtml(product.id);
        const safeImage = escapeHtml(product.image);
        const safeAlt = escapeHtml(product.alt);

        wrapper.innerHTML = `
      <div class="flex flex-col xl:flex-row gap-6">
        <img class="w-full xl:w-48 h-48 object-cover rounded-md" src="${safeImage}" alt="${safeAlt}">
        <div class="flex-1 space-y-4">
          <div class="flex flex-col gap-2">
            <p class="font-headline-lg uppercase text-primary">${safeName}</p>
            <p class="font-label-mono text-on-surface-variant uppercase text-[11px]">ID: ${safeId}</p>
            <p class="font-body-sm text-on-surface-variant">${safeDesc}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-1"><span class="font-label-mono text-on-surface-variant uppercase">Preço</span><p>${formatBRL(product.price)}</p></div>
            <div class="space-y-1"><span class="font-label-mono text-on-surface-variant uppercase">Estoque</span><p>${product.stock}</p></div>
            <div class="space-y-1"><span class="font-label-mono text-on-surface-variant uppercase">Peso</span><p>${product.weightKg} kg</p></div>
            <div class="space-y-1"><span class="font-label-mono text-on-surface-variant uppercase">Tamanho</span><p>${escapeHtml(product.size) || '—'}</p></div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button type="button" data-action="edit" data-product-id="${safeId}" class="bg-primary text-background px-5 py-3 uppercase rounded-md hover:bg-secondary-container transition-colors">Editar</button>
            <button type="button" data-action="delete" data-product-id="${safeId}" class="bg-surface text-on-surface border border-outline-variant px-5 py-3 uppercase rounded-md hover:bg-surface-variant transition-colors">Excluir</button>
          </div>
        </div>
      </div>
    `;

        wrapper.querySelector('[data-action="edit"]').addEventListener('click', () => startEditProduct(product.id));
        wrapper.querySelector('[data-action="delete"]').addEventListener('click', () => deleteProduct(product.id));

        return wrapper;
    }

    function renderSellerProducts(products) {
        if (!sellerProductsContainer) return;
        sellerProductsContainer.innerHTML = '';
        if (!products.length) {
            sellerProductsContainer.innerHTML = '<p class="font-label-mono text-on-surface-variant">Nenhum produto encontrado. Cadastre um produto acima.</p>';
            return;
        }
        products.forEach(product => sellerProductsContainer.appendChild(createProductCard(product)));
    }

    function showFeedback(message, isError = false) {
        if (!vendorFeedback) return;
        vendorFeedback.textContent = message;
        vendorFeedback.className = `font-label-mono text-[12px] uppercase min-h-[22px] ${isError ? 'text-secondary-container' : 'text-primary'}`;
    }

    function resetForm() {
        productForm.reset();
        editingProductId = null;
        cancelEditBtn?.classList.add('hidden');
        showFeedback('Produto pronto para cadastro.');
    }

    function populateForm(product) {
        productNameInput.value = product.name || '';
        productIdInput.value = product.id || '';
        productPriceInput.value = product.price || 0;
        productStockInput.value = product.stock || 0;
        productWeightInput.value = product.weightKg || 0.4;
        productSizeInput.value = product.size || '';
        productVariantInput.value = product.variant || '';
        productImageInput.value = product.image || '';
        productDescriptionInput.value = product.description || '';
        cancelEditBtn?.classList.remove('hidden');
    }

    function updateStats(products) {
        const totalProducts = products.length;
        const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);

        if (statProducts) statProducts.textContent = totalProducts;
        if (statStock) statStock.textContent = totalStock;
        if (statOrders) statOrders.textContent = '0';
        if (statRevenue) statRevenue.textContent = formatBRL(0);

        if (metricsList) {
            metricsList.innerHTML = `
        <article class="bg-surface p-5 rounded-md border border-outline-variant">
          <p class="font-label-mono uppercase text-on-surface-variant mb-3">Meus produtos</p>
          <p class="font-headline-lg text-primary">${totalProducts}</p>
        </article>
        <article class="bg-surface p-5 rounded-md border border-outline-variant">
          <p class="font-label-mono uppercase text-on-surface-variant mb-3">Estoque total</p>
          <p class="font-headline-lg text-primary">${totalStock}</p>
        </article>
      `;
        }
    }

    function refreshSellerView() {
        if (!currentSeller) return;
        if (window.BrechoDB && window.BrechoDB.getSellerProducts) {
            const products = window.BrechoDB.getSellerProducts(currentSeller.id);
            renderSellerProducts(products);
            updateStats(products);
        }
    }

    function startEditProduct(productId) {
        if (!window.BrechoDB || !window.BrechoDB.getProductById) return;
        const product = window.BrechoDB.getProductById(productId);
        if (!product) return;
        editingProductId = product.id;
        populateForm(product);
        showFeedback('Editando produto. Clique em salvar para atualizar.');
    }

    function deleteProduct(productId) {
        if (!window.confirm('Deseja excluir este produto?')) return;
        if (window.BrechoDB && window.BrechoDB.deleteProduct) {
            window.BrechoDB.deleteProduct(productId);
            if (window.BrechoDB.refreshProductCatalog) window.BrechoDB.refreshProductCatalog();
            refreshSellerView();
            showFeedback('Produto excluído com sucesso.');
        }
    }

    function submitProductForm(event) {
        event.preventDefault();
        if (!currentSeller) {
            showFeedback('Nenhum vendedor autenticado.', true);
            return;
        }

        const payload = {
            id: productIdInput.value.trim(),
            nome: productNameInput.value.trim(),
            preco: Number(productPriceInput.value) || 0,
            estoque: Number(productStockInput.value) || 0,
            pesoKg: Number(productWeightInput.value) || 0.4,
            tamanho: productSizeInput.value.trim(),
            variante: productVariantInput.value.trim(),
            imagem: productImageInput.value.trim(),
            descricao: productDescriptionInput.value.trim(),
            ID_categoria: Number(categorySelect?.value || 1)
        };

        if (!payload.id || !payload.nome || !payload.preco || !payload.imagem) {
            showFeedback('Preencha nome, ID, preço e imagem.', true);
            return;
        }

        if (!window.BrechoDB) {
            showFeedback('Sistema de dados não disponível.', true);
            return;
        }

        if (editingProductId) {
            const product = window.BrechoDB.updateProduct(editingProductId, payload);
            if (!product) {
                showFeedback('Falha ao atualizar produto.', true);
                return;
            }
            showFeedback('Produto atualizado com sucesso.');
        } else {
            const product = window.BrechoDB.addProduct(payload, currentSeller.id);
            if (!product) {
                showFeedback('Falha ao salvar produto.', true);
                return;
            }
            showFeedback('Produto cadastrado com sucesso.');
        }

        if (window.BrechoDB.refreshProductCatalog) window.BrechoDB.refreshProductCatalog();
        refreshSellerView();
        resetForm();
    }

    function signOut() {
        if (window.BrechoDB && window.BrechoDB.clearSession) {
            window.BrechoDB.clearSession();
        }
        window.location.href = 'login.html';
    }

    function initVendorDashboard() {
        if (!window.BrechoDB) {
            console.error('BrechoDB não carregado. Inclua db.js antes de vendor.js.');
            return;
        }

        const user = BrechoDB.getCurrentUser();
        if (!user || user.type !== 'brecho') {
            window.location.href = 'login.html';
            return;
        }

        currentSeller = { type: user.type, id: user.data.ID_vendedor, data: user.data };
        if (sellerName) sellerName.textContent = currentSeller.data.nome;

        if (window.BrechoDB.getCategories) {
            const categories = window.BrechoDB.getCategories();
            buildCategoryOptions(categories);
        }

        refreshSellerView();

        productForm?.addEventListener('submit', submitProductForm);
        cancelEditBtn?.addEventListener('click', event => {
            event.preventDefault();
            resetForm();
        });

        document.getElementById('signOutBtn')?.addEventListener('click', signOut);
        showFeedback('Pronto para gerenciar o catálogo.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVendorDashboard);
    } else {
        initVendorDashboard();
    }
})(window);
