import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppHeaderSmall } from '@components/app-header/app-header-small.js';
import { useForm } from '@hooks/useForm';
import { LostPasswordStepOne } from '@services/auth/auth-actions';
import { selectError, selectIsLoading } from '@services/auth/auth-slice';
import { ROUTES } from '@utils/constants';

import styles from '../login/login.module.css';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const { values, handleChange } = useForm({ email: '' });

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(LostPasswordStepOne(values.email))
        .unwrap()
        .then(() => {
          localStorage.setItem('resetPasswordAllowed', 'true');
          navigate(ROUTES.RESET_PASSWORD);
        })
        .catch((err) => {
          console.error('Не удалось отправить код восстановления:', err);
        });
    },
    [dispatch, navigate, values.email]
  );

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <AppHeaderSmall text="Восстановление пароля, шаг 1" />
      <EmailInput
        value={values.email}
        onChange={handleChange}
        extraClass="mb-6"
        name="email"
        placeholder="Укажите e-mail"
      />
      <Button
        htmlType="submit"
        size="medium"
        type="primary"
        disabled={Boolean(isLoading)}
      >
        Восстановить
      </Button>
      {error && (
        <p className="text text_type_main-default text_color_error mt-6">{error}</p>
      )}
      <div className={styles.linkContainer}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?&nbsp;
          <Link className={styles.link} to={ROUTES.LOGIN}>
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
};
