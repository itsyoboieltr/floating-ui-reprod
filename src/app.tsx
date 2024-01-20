// @refresh reload
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/solid-query';
import { edenTreaty } from '@elysiajs/eden';
import { clientEnv } from '~/utils/env/client';
import type { App } from './routes/api';
import './app.css';

export const app = edenTreaty<App>(clientEnv.HOST_URL);

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        placeholderData: (previousData: unknown) => previousData,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
    }),
  });
  return (
    <Router
      root={(props) => (
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      )}>
      <FileRoutes />
    </Router>
  );
}
