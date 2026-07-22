/**
 * CORRE BRECHO — Autenticação (localStorage)
 * Gerencia cadastro, login e sessão via BrechoDB.
 */

function showToast(message, type) {
    const existing = document.getElementById('brecho-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'brecho-toast';
    toast.className = 'fixed top-6 right-6 z-[300] max-w-sm px-6 py-4 font-label-mono text-[12px] uppercase tracking-wider border-2 border-black brutal-shadow transition-all duration-300 translate-x-[120%]';

    if (type === 'error') {
        toast.classList.add('bg-secondary-container', 'text-white');
    } else {
        toast.classList.add('bg-primary', 'text-background');
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-[120%]');
        toast.classList.add('translate-x-0');
    });

    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-[120%]');
        setTimeout(() => toast.remove(), 350);
    }, 3000);
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

async function handleLoginSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span>';

    const email = document.getElementById('login-email')?.value || '';
    const password = document.getElementById('login-password')?.value || '';

    try {
        const result = BrechoDB.login(email, password);
        if (result.success) {
            showToast(`Login bem-sucedido como ${result.type === 'usuario' ? 'comprador' : 'vendedor'}.`);
            event.target.reset();
            setTimeout(() => {
                window.location.href = result.type === 'brecho' ? 'vendedor.html' : 'index.html';
            }, 800);
        } else {
            showToast(result.message || 'Usuário ou senha inválidos.', 'error');
        }
    } catch (err) {
        showToast(err.message || 'Usuário ou senha inválidos.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span>';

    const { formData, isStore } = buildRegisterData();

    try {
        const result = isStore ? BrechoDB.registerStore(formData) : BrechoDB.registerUser(formData);
        if (result.success) {
            showToast(result.message);
            event.target.reset();
            if (isStore) {
                const loginTab = document.getElementById('tab-login');
                if (loginTab) loginTab.click();
            }
        } else {
            showToast(result.message || 'Erro ao realizar cadastro.', 'error');
        }
    } catch (err) {
        showToast(err.message || 'Erro ao realizar cadastro.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
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
}

window.BrechoAuth = { showToast };
window.addEventListener('DOMContentLoaded', initAuth);
