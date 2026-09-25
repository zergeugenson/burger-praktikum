import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import cn from 'clsx';
import { useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import { BurgerContext } from '@/context';
import { useOrder } from '@hooks/useOrder.js';
import { DND_TYPES } from '@utils/dnd';

import { OrderDetails } from '../burger-constructor/order-details/order-details.jsx';
import { ConstructorElements } from './constructor-elements/constructor-elements.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const { order, counts, addItem, removeItem, totalPrice, moveIngredient } = useOrder();
  const { setSharedCounter } = useContext(BurgerContext);
  const { setOpenModal } = useContext(BurgerContext);

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: [DND_TYPES.BUN, DND_TYPES.ELEMENTS],
      drop: (item) => {
        addItem(item.ingredient);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(), // true, если над зоной
        canDrop: !!monitor.canDrop(), // true, если тип совпадает с accept
      }),
    }),
    []
  );

  let borderColor = '#333';
  if (canDrop && isOver) borderColor = 'blue';
  else if (canDrop) borderColor = '#777';

  useEffect(() => {
    setSharedCounter(counts);
  }, [counts]);

  const makeOrder = () => {
    setOpenModal({
      isopen: true,
      data: <OrderDetails OrderId={999} />,
      title: null,
    });
  };

  return (
    <section className={styles.burgerConstructor}>
      {order.length}
      <div
        className={styles.container}
        ref={dropRef}
        style={{
          minHeight: '150px',
          padding: '20px',
          border: '2px dashed gray',
          borderRadius: '8px',
          borderColor,
          transition: 'border-color 0.2s ease',
        }}
      >
        <div className={styles.bun}>
          <ConstructorElement
            extraClass={cn(styles.element, { [styles.empty]: !order?.bun?.name })}
            isLocked
            price={order?.bun?.price || ''}
            text={order?.bun?.name ? `${order?.bun?.name} (верх)` : ''}
            thumbnail={order?.bun?.image ? order?.bun?.image : null}
            type="top"
          />
        </div>

        <div className={`${styles.ingredients} custom-scroll`}>
          {order.ingredients.map((ingredient, index) => (
            <ConstructorElements
              key={ingredient.uid}
              ingredient={ingredient}
              index={index}
              moveIngredient={moveIngredient} // передаем функцию из хука
              removeItem={removeItem}
              styles={styles}
            />
          ))}
        </div>

        <div className={styles.bun}>
          <ConstructorElement
            extraClass={cn(styles.element, { [styles.empty]: !order?.bun?.name })}
            isLocked
            price={order?.bun?.price || ''}
            text={order?.bun?.name ? `${order?.bun?.name} (низ)` : ''}
            thumbnail={order?.bun?.image ? order?.bun?.image : null}
            type="bottom"
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.totalPrice}>
          <span className="text_type_digits-medium text">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          size="large"
          type="primary"
          onClick={() => makeOrder()}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
