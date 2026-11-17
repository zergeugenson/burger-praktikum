import { OrderCard } from '@components/order-card/order-card';
import { useEffect, type ReactNode } from 'react';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  selectProfileOrders,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
  selectProfileOrdersTotal,
  selectProfileOrdersTotalToday,
} from '@services/profile-orders/profile-orders-slice';

export const ProfileOrders = (): ReactNode => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectProfileOrders);
  const status = useAppSelector(selectProfileOrdersStatus);
  const error = useAppSelector(selectProfileOrdersError);
  const total = useAppSelector(selectProfileOrdersTotal);
  const totalToday = useAppSelector(selectProfileOrdersTotalToday);

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
    return (
      <p className="text text_type_main-default text_color_error">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text text_type_main-default text_color_inactive">
        Заказов пока нет
      </p>
    );
  }

  return (
    <div>
      <p>Всего заказов: {total}</p>
      <p>Сегодня: {totalToday}</p>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            #{order.number} — {order.status}
            <OrderCard />
          </li>
        ))}
      </ul>
    </div>
  );
};