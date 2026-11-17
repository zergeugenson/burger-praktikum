import type { ReactNode } from 'react';
import { CurrencyIcon, FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { ORDER_STATUS} from '@utils/constants'

import { Link, useLocation } from 'react-router-dom';

import type { TFeedOrder } from '@utils/api';
import type { TLocationState } from '@components/app/app';

import styles from './feed-card.module.css';

type TOrderCardProps = {
  order: TFeedOrder;
  showStatus: boolean;
  to: string;
};

export const FeedCard = ({
  order,
  showStatus,
  to,
}: TOrderCardProps): ReactNode => {
  const location = useLocation();
  const createdAt = new Date(order.createdAt);
  const state: TLocationState = { background: location };

  return (
    <li>
      <Link className={styles.container} state={state} to={to}>
        <div className={styles.header}>
          <span className="text text_type_digits-default">
            {`#${order.number.toString()}`}
          </span>
          {createdAt && (
            <FormattedDate
              className="text text_type_main-default text_color_inactive"
              date={createdAt}
            />
          )}
        </div>
        <h2 className={`${styles.name} text text_type_main-medium`}>{order.name}</h2>
        {showStatus && (
          <div className={`${styles.status} text text_type_main-default ${order.status === 'done' ? 'text_color_success' : ''}`}>
            {ORDER_STATUS[order.status]}
          </div>
        )}
        <div className={styles.bottom}>
          <ul className={styles.ingredients}>
            {order.ingredients.map((item, index) => (
              <li
                key={item._id + index + Math.random()}
                className={styles.item}
              >
                <img
                  alt={item.name}
                  className={styles.image}
                  src={item.image_mobile}
                />
              </li>
            ))}
          </ul>
          <span className={styles.price}>
            <span className="text text_type_digits-default">{order.price}</span>
            <CurrencyIcon type="primary" />
          </span>
        </div>
      </Link>
    </li>
  );
};

