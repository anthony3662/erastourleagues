const mongoose = require('mongoose');

const UnsubscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  unsubscribedAt: {
    type: String,
    default: () => String(Date.now()),
  },
});

const Unsubscribe = mongoose.model('Unsubscribe', UnsubscribeSchema);

module.exports = { model: Unsubscribe };
