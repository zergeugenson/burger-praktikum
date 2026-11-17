import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { FeedCard } from '@components/feeds/feed-card/feed-card';
import { FeedOrders } from '@components/feeds/feed-orders/feed-orders';
import { useEffect, type ReactNode, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  feedConnect,
  feedDisconnect,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} from '@services/feed/feed-slice';
import {type TFeedOrderWithIngredients, fullOrderWithIngredients } from '@/utils/common'
import styles from './feed.module.css';

export const Feed = (): ReactNode => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const status = useAppSelector(selectFeedStatus);
  const error = useAppSelector(selectFeedError);
const ingredients = useAppSelector(selectIngredients);

  const fullOrders = useMemo(
    () =>
      orders
        .map((order) => fullOrderWithIngredients(order, ingredients))
        .filter((order): order is TFeedOrderWithIngredients => order !== null),
    [orders, ingredients]
  );

  useEffect(() => {
    dispatch(feedConnect());
    return () => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  if (status === 'connecting' || status === 'idle') {
    return <Preloader />;
  }

  if (status === 'error') {
    return (
      <p className="text text_type_main-default text_color_error">
        {error ?? 'Ошибка подключения'}
      </p>
    );
  }

  if (orders.length === 0) {
    if (status === 'closed') {
      return (
        <p className="text text_type_main-default text_color_inactive">
          Соединение потеряно. Переподключаемся…
        </p>
      );
    }
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.feed}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <ul className={`${styles.feedList} custom-scroll`}>
          {fullOrders.map((order) => (
            <FeedCard
              key={order._id}
              order={order}
              showStatus={false}
              to={`/feed/${order._id}`}
            />
          ))}
        </ul>
      </div>
      <FeedOrders orders={fullOrders} total={total} totalToday={totalToday} />
    </div>
  );
};