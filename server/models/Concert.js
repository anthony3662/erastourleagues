const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ConcertSchema = new Schema({
  increasingId: {
    // NON Serial! This way we can insert newly announced shows without breaking any logic.
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    index: true,
  },
  region: {
    type: String, // 'usa' | 'latam' | 'europe' | 'asia' | 'oceania'
    required: true,
    index: true,
  },
  night: {
    // Night 1,2,3, ...
    // there is an edge case where she goes to Wembley and comes back 2 months later
    // don't use this field for querying or non-ui related logic!
    type: Number,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  outfits: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    default: [],
  },
  guitarSong: {
    type: Schema.Types.ObjectId,
    ref: 'SurpriseSong',
    required: false,
  },
  pianoSong: {
    type: Schema.Types.ObjectId,
    ref: 'SurpriseSong',
    required: false,
  },
});

const Concert = mongoose.model('Concert', ConcertSchema);

const populateChain = query => {
  return query.populate({ path: 'outfits', ref: 'Outfit' }).populate('guitarSong').populate('pianoSong').exec();
};

const findEarliestFutureConcert = async () => {
  try {
    const currentTime = Date.now();
    const [earliestConcert] = await populateChain(
      Concert.find({ startTime: { $gte: currentTime } })
        .sort({ startTime: 1 })
        .limit(1),
    );
    if (!earliestConcert) {
      return null; // could be null if the season is over!
    }
    return earliestConcert;
  } catch (e) {
    console.error(e);
  }
};

const findCurrentOrEarliestConcert = async () => {
  try {
    const currentTime = Date.now();
    const currentConcert = await populateChain(
      Concert.findOne({
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
      }),
    );

    if (currentConcert) {
      return currentConcert;
    }

    const [earliestConcert] = await populateChain(
      Concert.find({ startTime: { $gte: currentTime } })
        .sort({ startTime: 1 })
        .limit(1),
    );

    if (!earliestConcert) {
      return null; // could be null if the season is over!
    }
    return earliestConcert;
  } catch(e) {
    console.error(e);
  }
};

const getAllConcerts = async () => {
  try {
    return await populateChain(Concert.find({}).sort({ increasingId: 1 }));
  } catch (e) {
    console.error(e);
  }
}

const seedConcerts = async () => {
  const items = require('./seed/concertSeed');
  await Concert.insertMany(items);
};

module.exports = {
  model: Concert,
  findEarliestFutureConcert,
  findCurrentOrEarliestConcert,
  seedConcerts,
  populateChain,
  getAllConcerts,
};
