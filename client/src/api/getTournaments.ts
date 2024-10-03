import { axios } from 'helpers/axios';

import type { TournamentsApiResponse } from 'types/tournament';

export const getTournaments = async (): Promise<TournamentsApiResponse> => {
  try {
    const response = await axios.get('/tournaments');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch tournaments');
  }
};
