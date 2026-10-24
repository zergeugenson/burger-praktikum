import styles from './home.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { OrderDetails } from '@components/burger-constructor/order-details/order-details.jsx';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal.jsx';
import { selectIngredientsIsLoading } from '@services/ingredients/ingredients-slice.js';
import { closeModal } from '@services/modal/modal-slice.js';
import {
  clearOrder,
  selectOrderIsLoading,
  selectOrderNumber,
  selectOrderError,
} from '@services/order/order-slice.js';

export const Home = () => {
  const isOrderLoading = useSelector(selectOrderIsLoading);
  const orderError = useSelector(selectOrderError);
  const isIngredientLoading = useSelector(selectIngredientsIsLoading);
  const modalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const isOpen = modalState.type !== null;
  const isLoading = isOrderLoading || isIngredientLoading;
  const orderNumber = useSelector(selectOrderNumber);

  const handleCloseModal = () => {
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
          {orderError && (<p className="text text_type_main-default text_color_error mt-6">{orderError}</p>)}
          {!orderError && modalState.type === 'orderDetails' && <OrderDetails OrderId={orderNumber} />}
        </Modal>
      )}
    </>
  );
};
