import { categoriesRouter } from '@/server/api/routers/categories';
import { usersRouter } from '@/server/api/routers/users';
import { wishlistRouter } from '@/server/api/routers/wishlist';
import { createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  wishlist: wishlistRouter,
  categories: categoriesRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
