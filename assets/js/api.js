/**
 * CORRE BRECHO — Wrapper de API
 * Função centralizada para chamadas HTTP ao backend.
 * Substitui todas as interações diretas com localStorage para dados do servidor.
 */
(function (global) {
  'use strict';

  const API_BASE = '/api';

  async function request(method, path, body) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({ success: false, message: 'Erro de conexão.' }));

    if (!res.ok) {
      const error = new Error(data.message || `Erro ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // ─── Auth ───────────────────────────────────────────────
  function registerUser(formData) {
    return request('POST', '/auth/register/user', formData);
  }

  function registerStore(formData) {
    return request('POST', '/auth/register/store', formData);
  }

  function login(email, senha) {
    return request('POST', '/auth/login', { email, senha });
  }

  function logout() {
    return request('POST', '/auth/logout');
  }

  function getMe() {
    return request('GET', '/auth/me');
  }

  // ─── Exportar ───────────────────────────────────────────
  global.BrechoAPI = {
    request,
    auth: {
      registerUser,
      registerStore,
      login,
      logout,
      getMe
    }
  };
})(window);
