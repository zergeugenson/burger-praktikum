import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient }) => {
  const consistency = [
    { label: 'Калории, ккал', value: ingredient.calories },
    { label: 'Белки, г', value: ingredient.proteins },
    { label: 'Жиры, г', value: ingredient.fat },
    { label: 'Углеводы, г', value: ingredient.carbohydrates },
  ];

  return (
    <section className={styles.container}>
      <img alt={ingredient.name} className={styles.image} src={ingredient.image_large} />
      <h3 className={`${styles.name} mt-4 mb-8 text_type_main-medium text `}>
        {ingredient.name}
      </h3>
      <ul className={styles.consistency}>
        {consistency.map((item) => (
          <li key={item.label} className={styles.consistencyItem}>
            <span className="text_color_inactive text_type_main-default text">
              {item.label}
            </span>
            <span className="text_color_inactive text_type_main-default text">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
