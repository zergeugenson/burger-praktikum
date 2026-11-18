import { type ReactNode } from 'react';
import type { TOrder } from '@/utils/api';
import styles from './feed-orders.module.css';

type TFeedOrdersProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const MAX_PER_COLUMN = 10;
const MAX_COLUMNS = 2;
const MAX_PER_STATUS = MAX_PER_COLUMN * MAX_COLUMNS;

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const StatusColumn = ({
  title,
  numbers,
  variant,
}: {
  title: string;
  numbers: number[];
  variant: 'done' | 'pending';
}): ReactNode => {
  const columns = chunk(numbers.slice(0, MAX_PER_STATUS), MAX_PER_COLUMN);

  return (
    <div className={styles.statusGroup}>
      <h2 className={`${styles.title} text text_type_main-medium`}>{title}:</h2>
      <div className={styles.columns}>
        {columns.map((col, colIndex) => (
          <ul key={colIndex} className={styles.column}>
            {col.map((num) => (
              <li
                key={num}
                className={`text text_type_digits-default ${styles[variant]}`}
              >
                {num}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export const FeedOrders = ({
  orders,
  total,
  totalToday,
}: TFeedOrdersProps): ReactNode => {
  const doneNumbers = orders.filter((o) => o.status === 'done').map((o) => o.number);

  const pendingNumbers = orders
    .filter((o) => o.status === 'pending')
    .map((o) => o.number);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <StatusColumn title="Готовы" numbers={doneNumbers} variant="done" />
        <StatusColumn title="В работе" numbers={pendingNumbers} variant="pending" />
      </div>

      <div className={styles.totals}>
        <div className={styles.totalGroup}>
          <h2 className={`${styles.title} text text_type_main-medium`}>
            Выполнено за всё время:
          </h2>
          <p className={`text text_type_digits-large ${styles.totalNumber}`}>{total}</p>
        </div>
        <div className={styles.totalGroup}>
          <h2 className={`${styles.title} text text_type_main-medium`}>
            Выполнено за сегодня:
          </h2>
          <p className={`text text_type_digits-large ${styles.totalNumber}`}>
            {totalToday}
          </p>
        </div>
      </div>
    </div>
  );
};
