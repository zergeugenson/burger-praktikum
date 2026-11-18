import type { ReactNode } from 'react';
import { CurrencyIcon, FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { ORDER_STATUS} from '@utils/constants'
import type { TFeedOrder } from '@utils/api';


import styles from './feed-order-details.module.css';

type TFeedOrderDetails = {
  order: TFeedOrder;
  variant: 'page' | 'modal';
};

export const FeedOrderDetails = ({ order, variant }: TFeedOrderDetails): ReactNode => {
  const createdAt = new Date(order.createdAt);

  return (
    <div className={styles.container}>
      <div className={styles[variant]}>
        {variant === 'page' && (
          <p className={`${styles.number} text text_type_digits-default`}>
            {`#${order.number.toString()}`}
          </p>
        )}
        <h2 className={`${styles.name} text text_type_main-medium`}>{order.name}</h2>
        <div className={`${styles.status} text text_type_main-default ${order.status === 'done' ? 'text_color_success' : ''}`}>
          {ORDER_STATUS[order.status]}
        </div>
      </div>
      <h3 className={`${styles.title} text text_type_main-medium`}>
        Состав:
      </h3>
      <ul className={`${styles.ingredients} custom-scroll`}>
        {order && order.ingredients.map((item) => (
          <li key={item._id + Math.random()} className={styles.row}>
            <img src={item.image_mobile} alt={item.name} className={styles.image} />
            <div className={`${styles.ingredientName} text text_type_main-default`}>
              {item.name}
            </div>
            <span className={styles.price}>
              <span className="text text_type_digits-default">
                {item.price}
              </span>
              <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
          <FormattedDate
            className="text text_type_main-default text_color_inactive"
            date={createdAt}
          />
        <span className={styles.price}>
          <span className="text text_type_digits-default">{order.price}</span>
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </div>
  );
};
