const schedule = require('node-schedule');
const Draft = require('../models/Draft');
const League = require('../models/League');
const Outfit = require('../models/Outfit');
const Lineup = require('../models/Lineup');
const Concert = require('../models/Concert');
const SurpriseSong = require('../models/SurpriseSong');
const Albums = SurpriseSong.Albums;

/**
 * The server begins the draft process by instantiating this class
 * The Draft instance will manage the draft process for the league.
 * The server can interact with the instance after receiving HTTP requests
 * or socket events.
 */
class DraftMachine {
  constructor(io, leagueId, time, onComplete) {
    this.onComplete = onComplete;
    this.io = io;
    this.leagueId = leagueId;
    this.autopickJob = null;

    this.outfits = null;
    this.league = null;

    this.startDraftJob = schedule.scheduleJob(new Date(time), () => {
      this.startDraft();
    });
  }

  cancel() {
    // call this if rescheduling;
    this.startDraftJob?.cancel();
    this.autopickJob?.cancel();
  }

  async pushLog(message) {
    try {
      const unsavedDocument = await Draft.model.findOne({ league: this.leagueId });
      unsavedDocument.log.push(`${Date.now()}|${message}`);
      const savedDocument = await unsavedDocument.save();
      this.io.to(this.leagueId).emit('draft-log', savedDocument); // add this emit to log and DB
    } catch (e) {
      console.error(e);
    }
  }

  async startDraft() {
    try {
      await Draft.model.findOneAndReplace(
        { league: this.leagueId },
        {
          league: this.leagueId,
          picks: {},
          log: [],
        },
        { upsert: true }
      );


      this.league = await League.model.findByIdAndUpdate(this.leagueId, { status: 'drafting' }).exec();

      this.outfits = await Outfit.model.find({}).sort({ serialId: 1 }).exec();
      await this.pushLog('Draft starts in 5 minutes');
      const startDraftJob = schedule.scheduleJob(new Date(Date.now() + 5 * 60 * 1000), async () => {
        await this.pushLog('Draft starting');
        this.scheduleAutoPick();
      });
    } catch (e) {
      console.error(e);
    }
  }

  scheduleAutoPick() {
    /**
     * initial release will support 4 player leagues, will probably stay this way because of the # of outfits available.
     * a pick number between 1 - 40 is enough for client and server to infer which round and player's turn it is.
     * On league doc, players are stored in the order they accepted their invite.
     * This is their draft order.
     * Autopicks occur after 33 seconds. Disable the client at 30 seconds to minimize race conditions.
     */
    this.autopickJob = schedule.scheduleJob(new Date(Date.now() + 33 * 1000), () => {
      this.autoSelectPick();
    });
  }

  async getLowestUnselectedOutfit(draft) {
    try {
      // pass in populated document
      const pickObject = Object.fromEntries(draft.picks);
      const picks = Object.values(pickObject);
      const outfitsPicked = new Set(picks.map(pick => pick.outfit.serialId));
      for (let i = 1; i <= 40; i++) {
        if (!outfitsPicked.has(i)) {
          return this.outfits[i - 1]._id;
        }
      }
      return null;
    } catch (e) {
      console.error(e);
    }
  }

  checkIfOutfitPicked(draft, serialId) {
    try {
      const pickObject = Object.fromEntries(draft.picks);
      const picks = Object.values(pickObject);
      const outfitsPicked = new Set(picks.map(pick => pick.outfit.serialId));
      return outfitsPicked.has(serialId);
    } catch (e) {
      console.error(e);
    }
  }

  getNextPickNumber(draft) {
    const picks = Object.fromEntries(draft.picks);
    const pickNumbers = Object.keys(picks).sort((a, b) => Number(a) - Number(b));

    return pickNumbers.length ? Number(pickNumbers[pickNumbers.length - 1]) + 1 : 1;
  }

  async autoSelectPick() {
    try {
      // check the DB to find out what the next pick is
      // selects the next available outfit for the pick
      // update eventLog and draftPicks locally and on DB
      // emit log and DB
      const unsavedDocument = await Draft.model.findOne({ league: this.leagueId }).populate('picks.$*.outfit').exec();

      const nextPickNumber = this.getNextPickNumber(unsavedDocument);
      const isLastPick = nextPickNumber === 41;
      if (isLastPick) {
        this.completeDraft();
      } else {
        // make the pick
        const nextOutfit = await this.getLowestUnselectedOutfit(unsavedDocument);
        await unsavedDocument.picks.set(`${nextPickNumber}`, { timestamp: Date.now().toString(), method: 'auto', outfit: nextOutfit });
        await unsavedDocument.save();
        const updatedPopulatedDoc = await Draft.model.findOne({ league: this.leagueId }).populate('picks.$*.outfit').exec();
        this.io.to(this.leagueId).emit('draft-pick', updatedPopulatedDoc); // add this emit to log and DB
        this.scheduleAutoPick();
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *  this will be triggered by an HTTP request.
   *  the server will store Draft instances in an object dictionary in memory.
   *  This allows the server to manage multiple drafts at once.
   */

  async manualPick(username, pickNumber, serialId) {
    try {
      // check that the player's draft order allow the pickNumber inputted
      // check the DB, ensure that the pickNumber is the next pick
      // emits, update eventLog and draftPicks locally and on DB
      const playerList = this.league.playerUsernames;
      const playerIndex = playerList.indexOf(username);
      const modulo = {
        0: 1,
        1: 2,
        2: 3,
        3: 0,
      };
      if (!(pickNumber % 4 === modulo[playerIndex])) {
        // pickNumber doesn't match the username
        return false;
      }

      const unsavedDocument = await Draft.model.findOne({ league: this.leagueId }).populate('picks.$*.outfit').exec();
      const nextPickNumber = this.getNextPickNumber(unsavedDocument);

      if (nextPickNumber !== pickNumber) {
        return false; // return 400, picknumber doesn't match next pick
      }

      if (this.checkIfOutfitPicked(unsavedDocument, serialId)) {
        return false; // outfit already picked
      }

      await unsavedDocument.picks.set(`${nextPickNumber}`, {
        timestamp: Date.now().toString(),
        method: 'manual',
        outfit: this.outfits[serialId - 1]._id,
      });
      await unsavedDocument.save();
      const updatedPopulatedDoc = await Draft.model.findOne({ league: this.leagueId }).populate('picks.$*.outfit').exec();

      this.io.to(this.leagueId).emit('draft-pick', updatedPopulatedDoc);

      this.autopickJob?.cancel();
      const isLastPick = pickNumber === 40;
      if (isLastPick) {
        await this.completeDraft();
      } else {
        this.scheduleAutoPick();
      }

      return true;
    } catch (e) {
      console.error(e);
    }
  }

  pushToLog(event) {
    /**
     * allows the server to tell us if a user connected or disconnected
     * which we can then share with our front ends
     */
  }

  async completeDraft() {
    try {
      // emit, update eventLog local and DB
      // perform any required data transforms
      // add the new lineups to the DB
      const defaultSong = await SurpriseSong.model.findOne({ name: 'Macavity' }).exec(); // LOL
      const draft = await Draft.model.findOne({ league: this.leagueId }).populate('picks.$*.outfit').exec();
      const pickObject = Object.fromEntries(draft.picks);
      const picksNumbers = Object.keys(pickObject).map(key => Number(key));
      const usernames = this.league.playerUsernames;
      const { increasingId: concertId } = await Concert.findEarliestFutureConcert();
      const picksByPlayer = {
        [usernames[0]]: {
          starters: [],
          bench: [],
        },
        [usernames[1]]: {
          starters: [],
          bench: [],
        },
        [usernames[2]]: {
          starters: [],
          bench: [],
        },
        [usernames[3]]: {
          starters: [],
          bench: [],
        },
      };
      picksNumbers.forEach(pickNumber => {
        const draftOrderTable = {
          1: usernames[0],
          2: usernames[1],
          3: usernames[2],
          0: usernames[3],
        };
        const whoPickedMe = draftOrderTable[pickNumber % 4];
        const pickedOutfit = pickObject[pickNumber].outfit._id;
        /*
          Each player's first 6 rounds go to starter, rest to bench
         */
        if (pickNumber <= 24) {
          picksByPlayer[whoPickedMe].starters.push(pickedOutfit);
        } else {
          picksByPlayer[whoPickedMe].bench.push(pickedOutfit);
        }
      });

      for (let i = 0; i <= 3; i++) {
        await Lineup.model.create({
          concertId,
          username: usernames[i],
          league: this.leagueId,
          starters: picksByPlayer[usernames[i]].starters,
          bench: picksByPlayer[usernames[i]].bench,
          guitarAlbum: Albums.other,
          guitarSong: defaultSong._id,
          pianoAlbum: Albums.other,
          pianoSong: defaultSong._id,
        });
      }

      await League.model.findByIdAndUpdate(this.leagueId, { status: 'active', firstConcert: concertId }).exec();

      this.io.to(this.leagueId).emit('draft-finalize');
      // emit something
      this.onComplete(this.leagueId);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  DraftMachine,
};
