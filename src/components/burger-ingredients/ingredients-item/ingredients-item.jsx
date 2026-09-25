import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { DND_TYPES } from '@utils/dnd';

import styles from './ingredients-item.module.css';

export const IngredientsItem = ({ ingredient, counter, onClick }) => {
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

  return (
    <li className={styles.container} ref={dragRef} onClick={() => onClick()}>
      <article className={styles.card} tabIndex={0}>
        <div className={styles.imageContainer}>
          {counter > 0 && (
            <Counter count={counter} extraClass={styles.counter} size="default" />
          )}
          <img src={ingredient.image} className={styles.image} alt={ingredient.name} />
        </div>
        <div className={styles.price}>
          <span className="text_type_digits-default text">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <div className={`${styles.name} text_type_main-default text`}>
          {ingredient.name}
        </div>
      </article>
    </li>
  );
};
