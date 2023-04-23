import ItemCard from '@/components/ItemCard';
import { api } from '@/utils/api';

const CategoryContent = ({
  categoryId,
  userId,
}: {
  categoryId: string;
  userId?: string;
}) => {
  const itemsQuery = api.wishlist.getAll.useQuery({
    categoryId,
    userId,
  });
  const items = itemsQuery.data;
  if (itemsQuery.isLoading) return <></>;
  if (!itemsQuery.isSuccess || !items) return <></>;
  if (items.length === 0) return <></>;

  return (
    <section className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <ItemCard
          item={item}
          key={item.id}
          refresh={() => {
            itemsQuery.refetch().catch(console.error);
          }}
        />
      ))}
    </section>
  );
};

export default CategoryContent;
