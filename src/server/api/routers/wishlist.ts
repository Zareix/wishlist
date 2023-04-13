import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const wishlistRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wishlistItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const item = await ctx.prisma.wishlistItem.findUnique({
      where: {
        id: input,
      },
    });
    if (!item || item.userId !== ctx.session.user.id) {
      throw new Error('Item not found');
    }
    return item;
  }),
});
