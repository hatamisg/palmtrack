"use client";

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GardensProvider } from './context/GardensContext';
import { isSupabaseConfigured } from './supabase/client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient instance with optimized settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh longer
        gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
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
