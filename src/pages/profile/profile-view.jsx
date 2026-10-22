import {useDispatch, useSelector} from 'react-redux';
import {selectIsAuthChecked, selectUser} from '@services/auth/auth-slice.js';
import styles from './profile-view.module.css';
import {useForm} from "@hooks/useForm.js";
import {useCallback, useEffect} from "react";
import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import {changeUserData} from "@services/auth/auth-actions.js";

const formFields = {
	email: '',
	name: '',
	password: '',
}

export const ProfileView = () => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const { values, handleChange, setValues } = useForm(formFields);

	const setDefaults = () => {
		setValues({
			email: user.email,
			name: user.name,
			password: user.password,
		});
	}
	useEffect(() => {
		setDefaults();
	}, [user, setValues]);

	const handleCancel = useCallback(() => {
		setDefaults();
	}, [setValues, user]);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();
			void dispatch(changeUserData({
					email: values.email,
					name: values.name,
					...(values.password.length > 0 ? { password: values.password } : {}),
				})
			);
		}, [dispatch, values]
	);

	return (
		<form onSubmit={handleSubmit}>
			<Input
				icon="EditIcon"
				name="name"
				type="text"
				placeholder="Имя"
				value={values.name}
				extraClass="mb-6"
				onChange={handleChange}
			/>
			<Input
				icon="EditIcon"
				name="email"
				type="email"
				placeholder="Логин"
				extraClass="mb-6"
				value={values.email}
				onChange={handleChange}
			/>
			<Input
				icon="EditIcon"
				name="password"
				type="password"
				placeholder="Пароль"
				extraClass="mb-6"
				value={values.password}
				onChange={handleChange}
			/>
			<div>
				<Button  htmlType="button"  size="medium"  type="primary"  onClick={handleCancel}>
					Отмена
				</Button>
				<Button htmlType="submit" size="medium" type="primary" extraClass="ml-6">
					Сохранить
				</Button>
			</div>
		</form>
	);
};
