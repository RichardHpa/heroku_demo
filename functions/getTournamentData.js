// This function fetches the data for a single tournament and saves it to a file
import fs from 'fs';
import { format } from 'date-fns';

import { basePokeDataApiFullTournamentUrl, tournamentsFolder } from '../constants/folders.js';

export const getTournamentData = async tournamentId => {
  console.log(`Request for tournament ${tournamentId}`);
  const url = `${basePokeDataApiFullTournamentUrl}/${tournamentId}`;
  let options = {};
  options.redirect = 'follow';
  options.follow = 20;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (Object.keys(data).length === 0) {
      console.log(`Empty data returned for tournament ${tournamentId}`);
      return;
    }

    const date = format(new Date(), 'Pp');

    // hack for 0000132 as its not auto updating to running
    if (tournamentId === '0000132') {
      data.tournament.tournamentStatus = 'finished';
    }

    const newData = {
      dataLastUpdated: date,
      ...data,
    };

    try {
      fs.writeFileSync(
        `${tournamentsFolder}/${tournamentId}.json`,
        JSON.stringify(newData, null, 4)
      );
      console.log(`Data for ${tournamentId} updated at ${date} and file saved`);
    } catch (err) {
      console.error(err);
    }

    return newData;
  } catch (error) {
    console.error(error);
  }
};
