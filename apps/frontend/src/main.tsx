import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import FifoQueue from './FifoQueue';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <FifoQueue />
      </QueryClientProvider>
    </SnackbarProvider>
  </StrictMode>
);
