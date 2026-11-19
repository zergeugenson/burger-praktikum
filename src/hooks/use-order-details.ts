import { useEffect, useMemo, useState } from 'react';

import BurgerApi, { type TFeedOrder } from '@/utils/api';
import { fullOrderWithIngredients, type TFeedOrderWithIngredients } from '@utils/common';
import { useAppSelector } from '@hooks/hooks';
import { selectFeedOrders } from '@services/feed/feed-slice';
import { selectProfileOrders } from '@services/profile-orders/profile-orders-slice';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

type TUseOrderDetailsResult = {
  order: TFeedOrderWithIngredients | null;
  isLoading: boolean;
  error: string | null;
};

export const useOrderDetails = (orderId: string | null): TUseOrderDetailsResult => {
  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);
  const ingredients = useAppSelector(selectIngredients);

  const wsOrder =
    orderId !== null
      ? (feedOrders.find((o) => o._id === orderId) ??
        profileOrders.find((o) => o._id === orderId) ??
        null)
      : null;

  const [httpOrder, setHttpOrder] = useState<TFeedOrder | null>(null);
  const [httpIsLoading, setHttpIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wsOrder) {
      setHttpOrder(null);
      setHttpIsLoading(false);
      setError(null);
      return;
    }

    if (orderId === null) {
      setHttpOrder(null);
      setHttpIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setHttpIsLoading(true);
    setError(null);

    BurgerApi.getOrderDetails(orderId)
      .then((data) => {
        if (isCancelled) return;
        setHttpOrder(data);
        setHttpIsLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить заказ');
        setHttpIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [orderId, wsOrder]);

  // обогащение, там только 50 записей: могу себе позволить + еще юзмемо
  const rawOrder = wsOrder ?? httpOrder;
  const order = useMemo<TFeedOrderWithIngredients | null>(() => {
    if (!rawOrder) return null;
    if (ingredients.length === 0) return null;
    return fullOrderWithIngredients(rawOrder, ingredients);
  }, [rawOrder, ingredients]);

  const isLoading = httpIsLoading || (!!rawOrder && ingredients.length === 0 && !error);

  return {
    order,
    isLoading,
    error,
  };
};
