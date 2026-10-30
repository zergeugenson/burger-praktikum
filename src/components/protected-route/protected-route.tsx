import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAppSelector } from '@hooks/hooks';

import { selectIsAuthChecked, selectUser } from '@services/auth/auth-slice';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: TProtectedRouteProps): ReactNode => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const state = location.state as TLocationState | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
