const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'brecho-online-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 horas
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ─── Servir arquivos estáticos (frontend) ───────────────────
app.use(express.static(path.join(__dirname, '..')));

// ─── Rotas da API ───────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Iniciar servidor ───────────────────────────────────────
const db = require('./src/config/db');

app.listen(PORT, async () => {
  console.log('');
  await db.testConnection();
  console.log(`  🟢 Corre Brechó API rodando em http://localhost:${PORT}`);
  console.log(`  📦 Frontend servido em http://localhost:${PORT}/index.html`);
  console.log(`  🔌 API disponível em http://localhost:${PORT}/api`);
  console.log('');
});
