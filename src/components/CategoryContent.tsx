'use client';

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
import {
  type Category,
  type ItemImage,
  type ItemLink,
  type WishlistItem,
} from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import ItemCard from '@/components/ItemCard';
import { updateOrder as updateOrderAction } from '@/utils/actions';

const CategoryContent = ({
  messages,
  items: initialItems,
  userId,
  categories,
}: {
  messages: Parameters<typeof ItemCard>[0]['messages'];
  items: (WishlistItem & {
    category: Category;
    images: ItemImage[];
    links: ItemLink[];
  })[];
  userId?: string;
  categories: Parameters<typeof ItemCard>[0]['categories'];
}) => {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [items, setItems] = useState(initialItems);

  const updateOrder = (ids: string[]) => {
    startTransition(() => {
      updateOrderAction(ids)
        .then(() => router.refresh())
        .catch(console.error);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      updateOrder(newItems.map((item) => item.id));
    }
  };

  return (
    <section className="mt-4 flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <ItemCard
              messages={messages}
              categories={categories}
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
