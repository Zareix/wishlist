import ItemCard from '@/components/ItemCard';
import { getTranslation } from '@/i18n';
import { getServerSideAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

export const dynamic = 'force-dynamic';

const ArchivePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const { t } = await getTranslation(locale, 'archive');
  const { t: tItemCard } = await getTranslation(locale, 'itemCard');

  const items = (
    await prisma.wishlistItem.findMany({
      where: {
        state: {
          in: ['BOUGHT', 'CANCELED'],
        },
      },
      include: {
        links: true,
        images: true,
        category: true,
      },
    })
  ).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const categories = await prisma.category.findMany({
    where: {
      userId: (await getServerSideAuthSession())?.user.id,
      parentCategoryId: null,
    },
    include: {
      subCategories: true,
    },
  });

  return (
    <main>
      <h1>{t('title')}</h1>
      <section className="mt-4 grid gap-2 lg:grid-cols-2">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            messages={{
              actions: {
                archive: tItemCard('actions.archive'),
                dialogClose: tItemCard('actions.dialogClose'),
                edit: tItemCard('actions.edit'),
                move: tItemCard('actions.move'),
                on: tItemCard('actions.on', {
                  date: new Date(item.updatedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                }),
                restore: tItemCard('actions.restore'),
                restoreIn: tItemCard('actions.restoreIn', {
                  category: item.category.name,
                }),
                validate: tItemCard('actions.validate'),
              },
            }}
            item={item}
            categories={categories}
            canEdit
            isDraggable={false}
          />
        ))}
      </section>
    </main>
  );
};

export default ArchivePage;
