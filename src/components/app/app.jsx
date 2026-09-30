import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { closeModal } from '@/services/modal/modal-slice.js';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { getIngredients } from '@services/ingredients/ingredients-actions.js';
import { selectIngredientsIsLoading } from '@services/ingredients/ingredients-slice.js';
import {
  clearOrder,
  selectOrderIsLoading,
  selectOrderNumber,
} from '@services/order/order-slice.js';

import { OrderDetails } from '../burger-constructor/order-details/order-details.jsx';
import { IngredientDetails } from '../burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '../modal/modal.jsx';

import styles from './app.module.css';

export const App = () => {
  const isOrderLoading = useSelector(selectOrderIsLoading);
  const isIngredientLoading = useSelector(selectIngredientsIsLoading);
  const modalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const isOpen = modalState.type !== null;
  const isLoading = isOrderLoading || isIngredientLoading;
  const orderNumber = useSelector(selectOrderNumber);

  useEffect(() => {
    dispatch(getIngredients());
  }, []);

  const handleCloseModal = () => {
    dispatch(closeModal());
    if (modalState.type === 'orderDetails') {
      dispatch(clearOrder());
    }
  };

  return (
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </main>
        {isOpen && !isLoading && (
          <Modal close={() => handleCloseModal()} title={modalState.title}>
            {modalState.type === 'orderDetails' && (
              <OrderDetails OrderId={orderNumber} />
            )}
            {modalState.type === 'ingredientDetails' && (
              <IngredientDetails ingredient={modalState.data} />
            )}
          </Modal>
        )}
      </div>
  );
};
