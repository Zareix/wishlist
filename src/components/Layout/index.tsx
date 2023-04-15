import { Archive, Home, LogOut, Plus } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession();

  const logout = () => {
    signOut().catch(console.error);
  };

  return (
    <>
      <div className="container mx-auto lg:ml-[18vw] lg:max-w-4xl xl:max-w-5xl">
        {children}
      </div>
      {data?.user && (
        <>
          <nav className="fixed inset-y-4 left-2 right-auto hidden w-[15vw] flex-col border-r pl-2 lg:flex">
            <Link href="/">
              <Button variant="link">
                <Home className="mr-2" /> Home
              </Button>
            </Link>
            <Link href="/add">
              <Button variant="link">
                <Plus className="mr-2" /> Add new
              </Button>
            </Link>
            <Link href="/archive">
              <Button variant="link">
                <Archive className="mr-2" /> Archive
              </Button>
            </Link>
            <Button variant="link" onClick={logout} className="mr-auto">
              <LogOut className="mr-2" /> Log out
            </Button>
          </nav>
          <nav className="fixed inset-x-4 bottom-4 mx-auto flex max-w-sm items-center justify-center space-x-4 rounded-full bg-neutral-50 py-2 shadow-sm dark:border dark:border-slate-700 dark:bg-slate-950 lg:hidden">
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
            <Separator orientation="vertical" className="h-6" />
            <Button variant="link" onClick={logout}>
              <LogOut />
            </Button>
          </nav>
        </>
      )}
    </>
  );
};

export default Layout;
