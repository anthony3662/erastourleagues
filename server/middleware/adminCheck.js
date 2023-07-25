const adminCheckMiddleware = (req, res, next) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.email || !req.session.user || !req.session.user.isAdmin) {
    res.sendStatus(403);
    return;
  }

  next();
};

module.exports = { adminCheckMiddleware };
