import {useDispatch, useSelector} from 'react-redux';
import {selectIsAuthChecked, selectUser} from '@services/auth/auth-slice.js';
import styles from './profile.module.css';
import {useForm} from "@hooks/useForm.js";
import {useCallback} from "react";
import {userRegister} from "@services/auth/auth-actions.js";
import { Input } from '@krgaa/react-developer-burger-ui-components';

const formFields = {
	email: '',
	name: '',
	password: '',
}

export const ProfileView = () => {
	const user = useSelector(selectUser);
	const { handleChange } = useForm(formFields);
	return (
		<form>
			<Input
				extraClass="mb-6"
				icon="EditIcon"
				name="name"
				onChange={handleChange}
				placeholder="Имя"
				type="text"
				value={user.name}
			/>
			<Input
				extraClass="mb-6"
				icon="EditIcon"
				name="email"
				onChange={handleChange}
				placeholder="Логин"
				type="email"
				value={user.email}
			/>
			<Input
				extraClass="mb-6"
				icon="EditIcon"
				name="password"
				onChange={handleChange}
				placeholder="Пароль"
				type="password"
				value={user.password}
			/>
		</form>
	);
};
