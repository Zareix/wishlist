import { EnumCurrency, State as EnumState } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const wishlistRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const item = await ctx.prisma.wishlistItem.findUnique({
      where: {
        id: input,
      },
      include: {
        links: true,
        images: true,
      },
    });
    if (!item || item.userId !== ctx.session.user.id) {
      throw new Error('Item not found');
    }
    return item;
  }),
  getAll: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        states: z
          .array(
            z.enum(
              Object.keys(EnumState) as unknown as readonly [
                EnumState,
                ...EnumState[],
              ],
            ),
          )
          .default([EnumState.ACTIVE]),
        includeCategory: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.wishlistItem.findMany({
        where: {
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
          state: {
            in: input.states,
          },
        },
        include: {
          links: true,
          images: true,
          category: input.includeCategory,
        },
      });
    }),
  add: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        price: z.number().optional(),
        currency: z.enum(
          Object.keys(EnumCurrency) as unknown as readonly [
            EnumCurrency,
            ...EnumCurrency[],
          ],
        ),
        links: z.array(
          z.object({
            name: z.string().optional(),
            link: z.string(),
            price: z.number().optional(),
          }),
        ),
        images: z.array(
          z.object({
            image: z.string(),
          }),
        ),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        const item = await ctx.prisma.wishlistItem.findUnique({
          where: {
            id: input.id,
          },
          include: {
            links: true,
            images: true,
          },
        });
        if (!item || item.userId !== ctx.session.user.id) {
          throw new Error('Item not found');
        }
        await ctx.prisma.itemLink.deleteMany({
          where: {
            wishlistItemId: input.id,
          },
        });
        await ctx.prisma.itemImage.deleteMany({
          where: {
            wishlistItemId: input.id,
          },
        });
        return await ctx.prisma.wishlistItem.update({
          where: {
            id: input.id,
          },
          data: {
            userId: ctx.session.user.id,
            name: input.name,
            price: input.price,
            currency: input.currency,
            links: {
              create: input.links.map((link) => ({
                ...link,
                name:
                  link.name && link.name !== ''
                    ? link.name
                    : new URL(link.link).hostname.replace('www.', ''),
              })),
            },
            images: {
              create: input.images,
            },
            categoryId: input.categoryId,
          },
        });
      }

      const item = await ctx.prisma.wishlistItem.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          price: input.price,
          currency: input.currency,
          links: {
            create: input.links.map((link) => ({
              ...link,
              name:
                link.name && link.name !== ''
                  ? link.name
                  : new URL(link.link).hostname.replace('www.', ''),
            })),
          },
          images: {
            create: input.images,
          },
          categoryId: input.categoryId,
        },
      });
      return item;
    }),
  changeState: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        state: z
          .enum(
            Object.keys(EnumState) as unknown as readonly [
              EnumState,
              ...EnumState[],
            ],
          )
          .optional(),
        categoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.wishlistItem.update({
        where: {
          id: input.id,
        },
        data: {
          state: input.state,
          categoryId: input.categoryId,
          updatedAt: new Date(),
        },
      });
    }),
});
