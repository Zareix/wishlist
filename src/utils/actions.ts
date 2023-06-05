'use server';

import type { State } from '@prisma/client';

import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

export const changeItemState = ({
  id,
  state,
  categoryId,
}: {
  id: string;
  state?: State;
  categoryId?: string;
}) =>
  prisma.wishlistItem.update({
    where: {
      id: id,
    },
    data: {
      state: state,
      categoryId: categoryId,
      updatedAt: new Date(),
    },
  });

export const authorizeAccess = async ({ email }: { email: string }) => {
  const session = await getServerSideAuthSession();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      authorizeAccessTo: {
        connect: {
          id: user.id,
        },
      },
    },
  });
};

export const revokeAccess = async ({ userId }: { userId: string }) => {
  const session = await getServerSideAuthSession();
  return await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      authorizeAccessTo: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
};

export const changeCategoryVisibility = async ({
  categoryId,
  isPublic,
}: {
  categoryId: string;
  isPublic: boolean;
}) => {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      public: isPublic,
    },
  });
};
