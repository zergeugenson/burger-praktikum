import axios from 'axios';
import {
  setTokens,
  clearTokens,
  getRefreshToken,
  getAccessToken,
} from '@/utils/common.js';
import { BASE_API_URL } from './constants';
import { BaseApiClient } from './base-api-client';

class BurgerApi extends BaseApiClient {
  static api = axios.create({
    baseURL: BASE_API_URL,
  });

  static authHeaders() {
    return { authorization: getAccessToken() ?? '' };
  }

  static async fetchWithRefresh(requestFn) {
    try {
      return await requestFn();
    } catch (error) {
      if (!error?.message.includes('expired')) {
        throw error;
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Нет refresh-токена');
      }

      const refreshResponse = await this.post(
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

  static async getIngredients() {
    return this.get('/ingredients');
  }

  static async createOrder(ingredientIds) {
    return this.fetchWithRefresh(() =>
        this.post('/orders', { ingredients: ingredientIds }, {
          headers: {
            ...this.jsonHeaders(),
            ...this.authHeaders(),
          },
        })
    );
  }

  static async userLogin(data) {
    return this.post('/auth/login', data, { headers: this.jsonHeaders() })
        .then((response) => {
          if (response.success) {
            console.log('логин', response);
            setTokens(response.accessToken, response.refreshToken);
            return response.user;
          }
          return Promise.reject(new Error('Не удалось войти'));
        });
  }

  static async userRegister(data) {
    return this.post('/auth/register', data, { headers: this.jsonHeaders() })
        .then((response) => {
          if (response.success) {
            console.log('регистрация', response);
            setTokens(response.accessToken, response.refreshToken);
            return response.user;
          }
          return Promise.reject(new Error('ошибка регистрации'));
        });
  }

  static async getUserData() {
    return this.fetchWithRefresh(() =>
        this.get('/auth/user', {}, {
          headers: {
            ...this.jsonHeaders(),
            ...this.authHeaders(),
          },
        }).then((response) => {
          if (response.success) {
            console.log('данные юзера', response);
            return response.user;
          }
          return Promise.reject(new Error('Ошибка данных пользователя'));
        })
    );
  }

  static async changeUserData(payload) {
    return this.fetchWithRefresh(() =>
        this.patch('/auth/user', payload, {
          headers: {
            ...this.jsonHeaders(),
            ...this.authHeaders(),
          },
        }).then((response) => {
          if (response.success) {
            console.log('изменены данные юзера', response);
            return response.user;
          }
          return Promise.reject(new Error('Ошибка изменения данных пользователя'));
        })
    );
  }

  static async userLogout() {
    if (!getRefreshToken()) {
      clearTokens();
      return Promise.resolve();
    }

    return this.post(
        '/auth/logout',
        { token: getRefreshToken() },
        { headers: this.jsonHeaders() }
    ).then((response) => {
      if (response.success) {
        clearTokens();
        return response.user;
      }
      return Promise.reject(new Error('ошибка выхода'));
    });
  }
}

export default BurgerApi;
