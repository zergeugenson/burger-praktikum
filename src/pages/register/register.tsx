import {
  Button,
  EmailInput,
  PasswordInput,
  Input,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, type ReactNode, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { Link } from 'react-router-dom';

import { AppHeaderSmall } from '@components/app-header/app-header-small';
import { useForm } from '@hooks/useForm';
import { userRegister } from '@services/auth/auth-actions';
import { selectError } from '@services/auth/auth-slice';
import { ROUTES } from '@utils/constants';

import styles from '../login/login.module.css';

const formFields = {
  email: '',
  name: '',
  password: '',
};

// qqq
// chimchimr@gmail.com
// 1111111

export const Register = (): ReactNode => {
  const dispatch = useAppDispatch();
  const { values, handleChange } = useForm(formFields);
  const error = useAppSelector(selectError);
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      void dispatch(userRegister(values));
    },
    [dispatch, values]
  );

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <AppHeaderSmall text="Регистрация" />
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
      {error && (
        <p className="text text_type_main-default text_color_error mt-6">{error}</p>
      )}
      <div className={styles.linkContainer}>
        <p className={`${styles.link} text text_type_main-default text_color_inactive`}>
          Уже зарегистрированы? &nbsp;
          <Link className={styles.link} to={ROUTES.LOGIN}>
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
};
