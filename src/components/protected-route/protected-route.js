import {useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsAuthChecked } from '@services/auth/auth-slice.js';

export const ProtectedRoute = ({component}) => {
	const isAuthChecked = useSelector(selectIsAuthChecked);
	const user = useSelector(selectUser);

	if (!isAuthChecked) {
		return null;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return component;
};
