import { createContext, useContext } from 'react';

import { useGetTournament } from 'queries/useGetTournament';

import type { ReactNode } from 'react';
import type { TournamentApiResponse } from 'types/tournament';

interface TournamentContextProps {
  tournament: TournamentApiResponse['tournament'];
  divisions: TournamentApiResponse['tournament_data'];
}

const TournamentContext = createContext<TournamentContextProps | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useTournamentContext = () => {
  const currentUser = useContext(TournamentContext);
  if (!currentUser) {
    throw new Error('TournamentContext: No value provided');
  }

  return currentUser;
};

export const TournamentContextProvider = ({
  children,
  tournamentId,
}: {
  children: ReactNode;
  tournamentId: string | number;
}) => {
  const tournamentQuery = useGetTournament(tournamentId);

  if (tournamentQuery.isPending) {
    return 'Loading...';
  }

  if (tournamentQuery.isError) {
    return `There was an error: ${tournamentQuery.error}`;
  }

  return (
    <TournamentContext.Provider value={tournamentQuery.data}>
      {children}
    </TournamentContext.Provider>
  );
};
