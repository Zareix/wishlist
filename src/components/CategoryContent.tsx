import { useSession } from 'next-auth/react';

import ItemCard, { ItemCardLoading } from '@/components/ItemCard';
import { api } from '@/utils/api';

const CategoryContent = ({
  categoryId,
  userId,
}: {
  categoryId: string;
  userId?: string;
}) => {
  const session = useSession();
  const itemsQuery = api.wishlist.getAll.useQuery({
    categoryId,
    userId,
  });
  const items = itemsQuery.data;
  if (itemsQuery.isLoading)
    return (
      <section className="mt-4 flex flex-wrap gap-2">
        <ItemCardLoading />
      </section>
    );

  if (!itemsQuery.isSuccess || !items) return <></>;
  if (items.length === 0) return <></>;

  return (
    <section className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <ItemCard
          item={item}
          key={item.id}
          canEdit={session.data?.user.id === userId}
        />
      ))}
    </section>
  );
};

export default CategoryContent;
