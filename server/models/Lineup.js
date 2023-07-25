const Concert = require('./Concert');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * A document will be upserted every time the player edits their lineup
 * A document is also inserted on the finalization process after a concert, on behalf of
 * those who didn't set a lineup.
 * If the player skips one or more concerts without setting a lineup,
 * we can obtain the lineup for a given concertId by finding the document with the
 * highest concertId <= the inputted concertId, there should be a doc with the previous event's id.
 */
const LineupSchema = new Schema({
  concertId: {
    // the increasingId field on the Concert document
    type: Number,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  },
  starters: {
    type:  [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    default: [],
  },
  bench: {
    type:  [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    default: [],
  },
  guitarAlbum: {
    type: String,
  },
  guitarSong: {
    type: Schema.Types.ObjectId,
    ref: 'SurpriseSong',
  },
  pianoAlbum: {
    type: String,
  },
  pianoSong: {
    type: Schema.Types.ObjectId,
    ref: 'SurpriseSong',
  },
  score: {
    type: Number,
    default: 0,
  },
  outcome: {
    type: String, // win | loss | tie
    required: false,
  },
});

const Lineup = mongoose.model('Lineup', LineupSchema);

const getLineup = async (leagueId, username, concertId) => {
  const [lineup] = await Lineup.find({ league: leagueId, username, concertId: { $lte: concertId } })
    .sort({ concertId: -1 })
    .limit(1)
    .populate({ path: 'starters', model: 'Outfit' })
    .populate({ path: 'bench', model: 'Outfit' })
    .populate('guitarSong')
    .populate('pianoSong')
    .exec();
  if (!lineup) {
    // if you look up a concert date before league formation
    return null;
  }
  return lineup;
};

const getCurrentLineup = async (leagueId, username) => {
  try {
    const concert = await Concert.findCurrentOrEarliestConcert();

    if (!concert) return null;

    return await getLineup(leagueId, username, concert.increasingId);
  } catch (e) {
    console.error(e);
  }
};

const calculateLineups = async increasingId => {
  try {
    const concerts = await Concert.model.find({ increasingId: { $lte: increasingId } }).exec();
    const roundNumber = concerts.length;

    if (roundNumber % 3 === 1) {
      return [0, 1, 2, 3];
    } else if (roundNumber % 3 === 2) {
      return [0, 2, 1, 3];
    } else {
      return [0, 3, 1, 2];
    }
  } catch (e) {
    console.error(e)
  }
};

// pass in populated docs!
const calculateScore = (concertDoc, lineupDoc) => {
  const concert = concertDoc.toObject();
  const lineup = lineupDoc.toObject();
  const outfitsDisplayed = concert.outfits;
  const outfitsSelected = lineup.starters.map(o => o._id.toString());
  const winningOutfits = outfitsDisplayed.filter(outfit => outfitsSelected.includes(outfit._id.toString()));
  const outfitPoints = winningOutfits.reduce((a, v) => a + v.pointValue, 0);

  let songScore = 0;
  if (concert.guitarSong?.album === lineup.guitarAlbum) {
    songScore += 5;
  }
  if (concert.guitarSong?.name === lineup.guitarSong.name) {
    songScore += 5;
  }
  if (concert.pianoSong?.album === lineup.pianoAlbum) {
    songScore += 5;
  }
  if (concert.pianoSong?.name === lineup.pianoSong.name) {
    songScore += 5;
  }

  return outfitPoints + songScore;
};

module.exports = {
  model: Lineup,
  getLineup,
  getCurrentLineup,
  calculateLineups,
  calculateScore,
};
