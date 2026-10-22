import styles from './profile.module.css';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { userLogout } from '@services/auth/auth-actions';
import { ROUTES } from '@utils/constants';
import { useDispatch } from 'react-redux';

export const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const linkClass = ({ isActive }) =>
		`${styles.link} text text_type_main-medium pt-4 pb-4 ${
			isActive ? styles.isActive : ''
		}`;

	const doLogout = async () => {
		try {
			await dispatch(userLogout()).unwrap();
			navigate(ROUTES.LOGIN);
		} catch (e) {
			console.error('Ошибка логаута:', e);
		}
	};

	return (
		<div className={styles.container}>
			<nav className={styles.menu}>
				<NavLink className={linkClass} end to={ROUTES.PROFILE}>
					Профиль
				</NavLink>
				<NavLink className={linkClass} end to={ROUTES.PROFILE_ORDERS}>
					История заказов
				</NavLink>
				<button
					className={`${styles.link} text text_type_main-medium pt-4 pb-4`}
					onClick={doLogout}
					type="button"
				>
					Выход
				</button>
				<p className="text text_type_main-default text_color_inactive mt-20">
					В этом разделе вы можете изменить свои персональные данные
				</p>
			</nav>
			<section className={styles.outlet}><Outlet /></section>
		</div>
	);
};
