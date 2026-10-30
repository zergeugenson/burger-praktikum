import { useEffect, type ReactNode } from 'react';
import { useAppDispatch } from '@hooks/hooks';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';
import { Home } from '@/pages/home/home';
import { IngredientModal } from '@/pages/ingredient/ingredient-modal';
import { IngredientPage } from '@/pages/ingredient/ingredient-page';
import { Login } from '@/pages/login/login';
import { ProfileOrders } from '@/pages/profile/profile-orders';
import { ProfileView } from '@/pages/profile/profile-view';
import { Profile } from '@/pages/profile/profile';
import { ForgotPassword } from '@/pages/register/forgot-password';
import { Register } from '@/pages/register/register';
import { ResetPassword } from '@/pages/register/reset-password';
import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { getUserData } from '@services/auth/auth-actions';
import { getIngredients } from '@services/ingredients/ingredients-actions';
import { ROUTES } from '@utils/constants';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

export const App = (): ReactNode => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const background = (location.state as TLocationState | null)?.background;

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {(location?.pathname === '/' || location?.pathname.includes('ingredients')) && (
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
      )}
      <main className={`${styles.main} pl-5 pr-5`}>
        <Routes location={background ?? location}>
          <Route element={<Home />} path={ROUTES.HOME} />
          <Route element={<IngredientPage />} path={ROUTES.INGREDIENT} />
          <Route
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
            path={ROUTES.LOGIN}
          />
          <Route
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
            path={ROUTES.REGISTER}
          />
          <Route
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
            path={ROUTES.FORGOT_PASSWORD}
          />
          <Route
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
            path={ROUTES.RESET_PASSWORD}
          />
          <Route
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
            path={ROUTES.PROFILE}
          >
            <Route index element={<ProfileView />} />
            <Route path="orders" element={<ProfileOrders />} />
          </Route>
        </Routes>
        {background && (
          <Routes>
            <Route element={<IngredientModal />} path={ROUTES.INGREDIENT} />
          </Routes>
        )}
      </main>
    </div>
  );
};
