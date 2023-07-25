const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
    default: 'caticorn',
  },
  leagues: {
    type: [{ type: Schema.Types.ObjectId, ref: 'League' }], // league ids
    default: [],
  },
  createdAt: {
    type: String,
    default: () => Date.now(),
  },
  isAdmin: {
    // isAdmin: true will not be set programmatically. Use the DB console to make someone an admin.
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

const findByEmail = async email => {
  try {
    return await User.findOne({ email }).exec();
  } catch (e) {
    console.error(e)
  }
};

const findByUsername = async username => {
  try {
    return await User.findOne({ username }).exec();
  } catch (e) {
    console.error(e);
  }
};

const insert = async user => {
  try {
    return await User.create(user);
  } catch (e) {
    console.error(e);
  }
};

const joinLeague = async (username, leagueId) => {
  try {
    const user = await User.findOne({ username });
    user.leagues.push(leagueId);
    await user.save();
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  findByEmail,
  findByUsername,
  insert,
  joinLeague,
  model: User,
};
