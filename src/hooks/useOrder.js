import { useState, useEffect, useMemo } from 'react';

const generateUid = () => crypto.randomUUID();

export const useOrder = () => {
  const [order, setOrder] = useState({
    bun: null,
    ingredients: [],
  });

  const [counts, setCounts] = useState({});

  useEffect(() => {
    const newCounts = {};
    if (order.bun) {
      newCounts[order.bun._id] = 1;
    }
    order.ingredients.forEach((item) => {
      newCounts[item._id] = (newCounts[item._id] || 0) + 1;
    });
    setCounts(newCounts);
  }, [order]);

  const addItem = (item) => {
    const itemWithUid = { ...item, uid: generateUid() };
    setOrder((prevOrder) => {
      if (itemWithUid.type === 'bun') {
        return { ...prevOrder, bun: itemWithUid };
      } else {
        return { ...prevOrder, ingredients: [...prevOrder.ingredients, itemWithUid] };
      }
    });
  };

  const removeItem = (uid) => {
    setOrder((prevOrder) => {
      if (prevOrder.bun && prevOrder.bun.uid === uid) {
        return prevOrder;
      }
      const newIngredients = prevOrder.ingredients.filter((item) => item.uid !== uid);
      return { ...prevOrder, ingredients: newIngredients };
    });
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    if (order.bun) {
      total += order.bun.price;
      // total += order.bun.price * 2; Удваивать стоимость булки -- плохая практика, побьют. Не надо так!
    }
    order.ingredients.forEach((item) => {
      total += item.type === 'bun' ? item.price * 2 : item.price;
    });
    return total;
  }, [order]);

  const moveIngredient = (dragIndex, hoverIndex) => {
    setOrder((prevOrder) => {
      const newIngredients = [...prevOrder.ingredients];
      const dragItem = newIngredients[dragIndex];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);
      return { ...prevOrder, ingredients: newIngredients };
    });
  };

  return { order, counts, addItem, removeItem, totalPrice, moveIngredient };
};
