import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '@hooks/useForm.js';
import { changeUserData } from '@services/auth/auth-actions.js';
import { selectUser } from '@services/auth/auth-slice.js';

const formFields = {
  email: '',
  name: '',
  password: '',
};

export const ProfileView = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { values, handleChange, setValues } = useForm(formFields);

  const setDefaults = useCallback(() => {
    setValues({
      email: user.email ?? '',
      name: user.name ?? '',
      password: '',
    });
  }, [user, setValues]);

  useEffect(() => {
    setTimeout(() => {
      setDefaults();
    }, 100);
  }, []);

  const handleCancel = useCallback(() => {
    setDefaults();
  }, [setDefaults]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      void dispatch(
        changeUserData({
          email: values.email,
          name: values.name,
          ...(values.password.length > 0 ? { password: values.password } : {}),
        })
      );
    },
    [dispatch, values]
  );

  const isChanged =
    Boolean(user) &&
    (values.name !== user?.name ||
      values.email !== user.email ||
      values.password.length > 0);

  return (
    <form onSubmit={onSubmit}>
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
        {user && (
          <div>
            <Button
              htmlType="button"
              size="medium"
              type="primary"
              onClick={handleCancel}
              disabled={!isChanged}
            >
              Отмена
            </Button>
            <Button
              htmlType="submit"
              size="medium"
              type="primary"
              extraClass="ml-6"
              disabled={!isChanged}
            >
              Сохранить
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
