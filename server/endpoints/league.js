const express = require('express');
const router = express.Router();
const { cookieCheckMiddleware } = require('../middleware/cookieCheck');
const League = require('../models/League');
const User = require('../models/User');
const Draft = require('../models/Draft');
const { DraftMachineManager } = require('../draft/draftMachineManager');
const { sendDraftSchedule } = require('../email/mailgun');

require('moment-timezone');
const Outfit = require('../models/Outfit');

router.use(cookieCheckMiddleware);

router.post('/create-league', async (req, res) => {
  const username = req.session.user.username;
  const name = req.body.leagueName;

  if (!name) {
    res.sendStatus(400);
    return;
  }

  const newLeague = await League.insert({
    creatorUsername: username,
    name,
    playerUsernames: [username],
  });

  await User.joinLeague(username, newLeague['_id']);

  res.json({
    success: true,
    league: newLeague,
  });
});

router.get('/leagues', async (req, res) => {
  const { leagues: leagueIds } = await User.findByEmail(req.session.email);
  const leagues = await League.model.find({ _id: { $in: leagueIds } });
  res.json({
    leagues,
  });
});

router.post('/league-details', async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.sendStatus(400);
    return;
  }
  const league = await League.get(id);
  res.json({
    league,
  });
});

router.post('/schedule-draft', async (req, res) => {
  const { time, leagueId } = req.body;
  // must be at least 10m away!
  if (!time || !leagueId || Number(time) <= Date.now() + 10 * 60 * 1000) {
    res.sendStatus(400);
    return;
  }

  const league = await League.model.findById(leagueId).exec();

  if (league.creatorUsername !== req.session.user.username || league.status !== 'predraft') {
    res.sendStatus(403);
    return;
  }

  const updatedLeague = await League.model.findByIdAndUpdate(leagueId, { draftTime: String(time) }).exec();
  const users = await User.model.find({ username: { $in: updatedLeague.playerUsernames } }).exec();

  // send emails
  users.forEach(user => {
    sendDraftSchedule(updatedLeague.name, user.email, time);
  });
  // schedule task
  DraftMachineManager.initializeMachine(leagueId, time);

  res.json({
    success: true,
  });
});

router.post('/draft', async (req, res) => {
  // to be used with drafting and active status leagues
  const { leagueId } = req.body;
  if (!leagueId) {
    res.sendStatus(400);
    return;
  }
  const draft = await Draft.model.findOne({ league: leagueId }).populate('picks.$*.outfit').exec();
  const outfits = await Outfit.model.find({}).sort({ serialId: 1 }).exec();

  res.json({
    draft,
    outfits,
  });
});

router.post('/pick-outfit', async (req, res) => {
  const username = req.session.user.username;
  const { leagueId, pickNumber, serialId } = req.body;
  if (!leagueId || !pickNumber || !serialId) {
    res.sendStatus(400);
    return;
  }

  const success = await DraftMachineManager.handlePick(leagueId, username, pickNumber, serialId);

  res.json({
    success,
  });
});

module.exports = router;
