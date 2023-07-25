const socketCookieCheck = (socket, next) => {
  const session = socket.request.session;

  if (!session || !session.isAuthenticated || !session.email || !session.user) {
    next(new Error('Unauthorized'));
    return;
  }

  next();
};

module.exports = socketCookieCheck;
