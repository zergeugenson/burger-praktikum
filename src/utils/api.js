import axios from 'axios';
import {
  setTokens,
  clearTokens,
  getRefreshToken,
  getAccessToken,
} from '@/utils/common.js';
import { BASE_API_URL } from './constants';

class BurgerApi {
  static api = axios.create({
    baseURL: BASE_API_URL,
  });

  static authHeaders() {
    return { authorization: getAccessToken() ?? '' };
  }

  static jsonHeaders() {
    return { 'Content-Type': 'application/json;charset=utf-8' };
  }

  static async fetchWithRefresh(requestFn) {
    try {
      console.log("АПИ: токены ОК")
      return await requestFn();
    } catch (error) {
      console.log("АПИ: токены НЕ ОК")
      if (error?.message !== 'jwt expired') {
        console.log("АПИ: пиздец")
        throw error;
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Нет refresh-токена для обновления');
      }

      console.log("АПИ: Шлем токен!")
      const refreshResponse = await this.post(
          '/auth/token',
          JSON.stringify({ token: refreshToken }),
          { headers: this.jsonHeaders() }
      );

      if (!refreshResponse.success) {
        throw new Error('Не удалось обновить токен');
      }

      setTokens(refreshResponse.accessToken, refreshResponse.refreshToken);
      console.log("АПИ: Запускаем исходный запрос!")
      return requestFn();
    }
  }

  static async get(url, params = {}, config = {}) {
    try {
      const response = await this.api.get(url, { params, ...config });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async post(url, data = {}, config = {}) {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
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

  static handleError(error) {
    if (error.response) {
      const serverMessage = error.response.data?.message || error.response.statusText;
      throw new Error(`Ошибка сервера (${error.response.status}): ${serverMessage}`);
    } else if (error.request) {
      throw new Error('Ошибка сети');
    } else {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }

  static async printError(error) {
    return this.handleError(error);
  }
}

export default BurgerApi;
