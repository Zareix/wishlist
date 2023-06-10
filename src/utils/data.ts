import { prisma } from '@/server/db';

export const getCategories = (userId: string) =>
  prisma.category.findMany({
    where: {
      userId,
      parentCategoryId: null,
    },
    include: {
      subCategories: {
        include: {
          wishlistItems: {
            include: {
              images: true,
              links: true,
            },
            where: {
              state: 'ACTIVE',
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
      wishlistItems: {
        include: {
          images: true,
          links: true,
        },
        where: {
          state: 'ACTIVE',
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
