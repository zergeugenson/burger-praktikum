import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '@utils/constants';
import type { ReactNode } from 'react';

import styles from './app-header.module.css';

type TRenderProps = {
  isActive: boolean;
  isPending: boolean;
};

export const AppHeader = (): ReactNode => {
  const linkClass =
    (extra: string = '') =>
    ({ isActive }: TRenderProps): string =>
      [styles.link, extra, isActive ? styles.link_active : ''].filter(Boolean).join(' ');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink end to={ROUTES.HOME} className={linkClass()}>
            {({ isActive }: TRenderProps): ReactNode => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>

          <NavLink to={ROUTES.ORDERS} className={linkClass('ml-10')}>
            {({ isActive }: TRenderProps): ReactNode => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>

        <Link to={ROUTES.HOME} className={styles.logo}>
          <Logo />
        </Link>

        <NavLink to={ROUTES.PROFILE} className={linkClass(styles.link_position_last)}>
          {({ isActive }: TRenderProps): ReactNode => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
