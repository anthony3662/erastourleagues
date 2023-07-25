const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurpriseSongSchema = new Schema({
  album: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const SurpriseSong = mongoose.model('SurpriseSong', SurpriseSongSchema);

const Albums = {
  // maps to how its saved in DB
  debut: 'Debut',
  fearless: 'Fearless',
  speakNow: 'Speak Now',
  red: 'Red',
  1989: '1989',
  reputation: 'reputation',
  lover: 'Lover',
  folklore: 'folklore',
  evermore: 'evermore',
  midnights: 'Midnights',
  other: 'Other',
};

const seedSurpriseSongs = async () => {
  const items = require('./seed/surpriseSongSeed');
  await SurpriseSong.insertMany(items);
};

module.exports = {
  model: SurpriseSong,
  seedSurpriseSongs,
  Albums,
};
