const express = require('express');
const router = express.Router();
const Concert = require('../models/Concert');
const League = require('../models/League');
const Lineup = require('../models/Lineup');
const Leaderboard = require('../models/Leaderboard');
const { adminCheckMiddleware } = require('../middleware/adminCheck');
const { Types } = require('mongoose');
const groupBy = require('lodash/groupBy');
const isEqual = require('lodash/isEqual');
router.use(adminCheckMiddleware);

router.post('/save-surprise-songs', async (req, res) => {
  const { guitarSongId, pianoSongId, concertId } = req.body;

  if (!concertId) {
    res.sendStatus(403);
    return;
  }

  await Concert.model
    .findOneAndUpdate(
      { increasingId: concertId },
      {
        guitarSong: guitarSongId || null,
        pianoSong: pianoSongId || null,
      },
    )
    .exec();

  const updatedConcert = await Concert.populateChain(Concert.model.findOne({ increasingId: concertId }));

  res.json({
    updatedConcert,
  });
});

router.post('/update-outfits', async (req, res) => {
  const { concertId, outfitIds } = req.body;
  if (!concertId || !outfitIds) {
    res.sendStatus(403);
    return;
  }

  await Concert.model.findOneAndUpdate({ increasingId: concertId }, { outfits: outfitIds }).exec();
  const updatedConcert = await Concert.populateChain(Concert.model.findOne({ increasingId: concertId }));

  res.json({
    updatedConcert,
  });
});

/**
 * Generates lineup documents on behalf of those who did not set a lineup.
 * Attaches scores and outcome to lineup documents.
 * Runs when admin closes concert, might be expensive.
 */

const scoreConcert = async concertId => {
  const concert = await Concert.populateChain(Concert.model.findOne({ increasingId: concertId }));

  if (!concert || Number(Concert.startTime) > Date.now()) {
    throw Error('concert cannot be scored yet');
  }

  const activeLeagues = await League.model.find({ status: 'active', firstConcert: { $ne: null, $lte: concertId } }).exec();

  //We need to score a lineup for each entry here!
  const pairings = {}; // ${leagueId}|${playerUsername}: true //both are alphanumeric so this is safe
  activeLeagues.forEach(league => {
    const leaguePlayers = league.playerUsernames;
    leaguePlayers.forEach(username => (pairings[`${league._id}|${username}`] = true));
  });

  const lineups = await Lineup.model.find({ concertId }).exec();
  lineups.forEach(lineup => {
    delete pairings[`${lineup.league}|${lineup.username}`];
  });

  // Everything still in pairings, that player didn't set their lineup for the week!
  // We assume a lineup object for the previous event exists, as each week the finalization process inserts the player's lineup doc if they didn't set a lineup.
  // If the league doesn't have a previous event, then the Lineup that was autogenerated when draft finalizes is current and the object will be empty.

  const [previousConcert] = await Concert.model
    .find({ increasingId: { $lt: concertId } })
    .sort({ increasingId: -1 })
    .limit(1)
    .exec();
  const previousId = previousConcert?.increasingId || -1;

  const filter = {
    concertId: previousId,
    $expr: {
      $in: [{ $concat: [{ $toString: '$league' }, '|', '$username'] }, Object.keys(pairings)],
    },
  };

  try {
    const lineups = await Lineup.model.find(filter);

    const duplicatedLineups = lineups.map(lineup => ({
      ...lineup.toObject(),
      _id: new Types.ObjectId(), // Generate new ObjectId for duplication
      concertId, // Update concertId to currentWeek
    }));

    if (duplicatedLineups.length > 0) {
      await Lineup.model.bulkWrite(
        duplicatedLineups.map(lineup => ({
          insertOne: {
            document: lineup,
          },
        })),
      );
    } else {
    }
  } catch (error) {
    console.error('An error occurred while querying or duplicating documents:', error);
  }

  // at this point every active player has a Lineup doc for the week that we're closing.

  const uptoDateLineups = await Lineup.model
    .find({ concertId })
    .populate({ path: 'starters', model: 'Outfit' })
    .populate({ path: 'bench', model: 'Outfit' })
    .populate('guitarSong')
    .populate('pianoSong')
    .exec();

  if (!uptoDateLineups.length) {
    // all leagues have firstConcert after what was inputted here. If you need to make a correction to an early concert,
    // no need to press Close Concert. The informational pages are already taken care of through other means.
    return;
  }

  const groupByLeague = groupBy(uptoDateLineups, 'league');

  const bulkUpdateOperations = [];

  const matchupOrder = await Lineup.calculateLineups(concertId);

  // sorry future self lmao
  activeLeagues.forEach(league => {
    const leagueLineups = groupByLeague[league._id];
    const player0Lineup = leagueLineups.find(l => l.username === league.playerUsernames[0]);
    const player1Lineup = leagueLineups.find(l => l.username === league.playerUsernames[1]);
    const player2Lineup = leagueLineups.find(l => l.username === league.playerUsernames[2]);
    const player3Lineup = leagueLineups.find(l => l.username === league.playerUsernames[3]);

    const player0Score = Lineup.calculateScore(concert, player0Lineup);
    const player1Score = Lineup.calculateScore(concert, player1Lineup);
    const player2Score = Lineup.calculateScore(concert, player2Lineup);
    const player3Score = Lineup.calculateScore(concert, player3Lineup);

    const compare = (one, two) => {
      if (one === two) return 'tie';
      if (one > two) return 'win';
      return 'loss';
    };
    let outcomes;
    if (isEqual(matchupOrder, [0, 1, 2, 3])) {
      outcomes = [
        compare(player0Score, player1Score),
        compare(player1Score, player0Score),
        compare(player2Score, player3Score),
        compare(player3Score, player2Score),
      ];
    } else if (isEqual(matchupOrder, [0, 2, 1, 3])) {
      outcomes = [
        compare(player0Score, player2Score),
        compare(player1Score, player3Score),
        compare(player2Score, player0Score),
        compare(player3Score, player1Score),
      ];
    } else {
      outcomes = [
        compare(player0Score, player3Score),
        compare(player1Score, player2Score),
        compare(player2Score, player1Score),
        compare(player3Score, player0Score),
      ];
    }
    const [player0Outcome, player1Outcome, player2Outcome, player3Outcome] = outcomes;

    bulkUpdateOperations.push({
      updateOne: {
        filter: { _id: player0Lineup._id },
        update: { score: player0Score, outcome: player0Outcome },
      },
    });
    bulkUpdateOperations.push({
      updateOne: {
        filter: { _id: player1Lineup._id },
        update: { score: player1Score, outcome: player1Outcome },
      },
    });
    bulkUpdateOperations.push({
      updateOne: {
        filter: { _id: player2Lineup._id },
        update: { score: player2Score, outcome: player2Outcome },
      },
    });
    bulkUpdateOperations.push({
      updateOne: {
        filter: { _id: player3Lineup._id },
        update: { score: player3Score, outcome: player3Outcome },
      },
    });
  });

  await Lineup.model.bulkWrite(bulkUpdateOperations);
};

const generateLeaderboard = async concertId => {
  const topTenLineups = await Lineup.model.find({ concertId }).sort({ score: -1 }).limit(10).exec();

  await Leaderboard.model.findOneAndUpdate(
    { concertId }, // Find the existing leaderboard with matching concertId
    { $set: { winners: topTenLineups.map(lineup => lineup._id.toString()) } }, // Update the winners field
    { upsert: true } // Create a new document if it doesn't exist
  );
};

// write scores, generate leaderboard. Should allow safe calling more than once on an event.
// sets the endTime to present if current concert and present time is earlier the end time on the document (default value is 23:40)
// If you expect a concert to end past 2340, use the DB console to edit in an generous estimated end time.
// Then once the concert actually closes this route will set the actual end time.
// You can also call this after a concert if you need to rescore everything and regenerate leaderboards for whatever reason
router.post('/close-concert', async (req, res) => {
  const { concertId } = req.body;
  if (!concertId) {
    res.sendStatus(403);
    return;
  }

  const concert = await Concert.model.findOne({ increasingId: concertId }).exec();

  try {
    await scoreConcert(concertId);
    await generateLeaderboard(concertId);
  } catch (e) {
    console.error(e);
  }

  if (Number(concert.startTime) < Date.now() && Number(concert.endTime) > Date.now()) {
    await Concert.model.updateOne({ increasingId: concertId }, { endTime: Date.now() }).exec();
  }

  res.json({
    success: true,
  });
});

module.exports = router;
