const { DraftMachine } = require('./draftMachine');
const League = require('../models/League');
const Draft = require('../models/Draft');
const Mailgun = require('../email/mailgun');
class DraftMachineManager {
  static io;
  static draftMachines = {};

  /**
   * Call on server startup, only on prod
   * Schedules pending drafts in case server crashes and has to restart.
   */
  static async onServerRestart() {
    /*
      Initialize drafts
     */
    const query = await League.model
      .find({
        status: 'predraft',
        draftTime: { $ne: null },
      })
      .exec();

    const draftsToInitialize = query.filter(league => Number(league.draftTime) > Date.now());
    draftsToInitialize.forEach(league => {
      DraftMachineManager.draftMachines[league._id] = new DraftMachine(DraftMachineManager.io, league._id, league.draftTime, completedId => {
        delete DraftMachineManager.draftMachines[completedId];
      });
    });

    /*
      Roll back incomplete work interrupted by unexpected shutdown
      Don't enable this on dev until we're actually able to set the work as completed...
     */

    const leagues = await League.model.find({ status: 'drafting' }).exec();
    const leagueIds = leagues.map(league => league._id);
    await Draft.model.deleteMany({ league: { $in: leagueIds } }).exec();
    await League.model.updateMany({ _id: { $in: leagueIds } }, { $set: { status: 'predraft', draftTime: null } }).exec();

    const playerUsernames = leagues.flatMap(league => league.playerUsernames);
    if (playerUsernames.length) {
      await Mailgun.sendInterruptedDraftNotification(playerUsernames);
    }
    console.log('restart procedure successful');
  }

  static initializeMachine(leagueId, time) {
    // cancels the original in case of a reschedule
    if (DraftMachineManager.draftMachines[leagueId]) {
      DraftMachineManager.draftMachines[leagueId].cancel();
    }
    // TODO: pass in time instead of starting 20 seconds after creation!
    DraftMachineManager.draftMachines[leagueId] = new DraftMachine(DraftMachineManager.io, leagueId, time, completedId => {
      delete DraftMachineManager.draftMachines[completedId];
    });
  }

  static async handlePick(leagueId, username, pickNumber, serialId) {
    const machine = DraftMachineManager.draftMachines[leagueId];
    if (!machine) {
      return false;
    }

    try {
      return await machine.manualPick(username, pickNumber, serialId);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  DraftMachineManager,
};
