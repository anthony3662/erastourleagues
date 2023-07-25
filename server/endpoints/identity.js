const express = require('express');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const CLIENT_ID = '465736712882-eoqteedshsrd37cj2mhkeahurnj0j8af.apps.googleusercontent.com';

const googleClient = new OAuth2Client(CLIENT_ID);

router.get('/validate-session', async (req, res) => {
  // used to bypass the login page if user already has a valid cookie
  const email = req.session?.email;
  if (!req.session?.isAuthenticated || !email) {
    res.json({ success: false });
    return;
  }

  const user = await User.findByEmail(email); // check if user exists

  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: true, message: 'ACCOUNT_SETUP_NEEDED' });
  }
});

router.post('/google-signin', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload?.email) {
      req.session.isAuthenticated = true;
      req.session.email = payload?.email;

      const user = await User.findByEmail(payload.email); // check if user exists
      if (user) {
        req.session.user = user; // set user on cookie
        res.json({
          success: true,
          user,
        });
      } else {
        res.json({
          success: true,
          message: 'ACCOUNT_SETUP_NEEDED',
        });
      }
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    res.sendStatus(403);
    console.error(JSON.stringify(e));
  }
});

const validateUsername = async username => {
  if (username?.length < 8) {
    return 'LENGTH_ERROR';
  }
  if (username === 'taylorswift' || username === 'taylorswift13') {
    // such usernames can be edited in on the DB console if the gods are blessing us
    return 'USERNAME_RESERVED';
  }
  const usernameUser = await User.findByUsername(username);
  if (usernameUser) {
    return 'USERNAME_TAKEN';
  }
  return 'USERNAME_AVAILABLE';
};

router.post('/username-check', async (req, res) => {
  if (!req.session?.email || !req.session?.isAuthenticated) {
    res.sendStatus(403);
    return;
  }

  const usernameStatus = await validateUsername(req.body.username);

  res.json({
    isValid: usernameStatus === 'USERNAME_AVAILABLE',
    message: usernameStatus,
  });
});

router.post('/account-setup', async (req, res) => {
  const { username, avatar } = req.body;
  if (!username || !avatar) {
    res.sendStatus(400);
    return;
  }

  const email = req.session?.email;
  if (!req.session?.isAuthenticated || !email) {
    res.sendStatus(403);
    return;
  }

  const usernameStatus = await validateUsername(username);

  if (usernameStatus !== 'USERNAME_AVAILABLE') {
    res.json({ message: usernameStatus });
    return;
  }

  const user = await User.findByEmail(email);

  if (user) {
    req.session.user = user;
    res.json({
      message: 'USER_ALREADY_SETUP',
      user,
    });
  } else {
    const newUser = await User.insert({
      username,
      avatar,
      email,
    });
    req.session.user = newUser;
    res.json({
      message: 'USER_CREATED',
      user: newUser,
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

module.exports = router;
