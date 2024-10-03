import { useQuery } from '@tanstack/react-query';

import { getTournaments } from 'api/getTournaments';

export const useGetTournamentsKey = () => ['tournaments'];

export const useGetTournaments = () => {
  return useQuery({
    queryKey: useGetTournamentsKey(),
    queryFn: getTournaments,
    select: data => {
      return data.tcg.data;
    },
  });
};
