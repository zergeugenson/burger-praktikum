import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo, useCallback, useRef, useContext } from 'react';

import { BurgerContext } from '../../context';
import { IngredientDetails } from '../burger-ingredients/ingredient-details/ingredient-details';
import { IngredientsItem } from './ingredients-item/ingredients-item';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients = [] }) => {
  const ieGroups = [
    { label: 'Булки', type: 'bun' },
    { label: 'Начинки', type: 'main' },
    { label: 'Соусы', type: 'sauce' },
  ];

  const { sharedCounter } = useContext(BurgerContext);
  const { setOpenModal } = useContext(BurgerContext);

  const [activeTab, setActiveTab] = useState('bun');
  const containerRef = useRef(null);
  const groupRefs = useRef({});

  const groupedIe = useMemo(() => {
    const grIngr = ingredients.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    return ieGroups.map((item) => ({
      type: item.type,
      label: item.label,
      items: grIngr[item.type] || [],
    }));
  }, [ingredients]);

  const clickTab = useCallback((tab) => {
    const container = containerRef.current;
    const title = groupRefs.current[tab];

    setActiveTab(tab);

    if (container && title) {
      const top =
        title.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;
      container.scrollTo({ behavior: 'smooth', top });
    }
  }, []);

  const doScroll = useCallback(() => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top;

    let closestType = 'bun';
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const group of ieGroups) {
      const title = groupRefs.current[group.type];
      if (!title) continue;

      const distance = Math.abs(title.getBoundingClientRect().top - containerTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestType = group.type;
      }
    }
    setActiveTab(closestType);
  }, [ieGroups]);

  const showIngredient = (item) => {
    setOpenModal({
      isopen: true,
      data: <IngredientDetails ingredient={item} />,
      title: 'Детали ингредиента',
    });
  };

  return (
    <div className={styles.burgerIngredients}>
      <nav className={styles.tabs}>
        {ieGroups.map(({ label, type }) => (
          <Tab key={type} active={activeTab === type} onClick={clickTab} value={type}>
            {label}
          </Tab>
        ))}
      </nav>
      <section
        ref={containerRef}
        onScroll={doScroll}
        className={`${styles.listContainer}  custom-scroll`}
      >
        {groupedIe.length &&
          groupedIe.map(({ type, label, items }) => (
            <div key={type} className={styles.listItem}>
              <h2
                ref={(element) => {
                  groupRefs.current[type] = element;
                }}
              >
                {label}
              </h2>
              <div className={styles.ingredientsList}>
                {items.map((item, index) => (
                  <IngredientsItem
                    ingredient={item}
                    counter={sharedCounter[item._id] || 0}
                    key={item.id + index.toString()}
                    onClick={() => showIngredient(item)}
                  />
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};
