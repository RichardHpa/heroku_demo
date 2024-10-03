import type { LoaderFunctionArgs } from 'react-router-dom';

export const tournamentLoader = async ({ params }: LoaderFunctionArgs) => {
  const { tournamentId } = params;
  if (!tournamentId) {
    return {
      status: 404,
      error: new Error('Tournament not found'),
    };
  }

  return {
    tournamentId,
  };
};
