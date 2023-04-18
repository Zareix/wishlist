import { categoriesRouter } from '@/server/api/routers/categories';
import { wishlistRouter } from '@/server/api/routers/wishlist';
import { createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  wishlist: wishlistRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
