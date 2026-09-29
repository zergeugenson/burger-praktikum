import styles from './burger-constructor.module.css';
import cn from 'clsx';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useContext, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { BurgerContext } from '@/contexts';
import { useOrder } from '@hooks/useOrder.js';
import { DND_TYPES } from '@utils/dnd';
import { ConstructorElements } from './constructor-elements/constructor-elements.jsx';
import { useDispatch } from 'react-redux';
import { createOrder } from '@services/order/order-actions.js';
import { openModal, MODAL_TYPES } from '@/services/modal/modal-slice.js';





export const BurgerConstructor = () => {
    const dispatch = useDispatch();
    const { order, counts, addItem, removeItem, totalPrice, moveIngredient } = useOrder();
    const { setSharedCounter } = useContext(BurgerContext);

    useEffect(() => {
        setSharedCounter(counts);
    }, [counts]);

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

    const makeOrder = useCallback(() => {
        if (!order.bun) return null;
        dispatch(createOrder(
            [
                order.bun._id,
                ...order.ingredients.map((ingredient) => ingredient._id),
                order.bun._id,
            ]
        ));
        dispatch(openModal({
            type: MODAL_TYPES.ORDER_DETAILS,
        }));
    }, [dispatch, order]);

    let borderColor = '#333';
    if (canDrop && isOver) borderColor = 'blue';
    else if (canDrop) borderColor = '#777';

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
