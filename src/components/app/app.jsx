import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Home } from '@/pages/home/home.jsx';
import { IngredientModal } from '@/pages/ingredient/ingredient-modal.jsx';
import { IngredientPage } from '@/pages/ingredient/ingredient-page.jsx';
import { Login } from '@/pages/login/login.jsx';
import { ProfileOrders } from '@/pages/profile/profile-orders.jsx';
import { ProfileView } from '@/pages/profile/profile-view.jsx';
import { Profile } from '@/pages/profile/profile.jsx';
import { ForgotPassword } from '@/pages/register/forgot-password.jsx';
import { Register } from '@/pages/register/register.jsx';
import { ResetPassword } from '@/pages/register/reset-password.jsx';
import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { getUserData } from '@services/auth/auth-actions';
import { getIngredients } from '@services/ingredients/ingredients-actions.js';
import { ROUTES } from '@utils/constants';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;

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
            {/*  поп-ап ингридиента вызывается только здесь. IngredientModal есть обертка над модал, и больше он нигде не вызывается, см. импорты */}
            <Route element={<IngredientModal />} path={ROUTES.INGREDIENT} />
          </Routes>
        )}
      </main>
    </div>
  );
};
