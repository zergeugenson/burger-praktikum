import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { FeedCard } from '@components/feed-card/feed-card';
import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
  feedConnect,
  feedDisconnect,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} from '@services/feed/feed-slice';

export const Feed = (): ReactNode => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const status = useAppSelector(selectFeedStatus);
  const error = useAppSelector(selectFeedError);

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
    return <p className="text text_type_main-default text_color_error">{error}</p>;
  }

  return (
    <div>
      <h1>Лента заказов</h1>
      <p>Всего: {total}</p>
      <p>Сегодня: {totalToday}</p>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            #{order.number} — {order.status}
            <FeedCard />
          </li>
        ))}
      </ul>
    </div>
  );
};