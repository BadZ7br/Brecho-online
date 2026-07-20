const BRECHO_DB_KEY = 'BrechoOnlineMockDB';

const defaultDatabase = {
    Usuario: [],
    Vendedor: [],
    Categoria: [
        { ID_categoria: 1, nome_categoria: 'Moda feminina', descricao: 'Peças para o dia a dia' },
        { ID_categoria: 2, nome_categoria: 'Moda masculina', descricao: 'Streetwear e urbano' },
        { ID_categoria: 3, nome_categoria: 'Acessórios', descricao: 'Bolsas, bonés e bijuterias' }
    ],
    Produto: [],
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
        return { success: true, type: 'usuario', data: usuario };
    }

    const vendedor = database.Vendedor.find(store => normalizeEmail(store.email) === normalizedEmail && store.senha === senha);
    if (vendedor) {
        return { success: true, type: 'brecho', data: vendedor };
    }

    return { success: false, message: 'Usuário ou senha inválidos.' };
}

function showToast(message, type = 'info') {
    alert(message);
}

function buildRegisterData() {
    const activeStore = document.getElementById('register-store-fields')?.classList.contains('hidden') === false;
    const formData = {
        email: document.getElementById('register-email')?.value || '',
        senha: document.getElementById('register-password')?.value || '',
        confirmPassword: document.getElementById('register-confirm-password')?.value || ''
    };

    if (activeStore) {
        formData.nome_fantasia = document.getElementById('register-store-name')?.value || '';
        formData.cnpj = document.getElementById('register-store-cnpj')?.value || '';
        formData.whatsapp = document.getElementById('register-store-whatsapp')?.value || '';
        formData.localizacao = document.getElementById('register-store-location')?.value || '';
        formData.descricao = document.getElementById('register-store-description')?.value || '';
    } else {
        formData.nome = document.getElementById('register-user-name')?.value || '';
        formData.nick = document.getElementById('register-user-nick')?.value || '';
    }

    return { formData, isStore: activeStore };
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span>';

    const email = document.getElementById('login-email')?.value || '';
    const password = document.getElementById('login-password')?.value || '';

    setTimeout(() => {
        const result = login(email, password);
        if (result.success) {
            showToast(`Login bem-sucedido como ${result.type === 'usuario' ? 'usuário' : 'brechó'}.`); 
            event.target.reset();
        } else {
            showToast(result.message, 'error');
        }

        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 800);
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span>';

    const { formData, isStore } = buildRegisterData();

    setTimeout(() => {
        const result = isStore ? registerStore(formData) : registerUser(formData);
        if (result.success) {
            showToast(result.message);
            event.target.reset();
            if (isStore) {
                const userTab = document.getElementById('tab-login');
                if (userTab) userTab.click();
            }
        } else {
            showToast(result.message, 'error');
        }

        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 800);
}

function initAuth() {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    loadDatabase();
}

window.addEventListener('DOMContentLoaded', initAuth);
