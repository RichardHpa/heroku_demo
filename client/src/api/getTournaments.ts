import { axios } from 'helpers/axios';

import type { TournamentsApiResponse } from 'types/tournament';

export const getTournaments = async (): Promise<TournamentsApiResponse> => {
  try {
    const response = await axios.get('/api/tournaments');

    const tournaments = response.data.tcg.data;
    const reversedTournaments = tournaments.reverse();

    return {
      ...response.data,
      tcg: {
        ...response.data.tcg,
        data: reversedTournaments,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch tournaments');
  }
};
