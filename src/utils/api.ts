import axios, { type CreateAxiosDefaults, type RawAxiosRequestHeaders } from 'axios';
import {
  setTokens,
  clearTokens,
  getRefreshToken,
  getAccessToken,
} from '@utils/common';

import { BaseApiClient } from './base-api-client';
import { BASE_API_URL } from './constants';

export type TUser = {
  email: string;
  name: string;
};

export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TOrder = {
  number: number;
  _id?: string;
  status?: string;
  name?: string;
  ingredients?: TIngredient[];
  owner?: {
    name: string;
    email: string;
    createdAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
  price?: number;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TGetUserResponse = {
  success: boolean;
  user: TUser;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TGetIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TCreateOrderResponse = {
  success: boolean;
  name: string;
  order: TOrder;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type TChangeUserDataPayload = Partial<{
  email: string;
  password: string;
  name: string;
}>;

export type TLostPasswordStepOnePayload = Partial<{
  email: string;
}>;

export type TLostPasswordStepTwoPayload = {
  password: string;
  token: string;
};

class BurgerApi extends BaseApiClient {
  static api = axios.create({
    baseURL: BASE_API_URL,
  } as CreateAxiosDefaults);

  static authHeaders(): RawAxiosRequestHeaders {
    return { authorization: getAccessToken() ?? '' } as RawAxiosRequestHeaders;
  }

  static async fetchWithRefresh<T>(
      requestFn: () => Promise<T>
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('expired')) {
        throw error;
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Нет refresh-токена');
      }

      const refreshResponse = await this.post<TRefreshTokenResponse>(
          '/auth/token',
          JSON.stringify({ token: refreshToken }),
          { headers: this.jsonHeaders() }
      );

      if (!refreshResponse.success) {
        throw new Error('Не удалось обновить токен');
      }

      setTokens(refreshResponse.accessToken, refreshResponse.refreshToken);
      return requestFn();
    }
  }

  static async getIngredients(): Promise<TGetIngredientsResponse> {
    return this.get<TGetIngredientsResponse>('/ingredients');
  }

  static async createOrder(
      ingredientIds: string[]
  ): Promise<TCreateOrderResponse> {
    return this.fetchWithRefresh(() =>
        this.post<TCreateOrderResponse>(
            '/orders',
            { ingredients: ingredientIds },
            {
              headers: {
                ...this.jsonHeaders(),
                ...this.authHeaders(),
              },
            }
        )
    );
  }

  static async userLogin(data: TLoginPayload): Promise<TUser> {
    return this.post<TAuthResponse>('/auth/login', data, {
      headers: this.jsonHeaders(),
    }).then((response) => {
      if (response.success) {
        console.log('логин', response);
        setTokens(response.accessToken, response.refreshToken);
        return response.user;
      }
      return Promise.reject(new Error('Не удалось войти'));
    });
  }

  static async userRegister(data: TRegisterPayload): Promise<TUser> {
    return this.post<TAuthResponse>('/auth/register', data, {
      headers: this.jsonHeaders(),
    }).then((response) => {
      if (response.success) {
        console.log('регистрация', response);
        setTokens(response.accessToken, response.refreshToken);
        return response.user;
      }
      return Promise.reject(new Error('ошибка регистрации'));
    });
  }

  static async getUserData(): Promise<TUser> {
    return this.fetchWithRefresh(() =>
        this.get<TGetUserResponse>(
            '/auth/user',
            {},
            {
              headers: {
                ...this.jsonHeaders(),
                ...this.authHeaders(),
              },
            }
        ).then((response) => {
          if (response.success) {
            return response.user;
          }
          return Promise.reject(new Error('Ошибка данных пользователя'));
        })
    );
  }

  static async changeUserData(
      payload: TChangeUserDataPayload
  ): Promise<TUser> {
    return this.fetchWithRefresh(() =>
        this.patch<TGetUserResponse>('/auth/user', payload, {
          headers: {
            ...this.jsonHeaders(),
            ...this.authHeaders(),
          },
        }).then((response) => {
          if (response.success) {
            return response.user;
          }
          return Promise.reject(
              new Error('Ошибка изменения данных пользователя')
          );
        })
    );
  }

  static async userLogout(): Promise<void> {
    if (!getRefreshToken()) {
      clearTokens();
      return;
    }

    return this.post<TLogoutResponse>(
        '/auth/logout',
        { token: getRefreshToken() },
        { headers: this.jsonHeaders() }
    ).then((response) => {
      if (response.success) {
        clearTokens();
        return;
      }
      return Promise.reject(new Error('ошибка выхода'));
    });
  }

  static async LostPasswordStepOne(
      payload: TLostPasswordStepOnePayload
  ): Promise<boolean> {
    return this.post<TPasswordResetResponse>(
        '/password-reset',
        JSON.stringify({ payload }),
        { headers: this.jsonHeaders() }
    ).then((response) => {
      if (response.success) {
        return true;
      }
      return Promise.reject(
          new Error('Ошибка восстановления пароля: имейл юзера не найден')
      );
    });
  }

  static async LostPasswordStepTwo(
      payload: TLostPasswordStepTwoPayload
  ): Promise<boolean> {
    return this.post<TPasswordResetResponse>(
        '/password-reset/reset',
        JSON.stringify({ payload }),
        { headers: this.jsonHeaders() }
    ).then((response) => {
      if (response.success) {
        return true;
      }
      return Promise.reject(
          new Error('Ошибка восстановления пароля: какая-то ошибка на втором шаге')
      );
    });
  }
}

export default BurgerApi;
