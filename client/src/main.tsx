import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import {
  createBrowserRouter,
  RouterProvider,
  // ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';

import './index.css';

function FallbackRender() {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <div
      id="error-page"
      className="flex h-screen flex-col items-center justify-center gap-8"
    >
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-red-400">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <FallbackRender />,
  },
]);

const Fallback = () => (
  <div>
    <h1>Loading...</h1>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ErrorBoundary fallbackRender={fallbackRender}> */}
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
    <RouterProvider router={router} fallbackElement={<Fallback />} />
    {/* </ErrorBoundary> */}
  </StrictMode>,
);
