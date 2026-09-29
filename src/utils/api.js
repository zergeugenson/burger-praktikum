import axios from 'axios';
import { BASE_API_URL } from './constants';

class BurgerApi {
  static api = axios.create({
    baseURL: BASE_API_URL,
  });

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

  /**
   * фабрика для GET-ов
   * @param {string} url - эндпоинт ex. '/ingredients'
   * @param {object} params - параметры
   * @returns {Promise<any>} - ответ
   */
  static async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * фабрика для POST-ов
   * @param {string} url - эндпоинт ex. '/orders'
   * @param {object} data - тело запроса
   * @returns {Promise<any>} - ответ
   */
  static async post(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // --- Специфичные методы API ---

  static async getIngredients() {
    return this.get('/ingredients');
  }

  /**
   * Отправка заказа на сервер
   * @param {string[]} ingredientIds - массив ID ингредиентов (например, ["609...", "609..."])
   * @returns {Promise<any>} - ответ сервера (обычно содержит order.number)
   */
  static async createOrder(ingredientIds) {
    // Формируем тело запроса согласно требованиям API
    const payload = {
      ingredients: ingredientIds
    };

    // Отправляем POST запрос на /orders
    return this.post('/orders', payload);
  }

  static async printError(error) {
    return this.handleError(error);
  }
}

export default BurgerApi;
