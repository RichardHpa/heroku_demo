import { axios } from 'helpers/axios';

import type { TournamentApiResponse } from 'types/tournament';

export const getTournament = async (
  id: string,
): Promise<TournamentApiResponse> => {
  try {
    const response = await axios.get(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch tournament');
  }
};
