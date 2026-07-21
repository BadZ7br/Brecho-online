(function (global) {
    'use strict';

    const BRECHO_DB_KEY = 'BrechoOnlineMockDB';
    const SESSION_KEY = 'BrechoOnlineSession';

    const defaultDatabase = {
        Usuario: [
            {
                ID_Usuario: 1,
                nome: 'Cliente de Teste',
                sobrenome: '',
                email: 'cliente@corre.com',
                telefone: '(11) 90000-0000',
                cpf: '00000000000',
                senha: 'cliente123',
                data_cadastro: '2025-01-01T00:00:00.000Z',
                status_conta: 'Ativo'
            }
        ],
        Vendedor: [
            {
                ID_vendedor: 1,
                nome: 'Corre Brechó',
                sobrenome: '',
                email: 'brecho@corre.com',
                telefone: '(11) 99999-9999',
                cnpj: '00000000000191',
                senha: 'brecho123',
                data_cadastro: '2025-01-01T00:00:00.000Z',
                status_conta: 'Ativo'
            }
        ],
        Categoria: [
            { ID_categoria: 1, nome_categoria: 'Moda feminina', descricao: 'Peças para o dia a dia' },
            { ID_categoria: 2, nome_categoria: 'Moda masculina', descricao: 'Streetwear e urbano' },
            { ID_categoria: 3, nome_categoria: 'Acessórios', descricao: 'Bolsas, bonés e bijuterias' }
        ],
        Produto: [
            {
                ID_produto: 1,
                id: 'yinyang',
                nome: 'Bermuda Jeans Yin Yang Streetwear',
                preco: 40.0,
                tamanho: '46',
                variante: 'Streetwear',
                imagem: 'img/Shortyingyang.png',
                alt: 'Bermuda jeans azul com lavagem desgastada, estampa yin yang e detalhes orientais na perna direita',
                pesoKg: 0.35,
                ID_categoria: 2,
                ID_vendedor: 1,
                estoque: 6,
                descricao: 'Bermuda jeans oversized com atitude streetwear e estampa yin yang.'
            },
            {
                ID_produto: 2,
                id: 'short',
                nome: 'Short Jeans Dark Streetwear',
                preco: 35.0,
                tamanho: '40',
                variante: 'Dark Grey',
                imagem: 'img/short2;png.png',
                alt: 'Short jeans cinza feminino com estampa gótica preta na perna direita e fechamento por botões frontais.',
                pesoKg: 0.28,
                ID_categoria: 2,
                ID_vendedor: 1,
                estoque: 5,
                descricao: 'Short jeans dark com acabamento desfiado e design urbano.'
            },
            {
                ID_produto: 3,
                id: 'flannel',
                nome: 'Heavy Flannel Blue Ash',
                preco: 245.0,
                tamanho: 'L',
                variante: 'Blue Ash Plaid',
                imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjvI6v5KCEfWalM3KmMU6uzrq34XFi7nrSsRdiXmLSLlCUwTDMqZPwYzxA0MAMhCA0yYeaB1ffEUrE-Bzf7xT-rolKN-HOH-5aEaRNItnmCl_XRlmvZWv0lYkbP0s7vNdxVh08kCMqdr_Q-RJQNbOxaWTWFFPqwDGj7snXjeZ20LHu9JWsgJfE6RvRhv_jETiyH8-suqbWmiWltr1jq0CcBm5RjQlLpKX4dPcakc1aO7mindV5LxXp7jCZ9kGkOd4f6LvwZVk68KRl',
                alt: "Camisa flanela oversized xadrez azul e preto, com remendo personalizado 'CORRE' no peito, em uma cerca de arame.",
                pesoKg: 0.5,
                ID_categoria: 2,
                ID_vendedor: 1,
                estoque: 8,
                descricao: 'Flanela pesada com estética grunge e corte oversized.'
            },
            {
                ID_produto: 4,
                id: 'bolt',
                nome: 'Bolt Pendant Chain',
                preco: 115.0,
                tamanho: 'Único',
                variante: 'Acessório',
                imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAudUyeuCloZiebvMB96uDyrBCODsWNnBeR8SqSmofcjQp-Fl4kQygQqRZ5XuP8sZY-bAKZfcWIiIoPOeKZpNIi_lziqlgczDLgPKxGnFmOG0LyxE2dBGao7cfmykVaiupmHESJL2Z52q1IjvH6C9F5iUa4w5Xeh51NBHtuTVCbGuhZOdJdOJn4DfuAJTjhtnEcE2Im-cEbvyEd9AYiTclC0Jp2o_38YDZGxniVbetjtjcFJReI3e4LdYVz1PxEPmT8QA7ExJk_5ho2',
                alt: 'Colar de corrente prateada com pingente de parafuso industrial, sobre uma laje de ardósia escura.',
                pesoKg: 0.15,
                ID_categoria: 3,
                ID_vendedor: 1,
                estoque: 12,
                descricao: 'Corrente bolta chunky com acabamento prateado fosco.'
            },
            {
                ID_produto: 5,
                id: 'hoodie',
                nome: 'Vintage 90s Box Logo Hoodie',
                preco: 289.0,
                tamanho: 'XL',
                variante: 'Washed Black',
                imagem: 'img/produto-hoodie.svg',
                alt: 'Moletom vintage anos 90 com estampa desbotada no peito, estilo streetwear urbano.',
                pesoKg: 0.9,
                ID_categoria: 1,
                ID_vendedor: 1,
                estoque: 3,
                descricao: 'Moletom soft, oversized e com vibe retrô dos anos 90.'
            },
            {
                ID_produto: 6,
                id: 'botas',
                nome: 'Urban Combat Boots',
                preco: 450.0,
                tamanho: '42',
                variante: 'Distressed Leather',
                imagem: 'img/produto-botas.svg',
                alt: 'Coturno urbano de couro desgastado com sola grossa, estilo neo-punk industrial.',
                pesoKg: 1.6,
                ID_categoria: 2,
                ID_vendedor: 1,
                estoque: 4,
                descricao: 'Botas robustas com sola de combate e acabamento desgastado.'
            },
            {
                ID_produto: 7,
                id: 'corrente',
                nome: 'Padlock Heavy Chain',
                preco: 120.0,
                tamanho: 'Único',
                variante: 'Acessório',
                imagem: 'img/produto-corrente.svg',
                alt: 'Corrente prateada chunky com pingente de cadeado, estética industrial brutalista.',
                pesoKg: 0.35,
                ID_categoria: 3,
                ID_vendedor: 1,
                estoque: 10,
                descricao: 'Corrente pesada com cadeado inspirado na cena industrial.'
            }
        ],
        Carrinho: [],
        Pedido: [],
        Pagamento: [],
        AvaliacaoVendedor: [],
        AvaliacaoProduto: [],
        Denuncia: [],
        Comissao: []
    };

    function loadDatabase() {
        const raw = localStorage.getItem(BRECHO_DB_KEY);
        if (!raw) {
            localStorage.setItem(BRECHO_DB_KEY, JSON.stringify(defaultDatabase, null, 2));
            return JSON.parse(JSON.stringify(defaultDatabase));
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            console.error('Erro ao carregar database local:', error);
            localStorage.setItem(BRECHO_DB_KEY, JSON.stringify(defaultDatabase, null, 2));
            return JSON.parse(JSON.stringify(defaultDatabase));
        }
    }

    function saveDatabase(database) {
        localStorage.setItem(BRECHO_DB_KEY, JSON.stringify(database, null, 2));
    }

    function getNextId(items, idField) {
        if (!items.length) {
            return 1;
        }
        return Math.max(...items.map(item => item[idField] || 0)) + 1;
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function normalizeCnpj(cnpj) {
        return String(cnpj || '').replace(/\D/g, '');
    }

    function findUserByEmail(database, email) {
        return database.Usuario.find(user => normalizeEmail(user.email) === normalizeEmail(email));
    }

    function findSellerByEmail(database, email) {
        return database.Vendedor.find(store => normalizeEmail(store.email) === normalizeEmail(email));
    }

    function registerUser(formData) {
        const database = loadDatabase();
        const email = normalizeEmail(formData.email);

        if (!formData.nome || !formData.nick || !formData.email || !formData.senha) {
            return { success: false, message: 'Preencha todos os campos de cadastro de usuário.' };
        }

        if (findUserByEmail(database, email) || findSellerByEmail(database, email)) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        if (formData.senha !== formData.confirmPassword) {
            return { success: false, message: 'As senhas não coincidem.' };
        }

        const novoUsuario = {
            ID_Usuario: getNextId(database.Usuario, 'ID_Usuario'),
            nome: formData.nome,
            sobrenome: '',
            email,
            telefone: formData.telefone || '',
            cpf: formData.cpf || '',
            senha: formData.senha,
            data_cadastro: new Date().toISOString(),
            status_conta: 'Ativo'
        };

        database.Usuario.push(novoUsuario);
        saveDatabase(database);

        return { success: true, message: 'Cadastro de usuário realizado com sucesso.' };
    }

    function registerStore(formData) {
        const database = loadDatabase();
        const email = normalizeEmail(formData.email);
        const cnpj = normalizeCnpj(formData.cnpj);

        if (!formData.nome_fantasia || !formData.cnpj || !formData.whatsapp || !formData.localizacao || !formData.email || !formData.senha) {
            return { success: false, message: 'Preencha todos os campos de cadastro de brechó.' };
        }

        if (findSellerByEmail(database, email) || findUserByEmail(database, email)) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        if (database.Vendedor.some(store => normalizeCnpj(store.cnpj) === cnpj)) {
            return { success: false, message: 'Este CNPJ já está cadastrado.' };
        }

        if (formData.senha !== formData.confirmPassword) {
            return { success: false, message: 'As senhas não coincidem.' };
        }

        const novoVendedor = {
            ID_vendedor: getNextId(database.Vendedor, 'ID_vendedor'),
            nome: formData.nome_fantasia,
            sobrenome: '',
            email,
            telefone: formData.whatsapp,
            cnpj,
            senha: formData.senha,
            data_cadastro: new Date().toISOString(),
            status_conta: 'Ativo'
        };

        database.Vendedor.push(novoVendedor);
        saveDatabase(database);

        return { success: true, message: 'Cadastro de brechó realizado com sucesso.' };
    }

    function login(email, senha) {
        const database = loadDatabase();
        const normalizedEmail = normalizeEmail(email);

        const usuario = database.Usuario.find(user => normalizeEmail(user.email) === normalizedEmail && user.senha === senha);
        if (usuario) {
            saveSession({ type: 'usuario', id: usuario.ID_Usuario });
            return { success: true, type: 'usuario', data: usuario };
        }

        const vendedor = database.Vendedor.find(store => normalizeEmail(store.email) === normalizedEmail && store.senha === senha);
        if (vendedor) {
            saveSession({ type: 'brecho', id: vendedor.ID_vendedor });
            return { success: true, type: 'brecho', data: vendedor };
        }

        return { success: false, message: 'Usuário ou senha inválidos.' };
    }

    function getSession() {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
    }

    function saveSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    function getCurrentUser() {
        const session = getSession();
        if (!session) return null;
        const database = loadDatabase();
        if (session.type === 'usuario') {
            const user = database.Usuario.find(item => item.ID_Usuario === session.id);
            return user ? { type: 'usuario', id: session.id, data: user } : null;
        }
        const seller = database.Vendedor.find(item => item.ID_vendedor === session.id);
        return seller ? { type: 'brecho', id: session.id, data: seller } : null;
    }

    function mapProductRecord(record) {
        return {
            ID_produto: record.ID_produto,
            id: String(record.id || record.ID_produto || '').trim(),
            name: record.nome || '',
            price: Number(record.preco || record.price || 0),
            size: record.tamanho || record.size || '',
            variant: record.variante || record.variant || '',
            image: record.imagem || record.image || '',
            alt: record.alt || record.nome || record.name || '',
            weightKg: Number(record.pesoKg || record.weightKg || 0.4),
            categoryId: record.ID_categoria || record.categoryId || null,
            sellerId: record.ID_vendedor || record.sellerId || null,
            stock: Number(record.estoque || record.stock || 0),
            description: record.descricao || record.description || ''
        };
    }

    function getProducts() {
        return loadDatabase().Produto.map(mapProductRecord);
    }

    function getProductById(productId) {
        return getProducts().find(product => String(product.id) === String(productId) || String(product.ID_produto) === String(productId));
    }

    function addProduct(productData, sellerId) {
        const database = loadDatabase();
        const nextId = getNextId(database.Produto, 'ID_produto');
        const slug = String(productData.id || productData.nome || nextId)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '');

        const newProduct = {
            ID_produto: nextId,
            id: slug || `produto-${nextId}`,
            nome: productData.nome || '',
            preco: Number(productData.preco) || 0,
            tamanho: productData.tamanho || '',
            variante: productData.variante || '',
            imagem: productData.imagem || '',
            alt: productData.alt || productData.nome || '',
            pesoKg: Number(productData.pesoKg || productData.weightKg || 0.4),
            ID_categoria: Number(productData.ID_categoria) || null,
            ID_vendedor: Number(sellerId) || null,
            estoque: Number(productData.estoque) || 0,
            descricao: productData.descricao || ''
        };

        database.Produto.push(newProduct);
        saveDatabase(database);
        return mapProductRecord(newProduct);
    }

    function updateProduct(productId, updates) {
        const database = loadDatabase();
        const product = database.Produto.find(item => String(item.id) === String(productId) || String(item.ID_produto) === String(productId));
        if (!product) return null;

        Object.assign(product, {
            nome: updates.nome ?? product.nome,
            preco: Number(updates.preco ?? product.preco) || product.preco,
            tamanho: updates.tamanho ?? product.tamanho,
            variante: updates.variante ?? product.variante,
            imagem: updates.imagem ?? product.imagem,
            alt: updates.alt ?? product.alt,
            pesoKg: Number(updates.pesoKg ?? product.pesoKg) || product.pesoKg,
            ID_categoria: Number(updates.ID_categoria ?? product.ID_categoria) || product.ID_categoria,
            estoque: Number(updates.estoque ?? product.estoque) || product.estoque,
            descricao: updates.descricao ?? product.descricao
        });

        saveDatabase(database);
        return mapProductRecord(product);
    }

    function deleteProduct(productId) {
        const database = loadDatabase();
        database.Produto = database.Produto.filter(item => String(item.id) !== String(productId) && String(item.ID_produto) !== String(productId));
        saveDatabase(database);
    }

    function getSellerProducts(sellerId) {
        return getProducts().filter(product => String(product.sellerId) === String(sellerId));
    }

    function getCategories() {
        return loadDatabase().Categoria.map(category => ({
            id: category.ID_categoria,
            name: category.nome_categoria,
            description: category.descricao
        }));
    }

    function getDashboardStats(sellerId) {
        const database = loadDatabase();
        const products = getProducts();
        const orders = Array.isArray(database.Pedido) ? database.Pedido : [];
        const revenue = orders.reduce((sum, order) => sum + Number(order.valor_total || 0), 0);
        const sellerProducts = sellerId ? products.filter(product => String(product.sellerId) === String(sellerId)) : [];
        const sellerOrders = sellerId ? orders.filter(order => String(order.ID_vendedor) === String(sellerId)) : [];

        return {
            totalUsers: database.Usuario.length,
            totalSellers: database.Vendedor.length,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: revenue,
            sellerProductsCount: sellerProducts.length,
            sellerOrdersCount: sellerOrders.length,
            sellerRevenue: sellerOrders.reduce((sum, order) => sum + Number(order.valor_total || 0), 0),
            latestProducts: sellerProducts.slice(-5).reverse()
        };
    }

    async function seedDatabaseFromJsonFile() {
        if (localStorage.getItem(BRECHO_DB_KEY)) {
            return loadDatabase();
        }

        localStorage.setItem(BRECHO_DB_KEY, JSON.stringify(defaultDatabase, null, 2));
        return loadDatabase();
    }

    function refreshProductCatalog() {
        const products = getProducts();
        const productsById = products.reduce((acc, product) => {
            if (product.id) acc[product.id] = product;
            return acc;
        }, {});
        global.PRODUCTS = products;
        global.PRODUCTS_BY_ID = productsById;
        return { products, productsById };
    }

    async function initDatabase() {
        await seedDatabaseFromJsonFile();
        refreshProductCatalog();
    }

    global.BrechoDB = {
        loadDatabase,
        saveDatabase,
        getNextId,
        normalizeEmail,
        normalizeCnpj,
        findUserByEmail,
        findSellerByEmail,
        registerUser,
        registerStore,
        login,
        getSession,
        saveSession,
        clearSession,
        getCurrentUser,
        getProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getSellerProducts,
        getCategories,
        getDashboardStats,
        refreshProductCatalog,
        initDatabase
    };

    initDatabase();
})(window);
