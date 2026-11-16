import { useAppSelector } from '@hooks/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import type { ReactNode } from 'react';

import styles from './feed.module.css';

import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} from '@services/feed/feed-slice';

export const Feed = (): ReactNode => {
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const status = useAppSelector(selectFeedStatus);
  const error = useAppSelector(selectFeedError);

  if (status === 'connecting') return <Preloader />;
  if (status === 'error') return <p>Ошибка: {error}</p>;
  if (status === 'closed') return <p>Соединение закрыто</p>;

  return (
    <div className={styles.container}>
      <h1>Лента заказов</h1>
      <p>Всего: {total}</p>
      <p>Сегодня: {totalToday}</p>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            #{order.number} — {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};