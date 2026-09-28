import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { DND_TYPES } from '@utils/dnd';

import styles from './constructor-elements.module.css';

export const ConstructorElements = ({
  ingredient,
  index,
  moveIngredient,
  removeItem,
}) => {
  const dragRef = useRef(null);

  const [, drop] = useDrop({
    accept: DND_TYPES.CONSTRUCTOR_ITEM,
    hover: (item, monitor) => {
      if (!dragRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dragRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveIngredient(dragIndex, hoverIndex);
      item.index = hoverIndex;
      return false;
    },
  });

  const [{ isDragging }, drag] = useDrag({
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
        key={ingredient.uid}
        index={index}
        extraClass={styles.elem}
        price={ingredient?.price}
        text={ingredient?.name}
        thumbnail={ingredient?.image}
        handleClose={() => removeItem(ingredient.uid)}
      />
    </li>
  );
};
