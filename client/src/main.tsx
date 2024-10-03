import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FallbackLoader } from 'components/FallbackLoader';

import { RootLayout } from 'layouts/RootLayout';

import { FallbackRender } from 'errors/FallbackRender';
import { NotFound } from 'errors/NotFound';

import { Home } from 'pages/Home';
import {
  Tournament,
  tournamentLoader,
  TournamentOutlet,
} from 'pages/Tournament';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <FallbackRender />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'tournaments/:tournamentId',
        loader: tournamentLoader,
        element: <TournamentOutlet />,
        children: [{ index: true, element: <Tournament /> }],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// eslint-disable-next-line react-refresh/only-export-components -- ignore this one as it doesn't need to be refreshed
const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    d => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-gray-900 dark:text-gray-200">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<FallbackLoader />} />

        {import.meta.env.MODE === 'development' && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </div>
  </StrictMode>,
);
