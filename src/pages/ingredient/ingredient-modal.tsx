import { type ReactNode } from 'react';
import { useAppSelector } from '@hooks/hooks';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

export const IngredientModal = (): ReactNode => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const ingredient = ingredients.find(({ _id }) => _id === id);
  const navigate = useNavigate();

  if (!ingredient) return null;

  return (
    <Modal close={() => navigate(-1)} title="Детали ингредиента">
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};
