import { Archive, Home, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen bg-neutral-100">{children}</main>
      <nav className="fixed inset-x-10 bottom-4 flex items-center justify-center space-x-4 rounded-full bg-white py-2">
        <Link href="/">
          <Button variant="link">
            <Home />
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <Link href="/add">
          <Button variant="link">
            <Plus />
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-6" />
        <Link href="/archive">
          <Button variant="link">
            <Archive />
          </Button>
        </Link>
      </nav>
    </>
  );
};

export default Layout;
