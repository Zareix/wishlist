import ItemCard from '@/components/ItemCard';
import { api } from '@/utils/api';

const CategoryContent = ({ categoryId }: { categoryId: string }) => {
  const itemsQuery = api.wishlist.getAll.useQuery({
    categoryId,
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
