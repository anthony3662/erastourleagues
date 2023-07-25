const express = require('express');
const router = express.Router();
const Concert = require('../models/Concert');
const Outfit = require('../models/Outfit');
const Lineup = require('../models/Lineup');
const League = require('../models/League');
const Unsubscribe = require('../models/Unsubscribe');
const SurpriseSongs = require('../models/SurpriseSong');
const Leaderboards = require('../models/Leaderboard');

/**
 * Endpoints that do not require credentials
 */

router.get('/concerts', async (req, res) => {
  const concerts = await Concert.getAllConcerts();
  const currentConcert = await Concert.findCurrentOrEarliestConcert();

  res.json({
    concerts,
    currentConcert,
  });
});

router.get('/outfits', async (req, res) => {
  const outfits = await Outfit.model.find({}).sort({ serialId: 1 }).exec();

  res.json({
    outfits,
  });
});

router.get('/surprise-songs', async (req, res) => {
  const surpriseSongs = await SurpriseSongs.model.find({}).exec();

  res.json({
    surpriseSongs,
  });
});

router.get('/everything', async (req, res) => {
  const concerts = await Concert.getAllConcerts();
  const currentConcert = await Concert.findCurrentOrEarliestConcert();

  const outfits = await Outfit.model.find({}).sort({ serialId: 1 }).exec();
  const surpriseSongs = await SurpriseSongs.model.find({}).exec();
  const leaderboards = await Leaderboards.model
    .find({})
    .sort({ concertId: 1 })
    .populate({ path: 'winners', model: 'Lineup', populate: [
        { path: 'league', model: 'League' },
        { path: 'guitarSong', model: 'SurpriseSong' },
        { path: 'pianoSong', model: 'SurpriseSong' },
        { path: 'starters', model: 'Outfit' },
        { path: 'bench', model: 'Outfit' },
      ]})
    .exec();


  res.json({
    concerts,
    currentConcert,
    outfits,
    surpriseSongs,
    leaderboards,
  });
});

router.get('/unsubscribe', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.sendStatus(403);
    return;
  }

  // Check if the email is already in the Unsubscribe table
  const existingUnsubscribe = await Unsubscribe.model.findOne({ email }).exec();

  if (existingUnsubscribe) {
    // Email is already unsubscribed
    res.send(`
      <html>
        <body>
          <h1>You're already unsubscribed. You will not receive any more invites.</h1>
        </body>
      </html>
    `);
    return;
  }

  // Create a new entry in the Unsubscribe table
  await Unsubscribe.model.create({ email });

  // Email successfully unsubscribed
  res.send(`
    <html>
      <body>
        <h1>You have unsubscribed. You will not receive any more invites.</h1>
      </body>
    </html>
  `);
});

module.exports = router;
