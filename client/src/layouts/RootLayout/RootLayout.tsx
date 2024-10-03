import { Outlet, ScrollRestoration, Link } from 'react-router-dom';

import { Heading } from 'components/Heading';

export const RootLayout = () => {
  return (
    <div className="container mx-auto flex flex-grow flex-col gap-4 px-4 py-12">
      <Link to="/" className="inline-flex">
        <Heading className="hover:underline">PTCG Standings Demo</Heading>
      </Link>
      <ScrollRestoration />
      <div>
        <Outlet />
      </div>
    </div>
  );
};
