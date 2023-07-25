const express = require('express');
const router = express.Router();
const Lineup = require('../models/Lineup');
const Concert = require('../models/Concert');
const User = require('../models/User');
const Trade = require('../models/Trade');
const groupBy = require('lodash/groupBy');
const { cookieCheckMiddleware } = require('../middleware/cookieCheck');

router.use(cookieCheckMiddleware);

router.post('/gameboard', async (req, res) => {
  const { leagueId, usernames, firstConcert } = req.body;
  if (!leagueId || !firstConcert) {
    res.sendStatus(400);
    return;
  }

  const currentConcert = await Concert.findCurrentOrEarliestConcert();

  // all concerts the league is/was active for
  const allLeagueConcerts = await Concert.populateChain(
    Concert.model.find({ increasingId: { $gte: firstConcert } }).sort({ increasingId: 1 }),
  );

  if (!currentConcert) {
    // season over :(
    res.json({
      concert: null,
      lineups: null,
      allLeagueConcerts,
    });
    return;
  }

  const { increasingId: concertId } = currentConcert;

  const lineups = await Promise.all(usernames.map(username => Lineup.getLineup(leagueId, username, concertId)));

  const matchups = await Lineup.calculateLineups(concertId, usernames);

  const users = await User.model.find({ username: { $in: usernames } }).exec();

  const allPastLineups = await Lineup.model.find({ league: leagueId }).exec();
  const lineupsByUser = groupBy(allPastLineups, 'username');

  const usersObject = {};
  const recordsObject = {};
  users.forEach(user => {
    usersObject[user.username] = user;

    let win = 0;
    let loss = 0;
    let tie = 0;
    let seasonPoints = 0;
    lineupsByUser[user.username]?.forEach(l => {
      seasonPoints += (l?.score || 0);
      const outcome = l?.outcome;
      if (outcome === 'win') win += 1;
      else if (outcome === 'loss') loss += 1;
      else if (outcome === tie) tie += 1;
    });
    recordsObject[user.username] = { win, loss, tie, seasonPoints, username: user.username };
  });

  res.json({
    currentConcert,
    lineups,
    allLeagueConcerts,
    matchups,
    users: usersObject,
    records: recordsObject,
  });
});

router.post('/lineups', async (req, res) => {
  const { leagueId, usernames, concertId } = req.body;
  const lineups = await Promise.all(usernames.map(username => Lineup.getLineup(leagueId, username, concertId)));
  const matchups = await Lineup.calculateLineups(concertId, usernames);

  res.json({
    lineups,
    matchups,
  });
});

router.post('/set-surprise-songs', async (req, res) => {
  const { leagueId, guitarAlbum, guitarSongId, pianoAlbum, pianoSongId } = req.body;
  const username = req.session.user.username;

  if (!leagueId) {
    res.sendStatus(400);
    return;
  }

  const concert = await Concert.findCurrentOrEarliestConcert();
  if (Number(concert.startTime) <= Date.now()) {
    res.sendStatus(400); // transacting closes at the start time in DB, usually 19:45
    return;
  }

  const [lineup] = await Lineup.model
    .find({ league: leagueId, username, concertId: { $lte: concert.increasingId } })
    .sort({ concertId: -1 })
    .limit(1)
    .exec();

  const duplicatedLineup = {
    ...lineup.toObject(),
    concertId: concert.increasingId,
    score: 0,
  };

  delete duplicatedLineup._id;
  delete duplicatedLineup.outcome;
  if (guitarAlbum) duplicatedLineup.guitarAlbum = guitarAlbum;
  if (guitarSongId) duplicatedLineup.guitarSong = guitarSongId;
  if (pianoAlbum) duplicatedLineup.pianoAlbum = pianoAlbum;
  if (pianoSongId) duplicatedLineup.pianoSong = pianoSongId;

  const upsert = await Lineup.model
    .updateOne({ concertId: concert.increasingId, username, league: leagueId }, duplicatedLineup, { upsert: true })
    .exec();
  const updatedLineup = await Lineup.model
    .findOne({ concertId: concert.increasingId, username, league: leagueId })
    .populate({ path: 'starters', model: 'Outfit' })
    .populate({ path: 'bench', model: 'Outfit' })
    .populate('guitarSong')
    .populate('pianoSong')
    .exec();
  res.json({
    updatedLineup,
  });
});

router.post('/swap-outfits', async (req, res) => {
  const { leagueId, newStarterId, newBenchId } = req.body;
  const username = req.session.user.username;

  if (!leagueId || !newStarterId || !newBenchId) {
    res.sendStatus(400);
    return;
  }

  const concert = await Concert.findCurrentOrEarliestConcert();
  if (Number(concert.startTime) <= Date.now()) {
    res.sendStatus(400); // transacting closes at the start time in DB, usually 19:45
    return;
  }

  const [_lineup] = await Lineup.model
    .find({ league: leagueId, username, concertId: { $lte: concert.increasingId } })
    .sort({ concertId: -1 })
    .limit(1)
    .exec();

  const lineup = _lineup.toObject();

  const starters = lineup.starters.map(s => s._id.toString());
  const bench = lineup.bench.map(b => b._id.toString());

  if (!starters.includes(newBenchId) || !bench.includes(newStarterId)) {
    // swap not valid
    res.sendStatus(400);
    return;
  }

  starters[starters.indexOf(newBenchId)] = newStarterId;
  bench[bench.indexOf(newStarterId)] = newBenchId;

  // this ensures the starting lineup finishes with 6 elements.
  while (starters.length < 6 && bench.length > 0) {
    starters.push(bench.shift());
  }

  const newLineup = {
    ...lineup,
    concertId: concert.increasingId,
    starters,
    bench,
    score: 0,
  };

  delete newLineup._id;
  delete newLineup.outcome;

  await Lineup.model.updateOne({ concertId: concert.increasingId, username, league: leagueId }, newLineup, { upsert: true }).exec();
  const updatedLineup = await Lineup.model
    .findOne({ concertId: concert.increasingId, username, league: leagueId })
    .populate({ path: 'starters', model: 'Outfit' })
    .populate({ path: 'bench', model: 'Outfit' })
    .populate('guitarSong')
    .populate('pianoSong')
    .exec();

  res.json({
    updatedLineup,
  });
});

router.post('/accept-trade', async (req, res) => {
  const { tradeId } = req.body;
  const { username } = req.session.user;

  if (!tradeId) {
    res.sendStatus(400);
    return;
  }

  const trade = await Trade.model.findById(tradeId).exec();

  if (Number(trade.expiresAt) < Date.now() || trade.recipientUsername !== username) {
    // expired or not the recipient
    res.sendStatus(400);
    return;
  }

  const concert = await Concert.findCurrentOrEarliestConcert();
  if (Number(concert.startTime) <= Date.now()) {
    res.sendStatus(400); // transacting closes at the start time in DB, usually 19:45
    return;
  }

  const { leagueId, senderUsername, recipientUsername } = trade;
  const myPayment = trade.myPayment.map(id => id.toString());
  const recipientPayment = trade.recipientPayment.map(id => id.toString());

  const senderLineup = await Lineup.getCurrentLineup(leagueId, senderUsername);
  const recipientLineup = await Lineup.getCurrentLineup(leagueId, recipientUsername);

  const senderStarters = senderLineup.starters.map(l => l._id.toString());
  const senderBench = senderLineup.bench.map(l => l._id.toString());
  const recipientStarters = recipientLineup.starters.map(l => l._id.toString());
  const recipientBench = recipientLineup.bench.map(l => l._id.toString());

  const senderOutfits = [...senderStarters, ...senderBench];
  const recipientOutfits = [...recipientStarters, ...recipientBench];

  const isSenderLineupValid = myPayment.every(id => senderOutfits.includes(id));
  const isRecipientLineupValid = recipientPayment.every(id => recipientOutfits.includes(id));

  if (!isSenderLineupValid || !isRecipientLineupValid) {
    // trade can no longer be executed due to prior trading
    res.sendStatus(400);
    return;
  }

  const newSenderOutfits = [
    ...senderStarters.filter(o => !myPayment.includes(o)),
    ...recipientPayment,
    ...senderBench.filter(o => !myPayment.includes(o)),
  ];
  const newRecipientOutfits = [
    ...recipientStarters.filter(o => !recipientPayment.includes(o)),
    ...myPayment,
    ...recipientBench.filter(o => !recipientPayment.includes(o)),
  ];

  const newSenderStarters = newSenderOutfits.slice(0, 6);
  const newSenderBench = newSenderOutfits.slice(6);
  const newRecipientStarters = newRecipientOutfits.slice(0, 6);
  const newRecipientBench = newRecipientOutfits.slice(6);

  const newSenderLineup = {
    league: senderLineup.league.toString(),
    guitarSong: senderLineup.guitarSong._id.toString(),
    guitarAlbum: senderLineup.guitarAlbum,
    pianoSong: senderLineup.pianoSong._id.toString(),
    pianoAlbum: senderLineup.pianoAlbum,
    concertId: concert.increasingId,
    starters: newSenderStarters,
    bench: newSenderBench,
  };


  await Lineup.model
    .updateOne({ concertId: concert.increasingId, username: senderUsername, league: leagueId }, newSenderLineup, { upsert: true })
    .exec();

  const newRecipientLineup = {
    league: recipientLineup.league.toString(),
    guitarSong: recipientLineup.guitarSong._id.toString(),
    guitarAlbum: recipientLineup.guitarAlbum,
    pianoSong: recipientLineup.pianoSong._id.toString(),
    pianoAlbum: recipientLineup.pianoAlbum,
    concertId: concert.increasingId,
    starters: newRecipientStarters,
    bench: newRecipientBench,
  };
  delete newRecipientLineup._id;
  delete newRecipientLineup.outcome;

  await Lineup.model
    .updateOne({ concertId: concert.increasingId, username: recipientUsername, league: leagueId }, newRecipientLineup, { upsert: true })
    .exec();

  await Trade.model.findByIdAndDelete(tradeId).exec();
  const senderLineupAfterExecution = await Lineup.getCurrentLineup(leagueId, senderUsername);
  const recipientLineupAfterExecution = await Lineup.getCurrentLineup(leagueId, recipientUsername);
  res.json({ newSenderLineup: senderLineupAfterExecution, newRecipientLineup: recipientLineupAfterExecution });
});

router.post('/offer-trade', async (req, res) => {
  const { leagueId, myPayment, recipientPayment, recipientUsername } = req.body;
  const allParamsPresent = leagueId && myPayment && recipientPayment && recipientUsername;
  if (!allParamsPresent) {
    res.sendStatus(400);
    return;
  }

  const newTrade = await Trade.model.create({
    leagueId,
    senderUsername: req.session.user.username,
    recipientUsername,
    myPayment,
    recipientPayment,
  });

  res.json({
    newTrade,
  });
});

/**
 * For trades that cannot be executed due to previously executed trades, the FE should still display them with appropriate UI.
 */
router.post('/get-trades', async (req, res) => {
  const { leagueId } = req.body;
  if (!leagueId) {
    res.sendStatus(400);
    return;
  }

  const trades = await Trade.model
    .find({ leagueId })
    .populate({ path: 'myPayment', ref: 'Outfit' })
    .populate({ path: 'recipientPayment', ref: 'Outfit' })
    .exec();
  const currentTrades = trades.filter(t => Number(t.expiresAt) >= Date.now());

  res.json({
    trades: currentTrades,
  });
});

router.post('/delete-trade', async (req, res) => {
  const { tradeId } = req.body;
  const { username } = req.session.user;
  if (!tradeId) {
    res.sendStatus(400);
    return;
  }

  const tradeToDelete = await Trade.model.findById(tradeId).exec();

  // sender can withdraw. recipient can reject.
  if (tradeToDelete.senderUsername !== username && tradeToDelete.recipientUsername !== username) {
    res.sendStatus(400);
    return;
  }

  await Trade.model.findByIdAndDelete(tradeId).exec();
  res.json({ success: true });
});

module.exports = router;
