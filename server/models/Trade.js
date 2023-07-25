const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
  leagueId: {
    type: String,
    required: true,
    index: true,
  },
  senderUsername: {
    type: String,
    required: true,
  },
  recipientUsername: {
    type: String,
    required: true,
  },
  myPayment: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    required: true,
  },
  recipientPayment: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    required: true,
  },
  expiresAt: {
    type: String,
    default: () => String(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = {
  model: Trade,
};
