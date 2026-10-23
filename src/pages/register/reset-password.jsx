import styles from '../login/login.module.css';
import {
	Button,
	Input,
	PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { LostPasswordStepTwo } from '@services/auth/auth-actions';
import { ROUTES } from '@utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {selectError, selectIsLoading} from "@services/auth/auth-slice.js";
import {AppHeaderSmall} from "@components/app-header/app-header-small.jsx";

const formFields = {
	token: '',
	password: '',
}

export const ResetPassword = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoading = useSelector(selectIsLoading);
	const error = useSelector(selectError);
	const { values, handleChange } = useForm(formFields);

	const onSubmit = useCallback((e) => {
		e.preventDefault();

		void dispatch(LostPasswordStepTwo(values))
			.unwrap()
			.then(() => {
			localStorage.removeItem('resetPasswordAllowed');
			void navigate(ROUTES.LOGIN);
		})
			.catch((err) => {
				console.error('Не удалось восстановить пароль:', err);
			});

		}, [dispatch, navigate, values]
	);

	if (!(localStorage.getItem('resetPasswordAllowed') === 'true')) {
		return <Navigate replace to={ROUTES.FORGOT_PASSWORD} />;
	}


	return (
		<form onSubmit={onSubmit}  style={{ alignItems: 'center' }}>
			<AppHeaderSmall text="Восстановление пароля, шаг 2" />
			<PasswordInput
				value={values.password}
				onChange={handleChange}
				extraClass="mb-6"
				name="password"
				placeholder="Введите новый пароль"
			/>
			<Input
				value={values.token}
				onChange={handleChange}
				extraClass="mb-6"
				name="token"
				placeholder="Введите код из письма"
				type="text"
			/>
			<Button disabled={isLoading} htmlType="submit" size="medium" type="primary">
				Сохранить
			</Button>
			{error && (
				<p className="text text_type_main-default text_color_error mt-6 mb-6">
					{error}
				</p>
			)}
			<div className={styles.linkContainer}>
				<p
					className={`${styles.link} text text_type_main-default text_color_inactive`}
				>
					Вспомнили пароль? &nbsp;
					<Link className={styles.link} to={ROUTES.LOGIN}>
						Войти
					</Link>
				</p>
			</div>
		</form>
	);
};
