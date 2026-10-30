import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, type ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { type TConstructorIngredient } from '@services/burger-constructor/burger-constructor-slice';

import { DND_TYPES } from '@utils/dnd';

type TConstructorElementsProps = {
  ingredient: TConstructorIngredient;
  index: number;
  moveIngredient: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (uid: string) => void;
  styles: Record<string, string>;
};

type TConstructorDragItem = {
  id: string;
  index: number;
};

type TDragCollected = {
  isDragging: boolean;
};

export const ConstructorElements = ({
  ingredient,
  index,
  moveIngredient,
  removeItem,
  styles,
}: TConstructorElementsProps): ReactNode => {
  const dragRef = useRef<HTMLLIElement | null>(null);

  const [, drop] = useDrop<TConstructorDragItem, void, unknown>({
    accept: DND_TYPES.CONSTRUCTOR_ITEM,
    hover: (item, monitor) => {
      if (!dragRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dragRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<TConstructorDragItem, void, TDragCollected>({
    type: DND_TYPES.CONSTRUCTOR_ITEM,
    item: () => ({ id: ingredient.uid, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(dragRef));
  const opacity = isDragging ? 0.3 : 1;

  return (
    <li className={styles.tops} ref={dragRef} style={{ opacity }}>
      <DragIcon type="primary" />
      <ConstructorElement
        extraClass={styles.elem}
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
        handleClose={() => removeItem(ingredient.uid)}
      />
    </li>
  );
};
