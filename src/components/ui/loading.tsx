import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/ui';

const Loading = ({ className }: { className?: string }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);
const LoadingFullPage = () => {
  return (
    <main className="grid place-content-center">
      <Loader2 className="animate-spin" />
    </main>
  );
};

export { Loading, LoadingFullPage };
