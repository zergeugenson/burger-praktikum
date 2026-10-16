import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import {useEffect} from "react";
import {getIngredients} from "@services/ingredients/ingredients-actions.js";
import {useDispatch, useSelector} from "react-redux";
import {Modal} from "@components/modal/modal.jsx";
import {OrderDetails} from "@components/burger-constructor/order-details/order-details.jsx";
import {IngredientDetails} from "@components/burger-ingredients/ingredient-details/ingredient-details.jsx";
import {clearOrder, selectOrderIsLoading, selectOrderNumber} from "@services/order/order-slice.js";
import {closeModal} from "@services/modal/modal-slice.js";
import {selectIngredientsIsLoading} from "@services/ingredients/ingredients-slice.js";


export const Home = () => {
	const isOrderLoading = useSelector(selectOrderIsLoading);
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

	useEffect(() => {
		dispatch(getIngredients());
	}, []);

	return (
		<>
			<BurgerIngredients />
			<BurgerConstructor />
			{isOpen && !isLoading && (
				<Modal close={() => handleCloseModal()} title={modalState.title}>
					{modalState.type === 'orderDetails' && <OrderDetails OrderId={orderNumber} />}
					{modalState.type === 'ingredientDetails' && (
						<IngredientDetails ingredient={modalState.data} />
					)}
				</Modal>
			)}
		</>
	);
};


