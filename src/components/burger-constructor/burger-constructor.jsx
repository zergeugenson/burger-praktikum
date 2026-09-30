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
import { DND_TYPES } from '@utils/dnd';
import { ConstructorElements } from './constructor-elements/constructor-elements.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '@services/order/order-actions.js';
import { openModal, MODAL_TYPES } from '@/services/modal/modal-slice.js';
import { clearOrder } from '@/services/order/order-slice.js';
import {
    selectOrder,
    selectCounts,
    selectTotalPrice,
    addItem,
    removeItem,
    moveIngredient,
    clearConstructor,
} from '@services/burger-constructor/burger-constructor-slice.js';

export const BurgerConstructor = () => {
    const dispatch = useDispatch();
    const { setSharedCounter } = useContext(BurgerContext);
    const order = useSelector(selectOrder);
    const counts = useSelector(selectCounts);
    const totalPrice = useSelector(selectTotalPrice);
    const handleAdd = (item) => {
        dispatch(addItem(item));
    };

    const handleRemove = (uid) => {
        dispatch(removeItem(uid));
    };

    const handleMove = (dragIndex, hoverIndex) => {
        dispatch(moveIngredient({ dragIndex, hoverIndex }));
    };

    useEffect(() => {
        setSharedCounter(counts);
    }, [counts]);

      const [{ isOver, canDrop }, dropRef] = useDrop(
        () => ({
          accept: [DND_TYPES.BUN, DND_TYPES.ELEMENTS],
          drop: (item) => {
              handleAdd(item.ingredient);
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

        dispatch(clearConstructor());
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
                            moveIngredient={handleMove} // передаем функцию из хука
                            removeItem={handleRemove}
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
