import axios, {
  type AxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from 'axios';

export class BaseApiClient {
  static api = axios.create();

  static jsonHeaders(): RawAxiosRequestHeaders {
    return { 'Content-Type': 'application/json;charset=utf-8' } as RawAxiosRequestHeaders;
  }

  static async get<T = unknown>(
      url: string,
      params: Record<string, unknown> = {},
      config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.api.get<T>(url, { params, ...config } as AxiosRequestConfig);
      return response.data;
    } catch (error) {
      this.handleError(error as Error & { response?: any; request?: unknown });
    }
  }

  static async post<T = unknown>(
      url: string,
      data: unknown = {},
      config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as Error & { response?: any; request?: unknown });
    }
  }

  static async patch<T = unknown>(
      url: string,
      data: unknown = {},
      config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as Error & { response?: any; request?: unknown });
    }
  }

  static handleError(error: Error & { response?: any; request?: unknown }): never {
    if (error.response) {
      const serverMessage =
          error.response.data?.message || error.response.statusText;
      throw new Error(`Ошибка сервера (${error.response.status}): ${serverMessage}`);
    } else if (error.request) {
      throw new Error('Ошибка сети');
    } else {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }
}
