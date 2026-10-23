import styles from './ingredient-page.module.css';
import {IngredientDetails} from "@components/burger-ingredients/ingredient-details/ingredient-details.jsx";
import {useSelector} from 'react-redux';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';
import { selectIngredients, selectIngredientsIsLoading } from '@services/ingredients/ingredients-slice';

export const IngredientPage = () => {
	const { id } = useParams();
	const isLoading = useSelector(selectIngredientsIsLoading);
	const ingredients = useSelector(selectIngredients);
	const ingredient = ingredients.find(({ _id }) => _id === id);

	if (isLoading) {
		return (
			<section className={styles.backgound}>
				<Preloader />
			</section>
		);
	} else if(!ingredient) {
		return (
			<section className={`${styles.backgound} text text_type_main-medium`}>
				Ингредиент не найден
			</section>
		);
	} else {
		return (
			<section className={`${styles.backgound} ${styles.item}`}>
				<h1 className="text text_type_main-large">Детали ингредиента</h1>
				<IngredientDetails ingredient={ingredient} />
			</section>
		);
	}
};
