import styles from './app.module.css';
import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@/pages/home/home.jsx';
import { IngredientPage } from '@/pages/ingredient/ingredient-page.jsx';
import { Login } from '@/pages/login/login.jsx';
import { Register } from '@/pages/register/register.jsx';
import { LostPasswordStep1 } from '@/pages/register/lost-password-step-1.jsx';
import { LostPasswordStep2 } from '@/pages/register/lost-password-step-2.jsx';
import { Profile } from '@/pages/profile/profile.jsx';
import { ProfileOrders } from '@/pages/profile/profile-orders.jsx';
import { ProfileView } from '@/pages/profile/profile-view.jsx';
import { ROUTES } from '@utils/constants';
import { ProtectedRoute } from '@components/protected-route/protected-route'
import {useDispatch} from "react-redux";
import { useEffect } from 'react';
import { getUserData } from '@services/auth/auth-actions';
import { Route, Routes, useLocation } from 'react-router-dom';

export const App = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const background = (location.state)?.background;

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <Routes location={background ?? location}>
          <Route element={<Home />} path={ROUTES.HOME} />
            <Route element={ <IngredientPage /> } path={ROUTES.INGREDIENT} />
            <Route element={ <ProtectedRoute onlyUnAuth><Login /></ProtectedRoute> } path={ROUTES.LOGIN} />
            <Route element={ <ProtectedRoute onlyUnAuth><Register /></ProtectedRoute> } path={ROUTES.REGISTER} />
            <Route element={ <ProtectedRoute onlyUnAuth><LostPasswordStep1 /></ProtectedRoute> } path={ROUTES.LOST_PASSWORD} />
            <Route element={ <ProtectedRoute onlyUnAuth><LostPasswordStep2 /></ProtectedRoute> } path={ROUTES.RESET_PASSWORD} />
            <Route element={ <ProtectedRoute ><Profile /></ProtectedRoute> } path={ROUTES.PROFILE}>
                <Route index element={<ProfileView />} />
                <Route path="orders" element={<ProfileOrders />} />
            </Route>
        </Routes>
      </main>
    </div>
  );
};
