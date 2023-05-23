import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import ItemCard, { ItemCardLoading } from '@/components/ItemCard';
import { api } from '@/utils/api';

const CategoryContent = ({
  categoryId,
  userId,
}: {
  categoryId: string;
  userId?: string;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const updateOrderMutation = api.wishlist.updateOrder.useMutation();
  const itemsQuery = api.wishlist.getAll.useQuery({
    categoryId,
    userId,
  });
  const [items, setItems] = useState(itemsQuery.data ?? []);

  useEffect(() => {
    if (itemsQuery.isSuccess) {
      setItems(itemsQuery.data ?? []);
    }
  }, [itemsQuery.isSuccess, itemsQuery.data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        updateOrderMutation
          .mutateAsync(newItems.map((item) => item.id))
          .then(() => itemsQuery.refetch())
          .catch(console.error);
        return newItems;
      });
    }
  };

  if (itemsQuery.isLoading)
    return (
      <section className=" justify-start">
        <ItemCardLoading />
      </section>
    );

  if (!itemsQuery.isSuccess || !itemsQuery.data || !items) return <></>;
  if (itemsQuery.data.length === 0) return <></>;

  return (
    <section className="mt-4 flex flex-wrap content-start gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <ItemCard
              item={item}
              key={item.id}
              canEdit={!userId}
              isDraggable={!userId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default CategoryContent;
