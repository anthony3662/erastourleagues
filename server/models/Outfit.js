const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  serialId: {
    type: Number,
    required: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
  },
  designer: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  pointValue: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Outfit = mongoose.model('Outfit', OutfitSchema);

const seedOutfits = async () => {
  const items = require('./seed/outfitSeed');
  await Outfit.insertMany(items);
};

module.exports = {
  model: Outfit,
  seedOutfits,
};
