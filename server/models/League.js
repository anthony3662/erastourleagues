const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
  creatorUsername: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => Date.now(),
  },
  playerUsernames: {
    type: [String],
    default: [],
  },
  playerCapacity: {
    type: Number,
    default: 4,
  },
  status: {
    required: true,
    type: String,
    default: 'predraft', // predraft | drafting | active
  },
  draftTime: {
    type: String,
    required: false,
  },
  firstConcert: {
    // set on draft finalization
    type: Number, //concert's increasingId
    required: false,
  },
});

const League = mongoose.model('League', LeagueSchema);

const insert = async league => {
  try {
    return await League.create(league);
  } catch (e) {
    console.error(e);
  }
};

const get = async id => {
  try {
    return await League.findById(id);
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  insert,
  get,
  model: League,
};
