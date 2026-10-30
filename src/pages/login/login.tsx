import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, type FormEvent, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { Link } from 'react-router-dom';

import { AppHeaderSmall } from '@components/app-header/app-header-small';
import { useForm } from '@hooks/useForm';
import { userLogin } from '@services/auth/auth-actions';
import { selectError } from '@services/auth/auth-slice';
import { ROUTES } from '@utils/constants';

import styles from './login.module.css';

const formFields = {
  email: '',
  password: '',
};

export const Login = (): ReactNode => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const { values, handleChange } = useForm(formFields);
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      void dispatch(userLogin(values));
    },
    [dispatch, values]
  );

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <AppHeaderSmall text="Вход" />
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
      <Button htmlType="submit" size="medium" type="primary">
        Войти
      </Button>
      {error && (
        <p className="text text_type_main-default text_color_error mt-6">{error}</p>
      )}
      <div className={styles.linkContainer}>
        <div className="flex text text_type_main-default text_color_inactive m-4">
          Вы — новый пользователь? &nbsp;
          <Link className={styles.link} to={ROUTES.REGISTER}>
            Зарегистрироваться
          </Link>
        </div>
        <div className="text text_type_main-default text_color_inactive">
          Забыли пароль? &nbsp;
          <Link className={styles.link} to={ROUTES.FORGOT_PASSWORD}>
            Восстановить пароль
          </Link>
        </div>
      </div>
    </form>
  );
};
