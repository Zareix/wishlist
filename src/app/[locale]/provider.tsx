'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import PlausibleProvider from 'next-plausible';
import { useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <PlausibleProvider domain="wishlist.raphael-catarino.fr">
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default Providers;
