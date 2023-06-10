'use client';

import { ItemCardLoading } from '@/components/ItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoadingHomePage = () => {
  return (
    <main>
      <h1>Wishlist</h1>
      <Tabs defaultValue="loading" className="mt-4" key="loading">
        <TabsList>
          <TabsTrigger value="loading" className="flex gap-1">
            <Skeleton className="h-5 w-16" />
          </TabsTrigger>
          <TabsTrigger value="loading1" className="flex gap-1">
            <Skeleton className="h-5 w-16" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="loading" className="mt-4">
          <ItemCardLoading />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default LoadingHomePage;
