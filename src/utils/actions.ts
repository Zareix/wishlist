'use server';

import { type EnumCurrency, type State } from '@prisma/client';

import { getServerActionSession } from '@/server/auth';
import { prisma } from '@/server/db';

import { amazonProductCrawler, citadiumProductCrawler } from './crawler';

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
  const session = await getServerActionSession();
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
  const session = await getServerActionSession();
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

export const crawlUrl = async ({ url }: { url: string }) => {
  if (url.startsWith('https://www.amazon')) {
    return amazonProductCrawler(url);
  }

  if (url.startsWith('https://www.citadium.com')) {
    return citadiumProductCrawler(url);
  }

  return;
};

export const addWishlistItem = async ({
  id,
  name,
  price,
  currency,
  categoryId,
  images,
  links,
}: {
  id?: string;
  name: string;
  price?: number;
  currency: EnumCurrency;
  categoryId: string;
  images: {
    image: string;
  }[];
  links: {
    name?: string;
    price?: number;
    link: string;
  }[];
}) => {
  const session = await getServerActionSession();
  if (!session) {
    throw new Error('User not found');
  }
  if (id) {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        id: id,
      },
      include: {
        links: true,
        images: true,
      },
    });
    if (!item || item.userId !== session.user.id) {
      throw new Error('Item not found');
    }
    await prisma.itemLink.deleteMany({
      where: {
        wishlistItemId: id,
      },
    });
    await prisma.itemImage.deleteMany({
      where: {
        wishlistItemId: id,
      },
    });
    return await prisma.wishlistItem.update({
      where: {
        id: id,
      },
      data: {
        userId: session?.user.id,
        name: name,
        price: price,
        currency: currency,
        links: {
          create: links.map((link) => ({
            link: link.link,
            price: link.price,
            name:
              link.name && link.name !== ''
                ? link.name
                : new URL(link.link).hostname.replace('www.', ''),
          })),
        },
        images: {
          create: images.map((image) => ({
            image: image.image,
          })),
        },
        categoryId: categoryId,
      },
    });
  }

  const item = await prisma.wishlistItem.create({
    data: {
      userId: session.user.id,
      name: name,
      price: price,
      currency: currency,
      links: {
        create: links.map((link) => ({
          ...link,
          name:
            link.name && link.name !== ''
              ? link.name
              : new URL(link.link).hostname.replace('www.', ''),
        })),
      },
      images: {
        create: images,
      },
      categoryId,
    },
  });
  return item;
};

export const updateOrder = (ids: string[]) =>
  prisma.$transaction(
    ids.map((id, index) =>
      prisma.wishlistItem.update({
        where: {
          id,
        },
        data: {
          order: index,
        },
      }),
    ),
  );

export const addCategory = async ({
  name,
  parentCategoryId,
}: {
  name: string;
  parentCategoryId: string | null;
}) => {
  const session = await getServerActionSession();
  if (
    await prisma.category.findFirst({
      where: {
        name: name,
        userId: session?.user.id,
      },
    })
  ) {
    throw new Error('Category already exists');
  }
  return prisma.category.create({
    data: {
      name: name,
      userId: session?.user.id ?? '',
      parentCategoryId: parentCategoryId,
    },
  });
};
