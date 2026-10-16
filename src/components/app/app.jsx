import styles from './app.module.css';
import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@/pages/home/home.jsx';
import { ROUTES } from '@utils/constants';
import { Route, Routes } from 'react-router-dom';

export const App = () => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <Routes>
          <Route element={<Home />} path={ROUTES.HOME} />
        </Routes>
      </main>
    </div>
  );
};
