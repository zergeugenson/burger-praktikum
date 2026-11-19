import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { DND_TYPES } from '@utils/dnd';

import type { TIngredient } from '@/utils/api';
import { type ReactNode, useCallback, type RefCallback } from 'react';

import styles from './ingredients-item.module.css';

type TIngredientsItemProps = {
  ingredient: TIngredient | null;
  counter: number | null;
  onClick: () => void;
};

export const IngredientsItem = ({
  ingredient,
  counter,
  onClick,
}: TIngredientsItemProps): ReactNode => {
  const [, dragRef] = useDrag(
    () => ({
      type: DND_TYPES.BUN,
      item: { ingredient },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(), //true, пока висит
      }),
    }),
    [ingredient]
  );
  const setDragRef = useCallback<RefCallback<HTMLLIElement>>(
    (node) => {
      if (node) {
        dragRef(node);
      }
    },
    [dragRef]
  );

  return (
    <li className={styles.container} ref={setDragRef} onClick={() => onClick()}>
      <article className={styles.card} tabIndex={0}>
        <div className={styles.imageContainer}>
          {counter != null && counter > 0 && (
            <Counter count={counter} extraClass={styles.counter} size="default" />
          )}
          <img src={ingredient?.image} className={styles.image} alt={ingredient?.name} />
        </div>
        <div className={styles.price}>
          <span className="text_type_digits-default text">{ingredient?.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <div className={`${styles.name} text_type_main-default text`}>
          {ingredient?.name}
        </div>
      </article>
    </li>
  );
};
