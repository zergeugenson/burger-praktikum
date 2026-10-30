import { type ReactNode } from 'react';
import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderId: number | null;
};

export const OrderDetails = ({ orderId }: TOrderDetailsProps): ReactNode => {
  return (
    <div className={styles.container}>
      <p className={`${styles.id} text_type_digits-large text`}>{orderId}</p>
      <p className="text_type_main-medium text mt-8">идентификатор заказа</p>
      <div className={styles.checkMark}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text_type_main-default text">Ваш заказ начали готовить</p>
      <p className="text_type_main-default text text_color_inactive mt-2">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};