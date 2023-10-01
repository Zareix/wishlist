import { prisma } from '@/server/db';

export const getCategories = (userId: string, onlyPublic?: boolean) =>
  prisma.category.findMany({
    where: {
      userId,
      parentCategoryId: null,
      public: onlyPublic,
    },
    include: {
      subCategories: {
        where: {
          public: onlyPublic,
        },
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
