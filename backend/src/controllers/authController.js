const bcrypt = require('bcrypt');
const pool = require('../config/db');

const BCRYPT_ROUNDS = 10;

// ─── Helpers ────────────────────────────────────────────────
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeCnpj(cnpj) {
  return String(cnpj || '').replace(/\D/g, '');
}

// ─── Cadastro de Usuário ───────────────────────────────────
async function registerUser(req, res) {
  try {
    const { nome, nick, email, telefone, cpf, senha, confirmPassword } = req.body;

    if (!nome || !nick || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Verificar email único (tanto em Usuario quanto Vendedor)
    const [existingUser] = await pool.query('SELECT ID_Usuario FROM Usuario WHERE email = ?', [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }

    const [existingSeller] = await pool.query('SELECT ID_vendedor FROM Vendedor WHERE email = ?', [normalizedEmail]);
    if (existingSeller.length > 0) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }

    // Verificar CPF único (se informado)
    if (cpf) {
      const normalizedCpf = cpf.replace(/\D/g, '');
      const [existingCpf] = await pool.query('SELECT ID_Usuario FROM Usuario WHERE cpf = ?', [normalizedCpf]);
      if (existingCpf.length > 0) {
        return res.status(409).json({ success: false, message: 'Este CPF já está cadastrado.' });
      }
    }

    const hashedPassword = await bcrypt.hash(senha, BCRYPT_ROUNDS);

    const [result] = await pool.query(
      `INSERT INTO Usuario (nome, nick, email, telefone, cpf, senha, data_cadastro, status_conta)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Ativo')`,
      [nome, nick, normalizedEmail, telefone || '', cpf || '', hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro no registro de usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}

// ─── Cadastro de Vendedor/Loja ─────────────────────────────
async function registerStore(req, res) {
  try {
    const { nome_fantasia, cnpj, whatsapp, localizacao, descricao, email, senha, confirmPassword } = req.body;

    if (!nome_fantasia || !cnpj || !whatsapp || !localizacao || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedCnpj = normalizeCnpj(cnpj);

    // Verificar email único
    const [existingUser] = await pool.query('SELECT ID_Usuario FROM Usuario WHERE email = ?', [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }
    const [existingSeller] = await pool.query('SELECT ID_vendedor FROM Vendedor WHERE email = ?', [normalizedEmail]);
    if (existingSeller.length > 0) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }

    // Verificar CNPJ único
    const [existingCnpj] = await pool.query('SELECT ID_vendedor FROM Vendedor WHERE cnpj = ?', [normalizedCnpj]);
    if (existingCnpj.length > 0) {
      return res.status(409).json({ success: false, message: 'Este CNPJ já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, BCRYPT_ROUNDS);

    const [result] = await pool.query(
      `INSERT INTO Vendedor (nome, sobrenome, email, telefone, cnpj, localizacao, descricao, senha, data_cadastro, status_conta)
       VALUES (?, '', ?, ?, ?, ?, ?, ?, NOW(), 'Ativo')`,
      [nome_fantasia, normalizedEmail, whatsapp, normalizedCnpj, localizacao, descricao || '', hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Cadastro de vendedor realizado com sucesso.',
      sellerId: result.insertId
    });
  } catch (error) {
    console.error('Erro no registro de vendedor:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}

// ─── Login ──────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Preencha e-mail e senha.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Tentar como usuário
    const [users] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [normalizedEmail]);
    if (users.length > 0) {
      const user = users[0];
      if (user.status_conta === 'inativo' || user.status_conta === 'suspenso') {
        return res.status(403).json({ success: false, message: 'Sua conta está desativada.' });
      }
      const match = await bcrypt.compare(senha, user.senha);
      if (match) {
        req.session.user = { type: 'usuario', id: user.ID_Usuario };
        return res.json({
          success: true,
          type: 'usuario',
          data: {
            id: user.ID_Usuario,
            nome: user.nome,
            nick: user.nick,
            email: user.email,
            telefone: user.telefone
          }
        });
      }
    }

    // Tentar como vendedor
    const [sellers] = await pool.query('SELECT * FROM Vendedor WHERE email = ?', [normalizedEmail]);
    if (sellers.length > 0) {
      const seller = sellers[0];
      if (seller.status_conta === 'inativo' || seller.status_conta === 'suspenso') {
        return res.status(403).json({ success: false, message: 'Sua conta está desativada.' });
      }
      const match = await bcrypt.compare(senha, seller.senha);
      if (match) {
        req.session.user = { type: 'brecho', id: seller.ID_vendedor };
        return res.json({
          success: true,
          type: 'brecho',
          data: {
            id: seller.ID_vendedor,
            nome: seller.nome,
            email: seller.email,
            telefone: seller.telefone,
            cnpj: seller.cnpj,
            localizacao: seller.localizacao
          }
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}

// ─── Obter usuário logado ───────────────────────────────────
async function getMe(req, res) {
  try {
    const { type, id } = req.session.user;

    if (type === 'usuario') {
      const [rows] = await pool.query(
        'SELECT ID_Usuario, nome, nick, email, telefone, data_cadastro, status_conta FROM Usuario WHERE ID_Usuario = ?',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
      return res.json({ success: true, type: 'usuario', data: rows[0] });
    }

    if (type === 'brecho') {
      const [rows] = await pool.query(
        'SELECT ID_vendedor, nome, email, telefone, cnpj, localizacao, descricao, data_cadastro, status_conta FROM Vendedor WHERE ID_vendedor = ?',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Vendedor não encontrado.' });
      }
      return res.json({ success: true, type: 'brecho', data: rows[0] });
    }

    return res.status(400).json({ success: false, message: 'Tipo de sessão inválido.' });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
}

// ─── Logout ─────────────────────────────────────────────────
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao encerrar sessão:', err);
      return res.status(500).json({ success: false, message: 'Erro ao encerrar sessão.' });
    }
    res.json({ success: true, message: 'Sessão encerrada.' });
  });
}

module.exports = { registerUser, registerStore, login, getMe, logout };
