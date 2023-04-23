import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().optional().nullable(),
        })
        .default({}),
    )
    .query(({ ctx, input }) => {
      if (input.userId) {
        if (
          !ctx.session.user.hasAccessTo?.find(
            (user) => user.id === input.userId,
          )
        ) {
          throw new Error('Access denied');
        }
        return ctx.prisma.category.findMany({
          where: {
            userId: input.userId,
            parentCategoryId: null,
            public: true,
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
              where: {
                public: true,
              },
            },
            _count: {
              select: {
                wishlistItems: true,
              },
            },
          },
        });
      }
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
  changeVisibility: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          public: input.isPublic,
        },
      });
    }),
});
