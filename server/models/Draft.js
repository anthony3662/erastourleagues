const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DraftSchema = new Schema({
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
    required: true,
    index: true,
    unique: true,
  },
  picks: {
    // map keys 1 - 40
    type: Schema.Types.Map,
    required: true,
    of: new Schema({
      timestamp: String,
      method: String, // auto | manual
      outfit: {
        type: Schema.Types.ObjectId,
        ref: 'Outfit',
      },
    }),
  },
  log: {
    type: [String],
    default: [],
  },
});

const Draft = mongoose.model('Draft', DraftSchema);

module.exports = {
  model: Draft,
};
