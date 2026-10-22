
export const setTokens = (accessToken, refreshToken) => {
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (accessToken, refreshToken) => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
};

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const getAccessToken = () => localStorage.getItem('accessToken');
