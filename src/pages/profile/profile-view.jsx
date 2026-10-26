import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '@hooks/useForm.js';
import { changeUserData } from '@services/auth/auth-actions.js';
import { selectUser, selectIsLoading, selectError } from '@services/auth/auth-slice.js';

import styles from './profile-view.module.css';

export const ProfileView = () => {
  const user = useSelector(selectUser);
  return <ProfileForm key={user?.email ?? 'no-user'} user={user} />;
};

const ProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const { values, handleChange, setValues } = useForm({
    email: user?.email ?? '',
    name: user?.name ?? '',
    password: '',
  });

  const handleCancel = useCallback(() => {
    setValues({
      email: user.email ?? '',
      name: user.name ?? '',
      password: '',
    });
  }, [user, setValues]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        await dispatch(
          changeUserData({
            email: values.email,
            name: values.name,
            ...(values.password.length > 0 ? { password: values.password } : {}),
          })
        ).unwrap();

        setValues((prev) => ({ ...prev, password: '' }));
      } catch (error) {
        console.log('Ошибка сохранения профиля', error);
      }
    },
    [dispatch, values, setValues]
  );

  const isChanged =
    Boolean(user) &&
    (values.name !== user?.name ||
      values.email !== user.email ||
      values.password.length > 0);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
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
        value={values.email}
        extraClass="mb-6"
        onChange={handleChange}
      />
      <Input
        icon="EditIcon"
        name="password"
        type="password"
        placeholder="Пароль"
        value={values.password}
        extraClass="mb-6"
        onChange={handleChange}
        autoComplete="new-password"
      />

      {isChanged && (
        <div>
          <Button
            htmlType="button"
            size="medium"
            type="primary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            htmlType="submit"
            size="medium"
            type="primary"
            extraClass="ml-6"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </div>
      )}

      {error && (
        <p className="text text_type_main-default text_color_error mt-6">{error}</p>
      )}
    </form>
  );
};
