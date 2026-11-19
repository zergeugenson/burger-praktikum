import { FeedCard } from '@components/feeds/feed-card/feed-card';
import { useEffect, type ReactNode, useMemo } from 'react';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
  type TFeedOrderWithIngredients,
  fullOrderWithIngredients,
} from '@/utils/common';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  selectProfileOrders,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
} from '@services/profile-orders/profile-orders-slice';

import styles from '@/pages/feed/feed.module.css';

export const ProfileOrders = (): ReactNode => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectProfileOrders);
  const status = useAppSelector(selectProfileOrdersStatus);
  const error = useAppSelector(selectProfileOrdersError);
  const ingredients = useAppSelector(selectIngredients);

  const fullOrders = useMemo(
    () =>
      orders
        .map((order) => fullOrderWithIngredients(order, ingredients))
        .filter((order): order is TFeedOrderWithIngredients => order !== null),
    [orders, ingredients]
  );

  useEffect(() => {
    dispatch(profileOrdersConnect());
    return () => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  if (status === 'connecting' || status === 'idle') {
    return <Preloader />;
  }

  if (status === 'error') {
    return <p className="text text_type_main-default text_color_error">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text text_type_main-default text_color_inactive">Заказов пока нет</p>
    );
  }

  return (
    <div className={styles.feed}>
      <h1 className={`${styles.title} text text_type_main-large`}>Лента заказов</h1>
      <ul className={`${styles.feedList} custom-scroll`}>
        {fullOrders.map((order) => (
          <FeedCard
            key={order._id}
            order={order}
            showStatus={true}
            to={`/profile/orders/${order._id}`}
          />
        ))}
      </ul>
    </div>
  );
};
