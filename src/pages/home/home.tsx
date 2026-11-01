import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { OrderDetails } from '@components/burger-constructor/order-details/order-details';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { selectIngredientsIsLoading } from '@services/ingredients/ingredients-slice';
import { closeModal } from '@services/modal/modal-slice';
import {
  clearOrder,
  selectOrderIsLoading,
  selectOrderNumber,
  selectOrderError,
} from '@services/order/order-slice';
import type { ReactNode } from 'react';
import styles from './home.module.css';

export const Home = (): ReactNode => {
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const orderError = useAppSelector(selectOrderError);
  const isIngredientLoading = useAppSelector(selectIngredientsIsLoading);
  const modalState = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const isOpen = modalState.type !== null;
  const isLoading = isOrderLoading || isIngredientLoading;
  const orderNumber = useAppSelector(selectOrderNumber);

  const handleCloseModal = (): void => {
    dispatch(closeModal());
    if (modalState.type === 'orderDetails') {
      dispatch(clearOrder());
    }
  };

  return (
    <>
      <BurgerIngredients />
      <BurgerConstructor />
      {isOpen && isLoading && (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      )}
      {isOpen && !isLoading && (
        <Modal close={() => handleCloseModal()} title={modalState.title}>
          {orderError && (
            <p className="text text_type_main-default text_color_error mt-6">
              {orderError}
            </p>
          )}
          {!orderError && modalState.type === 'orderDetails' && (
            <OrderDetails orderId={orderNumber} />
          )}
        </Modal>
      )}
    </>
  );
};
