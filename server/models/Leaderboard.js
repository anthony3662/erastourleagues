const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaderboardSchema = new Schema({
  concertId: {
    type: Number,
    required: true,
    index: true,
    unique: true,
  },
  winners: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Lineup' }],
    default: [],
  },
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

module.exports = {
  model: Leaderboard,
};
