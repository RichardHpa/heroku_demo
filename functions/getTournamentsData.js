// This function is responsible for fetching the tournaments data
import fs from 'fs';
import { format } from 'date-fns';

import { basePokeDataApiTournamentsUrl, baseFolder } from '../constants/folders.js';
import { forceFinishTournaments } from '../constants/forceFinishTournaments.js';

export const getTournamentsData = async () => {
  console.log('Request for tournaments data');

  let options = {};
  options.redirect = 'follow';
  options.follow = 20;

  try {
    const response = await fetch(basePokeDataApiTournamentsUrl, options);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
      console.log('Empty data returned for tournaments');
      return;
    }
    const date = format(new Date(), 'Pp');

    // hack as some of the tournaments (mainly the ones in south america) are not auto updating from not-started to finished
    forceFinishTournaments.forEach(tournamentId => {
      const tournament = data.tcg.data.find(tournament => tournament.id === tournamentId);
      if (tournament) {
        tournament.tournamentStatus = 'finished';
      }
    });

    // hack for 0000132 as its not auto updating from not-started to finished
    // const tournament0000132 = data.tcg.data.find(tournament => tournament.id === '0000132');
    // if (tournament0000132) {
    //   tournament0000132.tournamentStatus = 'finished';
    // }
    // // hack for 0000137 as its not auto updating from running to finished
    // const tournament0000137 = data.tcg.data.find(tournament => tournament.id === '0000137');
    // if (tournament0000137) {
    //   tournament0000137.tournamentStatus = 'finished';
    // }

    // // turn 0000138 to running
    // const tournament0000138 = data.tcg.data.find(tournament => tournament.id === '0000138');
    // if (tournament0000138) {
    //   tournament0000138.tournamentStatus = 'running';
    // }

    const newData = {
      dataLastUpdated: date,
      ...data,
    };

    try {
      fs.writeFileSync(`${baseFolder}/tournaments.json`, JSON.stringify(newData, null, 4));
      console.log(`Tournaments Data updated at ${date} and file saved`);
    } catch (err) {
      console.error(err);
    }

    return newData;
  } catch (error) {
    console.error(error);
  }
};
