import path from 'path';

const __dirname = path.resolve();
export const baseFolder = `${__dirname}/data`;
export const tournamentsFolder = `${baseFolder}/tournaments`;

export const basePokeDataApiFullTournamentUrl = `https://www.pokedata.ovh/apiv2/division/masters+juniors+seniors/tcg/id`;
export const basePokeDataApiTournamentsUrl = 'https://www.pokedata.ovh/apiv2/tcg/tournaments';
