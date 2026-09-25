import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { MODALS_ROOT } from '@utils/constants';

import { ModalOverlay } from '../modal-overlay/modal-overlay.jsx';

import styles from './modal.module.css';

export const Modal = ({ children, close, title }) => {
  useEffect(() => {
    const escapeClose = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', escapeClose);

    return () => {
      document.removeEventListener('keydown', escapeClose);
    };
  }, [close]);

  const modalRoot = document.getElementById(MODALS_ROOT);
  if (!modalRoot) return null;

  return createPortal(
    <>
      <ModalOverlay className={styles.overlay} onClose={close} />
      <div className={styles.modal}>
        <div className={styles.header}>
          {title ? <h2 className="text text_type_main-large">{title}</h2> : null}
          <CloseIcon className={styles.close} type="primary" onClick={close} />
        </div>
        <div className={`${styles.content} pb-15 pl-10 pr-10`}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};
