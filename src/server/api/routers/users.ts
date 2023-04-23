import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getAuthorizedAccessTo: protectedProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          authorizeAccessTo: true,
        },
      })
    )?.authorizeAccessTo;
  }),
  authorizeAccess: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          authorizeAccessTo: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
  revokeAccess: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          authorizeAccessTo: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
    }),
});
