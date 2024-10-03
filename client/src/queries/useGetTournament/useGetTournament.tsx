import { useQuery } from '@tanstack/react-query';

import { getTournament } from 'api/getTournament';

export const useGetTournamentKey = (tournamentId: string) => [
  'tournaments',
  tournamentId,
];

export const useGetTournament = (tournamentId: string | number) => {
  const parsedTournamentId = tournamentId.toString();
  return useQuery({
    queryKey: useGetTournamentKey(parsedTournamentId),
    queryFn: () => getTournament(parsedTournamentId),
    select: data => {
      return {
        tournament: data.tournament,
        divisions: data.tournament_data,
      };
    },
  });
};
