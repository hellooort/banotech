'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Package } from 'lucide-react';
import type { Product, Category } from '@/types/database';

interface ProductWithCat extends Product {
  categories?: Category;
}

interface SortableItemProps {
  product: ProductWithCat;
  isDragEnabled: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ product, isDragEnabled, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 border border-border bg-surface px-3 py-2.5 transition-shadow ${
        isDragging ? 'shadow-lg z-10 opacity-90' : ''
      }`}
    >
      {isDragEnabled && (
        <button
          type="button"
          className="cursor-grab touch-none text-muted hover:text-foreground shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
      )}

      <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-background">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <Package size={16} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
        {product.model_name && (
          <p className="text-xs text-muted truncate">{product.model_name}</p>
        )}
      </div>

      {product.categories?.name && (
        <span className="hidden sm:inline-block shrink-0 rounded bg-brand-light px-1.5 py-0.5 text-[10px] text-brand-dark truncate max-w-[120px]">
          {product.categories.name}
        </span>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(product.id)}
          className="p-1.5 text-muted hover:text-foreground transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="p-1.5 text-muted hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

interface ProductSortableListProps {
  products: ProductWithCat[];
  isDragEnabled: boolean;
  onReorder: (reordered: ProductWithCat[]) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductSortableList({
  products,
  isDragEnabled,
  onReorder,
  onEdit,
  onDelete,
}: ProductSortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const itemIds = useMemo(() => products.map((p) => p.id), [products]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...products];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered);
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted">
        등록된 제품이 없습니다
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {products.map((product) => (
            <SortableItem
              key={product.id}
              product={product}
              isDragEnabled={isDragEnabled}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
