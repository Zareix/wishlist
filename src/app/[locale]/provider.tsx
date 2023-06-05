import { SessionProvider } from 'next-auth/react';
import PlausibleProvider from 'next-plausible';

import { TooltipProvider } from '@/components/ui/tooltip';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlausibleProvider domain="wishlist.raphael-catarino.fr">
      <SessionProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default Providers;
