import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, type ReactNode, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';

import { useForm } from '@hooks/useForm';
import { changeUserData } from '@services/auth/auth-actions';
import { selectUser, selectIsLoading, selectError } from '@services/auth/auth-slice';

import styles from './profile-view.module.css';

import type { TUser } from '@/utils/api';

export const ProfileView = (): ReactNode => {
  const user = useAppSelector(selectUser);
  return <ProfileForm key={user?.email ?? 'no-user'} user={user} />;
};

type TProfileFormProps = {
  user: TUser | null;
};

const ProfileForm = ({ user }: TProfileFormProps): ReactNode => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const { values, handleChange, setValues } = useForm({
    email: user?.email ?? '',
    name: user?.name ?? '',
    password: '',
  });

  const handleCancel = useCallback(() => {
    setValues({
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: '',
    });
  }, [user, setValues]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
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
      } catch (err) {
        console.log('Ошибка сохранения профиля', err);
      }
    },
    [dispatch, values, setValues]
  );

  const isChanged =
    user !== null &&
    (values.name !== user.name ||
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
