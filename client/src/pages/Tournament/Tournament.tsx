import { useTournamentContext } from 'context/TournamentContext';

import { Heading } from 'components/Heading';

export const Tournament = () => {
  const { tournament } = useTournamentContext();
  console.log(tournament);
  return (
    <div>
      <Heading level="4">{tournament.name}</Heading>

      <pre>{JSON.stringify(tournament, null, 2)}</pre>
    </div>
  );
};
