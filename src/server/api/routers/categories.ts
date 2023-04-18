import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.session.user.id,
        parentCategoryId: null,
      },
      include: {
        subCategories: {
          include: {
            _count: {
              select: {
                wishlistItems: true,
              },
            },
          },
        },
        _count: {
          select: {
            wishlistItems: true,
          },
        },
      },
    });
  }),
  getOne: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.category.findUnique({
      where: {
        id: input,
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
    .input(
      z.object({
        name: z.string(),
        parentCategoryId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        await ctx.prisma.category.findFirst({
          where: {
            name: input.name,
            userId: ctx.session.user.id,
          },
        })
      ) {
        throw new Error('Category already exists');
      }
      return ctx.prisma.category.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          parentCategoryId: input.parentCategoryId,
        },
      });
    }),
});
