import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectCounts } from '@services/burger-constructor/burger-constructor-slice';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { ingredientsGroups, type TIngredientType } from '@utils/constants';
import type { TIngredient } from '@/utils/api';
import { useAppSelector } from '@hooks/hooks';

import { IngredientsItem } from './ingredients-item/ingredients-item';

import styles from './burger-ingredients.module.css';

const isIngredientType = (value: string): value is TIngredientType =>
  value === 'bun' || value === 'sauce' || value === 'main';

type TIngredientGroup = {
  type: TIngredientType;
  label: string;
  items: TIngredient[];
};

export const BurgerIngredients = (): ReactNode => {
  const ingredients = useAppSelector(selectIngredients);
  const navigate = useNavigate();
  const location = useLocation();
  const counts = useAppSelector(selectCounts);

  const [activeTab, setActiveTab] = useState<TIngredientType>('bun');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRefs = useRef<Partial<Record<TIngredientType, HTMLHeadingElement>>>({});

  const groupedIe = useMemo<TIngredientGroup[]>(() => {
    const grIngr = ingredients.reduce<Record<TIngredientType, TIngredient[]>>(
      (acc, item) => {
        acc[item.type].push(item);
        return acc;
      },
      { bun: [], sauce: [], main: [] }
    );

    return ingredientsGroups.map((group) => ({
      type: group.type,
      label: group.label,
      items: grIngr[group.type] ?? [],
    }));
  }, [ingredients]);

  const clickTab = useCallback((tab: string) => {
    if (!isIngredientType(tab)) return;

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

    let closestType: TIngredientType = 'bun';
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const group of ingredientsGroups) {
      const title = groupRefs.current[group.type];
      if (!title) continue;

      const distance = Math.abs(title.getBoundingClientRect().top - containerTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestType = group.type;
      }
    }
    setActiveTab(closestType);
  }, []);

  const showIngredient = (item: TIngredient): void => {
    navigate(`/ingredients/${item._id}`, {
      state: { background: location },
    });
  };

  return (
    <div className={styles.burgerIngredients}>
      <nav className={styles.tabs}>
        {ingredientsGroups.map(({ label, type }) => (
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
        {groupedIe.map(({ type, label, items }) => (
          <div key={type} className={styles.listItem}>
            <h2
              ref={(element) => {
                groupRefs.current[type] = element ?? undefined;
              }}
            >
              {label}
            </h2>
            <div className={styles.ingredientsList}>
              {items.map((item) => (
                <IngredientsItem
                  key={item._id}
                  ingredient={item}
                  counter={counts[item._id] ?? 0}
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
