import axios from 'axios';

export class BaseApiClient {
	static api = axios.create();

	static jsonHeaders() {
		return { 'Content-Type': 'application/json;charset=utf-8' };
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

	static async patch(url, data = {}, config = {}) {
		try {
			const response = await this.api.patch(url, data, config);
			return response.data;
		} catch (error) {
			this.handleError(error);
		}
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
