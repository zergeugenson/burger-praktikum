import styles from '../login/login.module.css';
import { Link } from 'react-router-dom';
import { Button, EmailInput, PasswordInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useForm } from '@hooks/useForm';
import { ROUTES } from '@utils/constants';
import {useDispatch, useSelector} from "react-redux";
import { useCallback } from 'react';
import {userLogin, userRegister} from '@services/auth/auth-actions';

const formFields = {
	email: '',
	name: '',
	password: '',
}


// hahdsj
// adsdasd@sdf.com
// qweqwqeq


export const Register = () => {
	const dispatch = useDispatch();
	const { values, handleChange } = useForm(formFields);
	const handleSubmit = useCallback((e)=> {
		e.preventDefault();
		void dispatch(userRegister(values));
	},
	[dispatch, values]
);

	return (
		<form onSubmit={handleSubmit}>
			<h1 className={'text text_type_main-medium mb-6 text-center'}>Регистрация</h1>
			<Input
				extraClass="mb-6"
				name="name"
				onChange={handleChange}
				placeholder="Имя"
				type="text"
				value={values.name}
			/>
			<EmailInput
				extraClass="mb-6"
				name="email"
				onChange={handleChange}
				placeholder="E-mail"
				value={values.email}
			/>
			<PasswordInput
				extraClass="mb-6"
				name="password"
				onChange={handleChange}
				placeholder="Пароль"
				value={values.password}
			/>
			<Button htmlType="submit" size="medium" type="primary">
				Зарегистрироваться
			</Button>
			<div className={styles.linkContainer}>
				<p
					className={`${styles.link} text text_type_main-default text_color_inactive`}
				>
					Уже зарегистрированы?
					<Link className={styles.link} to={ROUTES.LOGIN}>
						Войти
					</Link>
				</p>
			</div>
		</form>
	);


};
