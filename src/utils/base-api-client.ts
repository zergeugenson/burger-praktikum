import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from 'axios';

type TServerErrorResponse = {
  message?: string;
};

export class BaseApiClient {
  static api = axios.create();

  static jsonHeaders(): RawAxiosRequestHeaders {
    return {
      'Content-Type': 'application/json;charset=utf-8',
    } as RawAxiosRequestHeaders;
  }

  static async get<T = unknown>(
    url: string,
    params: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.api.get<T>(url, {
        params,
        ...config,
      } as AxiosRequestConfig);
      return response.data;
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  static handleError(error: unknown): never {
    if (isAxiosError<TServerErrorResponse>(error)) {
      if (error.response) {
        const serverMessage = error.response.data?.message ?? error.response.statusText;
        throw new Error(`Ошибка сервера (${error.response.status}): ${serverMessage}`);
      }
      if (error.request) {
        throw new Error('Ошибка сети');
      }
    }

    if (error instanceof Error) {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
    throw new Error('Неизвестная ошибка');
  }
}
