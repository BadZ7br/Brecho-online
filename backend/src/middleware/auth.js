function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Não autenticado.' });
  }
  next();
}

function requireSeller(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Não autenticado.' });
  }
  if (req.session.user.type !== 'brecho') {
    return res.status(403).json({ success: false, message: 'Acesso restrito a vendedores.' });
  }
  next();
}

function requireUser(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Não autenticado.' });
  }
  if (req.session.user.type !== 'usuario') {
    return res.status(403).json({ success: false, message: 'Acesso restrito a compradores.' });
  }
  next();
}

module.exports = { requireAuth, requireSeller, requireUser };
