/**
 * CORRE BRECHO — Banco de dados JSON
 * Substitui o MySQL para facilitar testes locais.
 * Simula a interface do mysql2/promise: pool.query(sql, params)
 * Dados persistem em data/database.json entre reinicializações.
 */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'database.json');

// ─── Schema inicial (tabelas + dados seed) ─────────────────
const SEED = {
  Usuario: [],
  Vendedor: [],
  Categoria: [
    { ID_categoria: 1, nome_categoria: 'Moda feminina', descricao: 'Peças para o dia a dia' },
    { ID_categoria: 2, nome_categoria: 'Moda masculina', descricao: 'Streetwear e urbano' },
    { ID_categoria: 3, nome_categoria: 'Acessórios', descricao: 'Bolsas, bonés e bijuterias' }
  ],
  Produto: [],
  Pedido: [],
  ItemPedido: [],
  Pagamento: [],
  Carrinho: [],
  ItemCarrinho: [],
  Endereco: [],
  Entrega: [],
  AvaliacaoVendedor: [],
  AvaliacaoProduto: [],
  Denuncia: [],
  Comissao: [],
  Favoritos: [],
  Mensagem: [],
  Mensagem_has_Usuario: [],
  Produto_has_ImagemProduto: [],
  ImagemProduto: []
};

// ─── Carregar / Salvar ─────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Erro ao ler database.json:', e.message);
  }
  return JSON.parse(JSON.stringify(SEED));
}

function save(db) {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

let db = load();

// ─── Auto-increment helper ─────────────────────────────────
function nextId(table, field) {
  if (!db[table] || !db[table].length) return 1;
  return Math.max(...db[table].map(r => Number(r[field]) || 0)) + 1;
}

// ─── Parse de SQL simplificado ─────────────────────────────
// Suporta: SELECT, INSERT INTO, UPDATE, DELETE FROM
// Com WHERE, AND, ORDER BY, LIMIT, VALUES, SET

function parseSelect(sql, params) {
  // SELECT colunas FROM tabela WHERE条件 ORDER BY col LIMIT n
  const m = sql.match(/FROM\s+`?(\w+)`?/i);
  if (!m) return null;
  const table = m[1];
  let rows = db[table] ? [...db[table]] : [];

  // WHERE
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|\s*$)/is);
  if (whereMatch) {
    const conditions = parseConditions(whereMatch[1]);
    let paramIdx = 0;
    rows = rows.filter(row => {
      for (const cond of conditions) {
        const val = cond.value === '?' ? params[paramIdx++] : cond.value;
        if (val === '?') continue;
        if (!matchCondition(row, cond.field, cond.op, val)) return false;
      }
      return true;
    });
  }

  // ORDER BY
  const orderMatch = sql.match(/ORDER\s+BY\s+`?(\w+)`?\s*(ASC|DESC)?/i);
  if (orderMatch) {
    const field = orderMatch[1];
    const dir = (orderMatch[2] || 'ASC').toUpperCase();
    rows.sort((a, b) => {
      const va = a[field], vb = b[field];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return dir === 'DESC' ? -cmp : cmp;
    });
  }

  // LIMIT
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    rows = rows.slice(0, parseInt(limitMatch[1], 10));
  }

  // Column projection: extract selected columns
  let selectedCols = null;
  const colMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
  if (colMatch && !colMatch[1].includes('*') && !/COUNT|SUM|COALESCE/i.test(colMatch[1])) {
    selectedCols = colMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));
  }

  // SELECT *, COUNT, SUM, COALESCE
  if (/SELECT\s+COUNT\(\*?\)/i.test(sql)) {
    return [{ count: rows.length }];
  }
  if (/SELECT\s+COALESCE\(SUM\((\w+)\)/i.test(sql)) {
    const sumField = sql.match(/COALESCE\(SUM\((\w+)\)/i)[1];
    const total = rows.reduce((s, r) => s + Number(r[sumField] || 0), 0);
    return [{ total }];
  }

  // Project only selected columns
  if (selectedCols) {
    rows = rows.map(row => {
      const projected = {};
      selectedCols.forEach(col => {
        if (row[col] !== undefined) projected[col] = row[col];
      });
      return projected;
    });
  }

  return rows;
}

function parseInsert(sql, params) {
  const tableMatch = sql.match(/INTO\s+`?(\w+)`?\s*\((.+?)\)\s*VALUES\s*\((.+?)\)\s*$/is);
  if (!tableMatch) return { insertId: 0 };
  const table = tableMatch[1];
  const columns = tableMatch[2].split(',').map(c => c.trim().replace(/`/g, ''));
  const rawValues = tableMatch[3];

  // Parse VALUES: extract ? placeholders and SQL literals ('string', NOW(), etc.)
  const valueTokens = [];
  const valRegex = /'([^']*)'|\?|(\w+)\s*\(\s*\)/gi;
  let vm;
  let paramIdx = 0;
  while ((vm = valRegex.exec(rawValues)) !== null) {
    if (vm[1] !== undefined) {
      valueTokens.push(vm[1]); // 'string literal'
    } else if (vm[0] === '?') {
      valueTokens.push(params[paramIdx++]); // parameter placeholder
    } else if (vm[2] && vm[2].toUpperCase() === 'NOW') {
      valueTokens.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
    }
  }

  if (!db[table]) db[table] = [];

  const TABLE_ID_MAP = {
    Usuario: 'ID_Usuario', Vendedor: 'ID_vendedor', Produto: 'ID_produto',
    Pedido: 'ID_pedido', Pagamento: 'ID_pagamento', Carrinho: 'ID_carrinho',
    Categoria: 'ID_categoria', Endereco: 'ID_endereco', Entrega: 'ID_entrega',
    Mensagem: 'ID_mensagem', Denuncia: 'ID_denuncia', Favoritos: 'ID_favoritos',
    Comissao: 'ID_comissao', AvaliacaoVendedor: 'ID_avaliacao', AvaliacaoProduto: 'ID_avaliacao',
    ItemPedido: 'ID_item', ItemCarrinho: 'ID_item_carrinho',
    Produto_has_ImagemProduto: 'ID Produto_ID_produto',
    ImagemProduto: 'ID_imagem', Mensagem_has_Usuario: 'Mensagem_ID_mensagem'
  };
  const idField = columns.find(c => c.toLowerCase().startsWith('id_')) || TABLE_ID_MAP[table] || 'id';

  const row = {};
  columns.forEach((col, i) => {
    let val = valueTokens[i];
    if (val === undefined || val === null) val = null;
    row[col] = val;
  });

  // Auto-increment: always set ID even if not in columns list
  const newId = nextId(table, idField);
  if (!row[idField] || row[idField] === null) {
    row[idField] = newId;
  }

  db[table].push(row);
  save(db);

  return { insertId: row[idField] || newId, affectedRows: 1 };
}

function parseUpdate(sql, params) {
  const tableMatch = sql.match(/UPDATE\s+`?(\w+)`?\s+SET/i);
  if (!tableMatch) return { affectedRows: 0 };
  const table = tableMatch[1];

  // Extrair campos do SET
  const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/is);
  if (!setMatch) return { affectedRows: 0 };

  const setClause = setMatch[1];
  const setFields = [];
  const fieldRegex = /`?(\w+)`?\s*=\s*\?/g;
  let fm;
  while ((fm = fieldRegex.exec(setClause)) !== null) {
    setFields.push(fm[1]);
  }

  // WHERE
  let rows = db[table] ? db[table] : [];
  let paramIdx = setFields.length; // params[:SET] then params[WHERE:]

  const whereMatch = sql.match(/WHERE\s+(.+?)$/is);
  if (whereMatch) {
    const conditions = parseConditions(whereMatch[1]);
    const ids = [];
    rows.forEach((row, idx) => {
      for (const cond of conditions) {
        const val = cond.value === '?' ? params[paramIdx++] : cond.value;
        if (!matchCondition(row, cond.field, cond.op, val)) return;
      }
      ids.push(idx);
    });

    // Aplicar SET
    paramIdx = 0;
    ids.forEach(idx => {
      setFields.forEach(field => {
        rows[idx][field] = params[paramIdx++];
      });
    });

    save(db);
    return { affectedRows: ids.length };
  }

  return { affectedRows: 0 };
}

function parseDelete(sql, params) {
  const tableMatch = sql.match(/FROM\s+`?(\w+)`?\s+WHERE/i);
  if (!tableMatch) return { affectedRows: 0 };
  const table = tableMatch[1];

  if (!db[table]) return { affectedRows: 0 };

  const before = db[table].length;
  const whereMatch = sql.match(/WHERE\s+(.+?)$/is);
  if (whereMatch) {
    const conditions = parseConditions(whereMatch[1]);
    let paramIdx = 0;
    db[table] = db[table].filter(row => {
      for (const cond of conditions) {
        const val = cond.value === '?' ? params[paramIdx++] : cond.value;
        if (!matchCondition(row, cond.field, cond.op, val)) return true;
      }
      return false;
    });
  }

  save(db);
  return { affectedRows: before - db[table].length };
}

// ─── Helpers ───────────────────────────────────────────────

function parseConditions(str) {
  const parts = str.split(/\s+AND\s+/i);
  return parts.map(part => {
    part = part.trim();
    // field = ?
    let m = part.match(/`?(\w+)`?\s*=\s*(.+)/);
    if (m) return { field: m[1], op: '=', value: m[2].trim() };
    return { field: part, op: '=', value: '?' };
  });
}

function matchCondition(row, field, op, value) {
  const rowVal = row[field];
  const cmpVal = value === 'NULL' ? null : value;

  switch (op) {
    case '=':
      return String(rowVal) === String(cmpVal);
    case '!=':
    case '<>':
      return String(rowVal) !== String(cmpVal);
    case '>':
      return Number(rowVal) > Number(cmpVal);
    case '<':
      return Number(rowVal) < Number(cmpVal);
    default:
      return String(rowVal) === String(cmpVal);
  }
}

// ─── Interface pública (simula mysql2 pool) ────────────────

async function query(sql, params = []) {
  const trimmed = sql.trim();

  if (/^\s*SELECT/i.test(trimmed)) {
    const rows = parseSelect(trimmed, params);
    return [rows, []];
  }

  if (/^\s*INSERT/i.test(trimmed)) {
    const result = parseInsert(trimmed, params);
    return [result, []];
  }

  if (/^\s*UPDATE/i.test(trimmed)) {
    const result = parseUpdate(trimmed, params);
    return [result, []];
  }

  if (/^\s*DELETE/i.test(trimmed)) {
    const result = parseDelete(trimmed, params);
    return [result, []];
  }

  console.warn('SQL não suportado:', trimmed);
  return [[], []];
}

async function testConnection() {
  console.log('  📁 Banco de dados: JSON (data/database.json)');
  return true;
}

module.exports = { query, testConnection };
