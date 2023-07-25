const express = require('express');
const router = express.Router();
const { cookieCheckMiddleware } = require('../middleware/cookieCheck');
const League = require('../models/League');
const Invitation = require('../models/Invitation');
const Unsubscribe = require('../models/Unsubscribe');
const { joinLeague } = require('../models/User');
const { sendInviteEmail, decryptInvitationToken, emailRegex } = require('../email/mailgun');

router.use(cookieCheckMiddleware);


router.post('/create-invite', async (req, res) => {
  const { leagueId, email } = req.body;
  if (!leagueId || !email) {
    res.sendStatus(400);
    return;
  }

  // Check if the email is unsubscribed
  const isEmailUnsubscribed = await Unsubscribe.model.exists({ email });
  if (isEmailUnsubscribed) {
    res.json({
      success: false,
      message: 'EMAIL_UNSUBSCRIBED',
    });
    return;
  }

  const league = await League.get(leagueId);
  if (league.creatorUsername !== req.session.user.username) {
    res.sendStatus(403);
    return;
  }

  if (!emailRegex.test(email)) {
    res.sendStatus(400);
    return;
  }

  const existingPlayers = league.playerUsernames;
  const leagueCapacity = league.playerCapacity;
  if (existingPlayers.length === leagueCapacity) {
    res.json({
      success: false,
      message: 'LEAGUE_FULL',
    });
    return;
  }

  const existingInvitations = await Invitation.getLeagueInvitations(leagueId);
  const unexpiredInvitations = existingInvitations.filter(({ expiresAt }) => {
    return Date.now() < Number(expiresAt);
  });

  const availableSpots = leagueCapacity - existingPlayers.length;

  if (availableSpots <= unexpiredInvitations.length) {
    res.json({
      success: false,
      message: 'INVITES_PENDING',
    });
    return;
  }

  await sendInviteEmail(league.name, email);

  // insert logic
  const refreshedInvite = await Invitation.refreshInvite(leagueId, email);
  if (refreshedInvite) {
    res.json({
      success: true,
      message: 'INVITE_RENEWED',
      invite: refreshedInvite,
    });
    return;
  }

  const newInvite = await Invitation.insert({ email, league: leagueId });
  res.json({
    success: true,
    message: 'INVITE_CREATED',
    invite: newInvite,
  });
});

router.post('/my-invites', async (req, res) => {
  const { invitationToken } = req.body;
  if (!invitationToken) {
    res.sendStatus(400);
    return;
  }

  const invites = await Invitation.getInvitesByEmail(decryptInvitationToken(invitationToken));
  res.json({
    invites,
  });
});

router.post('/league-invites', async (req, res) => {
  const { leagueId } = req.body;
  if (!leagueId) {
    res.sendStatus(400);
    return;
  }

  const invites = await Invitation.model.find({ league: leagueId }).exec();
  res.json({
    invites,
  });
});

router.post('/accept', async (req, res) => {
  const { invitationToken, inviteId } = req.body;
  if (!invitationToken || !inviteId) {
    res.sendStatus(400);
    return;
  }

  const invite = await Invitation.model.findById(inviteId).exec();
  const inviteEmail = decryptInvitationToken(invitationToken);

  if (!invite || invite.email !== inviteEmail) {
    res.json({
      success: false,
      message: 'INVITE_INVALID',
    });
    return;
  }

  const leagueId = invite.league;
  const leagueToJoin = await League.model.findById(leagueId);
  if (!leagueToJoin) {
    res.json({
      success: false,
      message: 'INVITE_INVALID',
    });
    return;
  }

  if (leagueToJoin.playerUsernames.includes(req.session.username)) {
    res.json({
      success: false,
      message: 'ALREADY_ACCEPTED',
    });
    return;
  }
  leagueToJoin.playerUsernames.push(req.session.user.username);
  await leagueToJoin.save();

  await joinLeague(req.session.user.username, leagueId);

  await Invitation.model.findByIdAndDelete(inviteId).exec();
  res.json({
    success: true,
  });
});

router.post('/decline', async (req, res) => {
  const { inviteId } = req.body;
  if (!inviteId) {
    res.sendStatus(400);
    return;
  }

  await Invitation.model.findByIdAndDelete(inviteId).exec();
  res.json({
    success: Boolean(del),
  });
});

module.exports = router;
