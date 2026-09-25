import axios from 'axios';

import { BASE_API_URL } from './constants';

class BurgerApi {
  /**
   * Получение данных по URL
   * @param {string} url - URL для запроса
   * @returns {Promise<any>} - Данные ответа
   */
  static async getIngredients(url) {
    try {
      const response = await axios.get(`${BASE_API_URL}${url}`);
      return response.data;
    } catch (error) {
      const errorMessage = `Неизвестная сетевая ошибка', ${error?.message}`;
      throw new Error(errorMessage);
    }
  }
}

export default BurgerApi;
