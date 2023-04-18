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
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard
            item={item}
            refresh={() => {
              itemsQuery.refetch().catch(console.error);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default CategoryContent;
