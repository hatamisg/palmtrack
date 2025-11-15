"use client";

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GardensProvider } from './context/GardensContext';
import { isSupabaseConfigured } from './supabase/client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  // Determine whether to use Supabase
  const envUseSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE;
  const useSupabase = envUseSupabase !== undefined
    ? envUseSupabase === 'true'
    : isSupabaseConfigured();

  return (
    <QueryClientProvider client={queryClient}>
      <GardensProvider useSupabase={useSupabase}>
        {children}
      </GardensProvider>
    </QueryClientProvider>
  );
}
