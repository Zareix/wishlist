import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        _count: {
          select: {
            wishlistItems: true,
          },
        },
      },
    });
  }),
  getOne: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        wishlistItems: {
          include: {
            images: true,
            links: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (
        (
          await ctx.prisma.category.findMany({
            where: {
              name: input,
              userId: ctx.session.user.id,
            },
          })
        ).length > 0
      ) {
        throw new Error('Category already exists');
      }
      return ctx.prisma.category.create({
        data: {
          name: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
