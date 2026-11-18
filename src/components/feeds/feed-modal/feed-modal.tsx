import { useOrderDetails } from '@hooks/use-order-details';
import { Modal } from '@components/modal/modal';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FeedOrderDetails } from '@/components/feeds/feed-order-details/feed-order-details';
import styles from '@components/feeds/feed-order-details/feed-order-details.module.css';

export const FeedModal = (): ReactNode => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { order, isLoading, error } = useOrderDetails(id ?? null);

  const onClose = (): void => {
    navigate(-1);
  };

  return (
    <Modal close={onClose} title={`#${order?.number}`}>
      {isLoading && <Preloader />}
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
      {!isLoading && !error && order && (
        <FeedOrderDetails variant="modal" order={order} />
      )}
      {!isLoading && !error && !order && <p>Заказ не найден</p>}
    </Modal>
  );
};

export const FeedPage = (): ReactNode => {
  const { id } = useParams<{ id: string }>();
  const { order, isLoading, error } = useOrderDetails(id ?? null);

  return (
    <section className={styles.containerPage}>
      <div className={styles.top}>
        {isLoading && <Preloader />}
        {error && (
          <p className="text text_type_main-default text_color_error">{error}</p>
        )}
        {!isLoading && !error && order && (
          <FeedOrderDetails variant="page" order={order} />
        )}
        {!isLoading && !error && !order && <p>Заказ не найден</p>}
      </div>
    </section>
  );
};
