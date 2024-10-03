import { Link } from 'react-router-dom';

import { useGetTournaments } from 'queries/useGetTournaments';

import { Heading } from 'components/Heading';

export const Home = () => {
  // write a block of code that should fail type checking to test npx tsc --noEmit
  const test = 'test';
  test = 1;
  console.log(test);

  const { data, isLoading, isError } = useGetTournaments();

  if (isLoading || !data) {
    return <div>Loading data...</div>;
  }

  // Test this to see if it hits the error boundary
  if (isError) {
    return <div>There was an error getting the data 7</div>;
  }

  return (
    <div>
      <Heading level="6">All tournaments</Heading>
      <div className="rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        {data.map(tournament => (
          <Link
            key={tournament.id}
            to={`/tournaments/${tournament.id}`}
            className="block w-full cursor-pointer border-b border-gray-200 px-4 py-4 hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
          >
            {tournament.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
