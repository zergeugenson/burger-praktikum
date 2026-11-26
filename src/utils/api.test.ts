import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import BurgerApi from './api';

vi.mock('./base-api-client', () => ({
  BaseApiClient: class {
    static get = vi.fn();
    static post = vi.fn();
    static patch = vi.fn();
    static jsonHeaders = vi.fn();
  },
}));

vi.mock('@utils/common', () => ({
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn(),
  getAccessToken: vi.fn(),
}));

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@utils/common';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const base = BurgerApi as unknown as {
  get: Mock;
  post: Mock;
  patch: Mock;
  jsonHeaders: Mock;
};

const mockedGetAccessToken = getAccessToken as Mock;
const mockedGetRefreshToken = getRefreshToken as Mock;

const user = { email: 'a@b.c', name: 'Alice' };

beforeEach(() => {
  vi.resetAllMocks();
  base.jsonHeaders.mockReturnValue(JSON_HEADERS);
  mockedGetAccessToken.mockReturnValue('access-1');
  mockedGetRefreshToken.mockReturnValue('refresh-1');
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('BurgerApi.authHeaders', () => {
  it('возвращает access-токен в заголовке authorization', () => {
    expect(BurgerApi.authHeaders()).toEqual({ authorization: 'access-1' });
  });
});

describe('BurgerApi.fetchWithRefresh', () => {
  it('возвращает результат запроса без обновления токена', async () => {
    const requestFn = vi.fn().mockResolvedValue('ok');

    await expect(BurgerApi.fetchWithRefresh(requestFn)).resolves.toBe('ok');
    expect(requestFn).toHaveBeenCalledTimes(1);
    expect(base.post).not.toHaveBeenCalled();
  });

  it('бросает ошибку, если нет refresh-токена', async () => {
    mockedGetRefreshToken.mockReturnValue(null);
    const requestFn = vi.fn().mockRejectedValue(new Error('jwt expired'));

    await expect(BurgerApi.fetchWithRefresh(requestFn)).rejects.toThrow(
      'Нет refresh-токена'
    );
    expect(base.post).not.toHaveBeenCalled();
  });

  it('обновляет токены и повторяет запрос при "expired"', async () => {
    const requestFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('jwt expired'))
      .mockResolvedValueOnce('second');
    base.post.mockResolvedValue({
      success: true,
      accessToken: 'access-2',
      refreshToken: 'refresh-2',
    });

    await expect(BurgerApi.fetchWithRefresh(requestFn)).resolves.toBe('second');

    expect(base.post).toHaveBeenCalledWith(
      '/auth/token',
      JSON.stringify({ token: 'refresh-1' }),
      { headers: JSON_HEADERS }
    );
    expect(setTokens).toHaveBeenCalledWith('access-2', 'refresh-2');
    expect(requestFn).toHaveBeenCalledTimes(2);
  });
});

describe('BurgerApi.getIngredients', () => {
  it('запрашивает /ingredients и возвращает ответ', async () => {
    const response = { success: true, data: [] };
    base.get.mockResolvedValue(response);

    await expect(BurgerApi.getIngredients()).resolves.toBe(response);
    expect(base.get).toHaveBeenCalledWith('/ingredients');
  });
});

describe('BurgerApi.createOrder', () => {
  it('отправляет ингредиенты с авторизационными заголовками', async () => {
    const response = { success: true, name: 'Бургер', order: { number: 1 } };
    base.post.mockResolvedValue(response);

    await expect(BurgerApi.createOrder(['id1', 'id2'])).resolves.toBe(response);

    expect(base.post).toHaveBeenCalledWith(
      '/orders',
      { ingredients: ['id1', 'id2'] },
      { headers: { ...JSON_HEADERS, authorization: 'access-1' } }
    );
  });

  it('после обновления токена повторяет запрос уже с новым токеном', async () => {
    mockedGetAccessToken.mockReturnValueOnce('old').mockReturnValue('new');
    base.post
      .mockRejectedValueOnce(new Error('jwt expired'))
      .mockResolvedValueOnce({
        success: true,
        accessToken: 'new',
        refreshToken: 'refresh-2',
      })
      .mockResolvedValueOnce({ success: true, name: 'Бургер', order: { number: 2 } });

    const result = await BurgerApi.createOrder(['id1']);

    expect(result.order.number).toBe(2);
    expect(base.post).toHaveBeenCalledTimes(3);
    expect(base.post.mock.calls[0][2]).toEqual({
      headers: { ...JSON_HEADERS, authorization: 'old' },
    });
    expect(base.post.mock.calls[1][0]).toBe('/auth/token');
    expect(base.post.mock.calls[2][2]).toEqual({
      headers: { ...JSON_HEADERS, authorization: 'new' },
    });
  });
});

describe('BurgerApi.userLogin', () => {
  const payload = { email: 'a@b.c', password: '123' };

  it('сохраняет токены и возвращает пользователя', async () => {
    base.post.mockResolvedValue({
      success: true,
      user,
      accessToken: 'a',
      refreshToken: 'r',
    });

    await expect(BurgerApi.userLogin(payload)).resolves.toEqual(user);

    expect(base.post).toHaveBeenCalledWith('/auth/login', payload, {
      headers: JSON_HEADERS,
    });
    expect(setTokens).toHaveBeenCalledWith('a', 'r');
  });

  it('пробрасывает ошибку запроса', async () => {
    base.post.mockRejectedValue(new Error('401'));

    await expect(BurgerApi.userLogin(payload)).rejects.toThrow('401');
  });
});

describe('BurgerApi.userRegister', () => {
  const payload = { email: 'a@b.c', password: '123', name: 'Alice' };

  it('отклоняется, если success=false', async () => {
    base.post.mockResolvedValue({ success: false });

    await expect(BurgerApi.userRegister(payload)).rejects.toThrow('ошибка регистрации');
    expect(setTokens).not.toHaveBeenCalled();
  });
});

describe('BurgerApi.getUserData', () => {
  it('возвращает пользователя и отправляет авторизационные заголовки', async () => {
    base.get.mockResolvedValue({ success: true, user });

    await expect(BurgerApi.getUserData()).resolves.toEqual(user);

    expect(base.get).toHaveBeenCalledWith(
      '/auth/user',
      {},
      { headers: { ...JSON_HEADERS, authorization: 'access-1' } }
    );
  });

  it('отклоняется, если success=false', async () => {
    base.get.mockResolvedValue({ success: false });

    await expect(BurgerApi.getUserData()).rejects.toThrow('Ошибка данных пользователя');
  });

  it('обновляет токен при "expired" и повторяет запрос', async () => {
    base.get
      .mockRejectedValueOnce(new Error('jwt expired'))
      .mockResolvedValueOnce({ success: true, user });
    base.post.mockResolvedValue({
      success: true,
      accessToken: 'a2',
      refreshToken: 'r2',
    });

    await expect(BurgerApi.getUserData()).resolves.toEqual(user);

    expect(base.get).toHaveBeenCalledTimes(2);
    expect(setTokens).toHaveBeenCalledWith('a2', 'r2');
  });
});

describe('BurgerApi.changeUserData', () => {
  const payload = { name: 'Bob' };

  it('отправляет PATCH и возвращает обновлённого пользователя', async () => {
    const updated = { ...user, name: 'Bob' };
    base.patch.mockResolvedValue({ success: true, user: updated });

    await expect(BurgerApi.changeUserData(payload)).resolves.toEqual(updated);

    expect(base.patch).toHaveBeenCalledWith('/auth/user', payload, {
      headers: { ...JSON_HEADERS, authorization: 'access-1' },
    });
  });

  it('обновляет токен при "expired" и повторяет запрос', async () => {
    base.patch
      .mockRejectedValueOnce(new Error('jwt expired'))
      .mockResolvedValueOnce({ success: true, user });
    base.post.mockResolvedValue({
      success: true,
      accessToken: 'a2',
      refreshToken: 'r2',
    });

    await expect(BurgerApi.changeUserData(payload)).resolves.toEqual(user);
    expect(base.patch).toHaveBeenCalledTimes(2);
  });
});

describe('BurgerApi.userLogout', () => {
  it('без refresh-токена только очищает токены и не делает запрос', async () => {
    mockedGetRefreshToken.mockReturnValue(null);

    await expect(BurgerApi.userLogout()).resolves.toBeUndefined();

    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(base.post).not.toHaveBeenCalled();
  });

  it('отправляет refresh-токен на сервер и очищает токены при успехе', async () => {
    base.post.mockResolvedValue({ success: true, message: 'ok' });

    await expect(BurgerApi.userLogout()).resolves.toBeUndefined();

    expect(base.post).toHaveBeenCalledWith(
      '/auth/logout',
      { token: 'refresh-1' },
      { headers: JSON_HEADERS }
    );
    expect(clearTokens).toHaveBeenCalledTimes(1);
  });

  it('отклоняется и не очищает токены, если success=false', async () => {
    base.post.mockResolvedValue({ success: false, message: 'fail' });

    await expect(BurgerApi.userLogout()).rejects.toThrow('ошибка выхода');
    expect(clearTokens).not.toHaveBeenCalled();
  });
});

describe('BurgerApi.LostPasswordStepOne', () => {
  it('возвращает true при успехе', async () => {
    base.post.mockResolvedValue({ success: true, message: 'ok' });

    await expect(BurgerApi.LostPasswordStepOne('a@b.c')).resolves.toBe(true);

    expect(base.post).toHaveBeenCalledWith(
      '/password-reset',
      JSON.stringify({ email: 'a@b.c' }),
      { headers: JSON_HEADERS }
    );
  });

  it('отклоняется при success=false', async () => {
    base.post.mockResolvedValue({ success: false, message: 'no' });

    await expect(BurgerApi.LostPasswordStepOne('a@b.c')).rejects.toThrow(
      'Ошибка восстановления пароля: имейл юзера не найден'
    );
  });
});

describe('BurgerApi.LostPasswordStepTwo', () => {
  const payload = { password: 'new-pass', token: '123456' };

  it('сериализует тело как { payload }', async () => {
    base.post.mockResolvedValue({ success: true, message: 'ok' });

    await BurgerApi.LostPasswordStepTwo(payload);

    expect(JSON.parse(base.post.mock.calls[0][1])).toEqual({ payload });
  });

  it('отклоняется при success=false', async () => {
    base.post.mockResolvedValue({ success: false, message: 'no' });

    await expect(BurgerApi.LostPasswordStepTwo(payload)).rejects.toThrow(
      'Ошибка восстановления пароля: какая-то ошибка на втором шаге'
    );
  });
});

describe('BurgerApi.refreshAccessToken', () => {
  it('очищает токены и бросает ошибку, если нет refresh-токена', async () => {
    mockedGetRefreshToken.mockReturnValue(null);

    await expect(BurgerApi.refreshAccessToken()).rejects.toThrow('Нет refresh-токена');
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(base.post).not.toHaveBeenCalled();
  });

  it('сохраняет новые токены при успехе', async () => {
    base.post.mockResolvedValue({
      success: true,
      accessToken: 'a2',
      refreshToken: 'r2',
    });

    await expect(BurgerApi.refreshAccessToken()).resolves.toBeUndefined();

    expect(base.post).toHaveBeenCalledWith(
      '/auth/token',
      { token: 'refresh-1' },
      { headers: JSON_HEADERS }
    );
    expect(setTokens).toHaveBeenCalledWith('a2', 'r2');
    expect(clearTokens).not.toHaveBeenCalled();
  });

  it('очищает токены и бросает ошибку при success=false', async () => {
    base.post.mockResolvedValue({ success: false });

    await expect(BurgerApi.refreshAccessToken()).rejects.toThrow(
      'Не удалось обновить токен'
    );
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(setTokens).not.toHaveBeenCalled();
  });
});

describe('BurgerApi.getOrderDetails', () => {
  it('возвращает заказ', async () => {
    const order = { _id: 'o1', number: 5 };
    base.get.mockResolvedValue({ success: true, order });

    await expect(BurgerApi.getOrderDetails('o1')).resolves.toBe(order);
    expect(base.get).toHaveBeenCalledWith('/orders/o1');
  });

  it('возвращает null, если сервер не прислал order', async () => {
    base.get.mockResolvedValue({ success: true });

    await expect(BurgerApi.getOrderDetails('o1')).resolves.toBeNull();
  });

  it('бросает ошибку при success=false', async () => {
    base.get.mockResolvedValue({ success: false });

    await expect(BurgerApi.getOrderDetails('o1')).rejects.toThrow(
      'Сервер вернул ошибку при получении заказа'
    );
  });
});
