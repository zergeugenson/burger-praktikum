import styles from './modal-overlay.module.css';
import { type ReactNode } from 'react';

type TModalOverlayProps = {
  onClose: () => void;
  className?: string;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): ReactNode => {
  return <div className={styles.overlay} onClick={onClose} />;
};
