import { AxiosError, type AxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseApiClient } from './base-api-client';

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    ...actual,
    default: { ...actual.default, create: vi.fn(() => apiMock) },
  };
});

const makeResponse = (status: number, statusText: string, data?: unknown) => ({
  status,
  statusText,
  data,
  headers: {},
  config: {} as never,
});

const serverError = (status: number, statusText: string, data?: unknown) =>
  new AxiosError(
    'Request failed',
    'ERR_BAD_RESPONSE',
    undefined,
    {},
    makeResponse(status, statusText, data)
  );

const networkError = () => new AxiosError('Network Error', 'ERR_NETWORK', undefined, {});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('BaseApiClient.jsonHeaders', () => {
  it('возвращает Content-Type для JSON', () => {
    expect(BaseApiClient.jsonHeaders()).toEqual({
      'Content-Type': 'application/json;charset=utf-8',
    });
  });
});

describe('BaseApiClient.get', () => {
  it('вызывает api.get и возвращает response.data', async () => {
    apiMock.get.mockResolvedValue({ data: { ok: true } });

    await expect(BaseApiClient.get('/ingredients')).resolves.toEqual({ ok: true });
    expect(apiMock.get).toHaveBeenCalledWith('/ingredients', { params: {} });
  });

  it('передаёт params и config', async () => {
    apiMock.get.mockResolvedValue({ data: 1 });
    const config: AxiosRequestConfig = { headers: { authorization: 'token' } };

    await BaseApiClient.get('/x', { page: 2 }, config);

    expect(apiMock.get).toHaveBeenCalledWith('/x', {
      params: { page: 2 },
      headers: { authorization: 'token' },
    });
  });

  it('params из config перекрывают аргумент params', async () => {
    apiMock.get.mockResolvedValue({ data: 1 });

    await BaseApiClient.get('/x', { page: 2 }, { params: { page: 5 } });

    expect(apiMock.get).toHaveBeenCalledWith('/x', { params: { page: 5 } });
  });

  it('преобразует ошибку через handleError', async () => {
    apiMock.get.mockRejectedValue(serverError(500, 'Internal Server Error'));

    await expect(BaseApiClient.get('/x')).rejects.toThrow(
      'Ошибка сервера (500): Internal Server Error'
    );
  });
});

describe('BaseApiClient.post', () => {
  it('вызывает api.post и возвращает response.data', async () => {
    apiMock.post.mockResolvedValue({ data: { id: 1 } });
    const config: AxiosRequestConfig = { headers: { a: 'b' } };

    await expect(BaseApiClient.post('/orders', { x: 1 }, config)).resolves.toEqual({
      id: 1,
    });
    expect(apiMock.post).toHaveBeenCalledWith('/orders', { x: 1 }, config);
  });

  it('по умолчанию отправляет пустые data и config', async () => {
    apiMock.post.mockResolvedValue({ data: null });

    await BaseApiClient.post('/orders');

    expect(apiMock.post).toHaveBeenCalledWith('/orders', {}, {});
  });

  it('преобразует ошибку через handleError', async () => {
    apiMock.post.mockRejectedValue(networkError());

    await expect(BaseApiClient.post('/x')).rejects.toThrow('Ошибка сети');
  });
});

describe('BaseApiClient.patch', () => {
  it('вызывает api.patch и возвращает response.data', async () => {
    apiMock.patch.mockResolvedValue({ data: { name: 'Bob' } });
    const config: AxiosRequestConfig = { headers: { a: 'b' } };

    await expect(
      BaseApiClient.patch('/auth/user', { name: 'Bob' }, config)
    ).resolves.toEqual({ name: 'Bob' });
    expect(apiMock.patch).toHaveBeenCalledWith('/auth/user', { name: 'Bob' }, config);
  });

  it('по умолчанию отправляет пустые data и config', async () => {
    apiMock.patch.mockResolvedValue({ data: null });

    await BaseApiClient.patch('/auth/user');

    expect(apiMock.patch).toHaveBeenCalledWith('/auth/user', {}, {});
  });

  it('преобразует ошибку через handleError', async () => {
    apiMock.patch.mockRejectedValue(new Error('boom'));

    await expect(BaseApiClient.patch('/x')).rejects.toThrow('Ошибка запроса: boom');
  });
});

describe('BaseApiClient.handleError', () => {
  it('использует message из тела ответа сервера', () => {
    const error = serverError(404, 'Not Found', { message: 'Order not found' });

    expect(() => BaseApiClient.handleError(error)).toThrow(
      'Ошибка сервера (404): Order not found'
    );
  });

  it('берёт statusText, если в теле нет message', () => {
    const error = serverError(403, 'Forbidden', { success: false });

    expect(() => BaseApiClient.handleError(error)).toThrow(
      'Ошибка сервера (403): Forbidden'
    );
  });

  it('берёт statusText, если тела ответа нет', () => {
    const error = serverError(502, 'Bad Gateway');

    expect(() => BaseApiClient.handleError(error)).toThrow(
      'Ошибка сервера (502): Bad Gateway'
    );
  });

  it('сообщение с "expired" сохраняется для fetchWithRefresh', () => {
    const error = serverError(403, 'Forbidden', { message: 'jwt expired' });

    expect(() => BaseApiClient.handleError(error)).toThrow(/expired/);
  });

  it('возвращает "Ошибка сети", если запрос ушёл, а ответа нет', () => {
    expect(() => BaseApiClient.handleError(networkError())).toThrow('Ошибка сети');
  });

  it('AxiosError без response и request попадает в ветку Error', () => {
    const error = new AxiosError('Invalid config', 'ERR_BAD_OPTION');

    expect(() => BaseApiClient.handleError(error)).toThrow(
      'Ошибка запроса: Invalid config'
    );
  });

  it('оборачивает обычный Error', () => {
    expect(() => BaseApiClient.handleError(new Error('oops'))).toThrow(
      'Ошибка запроса: oops'
    );
  });

  it.each([
    ['строка', 'text'],
    ['null', null],
    ['undefined', undefined],
    ['объект', { foo: 1 }],
  ])('возвращает "Неизвестная ошибка" для значения: %s', (_name, value) => {
    expect(() => BaseApiClient.handleError(value)).toThrow('Неизвестная ошибка');
  });

  it('всегда бросает именно Error', () => {
    try {
      BaseApiClient.handleError(serverError(500, 'x'));
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).not.toBeInstanceOf(AxiosError);
    }
  });
});
