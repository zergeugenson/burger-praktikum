import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { Button, EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useForm } from '@hooks/useForm';
import { ROUTES } from '@utils/constants';
import {useDispatch} from "react-redux";
import { useCallback } from 'react';
import { userLogin } from '@services/auth/auth-actions';

const formFields = {
	email: '',
	password: '',
}

export const Login = () => {
	const dispatch = useDispatch();
	const { values, handleChange } = useForm(formFields);
	const onSubmit = useCallback(
		e => {
		e.preventDefault();
		void dispatch(userLogin(values));
	},
	[dispatch, values]
);

	return (
		<form onSubmit={onSubmit}>
			<h1 className={'text text_type_main-medium mb-6 text-center'}>Вход</h1>
			<EmailInput
				onChange={handleChange}
				value={values.email}
				extraClass="mb-7"
				name="email"
				placeholder="E-mail"
			/>
			<PasswordInput
				onChange={handleChange}
				value={values.password}
				extraClass="mb-6"
				name="password"
				placeholder="Пароль"
			/>
			<Button extraClass="mb-20" htmlType="submit" size="medium" type="primary">Войти</Button>
			<div className={styles.linkContainer}>
				<div className={'flex text text_type_main-default text_color_inactive m-4'}>
					Вы — новый пользователь? &nbsp;
					<Link className={styles.link} to={ROUTES.REGISTER}>
						Зарегистрироваться
					</Link>
				</div>
				<div className={'text text_type_main-default text_color_inactive'}>
					Забыли пароль? &nbsp;
					<Link className={styles.link} to={ROUTES.LOST_PASSWORD}>
						 Восстановить пароль
					</Link>
				</div>
			</div>
		</form>
	);
};
