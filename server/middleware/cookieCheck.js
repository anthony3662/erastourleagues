const cookieCheckMiddleware = (req, res, next) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.email || !req.session.user) {
    res.sendStatus(403);
    return;
  }

  next();
};

module.exports = { cookieCheckMiddleware };
