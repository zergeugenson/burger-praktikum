import {Modal} from "@components/modal/modal.jsx";
import {IngredientDetails} from "@components/burger-ingredients/ingredient-details/ingredient-details.jsx";
import {useSelector} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

export const IngredientModal = () => {
	const { id } = useParams ();
	const ingredients = useSelector(selectIngredients);
	const ingredient = ingredients.find(({ _id }) => _id === id);
	const navigate = useNavigate();

	return (
		<Modal close={() => navigate(-1)} title="Детали ингредиента">
			<IngredientDetails ingredient={ingredient} />
		</Modal>
	);
};
