const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
  If invite is expired, user can be invited again, edit the expiration date.
  User can have invitations pending for multiple leagues.
  Delete entry to decline invite.
 */
const InvitationSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
    required: true,
    index: true,
  },
  createdAt: {
    type: String,
    default: () => Date.now(),
  },
  expiresAt: {
    type: String,
    default: () => String(Date.now() + 24 * 60 * 60 * 1000),
  },
});

const Invitation = mongoose.model('Invitation', InvitationSchema);

const insert = async invitation => {
  try {
    return await Invitation.create(invitation);
  } catch (e) {
    console.error(e);
  }
};

const getLeagueInvitations = async leagueId => {
  try {
    return await Invitation.find({ league: leagueId }).exec();
  } catch (e) {
    console.error(e);
  }
};

const getInvitesByEmail = async email => {
  try {
    return await Invitation.find({ email }).populate('league').exec();
  } catch (e) {
    console.error(e)
  }
};

const refreshInvite = async (league, email) => {
  try {
    return await Invitation.findOneAndUpdate({ league, email }, { expiresAt: String(Date.now() + 24 * 60 * 60 * 1000) }).exec();
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  insert,
  getLeagueInvitations,
  getInvitesByEmail,
  refreshInvite,
  model: Invitation,
};
